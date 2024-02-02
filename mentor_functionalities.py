import psycopg2
from psycopg2 import errors
from flask import Flask, request, jsonify
from config import db_params
from session_manager import *



app = Flask(__name__)


# --------------------------------------------------------------* FUNCTIONS *---------------------------------------------------------------------------

#Display mentor details
def fun_mentor_home():

    m_id = get_session_data('username')
    if not m_id:
        return jsonify({'error': 'Mentor not found'}), 404

    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''SELECT * FROM mentor WHERE m_id=%s''', (m_id,))
            mentor = cursor.fetchone()

    if mentor:
        return jsonify({'mentor': mentor})
    else:
        return jsonify({'error': 'Mentor not found'}), 404

# Function to update mentor profile
def update_mentor_profile(username, qualification):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''UPDATE mentor SET qualifctn=%s WHERE m_id=%s''', (qualification, username))
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
        return projects
    except psycopg2.Error as e:
        return None
 
# Function to fetch students under each project
def get_project_students(project_id):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''
                    SELECT s.* FROM student s
                    JOIN st_project sp ON s.st_id = sp.st_id
                    WHERE sp.prj_id = %s
                ''', (project_id,))
                students_in_project = cursor.fetchall()
        return students_in_project
    except psycopg2.Error as e:
        return None
 
# Function to add a new student under a project
 
# Import traceback module
 
def add_student_to_project(student_id, project_id):
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
                
        return jsonify({'message': 'Student added successfully!'})
    except errors.UniqueViolation as e:
        return jsonify({'error':'The student is already assigned to this project'})
    except psycopg2.Error as e:
        return jsonify({'error': 'Error adding student! Please try again...'}), 500
 
 
# Function to remove a student from a project
def remove_student_from_project(student_id, project_id):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('DELETE FROM st_project WHERE st_id=%s AND prj_id=%s', (student_id, project_id))
                conn.commit()
        return jsonify({'message': 'Student removed successfully!'})
    except errors.NoData:
        return jsonify({'error':'No such entry exists!'})
    except psycopg2.Error as e:
        return jsonify({'error': 'Couldn\'t remove student! Please try again...'}), 500
    
    
 
# Function to add an achievement for a student
def add_student_achievement(student_id, achievement_id):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('INSERT INTO std_ach(st_id, ach_id) VALUES (%s, %s)', (student_id, achievement_id))
                conn.commit()
        return jsonify({'message': 'Achievement added to student'})
    except errors.UniqueViolation:
        return jsonify({'message':'The student already has this achievement'})
    except psycopg2.Error as e:
        return jsonify({'error': 'Couldn\'t add achievement. Please try again...'})
    
 
#Function to remove an achievement from student
 
def remove_student_achievement(student_id, achievement_id):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                # If the entry exists, remove it from std_ach
                cursor.execute('DELETE FROM std_ach WHERE st_id=%s AND ach_id=%s', (student_id, achievement_id))
                conn.commit()
                
        return jsonify({'message': 'Student achievement removed successfully!'})
    except errors.NoData as e:  
        return jsonify({'error': 'The entry does not exist!'}), 404  # Return appropriate response with 404 status code
    except psycopg2.Error as e:
        return jsonify({'error': 'Error removing student achievement! Please try again...'}), 500
 
    
 
# Function to add a new project
def add_project(m_id,project_id, project_name, start_date, end_date):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                # Insert new project into the project table
                cursor.execute('INSERT INTO project(pr_name,project_id, start_date, end_date, m_id) VALUES (%s,%s, %s, %s, %s)',
                               (project_name,project_id, start_date, end_date, m_id))
                conn.commit()
                
        return jsonify({'message': 'Project added successfully!'})
    except errors.UniqueViolation as e:
        return jsonify({'error':'Project already exists!'})
    except psycopg2.Error as e:
        return jsonify({'error': 'Error adding project! Please try again...'}), 500
    
 
 
# Function to delete a project
def delete_project(m_id, project_id):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('DELETE FROM project WHERE prj_id=%s', (project_id,))
                conn.commit()
                
        return jsonify({'message': 'Project deleted successfully!'})
    except errors.NoData as e:
        return jsonify({'error':'No such project exists!'})
    except psycopg2.Error as e:
        return jsonify({'error': 'Error deleting project! Please try again...'}), 500
    
#------------------------------------------------------------------*ROUTES*----------------------------------------------------------------------------------

# Route to update mentor profile
@app.route('/mentor/<string:username>/profile', methods=['PUT'])
def update_profile(username):
    request_data = request.json
    new_qual = request_data.get('qualification')
    if new_qual is None:
        return jsonify({'error': 'Qualification not provided!'}), 400

    success = update_mentor_profile(username, new_qual)
    if success:
        return jsonify({'message': 'Profile updated successfully!'})
    else:
        return jsonify({'error': 'Failed to update mentor profile!'}), 500

# Route to get projects under the logged-in mentor
@app.route('/mentor/<string:mentor_id>/projects', methods=['GET'])
def mentor_projects(mentor_id):
    projects = get_mentor_projects(mentor_id)
    return jsonify(projects)

# Route to get students under a given project
@app.route('/mentor/<string:m_id>/projects/<string:project_id>/students', methods=['GET'])
def project_students(m_id, project_id):
    students = get_project_students(project_id)
    return jsonify(students)

# Route to add a new student under a project
@app.route('/mentor/<string:m_id>/projects/<string:project_id>/add_student', methods=['POST'])
def student_to_project(m_id, project_id):
    student_id = request.json.get('student_id')
    return add_student_to_project(student_id, project_id)

# Route to remove a student from a project
@app.route('/mentor/<string:m_id>/projects/<string:project_id>/remove_student', methods=['DELETE'])
def remove_student(m_id, project_id):
    student_id = request.json.get('student_id')
    return remove_student_from_project(student_id, project_id)

@app.route('/mentor/<string:m_id>/add_achievement', methods=['POST'])
def student_achievement(m_id):
    student_id = request.json.get('st_id')
    achievement_id = request.json.get('ach_id')
    return add_student_achievement(student_id, achievement_id)

if __name__ == '__main__':
    app.run(debug=True)
