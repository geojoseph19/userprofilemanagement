from admin import *
from mentor_functionalities import *
from student import *
from mail2 import *
from flask import Flask


app=Flask(__name__)

# ----------------------------------------------ROUTES FOR MENTOR---------------------------------------------------------------------------------


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


#----------------------------------------------------------------------------------------------------------------------------------------------------------




if __name__=="__main__":
    app.run(debug=True)