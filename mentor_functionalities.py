import psycopg2
from flask import Flask, request, jsonify
from config import db_params




app = Flask(__name__)


# --------------------------------------------------------------* FUNCTIONS *---------------------------------------------------------------------------

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
def add_student_to_project(student_id, project_id):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('INSERT INTO st_project(st_id, prj_id) VALUES (%s, %s)', (student_id, project_id))
                conn.commit()
        return jsonify({'message': 'Student added successfully!'})
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
    except psycopg2.Error as e:
        return jsonify({'error': 'Couldn\'t add achievement. Please try again...'})

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
