from flask import Blueprint
from app.services.student import *

student_controller = Blueprint('student', __name__)

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


