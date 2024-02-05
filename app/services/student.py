import psycopg2
from flask import Flask,request,jsonify, session
from config import db_params
from ..utils.validation_utils import is_valid_phone

app=Flask(__name__)


#----------------FUNCTIONS------------------------------------------------

#Display all student details
def fun_student_home():

    st_id = session.get('username')

    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''SELECT * FROM student WHERE st_id=%s''', (st_id,))
            student = cursor.fetchone()

    if student:
        return jsonify({'student': student})
    else:
        return jsonify({'error': 'Student not found'}), 404
    

#Update student details
def fun_update_student():

    data = request.json
    st_id = data.get('st_id')

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
        return jsonify({'Error': 'Invalid phone number'})

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

        return jsonify({'message': 'Student information updated successfully'})
    except Exception as e:
        return jsonify({'Error': 'Nothing to update'})


#View student achievements
def fun_view_student_achievements():

    data = request.json
    st_id = data.get('st_id')

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
                achievements_list = [
                    {'achievement_id': row[0], 'achievement_name': row[1], 'description': row[2], 'points': row[3]}
                    for row in achievements
                ]

        return jsonify({'achievements': achievements_list}), 200

    except psycopg2.Error as e:
        return jsonify({'error': str(e)}), 500


#View assigned project
def fun_view_assigned_project():
        
    data = request.json
    st_id = data.get('st_id')

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
            
            project_details = [
                    {'project_id': row[0], 'project_name': row[1], 'start_date': row[2], 'end_date': row[3], 
                     'mentor_id': row[4], 'mentor_fname':row[5], 'mentor_mname':row[6], 'mentor_lname':row[7] }
                    for row in project
                ]
            
        return jsonify({'project': project_details}), 200


#View student progress
def fun_fetch_progress():
    try:
        username=session.get('username')
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT semester FROM student WHERE st_id=%s',(username,))
                currentSemester=cursor.fetchone()
                cursor.execute('SELECT d.total_semester_count FROM student s JOIN departments d ON s.dept_id=d.dept_id WHERE s.st_id=%s',(username,))
                total_semesters=cursor.fetchone()

                cursor.execute('SELECT c.course_id, c.course_name FROM student s join courses c ON s.dept_id = c.dept_id AND c.semester < s.semester WHERE s.st_id = %s',(username,))  
                courses_completed=cursor.fetchall()

                courses_completed = {key: value for key, value in courses_completed}

        return jsonify({'progress': f'Progress : {currentSemester[0]}/{total_semesters[0]}', 'Courses completed': courses_completed})

    except Exception as e:
        response = jsonify({'error': 'No data available', 'status': 'failed'})
        response.status_code = 200  # Set the status code to 401 (Unauthorized)
        return response

 



# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)