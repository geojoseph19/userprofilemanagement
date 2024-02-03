import psycopg2
from config import db_params
from flask import jsonify,request,redirect, make_response
import datetime
from ..utils.authentication_utils import *
from ..utils.mail_utils import *


#Get the mail id corresponding to a username
def get_mail_from_username(username):
    query_admin = "SELECT a.admin_mail FROM credentials c JOIN admins a ON c.cred_id = a.cred_id WHERE c.username = %s"
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



#Provide an OTP via mail for user account recovery
def otp_mail():
    try:
        data=request.json
        userName=data.get('username')

        response = make_response('Data stored in cookie')
        response.set_cookie('username', userName)

        mailID=get_mail_from_username(userName)
        query_admin='SELECT admin_fname,admin_mname,admin_lname FROM admins WHERE admin_id=%s'
        query_student='SELECT fname,mname,lname FROM student WHERE st_id=%s'
        query_mentor='SELECT m_fname,m_mname,m_lname FROM mentor WHERE m_id=%s'
        if not mailID:
            return jsonify({'error':'Invalid mail ID',
                        'message':'Please provide a valid mail ID',
                        'status':'failed'
                        })
        otp=generate_otp()
        expiry_time=datetime.datetime.now()+datetime.timedelta(minutes=10)


        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('INSERT INTO otp(username,otp,expiry_time) VALUES(%s,%s,%s)',(userName,otp,expiry_time,))
                cursor.execute('SELECT role_id FROM credentials WHERE username=%s',(userName,))
                id=cursor.fetchone()
                if id==0:
                    query=query_admin
                elif id==1:
                    query=query_mentor
                elif id==2:
                    query=query_student
                else:
                    return jsonify({'error':'User not found',
                                        'message':'The user doesn\'t exist',
                                        'status':'failed'
                                        })
                cursor.execute(query,(userName,))
                details=cursor.fetchone()
        fname=details[0]
        mname=details[1]
        lname=details[2]
                
            
        send_mail(mailID,userName,fname,mname,lname)
        return jsonify({'message':f'A mail with OTP for resetting your password was sent to your mail id {mailID}'})
    

    except psycopg2.Error as e:
        return jsonify({'error':str(e),
                        'message':'An error has occured!',
                        'status':'failed'
                        })
    



#Verify the user entered OTP

def verify_otp():
    try:
        username = request.cookies.get('username')
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
                    return jsonify({'error':'Invalid OTP or OTP',
                                    'status':'failed',
                                    'status_code':400
                                    })
                
    except Exception as e:
        return jsonify({'error': 'An error occurred', 
                        'message': str(e),
                        'status_code':500
                        })


#Reset the user password
def reset_password(username):
    try:
        new_password=request.json.get('new_password')
        mailID=get_mail_from_username(username)
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                 cursor.execute('UPDATE credentials SET password_hash=%s WHERE email=%s',(hash_password(new_password),mailID,))
                 conn.commit()
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
