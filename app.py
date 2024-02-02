from flask import redirect, url_for, session
from login import *
from admin import *
from student import *
from mentor_functionalities import *

app=Flask(__name__)
app.config['SESSION_TYPE'] = 'filesystem'  
app.secret_key = 'secret_key'
Session(app)

#-------------------------------LOGIN/LOGOUT-----------------------------------------------
#Login function
@app.route('/login', methods=['POST'])
def login():
    return fun_login()

#Logout function
@app.route('/logout', methods=['POST'])
def logout():
    return fun_logout()

@app.route('/temp', methods=['GET','POST'])
def temp():
    return jsonify({'Redirect': 'Redirected to a temporary page!'})

#--------------------------------ADMIN-----------------------------------------
#-----------------------------ADMIN-ADMIN--------------------------------------
#View admin home details
@app.route('/admin/home', methods=['GET'])
def admin_home():
    return fun_admin_home()

 # Route to add an admin
@app.route('/api/v1/admin/add_admin', methods=['POST'])
def add_admin():
    return add_new_admin()
 
# Route to remove an admin
@app.route('/api/v1/admin/', methods=['DELETE'])
def remove_admin_route():
    return remove_admin()

#Route to update admin info
@app.route('/api/v1/admin/<string:admin_id>',methods=['PUT'])
def admin_update(admin_id):
    return update_admin_details(admin_id)


#-----------------------------ADMIN-MENTOR------------------------------------------

#Admin - Add new mentor
@app.route('/admin/addmentor', methods=['POST'])
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

#View admin home details
@app.route('/mentor/home', methods=['GET'])
def mentor_home():
    return fun_mentor_home()

# Route to update mentor profile
@app.route('/mentor/profile', methods=['PUT'])
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
@app.route('/mentor/<string:mentor_id>/projects', methods=['GET'])
def mentor_projects(mentor_id):
    username = session.get('username')
    projects = get_mentor_projects(username)
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

#Add achievement 
@app.route('/mentor/<string:m_id>/add_achievement', methods=['POST'])
def student_achievement(m_id):
    student_id = request.json.get('st_id')
    achievement_id = request.json.get('ach_id')
    return add_student_achievement(student_id, achievement_id)
 
 #Remove achievement
@app.route('/mentor/<string:m_id>/remove_achievement', methods=['DELETE'])
def del_student_achievement(m_id):
    student_id = request.json.get('st_id')
    achievement_id = request.json.get('ach_id')
    return remove_student_achievement(student_id, achievement_id)
 
 #Add project
@app.route('/mentor/<string:m_id>/add_project', methods=['POST'])
def add_project_route(m_id):
    m_id = session.get('username')
    request_data = request.json
    project_name = request_data.get('project_name')
    start_date = request_data.get('start_date')
    end_date = request_data.get('end_date')
    project_id = generate_project_id()
    
    return add_project(m_id,project_id, project_name, start_date, end_date)
 
 #Delete project
@app.route('/mentor/<string:m_id>/projects/<string:project_id>', methods=['DELETE'])
def delete_project_route(m_id, project_id):
    return delete_project(m_id, project_id)

#----------------------------------------------------------------------------------------------------------------------------------------------------------



if __name__ == '__main__':
    app.run(debug=True)


