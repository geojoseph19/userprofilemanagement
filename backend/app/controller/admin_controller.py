from flask import Blueprint
from app.services.admin import *
from app.services.student import *

admin_controller = Blueprint('admin', __name__, url_prefix="/api/v1")

#--------------------------------ADMIN--------------------------------------------
#Admin - create user
@admin_controller.route('/admin/createUser', methods=['POST'])
def admin_create_user():

    if session.get('logged_in') != True:
        response = jsonify({'error': 'Unauthorized access! Please login first', 'status': 'failed'})
        response.status_code = 401  
        return response
    return fun_admin_create_user()

#Admin - update user
@admin_controller.route('/admin/updateUser', methods=['POST'])
def admin_update_user():
    if session.get('logged_in') != True:
        response = jsonify({'error': 'Unauthorized access! Please login first', 'status': 'failed'})
        response.status_code = 401  
        return response
    return fun_admin_update_user()

#Admin - remove user
@admin_controller.route('/admin/removeUser', methods=['DELETE'])
def admin_remove_user():
    if session.get('logged_in') != True:
        response = jsonify({'error': 'Unauthorized access! Please login first', 'status': 'failed'})
        response.status_code = 401  
        return response
    return fun_admin_delete_user()


#-----------------------------ADMIN-ADMIN------------------------------------------

#View admin home details
@admin_controller.route('/admin/home', methods=['GET'])
def admin_home():

    return fun_admin_home()

 # Route to add an admin
@admin_controller.route('/admin/addAdmin', methods=['POST'])
def add_admin():
    return add_new_admin()
 
#-----------------------------ADMIN-MENTOR------------------------------------------

#Admin - Add new mentor
@admin_controller.route('/admin/addMentor', methods=['POST'])
def admin_create_mentor():
    return fun_admin_create_mentor()

#-----------------------------ADMIN-STUDENT------------------------------------------

#Add new student
@admin_controller.route('/admin/addStudent', methods=['POST'])
def admin_create_student():
    return fun_admin_create_student()
