from flask import Blueprint
from app.services.mentor import *
from app.utils.credential_generators import generate_project_id

mentor_controller = Blueprint('mentor', __name__)

# ----------------------------------------------ROUTES FOR MENTOR---------------------------------------------------------------------------------

#View mentor home details
@mentor_controller.route('/mentor/home', methods=['GET'])
def mentor_home():
    return fun_mentor_home()

# Route to update mentor profile
@mentor_controller.route('/mentor/profile', methods=['PUT'])
def update_profile():
    request_data = request.json
    username = session.get('username')
    new_qual = request_data.get('qualification')
    if new_qual is None:
        return jsonify({'error': 'Qualification not provided!'}), 400
 
    success = update_mentor_profile(username, new_qual)
    if success:
        return jsonify({'message': 'Profile updated successfully!'})
    else:
        return jsonify({'error': f'Failed to update {username} mentor profile!'}), 500
 
# Route to get projects under the logged-in mentor
@mentor_controller.route('/mentor/<string:mentor_id>/projects', methods=['GET'])
def mentor_projects(mentor_id):
    username = session.get('username')
    projects = get_mentor_projects(username)
    return jsonify(projects)
 
# Route to get students under a given project
@mentor_controller.route('/mentor/<string:m_id>/projects/<string:project_id>/students', methods=['GET'])
def project_students(project_id):
    students = get_project_students(project_id)
    return jsonify(students)
 
# Route to add a new student under a project
@mentor_controller.route('/mentor/<string:m_id>/projects/<string:project_id>/add_student', methods=['POST'])
def student_to_project(project_id):
    student_id = request.json.get('student_id')
    return add_student_to_project(student_id, project_id)
 
# Route to remove a student from a project
@mentor_controller.route('/mentor/<string:m_id>/projects/<string:project_id>/remove_student', methods=['DELETE'])
def remove_student(project_id):
    student_id = request.json.get('student_id')
    return remove_student_from_project(student_id, project_id)

#Add achievement 
@mentor_controller.route('/mentor/<string:m_id>/add_achievement', methods=['POST'])
def student_achievement(m_id):
    student_id = request.json.get('st_id')
    achievement_id = request.json.get('ach_id')
    return add_student_achievement(student_id, achievement_id)
 
 #Remove achievement
@mentor_controller.route('/mentor/<string:m_id>/remove_achievement', methods=['DELETE'])
def del_student_achievement(m_id):
    student_id = request.json.get('st_id')
    achievement_id = request.json.get('ach_id')
    return remove_student_achievement(student_id, achievement_id)
 
 #Add project
@mentor_controller.route('/mentor/<string:m_id>/add_project', methods=['POST'])
def add_project_route(m_id):
    m_id = session.get('username')
    request_data = request.json
    project_name = request_data.get('project_name')
    start_date = request_data.get('start_date')
    end_date = request_data.get('end_date')
    project_id = generate_project_id()
    
    return add_project(m_id,project_id, project_name, start_date, end_date)
 
 #Delete project
@mentor_controller.route('/mentor/<string:m_id>/projects/<string:project_id>', methods=['DELETE'])
def delete_project_route(m_id, project_id):
    return delete_project(m_id, project_id)