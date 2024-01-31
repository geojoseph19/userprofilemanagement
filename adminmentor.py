import psycopg2
from flask import Flask,request,jsonify
from config import db_params
from credentials import *

app=Flask(__name__)

#--------------------------MODIFY-MENTOR------------------------------------
#----------------------------FUNCTIONS--------------------------------------

#Create a mentor account
def fun_admin_create_mentor():

    role_id = 1

    data = request.json
    m_fname = data.get('mentor_first_name')
    m_mname = data.get('mentor_middle_name')
    m_lname = data.get('mentor_last_name')
    dept_id = data.get('department_id')
    qualifctn = data.get('qualification')
    email = data.get('email')

    cred_id = generate_cred_id()
    username = generate_username()
    password = generate_password(8)

    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('INSERT INTO credentials(cred_id, username, password_hash, role_id) VALUES (%s,%s,%s,%s)', 
                           (cred_id,username,password,role_id))

            cursor.execute('INSERT INTO mentor(m_id, m_fname, m_mname, m_lname, dept_id, qualifctn, cred_id, email) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)', 
                           (username,m_fname,m_mname,m_lname,dept_id,qualifctn,cred_id,email))

        return jsonify({'message': 'Mentor record added'})




#-----------------------------ROUTES----------------------------------------
#Add new mentor
@app.route('/admin/addmentor', methods=['PUT'])
def admin_create_mentor():
    return fun_admin_create_mentor()






# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
