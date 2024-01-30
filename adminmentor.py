import psycopg2
from flask import Flask,request,jsonify
from config import db_params
from credentials import *

app=Flask(__name__)

#--------------------------MODIFY-MENTOR------------------------------------
#----------------------------FUNCTIONS--------------------------------------

#Create a mentor account
def fun_admin_create_mentor():

    data = request.json
    m_fname = data.get('m_fname')
    m_mname = data.get('m_mname')
    m_lname = data.get('m_lname')
    dept_id = data.get('dept_id')
    qualifctn = data.get('qualifictn')
    #cred_id






    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('')





#-----------------------------ROUTES----------------------------------------
#Add new mentor
@app.route('/admin/addmentor', methods=['PUT'])
def admin_create_mentor():
    return fun_admin_create_mentor()






# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
