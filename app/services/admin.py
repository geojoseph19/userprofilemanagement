import psycopg2
import re
from flask import Flask,request,jsonify, session
from flask_session import Session
from config import db_params
from ..utils.credential_generators import *
from ..utils.mail_utils import *
from ..utils.session_manager import *
from ..utils.validation_utils import *


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
 
# Function to add new admin
def add_new_admin():
    try:
        roleID = 0
        credID = generate_cred_id()  
        username = generate_username()  
        password = generate_password(8)  
        hashed_password = hash_password(password)
        admin_fname = request.json.get('first_name')
        admin_mname = request.json.get('middle_name')
        admin_lname = request.json.get('last_name')
        adminMail = request.json.get('email')
 
        if not is_valid_email(adminMail):
            return jsonify({'error': 'Invalid email', 'message': 'Please enter a valid email'})
 
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('INSERT INTO credentials(cred_id, username, password_hash, role_id) VALUES (%s,%s,%s,%s)',
                               (credID, username, hashed_password, roleID))
                cursor.execute('INSERT INTO admins(admin_id,admin_fname,admin_mname,admin_lname,email,cred_id) VALUES(%s,%s,%s,%s,%s,%s)',
                               (username,
                               admin_fname, admin_mname, admin_lname, adminMail, credID))
 
        content_type = "newuser"
        data = password
        send_mail(adminMail,username,admin_fname,admin_mname,admin_lname,content_type,data)
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
    email=data.get('adminMail')
 
    if not is_valid_email(email):
        return jsonify({'error':'Invalid email address',
                        'message':'Please provide a valid mail address',
                        'status':'failed'
                        })
 
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.excecute('UPDATE admins SET admin_fname=%s,admin_mname=%s,admin_lname=%s,email=%s, WHERE admin_id=%s',(admin_fname,admin_mname,admin_lname,email,admin_id))
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
    m_fname = data.get('first_name')
    m_mname = data.get('middle_name')
    m_lname = data.get('last_name')
    dept_id = data.get('department_id')
    qualification = data.get('qualification')
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

            cursor.execute('INSERT INTO mentor(m_id, m_fname, m_mname, m_lname, dept_id, qualification, cred_id, email) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)', 
                           (username,m_fname,m_mname,m_lname,dept_id,qualification,cred_id,email))

    content_type = "newuser"
    data = password
    send_mail(email,username,m_fname,m_mname,m_lname,content_type,data)

    return jsonify({'message': 'Mentor record added'})

# Delete a mentor account
def fun_admin_delete_mentor():

    data = request.json
    username = data.get('username')
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('DELETE FROM mentor WHERE m_id=%s', (username,))
            cursor.execute('DELETE FROM credentials WHERE cred_id=%s', (username,))
 
    return jsonify({'message': 'Mentor record deleted'})


#--------------------------MODIFY-STUDENT------------------------------------
#----------------------------FUNCTIONS---------------------------------------

# Create a student account
def fun_admin_create_student():
    role_id = 2
 
    data = request.json
 
    # Validate required fields
    required_fields = ['first_name', 'last_name', 'email']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'Missing or empty {field}', 'message': f'Please provide {field}'}), 400
 
    fname = data['first_name']
    lname = data['last_name']
    email = data['email']
    if not is_valid_email(email):
        return jsonify({'error':'Invalid email address',
                        'message':'Please provide a valid mail address',
                        'status':'failed'
                        })
 
    # Other optional fields
    mname = data.get('middle_name')
    sex = data.get('sex')
    sphoneno = data.get('student_phone_no')
    address = data.get('address')
    guardian = data.get('guardian_name')
    gphoneno = data.get('guardian_phone_no')
    dob = data.get('dob')
    dept_id = data.get('dept_id')
    semester = data.get('semester')
 
    cred_id = generate_cred_id()
    username = generate_username()
    password = generate_password(8)
 
    try:
        hashed_password = hash_password(password)
    except Exception as e:
        return jsonify({'error': 'Password encryption error', 'message': str(e)}), 500
 
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('INSERT INTO credentials(cred_id, username, password_hash, role_id) VALUES (%s,%s,%s,%s)',
                           (cred_id, username, hashed_password, role_id))
 
            cursor.execute(
                'INSERT INTO student(st_id, fname, mname, lname, sex, sphoneno, address, guardian, gphoneno, dob, semester, dept_id, cred_id, email) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)',
                (username, fname, mname, lname, sex, sphoneno, address, guardian, gphoneno, dob, semester, dept_id,
                 cred_id, email))
            
    data = password
    content_type = "newuser"
 
    send_mail(email,username,fname,mname,lname,content_type,data)
 
    return jsonify({'message': 'Student record added'})
 
#Update student details
def fun_admin_update_student():

    data = request.json
    st_id = data.get('username')

    update_fields = {
        'student_first_name': data.get('student_first_name'),
        'student_middle_name': data.get('student_middle_name'),
        'lname': data.get('lname'),
        'sex': data.get('sex'),
        'email': data.get('email'),
        'sphoneno': data.get('sphoneno'),
        'address': data.get('address'),
        'guardian': data.get('guardian'),
        'gphoneno': data.get('gphoneno')
    }
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                # Construct SQL UPDATE statement dynamically based on provided fields
                update_query = '''UPDATE student SET {} WHERE 
                    st_id = %s'''.format(', '.join([f'{key} = %s' for key in update_fields if update_fields[key] is not None]))

                # Extract values for the fields to update
                update_values = [update_fields[key] for key in update_fields if update_fields[key] is not None]
                update_values.append(st_id)

                cursor.execute(update_query, update_values)

        conn.commit()

        return jsonify({'message': 'Student information updated successfully'})
    except Exception as e:
        return jsonify({'Error': 'Nothing to update'})
 
# Delete a student account
def fun_admin_delete_student():

    data = request.json
    username = data.get('username')
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('DELETE FROM student WHERE st_id=%s', (username,))
            cursor.execute('DELETE FROM credentials WHERE cred_id=%s', (username,))
 
    return jsonify({'message': 'Student record deleted'})


#Admin - Update User
def fun_admin_update_user():
    
    data = request.json
    username = data.get('username')

    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT r.role_type
                                    FROM credentials c
                                    INNER JOIN roles r ON c.role_id = r.role_id
                                    WHERE c.username = %s''', (username,))
                role_type = cursor.fetchone()[0]
    except psycopg2.Error as e:
        return jsonify({'error': 'Unable to fetch role type'}),e

    update_fields = {
        'fname': data.get('first_name'),
        'mname': data.get('middle_name'),
        'lname': data.get('last_name'),
        'sex': data.get('sex'),
        'email': data.get('email'),
        'sphoneno': data.get('student_phone_no'),
        'address': data.get('address'),
        'guardian': data.get('guardian'),
        'gphoneno': data.get('guardian_phone_no'),
        'dept_id': data.get('department_id'),
        'qualification': data.get('qualification'),
        'dob': data.get('date_of_birth'),
        'semester': data.get('semester')
    }
    if update_fields['sphoneno']:
        if not is_valid_phone(update_fields['sphoneno']):
            return jsonify({'Error': 'Invalid phone number'})
    

    # Construct SQL UPDATE statement dynamically based on provided fields
    admin_update_query = '''UPDATE admins SET {} WHERE 
        admin_id = %s'''.format(', '.join([f'{key} = %s' for key in update_fields if update_fields[key] is not None]))
    
    mentor_update_query = '''UPDATE mentor SET {} WHERE 
        m_id = %s'''.format(', '.join([f'{key} = %s' for key in update_fields if update_fields[key] is not None]))
    
    student_update_query = '''UPDATE student SET {} WHERE 
        st_id = %s'''.format(', '.join([f'{key} = %s' for key in update_fields if update_fields[key] is not None]))
    

    if role_type == "admin":
        update_query = admin_update_query
    elif role_type == "mentor":
        update_query = mentor_update_query
    elif role_type == "student":
        update_query = student_update_query
    else : return jsonify({'error': 'Role type not found'})

    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:

                # Extract values for the fields to update
                update_values = [update_fields[key] for key in update_fields if update_fields[key] is not None]
                update_values.append(username)

                cursor.execute(update_query, update_values)

        conn.commit()

        return jsonify({'message': f'{role_type} information updated successfully'})
    except Exception as e:
        return jsonify({'Error': f'Nothing to update in {role_type} profile'})




#Admin - delete user  
def fun_admin_delete_user():

    username=request.args.get('username')

    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT r.role_type
                                    FROM credentials c
                                    INNER JOIN roles r ON c.role_id = r.role_id
                                    WHERE c.username = %s''', (username,))
                role_type = cursor.fetchone()[0]
    except psycopg2.Error as e:
        return jsonify({'error': 'Unable to fetch role type'})
    
    admin_delete_query = "DELETE FROM admins WHERE admin_id=%s"
    mentor_delete_query = "DELETE FROM mentor WHERE m_id=%s"
    student_delete_query = "DELETE FROM student WHERE st_id=%s"
    
    if role_type == "admin":
        delete_query = admin_delete_query
    elif role_type == "mentor":
        delete_query = mentor_delete_query
    elif role_type == "student":
        delete_query = student_delete_query
    else : return jsonify({'error': 'Role type not found'})

    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute(delete_query, (username,))
                cursor.execute('DELETE FROM credentials WHERE username=%s', (username,))
    except psycopg2.Error as e:
        return jsonify({'error': f'Unable to delete {role_type} {username}'})
 
    return jsonify({'message': f'{role_type} record {username} deleted'})





#Admin - Create User
def fun_admin_create_user():
    data = request.json
    role_type = data.get('role_type')

    if role_type not in ['admin', 'mentor', 'student']:
        return jsonify({'error': 'Invalid role type'})

    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                # Insert user into the appropriate table based on role type
                if role_type == 'admin':
                    return add_new_admin()
                elif role_type == 'mentor':
                    return fun_admin_create_mentor()
                elif role_type == 'student':
                    return fun_admin_create_student()
    except Exception as e:
        return jsonify({'Error':'Unexpected error'})
               

