#-------------------------------------------------* MENTOR FUNCTIONALITIES *----------------------------------------------------------


import psycopg2
from psycopg2 import sql
from flask import Flask,request,jsonify
from miniproject.config import db_params


app=Flask(__name__)

#-----------------------------------------------------FUNCTIONS------------------------------------------------------------------------

# Function to update mentor profile
def update_mentor_profile(m_id,qualification):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''UPDATE mentor SET qualification=%s WHERE m_id=%s''',(qualification,m_id))
                conn.commit()
        return True
    except psycopg2.error as e:
        return False
    

# Function to fetch projects under a mentor
def get_mentor_projects(mentorid):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT * FROM project WHERE m_id=%s''',(mentorid))
                projects=cursor.fetchall()
        return projects
    except psycopg2.Error as e:
        return None

#Function to fetch students under each projects
def get_project_students(project_id):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT * FROM student WHERE st_id IN(SELECT st_id FROM st_project WHERE prj_id=%s)',(project_id))
                students_in_project=cursor.fetchall()
        return students_in_project
    except psycopg2.Error as e:
        return None

#------------------------------------------------------ROUTES-------------------------------------------------------------------------------
    
# Route to update mentor profile
@app.route('/mentor/<string:username>/profile',method=['PUT'])
def update_profile(m_id):
    request_data=request.json
    new_qual=request_data.get('qualification')
    if new_qual is None:
        return jsonify({'error':'Qualification not provided!'}),400
    
    success=update_mentor_profile(m_id,new_qual)
    if success:
        return jsonify({'message':'Profile updated successfully!'})
    else:
        return jsonify({'error':'failed to update mentor profile!'}),500
    
#Route to get projects under the logged in mentor
@app.route('/mentor/<string:mentor_id>/projects',method=['GET'])
def mentor_projects():
    mentor_id=request.args.get('mentor_id') # Fetches the corresponding value for mentor_id from the URL
    projects=get_mentor_projects(mentor_id)
    return jsonify(projects)

#Route to get students under a given project
@app.route('/mentor/<string:m_id/projects/<string:project_id>',methods=['GET'])
def project_students():
    projectid=request.args.get('project_id')
    students=get_project_students(projectid)
    return jsonify(students)



if __name__=='__main__':
    app.run(debug=True)