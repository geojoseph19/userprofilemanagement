import psycopg2
import bcrypt
from config import db_params
from flask import jsonify,request,redirect,url_for, session
import datetime
from ..utils.authentication_utils import *
from ..utils.mail_utils import *
from ..utils.session_manager import *
from ..utils.validation_utils import *
from ..utils.mail_content import *


#Get the mail id corresponding to a username
def get_mail_from_username(username):
    query_admin = "SELECT a.email FROM credentials c JOIN admins a ON c.cred_id = a.cred_id WHERE c.username = %s"
    query_student = "SELECT s.email FROM credentials c JOIN student s ON c.cred_id = s.cred_id WHERE c.username = %s"
    query_mentor = "SELECT m.email FROM credentials c JOIN mentor m ON c.cred_id = m.cred_id WHERE c.username = %s"
 
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT role_id FROM credentials WHERE username = %s', (username,))
                role = cursor.fetchone()
                if role is None:
                    return None  # No role found for the username
 
                role_id = role[0]
 
                if role_id == 0:
                    query = query_admin
                elif role_id == 1:
                    query = query_mentor
                elif role_id == 2:
                    query = query_student
 
                cursor.execute(query, (username,))
                result = cursor.fetchone()
 
                if result:
                    mailID = result[0]
                    return mailID
                else:
                    return None  # No mail ID found for the username
    except psycopg2.Error as e:
        return jsonify({'error': str(e), 'message': 'An error has occurred!', 'status': 'failed'})
 
 
 
#Provide an OTP via mail for user account recovery (same function is used to resend otp to the user)
def otp_mail():
    try:
        subject = 'OTP for account recovery'
        data = request.json
        username = data.get('username')
        set_session_data('username',username)
        mailID = get_mail_from_username(username)
        query_admin = 'SELECT admin_fname, admin_mname, admin_lname FROM admins WHERE admin_id=%s'
        query_student = 'SELECT fname, mname, lname FROM student WHERE st_id=%s'
        query_mentor = 'SELECT m_fname, m_mname, m_lname FROM mentor WHERE m_id=%s'
        
        if not mailID:
            return jsonify({'error': 'No matching mail id found',
                            'message': 'The given username has no associated mail id',
                            'status': 'failed'})
        
        # Generate OTP
        otp = generate_otp()
        expiry_time = datetime.datetime.now() + datetime.timedelta(minutes=10)
        
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                # Delete any previously generated OTP for the same user
                cursor.execute('DELETE FROM otp WHERE username = %s', (username,))
                
                # Insert the new OTP
                cursor.execute('INSERT INTO otp (username, otp, expiry_time) VALUES (%s, %s, %s)', (username, otp, expiry_time))
                
                # Fetch user details based on role
                cursor.execute('SELECT role_id FROM credentials WHERE username = %s', (username,))
                role_id = cursor.fetchone()[0]
                
                if role_id == 0:
                    query = query_admin
                elif role_id == 1:
                    query = query_mentor
                elif role_id == 2:
                    query = query_student
                else:
                    return jsonify({'error': 'User not found',
                                    'message': 'The user doesn\'t exist',
                                    'status': 'failed'})
                
                cursor.execute(query, (username,))
                details = cursor.fetchone()
                
        fname, mname, lname = details[0], details[1], details[2]
        #message = f'Hello {fname},\n Your OTP for account recovery is {otp}'
        
        content_type = "otp"
        data = otp
        send_mail(mailID,username,fname,mname,lname,content_type,data)
        
        return jsonify({'message': f'A mail with OTP for resetting your password is sent to your mail id {mailID}'})
 
    except psycopg2.Error as e:
        return jsonify({'error': str(e),
                        'message': 'An error has occurred! Couldn\'t send mail',
                        'status': 'failed'})
 
 
 
#Verify the user entered OTP
 
def verify_otp():
    try:
        username=get_session_data('username')
        otp=request.json.get('otp')
 
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('SELECT * FROM otp WHERE username=%s AND otp=%s AND expiry_time>NOW()',(username,otp,))
                if cursor.fetchone():
                    cursor.execute('DELETE FROM otp WHERE otp=%s',(otp,))

                    return jsonify({'message':'OTP verified successfully',
                                    'status':'success',
                                    'status_code':200
                                    })
                else:
                    return jsonify({'error':'Invalid OTP',
                                    'status':'failed',
                                    'status_code':400
                                    })
                
    except Exception as e:
        return jsonify({'error': 'An error occurred',
                        'message': str(e),
                        'status_code':500
                        })
 
 
#Reset the user password
def reset_password():
    try:
        username=get_session_data('username')
        new_password=request.json.get('new_password')
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                 cursor.execute('UPDATE credentials SET password_hash=%s WHERE username=%s',(hash_password(new_password),username,))
                 conn.commit()
                 clear_session()

        return jsonify({'message':'Password reset successfully',
                                    'status':'success',
                                    'status_code':200
                                    })
    
    except Exception as e:
        return jsonify({'error':str(e),
                        'message':'Couldn\'t reset password. Please try again!',
                        'status':'failed',
                        'status_code':500
                        })
                      
    

#update_password
def fun_updatepwd():
    try:
        data = request.json
        if data is None:
            raise ValueError('Invalid JSON data: Request body is empty')
        
        old_pwd = data.get('old_password')
        new_pwd = data.get('new_password')
        new_pwd_retype = data.get('new_password_retype')
        if old_pwd is None:
            raise ValueError('Missing old password field in JSON data')
        elif new_pwd is None:
            raise ValueError('Missing new password field in JSON data')
        elif new_pwd_retype is None:
            raise ValueError('Missing re-enter new password field in JSON data')
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
    else:
        if not old_pwd:
            return jsonify({'error':'Old password field empty'})
        if not new_pwd:
            return jsonify({'error':'New password field empty'})
        if not new_pwd_retype:
            return jsonify({'error':'Re-enter new password field empty'})
        else:

            username = get_session_data('username')
            if username == None : return jsonify({'error':'Unautorized access! Please login first'})

            if new_pwd == new_pwd_retype:
                
                if not is_valid_password(new_pwd):
                    return jsonify({'error':'The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character (!@#$%^&*()-+=).'})

                try:
                    with psycopg2.connect(**db_params) as conn:
                        with conn.cursor() as cursor:
                            cursor.execute('''SELECT password_hash FROM credentials WHERE username = %s''', (username,))
                            stored_pwd = cursor.fetchone()
                except psycopg2.Error as e:
                        return jsonify({'error': 'Error fetching password from credentials'}),e
                else:
                    
                    stored_pwd = stored_pwd[0]

                    #taking the str hash from database and converting to byte
                    stored_pwd = repr(stored_pwd)
                    stored_pwd = stored_pwd[3:-2]
                    
                    #checking if pwd is correct
                    if bcrypt.checkpw(old_pwd.encode('utf-8'), stored_pwd.encode('utf-8')):

                        new_pwd = hash_password(new_pwd)

                        try:
                            with psycopg2.connect(**db_params) as conn:
                                with conn.cursor() as cursor:
                                    cursor.execute('''UPDATE credentials SET password_hash=%s WHERE username=%s''', (new_pwd, username,))
                                    conn.commit()
                        except psycopg2.Error as e:
                                return jsonify({'error': 'Error updating password in credentials'})

                        else:
                            return jsonify({'Success': 'Password updated successfully!'}), 200
                    else:
                        return jsonify({'error': 'Incorrect password'}), 401
                
            else:
                return jsonify({'error': 'New password and re-enter new password fields does not match'}), 401
