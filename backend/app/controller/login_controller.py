from flask import Blueprint
from app.services.login import *

login_controller = Blueprint('login', __name__, url_prefix="/api/v1")

#-------------------------------LOGIN/LOGOUT-----------------------------------------------
#Login function
@login_controller.route('/login', methods=['POST'])
def login():
    return fun_login()

#Logout function
@login_controller.route('/logout', methods=['POST'])
def logout():
    return fun_logout()

@login_controller.route('/temp', methods=['GET','POST'])
def temp():
    return jsonify({'Redirect': 'Redirected to a temporary page!'})