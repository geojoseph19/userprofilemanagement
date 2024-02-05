from flask import Blueprint
from app.services.student import *

student_controller = Blueprint('student', __name__, url_prefix="/api/v1")

#-----------------------------STUDENT-PAGE-------------------------------------------

#View student home details
@student_controller.route('/student/home', methods=['GET'])
def student_home():
    return fun_student_home()

#Update student details
@student_controller.route('/student/editProfile', methods=['PUT'])
def update_student():
    return fun_update_student()

#View student achievements
@student_controller.route('/student/achievements', methods=['GET'])
def view_student_achievements():
    return fun_view_student_achievements()

#View assigned project
@student_controller.route('/student/project', methods=['GET'])
def view_assigned_project():
    return fun_view_assigned_project()

#View progress
@student_controller.route('/student/progress', methods=['GET'])
def fetch_progress():
    return fun_fetch_progress()

