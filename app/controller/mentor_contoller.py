from flask import Blueprint
from app.services.mentor import *
from app.utils.credential_generators import generate_project_id

mentor_controller = Blueprint('mentor', __name__, url_prefix="/api/v1")

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
@mentor_controller.route('/mentor/projects', methods=['GET'])
def mentor_projects():
    username = session.get('username')
    projects = get_mentor_projects(username)
    return jsonify(projects)
 
# Route to get students under a given project
@mentor_controller.route('/mentor/projects/students', methods=['GET'])
def project_students():
    students = get_project_students()
    return jsonify(students)
 
# Route to add a new student under a project
@mentor_controller.route('/mentor/projects/addStudent', methods=['POST'])
def student_to_project():
    return add_student_to_project()
 
# Route to remove a student from a project
@mentor_controller.route('/mentor/projects/removeStudent', methods=['DELETE'])
def remove_student():
    return remove_student_from_project()

#Add achievement 
@mentor_controller.route('/mentor/addAchievement', methods=['POST'])
def student_achievement():
    try:
        student_id = request.json.get('student_id')
        achievement_id = request.json.get('achievement_id')
    except: return jsonify({'error': 'Invalid inputs'})
    if not achievement_id:
        return jsonify({'error': 'Achievement ID not found'})
    if not student_id:
        return jsonify({'error': 'Student ID not found'})
    return add_student_achievement(student_id, achievement_id)
 
 #Remove achievement
@mentor_controller.route('/mentor/removeAchievement', methods=['DELETE'])
def del_student_achievement():
    try:
        student_id = request.args.get('student_id')
        achievement_id = request.args.get('achievement_id')
    except: return jsonify({'error': 'Invalid inputs'})
    if not achievement_id:
        return jsonify({'error': 'Achievement ID not found'})
    if not student_id:
        return jsonify({'error': 'Student ID not found'})
    return remove_student_achievement(student_id, achievement_id)
 
 #Add project
@mentor_controller.route('/mentor/addProject', methods=['POST'])
def add_project_route():
    m_id = session.get('username')
    request_data = request.json
    try:
        project_name = request_data.get('project_name')
        start_date = request_data.get('start_date')
        end_date = request_data.get('end_date')
    except: return jsonify({'error': 'Invalid inputs'})
    if not project_name or not start_date or not end_date : return jsonify({'error': 'Inputs Missing'})
    project_id = generate_project_id()
    
    return add_project(m_id,project_id, project_name, start_date, end_date)
 
 #Delete project
@mentor_controller.route('/mentor/removeProject', methods=['DELETE'])
def delete_project_route():
    try:
        project_id = request.json.get('project_id')
    except: return jsonify({'error': 'Invalid inputs'})
    if not project_id:
        return jsonify({'error': 'Project ID not found'})
    return delete_project(project_id)