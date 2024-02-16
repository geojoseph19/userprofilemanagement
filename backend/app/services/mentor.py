import psycopg2
from psycopg2 import errors
from datetime import datetime
from flask import Flask, request, jsonify
from config import db_params
from ..utils.session_manager import *
from ..utils.response_utils import *
 
 
 
app = Flask(__name__)
 
 
# --------------------------------------------------------------* FUNCTIONS *---------------------------------------------------------------------------
 

#Display mentor details
def fun_mentor_home():
 
    username = get_session_data('username')
    if not username:
        return jsonify({'error': 'Mentor not found'}), 404
    
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT cred_id FROM credentials WHERE username=%s''', (username,))
                cred_id = cursor.fetchone()[0]
    except psycopg2.Error as e:
            return jsonify({'error': 'Username not found'})
 
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''SELECT * FROM mentor WHERE m_id=%s''', (cred_id,))
            mentor = cursor.fetchone()
 
    if mentor:
        response={
            'first_name' : mentor[1],
            'middle_name' : mentor[2],
            'last_name' : mentor[3],
            'qualification' : mentor[4],
            'email' : mentor[5]
        }
 
        return generate_response(response)
    else:
        return generate_response(None,404)
 
# Function to update mentor profile
def update_mentor_profile(username, qualification):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''UPDATE mentor SET qualification=%s WHERE m_id=%s''', (qualification, username))
                conn.commit()
        return True
    except psycopg2.Error as e:
        return False
 
# Function to fetch projects under a mentor
def get_mentor_projects(mentor_id):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT * FROM project WHERE m_id=%s''', (mentor_id,))
                projects = cursor.fetchall()
                if projects:
                    response=format_query_results(projects)
                    return generate_response(response)
    except psycopg2.Error as e:
        error_message=get_database_error_message(e.pgcode)
        return custom_response(None,'Error has occured!',error_message,'failed',400)
 
       
 
# Function to fetch students under each project
def get_project_students():
    data = request.json
    project_id = data.get('project_id')
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    SELECT s.* FROM student s
                    JOIN st_project sp ON s.st_id = sp.st_id
                    WHERE sp.prj_id = %s
                ''', (project_id,))
                students_in_project = cursor.fetchall()
        response=format_query_results()
        return generate_response(response,200)
    except psycopg2.Error as e:
        error_message=get_database_error_message(e.pgcode)
        return custom_response(None,'Error has occured!',error_message,'failed',400)
        
 
# Function to add a new student under a project
 
# Import traceback module
 
def add_student_to_project():
        project_id = request.json.get('project_id')
        student_id = request.json.get('student_id')
        if not project_id:
            return custom_response(None,'Error has occured!','Please provide a valid project ID','failed',400)
        if not student_id:
            return custom_response(None,'Error has occured!','Please provide a valid student ID','failed',400)
        try:
            with psycopg2.connect(**db_params) as conn:
                with conn.cursor() as cursor:
                    # # Check if the student is already assigned to the project
                    # cursor.execute('SELECT EXISTS(SELECT 1 FROM st_project WHERE st_id=%s AND prj_id=%s)',(student_id,project_id))
                    # exists = cursor.fetchone()[0]
                    # if exists:
                    #     return jsonify({'message':'The student is already assigned to this project!'})
                    
                    # If the student is not already assigned, insert into st_project
                    cursor.execute('INSERT INTO st_project(st_id, prj_id) VALUES (%s, %s)', (student_id, project_id))
                    conn.commit()
                    
            return generate_response(None,200)
        except errors.UniqueViolation as e:
            return custom_response(None,'Error has occured!',f'Student {student_id} is already assigned to a project','failed',304)
        except psycopg2.Error as e:
            error_message=get_database_error_message(e.pgcode)
            return custom_response(None,'Error has occured!',error_message,'failed',400)
 
 
# Function to remove a student from a project
def remove_student_from_project():
    try:
        project_id = request.json.get('project_id')
        student_id = request.json.get('student_id')
    except: return custom_response(None,'Error has occured!','Please provide valid credentials','failed',400)
    if not project_id:
        return custom_response(None,'Missing Credential','Project ID not found','failed',404)
    if not student_id:
        return custom_response(None,'Missing credential','Student ID not found','failed',404)
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('DELETE FROM st_project WHERE st_id=%s AND prj_id=%s', (student_id, project_id))
                conn.commit()
        return custom_response(None,f'Student {student_id} removed from project {project_id}',None,'success',200)
    except errors.NoData:
        return custom_response(None,'No such entry exists!','Record not found','failed',404)
    except psycopg2.Error as e:
        return custom_response(None,'Database error!',f'{e.pgcode}','failed',404)
    
    
 
# Function to add an achievement for a student
def add_student_achievement(student_id, achievement_id):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('INSERT INTO std_ach(st_id, ach_id) VALUES (%s, %s)', (student_id, achievement_id))
                conn.commit()
        return custom_response(None,f'Achievement {achievement_id} awarded to student {student_id}',None,'success',200)
    except errors.UniqueViolation:
        return custom_response(None,f'Student {student_id} already has achievement {achievement_id}',None,'success',400)
    except psycopg2.Error as e:
        return custom_response(None,'Database error!',f'{e.pgcode}','failed',400)
    
 
#Function to remove an achievement from student
 
def remove_student_achievement(student_id, achievement_id):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                # If the entry exists, remove it from std_ach
                cursor.execute('DELETE FROM std_ach WHERE st_id=%s AND ach_id=%s', (student_id, achievement_id))
                conn.commit()
                
        return custom_response(None,f'Achievement {achievement_id} removed for student {student_id}',None,'success',200)
    except errors.NoData as e:  
        return custom_response(None,'No such entry exists!','Record not found!','failed',404)  # Return appropriate response with 404 status code
    except psycopg2.Error as e:
        return custom_response(None,'Database error!',f'{e.pgcode}','failed',400)
        
 
    
 
# Function to add a new project
def add_project(m_id,project_id, project_name, start_date, end_date):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                # Insert new project into the project table
             
                cursor.execute('INSERT INTO project(pr_name,prj_id, start_date, end_date, m_id) VALUES (%s,%s, %s, %s, %s)',
                               (project_name,project_id, start_date, end_date, m_id))
                conn.commit()
                
        return custom_response(None,f'Project {project_id} ({project_name}) created!',None,'success',200)
    except errors.UniqueViolation as e:
        return custom_response(None,'Project already exists and is active','Unique record violation','failed',400)
    except psycopg2.Error as e:
        return custom_response(None,'Database error!',f'{e.pgcode}','failed',404)
    
 
# Function to delete a project
def delete_project(project_id):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('DELETE FROM project WHERE prj_id=%s', (project_id,))
                conn.commit()
                
        return custom_response(None,f'Project {project_id} removed successfully!',None,'success',200)
    except errors.NoData as e:
        return custom_response(None,'No such project exists!','Record not found','success',404)
    except psycopg2.Error as e:
        return custom_response(None,'Database error!',f'{e.pgcode}','failed',404)