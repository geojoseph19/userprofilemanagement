import psycopg2
import re
from flask import Flask,request,jsonify, session
from flask_session import Session
from config import db_params
from ..utils.credentials import *
from ..utils.mailconn import *
from ..utils.session_manager import *

app=Flask(__name__)


#--------------------------MODIFY-ADMIN-------------------------------------
#----------------------------FUNCTIONS--------------------------------------

#Display admin details
def fun_admin_home():

    admin_id = get_session_data('username')
    if not admin_id:
        return jsonify({'error': 'Admin not found'}), 404

    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''SELECT * FROM admins WHERE admin_id=%s''', (admin_id,))
            admin = cursor.fetchone()

    if admin:
        return jsonify({'admin': admin})
    else:
        return jsonify({'error': 'Admin not found'}), 404

# Function to validate email format
def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return bool(re.match(pattern, email))
 
# Function to add new admin
def add_new_admin():
    try:
        roleID = 0
        credID = generate_cred_id()  
        username = generate_username()  
        password = generate_password(8)  
        hashed_password = hash_password(password)
        admin_fname = request.json.get('firstName')
        admin_mname = request.json.get('middleName')
        admin_lname = request.json.get('lastName')
        adminMail = request.json.get('mailID')
 
        if not is_valid_email(adminMail):
            return jsonify({'error': 'Invalid email', 'message': 'Please enter a valid email'})
 
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('INSERT INTO credentials(cred_id, username, password_hash, role_id) VALUES (%s,%s,%s,%s)',
                               (credID, username, hashed_password, roleID))
                cursor.execute('INSERT INTO admins(admin_id,admin_fname,admin_mname,admin_lname,admin_mail,cred_id) VALUES(%s,%s,%s,%s,%s,%s)',
                               (username,
                               admin_fname, admin_mname, admin_lname, adminMail, credID))
 
        send_mail(adminMail, username, password, admin_fname, admin_mname, admin_lname)
        return jsonify({'status': 'Success!', 'message': 'New admin added!'}), 200
    except AttributeError as e:
        return jsonify({'error': 'Missing data', 'message': 'Please provide complete data'}), 400
    except Exception as e:
        return jsonify({'error': 'An error has occurred!', 'message': str(e)}), 500
    
# Function to update the mentor details
def update_admin_details(admin_id):
   try:
    data=request.get_json()
 
    admin_fname=data.get('adminFname')
    admin_mname=data.get('adminMname')
    admin_lname=data.get('adminLname')
    admin_mail=data.get('adminMail')
 
    if not is_valid_email(admin_mail):
        return jsonify({'error':'Invalid email address',
                        'message':'Please provide a valid mail address',
                        'status':'failed'
                        })
 
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.excecute('UPDATE admins SET admin_fname=%s,admin_mname=%s,admin_lname=%s,admin_mail=%s, WHERE admin_id=%s',(admin_fname,admin_mname,admin_lname,admin_mail,admin_id))
            conn.commit()
    return jsonify({'message':'Admin details updated successfully!',
                    'status':'success'
                    })
   except AttributeError as e:
       return jsonify({'error':'Invalid value for attribute',
                       'message':'Please provide valid values',
                       'status':'failed'
                       })
   except Exception as e:
       return jsonify({
           'message':'An unexpected error has occured!',
           'status':'failed'
       })
 
# Function to remove an admin
def remove_admin():
    try:
        username = request.json.get('username')
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('DELETE FROM admins WHERE admin_id=%s', (username,))
        return jsonify({'message': 'Admin removed successfully!', 'status': 200}), 200
    except AttributeError:
        return jsonify({'error': 'Invalid ID provided', 'message': 'Please provide a valid admin ID'}), 400
    except Exception as e:
        return jsonify({'error': 'An error has occurred!', 'message': str(e)}), 500

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


    try:
        hashed_password = hash_password(password)
    except:
        return jsonify({'error':'Password encryption error'})
            

    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('INSERT INTO credentials(cred_id, username, password_hash, role_id) VALUES (%s,%s,%s,%s)', 
                           (cred_id,username,hashed_password,role_id))

            cursor.execute('INSERT INTO mentor(m_id, m_fname, m_mname, m_lname, dept_id, qualifctn, cred_id, email) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)', 
                           (username,m_fname,m_mname,m_lname,dept_id,qualifctn,cred_id,email))


    send_mail(email,username,password,m_fname,m_mname,m_lname)

    return jsonify({'message': 'Mentor record added'})

#--------------------------MODIFY-STUDENT------------------------------------
#----------------------------FUNCTIONS---------------------------------------

#Create a mentor account
def fun_admin_create_student():

    role_id = 1

    data = request.json
    m_fname = data.get('student_first_name')
    m_mname = data.get('student_middle_name')
    m_lname = data.get('student_last_name')
    sex= data.get('sex')
    phoneno = data.get('phone_number')
    address = data.get('address')
    dob = data.get('dob')
    email = data.get('email')

    cred_id = generate_cred_id()
    username = generate_username()
    password = generate_password(8)


    try:
        hashed_password = hash_password(password)
    except:
        return jsonify({'error':'Password encryption error'})
            

    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('INSERT INTO credentials(cred_id, username, password_hash, role_id) VALUES (%s,%s,%s,%s)', 
                           (cred_id,username,hashed_password,role_id))

            cursor.execute('INSERT INTO mentor(m_id, m_fname, m_mname, m_lname, dept_id, qualifctn, cred_id, email) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)', 
                           (username,m_fname,m_mname,m_lname,dept_id,qualifctn,cred_id,email))


    send_mail(email,username,password,m_fname,m_mname,m_lname)

    return jsonify({'message': 'Mentor record added'})


    

#-----------------------------ROUTES----------------------------------------
#Add new mentor
@app.route('/admin/addmentor', methods=['POST'])
def admin_create_mentor():
    return fun_admin_create_mentor()






# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
