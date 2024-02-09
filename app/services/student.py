import psycopg2
from psycopg2 import Error, errors
from flask import Flask,request,jsonify, session
from config import db_params
from ..utils.validation_utils import is_valid_phone
from ..utils.response_utils import *
from ..utils.session_manager import check_login

app=Flask(__name__)

#----------------FUNCTIONS------------------------------------------------

role_type = 'student'

#Display all student details
def fun_student_home():

    if not check_login(role_type): return generate_response('Unauthorized access! Please login first',401)

    st_id = session.get('username')

    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            try:
                cursor.execute('''SELECT * FROM student WHERE st_id=%s''', (st_id,))
                user = cursor.fetchone()
                print(user)
            except psycopg2.Error as e: 
                return generate_response(f'Student user {st_id} not found',e.pgcode)
            try:
                cursor.execute('''SELECT dept_name FROM departments WHERE dept_id=%s''', (user[11],))
                dept = cursor.fetchone()
                if dept is None: return generate_response('Error fetching student department data',404)
                else : dept = dept[0]                  
            except psycopg2.Error as e: 
                return generate_response(f'Error fetching department for student {st_id}',e.pgcode)

    response = {
        'username':user[0],
        'first_name':user[1],
        'middle_name':user[2],
        'last_name':user[3],
        'sex':user[4], 
        'email_id':user[5],
        'student_phone_no':user[6], 
        'address':user[7],
        'guardian_name':user[8],
        'guardian_phone_no':user[9],
        'department':dept,
        'semester':user[13]    
    }

    if user:
        return generate_response(response,200)
    else:
        return jsonify({'error': 'Student not found'}), 404
    

#Update student details
def fun_update_student():

    if not check_login(role_type): return generate_response('Unauthorized access! Please login first',401)

    data = request.json
    st_id = session.get('username')

    update_fields = {
        'fname': data.get('student_first_name'),
        'mname': data.get('student_middle_name'),
        'lname': data.get('student_last_name'),
        'sex': data.get('sex'),
        'email': data.get('email'),
        'sphoneno': data.get('student_phone_no'),
        'address': data.get('address'),
        'guardian': data.get('guardian'),
        'gphoneno': data.get('guardian_phone_no')
    }
    if not is_valid_phone(update_fields['sphoneno']):
        return generate_response('Invalid phone number',400)

    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                # Construct SQL UPDATE statement dynamically based on provided fields
                update_query = '''UPDATE student SET {} WHERE 
                    st_id = %s'''.format(', '.join([f'{key} = %s' for key in update_fields if update_fields[key] is not None]))

                # Extract values for the fields to update
                update_values = [update_fields[key] for key in update_fields if update_fields[key] is not None]
                update_values.append(st_id)

                cursor.execute(update_query, update_values)

        conn.commit()

        return generate_response('Student information updated successfully',200)
    except Exception as e:
        return generate_response('Nothing to update',304)


#View student achievements
def fun_view_student_achievements():

    if not check_login(role_type): return generate_response('Unauthorized access! Please login first',401)

    st_id = session.get('username')

    try:
        # Connect to the database
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                # Execute SQL query to retrieve achievement details for the student
                cursor.execute('''
                    SELECT a.ach_id, a.ach_name, a.desc, a.points
                    FROM achievements a
                    INNER JOIN std_ach sa ON a.ach_id = sa.ach_id
                    WHERE sa.st_id = %s
                ''', (st_id,))
                
                # Fetch all the rows
                achievements = cursor.fetchall()

                # Convert the result to a list of dictionaries
                # achievements_list = [
                #     {'achievement_id': row[0], 'achievement_name': row[1], 'description': row[2], 'points': row[3]}
                #     for row in achievements
                # ]


                achievements_dict = {
                        row[0]: {'achievement_name': row[1], 'description': row[2], 'points': row[3]}
                        for row in achievements
                                                }
 
        return generate_response(achievements_dict,200)

    except psycopg2.Error as e:
        return generate_response(e.pgerror,e.pgcode)


#View assigned project
def fun_view_assigned_project():

    if not check_login(role_type): return generate_response('Unauthorized access! Please login first',401)
        
    st_id = session.get('username')
    if not st_id:
        response = jsonify({'error': 'Unauthorized access! Please login first', 'status': 'failed'})
        response.status_code = 401  # Set the status code to 401 (Unauthorized)
        return response

    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''
                            SELECT p.prj_id, p.pr_name, p.start_date, p.end_date,
                            m.m_id, m.m_fname, m.m_mname, m.m_lname
                        FROM 
                            st_project sp
                        INNER JOIN 
                            project p ON sp.prj_id = p.prj_id
                        INNER JOIN 
                            mentor m ON p.m_id = m.m_id
                        WHERE 
                            sp.st_id = %s''', (st_id,))
            
            project = cursor.fetchall()
            
            project_details = {
    row[0]: {
        'project_name': row[1],
        'start_date': row[2],
        'end_date': row[3],
        'mentor_id': row[4],
        'mentor_fname': row[5],
        'mentor_mname': row[6],
        'mentor_lname': row[7]
    }
    for row in project
}
            
        return generate_response(project_details,200)


#View student progress
def fun_fetch_progress():
    
    if not check_login(role_type): return generate_response('Unauthorized access! Please login first',401)

    try:
        username=session.get('username')
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT semester FROM student WHERE st_id=%s',(username,))
                currentSemester=cursor.fetchone()
                cursor.execute('SELECT d.total_semester_count FROM student s JOIN departments d ON s.dept_id=d.dept_id WHERE s.st_id=%s',(username,))
                total_semesters=cursor.fetchone()

                cursor.execute('SELECT c.course_id, c.course_name, c.semester FROM student s join courses c ON s.dept_id = c.dept_id AND c.semester < s.semester WHERE s.st_id = %s',(username,))  
                courses_completed=cursor.fetchall()

                formatted_data = []

                for course_id, course_name, semester in courses_completed:
                    formatted_data.append({'course_id': course_id, 'course_name': course_name, 'semester': semester})


                response = {
                    'current_semester' : currentSemester[0],
                    'total_semesters' : total_semesters[0],
                    'courses_completed': formatted_data
                }

        return generate_response(response,200)

    except Exception as e:
        return generate_response('No data available',200)

 



# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)