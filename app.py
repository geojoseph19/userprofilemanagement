from login import *
from adminmentor import *
from student import *
from mentor_functionalities import *

app=Flask(__name__)


#-------------------------------LOGIN-----------------------------------------------
#Login function
@app.route('/login', methods=['POST'])
def login():
    return fun_login()

#-----------------------------ADMIN-MENTOR------------------------------------------
#Admin - Add new mentor
@app.route('/admin/addmentor', methods=['PUT'])
def admin_create_mentor():
    return fun_admin_create_mentor()



#-----------------------------STUDENT-PAGE-------------------------------------------

#View student home details
@app.route('/student/home', methods=['GET'])
def student_home():
    return fun_student_home()


#Update student details
@app.route('/student/editprofile', methods=['PUT'])
def update_student():
    return fun_update_student()


#View student achievements
@app.route('/student/achievements', methods=['GET'])
def view_student_achievements():
    return fun_view_student_achievements()

#View assigned project
@app.route('/student/project', methods=['GET'])
def view_assigned_project():
    return fun_view_assigned_project()


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
def project_students(project_id):
    students = get_project_students(project_id)
    return jsonify(students)
 
# Route to add a new student under a project
@app.route('/mentor/<string:m_id>/projects/<string:project_id>/add_student', methods=['POST'])
def student_to_project(project_id):
    student_id = request.json.get('student_id')
    return add_student_to_project(student_id, project_id)
 
# Route to remove a student from a project
@app.route('/mentor/<string:m_id>/projects/<string:project_id>/remove_student', methods=['DELETE'])
def remove_student(project_id):
    student_id = request.json.get('student_id')
    return remove_student_from_project(student_id, project_id)
 
@app.route('/mentor/<string:m_id>/add_achievement', methods=['POST'])
def student_achievement(m_id):
    student_id = request.json.get('st_id')
    achievement_id = request.json.get('ach_id')
    return add_student_achievement(student_id, achievement_id)
 
@app.route('/mentor/<string:m_id>/remove_achievement', methods=['DELETE'])
def del_student_achievement(m_id):
    student_id = request.json.get('st_id')
    achievement_id = request.json.get('ach_id')
    return remove_student_achievement(student_id, achievement_id)
 
@app.route('/mentor/<string:m_id>/add_project', methods=['POST'])
def add_project_route(m_id):
    request_data = request.json
    project_name = request_data.get('project_name')
    start_date = request_data.get('start_date')
    end_date = request_data.get('end_date')
    
    return add_project(m_id, project_name, start_date, end_date)
 
 
@app.route('/mentor/<string:m_id>/projects/<string:project_id>', methods=['DELETE'])
def delete_project_route(m_id, project_id):
    return delete_project(m_id, project_id)

#----------------------------------------------------------------------------------------------------------------------------------------------------------



if __name__ == '__main__':
    app.run(debug=True)


