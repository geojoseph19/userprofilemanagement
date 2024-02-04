from flask import Blueprint
from app.services.admin import *

admin_controller = Blueprint('admin', __name__)

#--------------------------------ADMIN-----------------------------------------
#-----------------------------ADMIN-ADMIN--------------------------------------
#View admin home details
@admin_controller.route('/admin/home', methods=['GET'])
def admin_home():
    return fun_admin_home()

 # Route to add an admin
@admin_controller.route('/api/v1/admin/add_admin', methods=['POST'])
def add_admin():
    return add_new_admin()
 
# Route to remove an admin
@admin_controller.route('/api/v1/admin/', methods=['DELETE'])
def remove_admin_route():
    return remove_admin()

#Route to update admin info
@admin_controller.route('/api/v1/admin/<string:admin_id>',methods=['PUT'])
def admin_update(admin_id):
    return update_admin_details(admin_id)


#-----------------------------ADMIN-MENTOR------------------------------------------

#Admin - Add new mentor
@admin_controller.route('/admin/addmentor', methods=['POST'])
def admin_create_mentor():
    return fun_admin_create_mentor()


