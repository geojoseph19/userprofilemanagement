import psycopg2
import bcrypt
from config import db_params
from flask import jsonify,request,redirect,url_for, session, send_file
import datetime
from ..utils.authentication_utils import *
from ..utils.mail_utils import *
from ..utils.session_manager import *
from ..utils.validation_utils import *
from ..utils.mail_content import *
from ..utils.response_utils import *

from werkzeug.utils import secure_filename
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload 
import psycopg2
import uuid
from io import BytesIO
import os


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
        return jsonify({'error': str(e), 'message': 'An error has occurred!', 'status': 'failed'}),400
 
 
 
#Provide an OTP via mail for user account recovery (same function is used to resend otp to the user)
def otp_mail():
    try:
        subject = 'OTP for account recovery'
        data = request.json
        username = data.get('username')
        if not username: return jsonify({'error':'Enter username'}),400
        set_session_data('username',username)
        mailID = get_mail_from_username(username)
        query_admin = 'SELECT a.admin_fname, a.admin_mname, a.admin_lname FROM admins a JOIN credentials c ON a.cred_id=c.cred_id WHERE username=%s'
        query_student = 'SELECT s.fname, s.mname, s.lname FROM student s JOIN credentials c ON s.cred_id=c.cred_id WHERE username=%s'
        query_mentor = 'SELECT a.m_fname, a.m_mname, a.m_lname FROM mentor a JOIN credentials c ON a.cred_id=c.cred_id WHERE username=%s'
        
        if not mailID:
            return jsonify({'error': 'User not found!',
                            'message': 'The given username has no associated mail id',
                            'status': 'failed'}),400
        
        # Generate OTP
        otp = generate_otp()
        expiry_time = datetime.datetime.now() + datetime.timedelta(minutes=5)
        
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
                                    'status': 'failed'}),400
                
                cursor.execute(query, (username,))
                details = cursor.fetchone()
    
                
        fname, mname, lname = details[0], details[1], details[2]
        #message = f'Hello {fname},\n Your OTP for account recovery is {otp}'
        
        content_type = "otp"
        data = otp
        #send_mail(mailID,username,fname,mname,lname,content_type,data)
        
        return jsonify({'message': f'An OTP for resetting password has been sent to mail id {hide_email(mailID)} <Debug otp {data}>'}),200
 
    except psycopg2.Error as e:
        return jsonify({'error': str(e),
                        'message': 'An error has occurred! Couldn\'t send mail',
                        'status': 'failed'}),400
 
 
 
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
                                    }),400
                
    except Exception as e:
        return jsonify({'error': 'An error occurred',
                        'message': str(e),
                        'status_code':500
                        }),500
 
 
#Reset the user password
def reset_password():
    try:
        username=get_session_data('username')
        new_password=request.json.get('password')
        if is_valid_password(new_password):
            with psycopg2.connect(**db_params) as conn:
                with conn.cursor() as cursor:
                    cursor.execute('UPDATE credentials SET password_hash=%s WHERE username=%s',(hash_password(new_password),username,))
                    conn.commit()
                    clear_session()

            return jsonify({'message':'Password reset successfully',
                                        'status':'success',
                                        'status_code':200
                                        }),200
        else:
            return jsonify({'error':'Invalid password'}),400
        
    except Exception as e:
        return jsonify({'error':str(e),
                        'message':'Couldn\'t reset password. Please try again!',
                        'status':'failed',
                        'status_code':500
                        }),500
                      
    

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
            


#update_username
def fun_update_username():

    if get_session_data('logged_in') != True :
        return generate_response('Unauthorized access! Please login first',401)

    try:
        data = request.json
        if data is None:
            raise ValueError('Invalid JSON data: Request body is empty')
        
        new_username = data.get('new_username')
        if new_username is None:
            raise ValueError('Missing new username field in JSON data')
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
    else:
        if not new_username:
            return jsonify({'error':'Username field empty'})
        else:
            username = get_session_data('username')
            if username == None : return jsonify({'error':'Unautorized access! Please login first'})

            try:
                with psycopg2.connect(**db_params) as conn:
                    with conn.cursor() as cursor:
                        cursor.execute('''SELECT cred_id FROM credentials WHERE username=%s''', (username,))
                        cred_id = cursor.fetchone()[0]

            except psycopg2.Error as e:
                    return jsonify({'error': 'Username not found'})

            try:
                with psycopg2.connect(**db_params) as conn:
                    with conn.cursor() as cursor:
                        cursor.execute('''UPDATE credentials SET username=%s WHERE cred_id=%s''', (new_username,cred_id))
                        conn.commit()

                        if cursor.rowcount > 0:
                            set_session_data('username', new_username)
                            
            except psycopg2.Error as e:
                    return jsonify({'error': 'Username already exists'})
            
    return generate_response('Username updated successfully',200)




conn = psycopg2.connect(host='localhost', user='geo', password='geo', database='postgres')
cursor = conn.cursor()
 

 
drive_credentials = service_account.Credentials.from_service_account_file('triple-bounty-413009-6af8bcc414e6.json', scopes=['https://www.googleapis.com/auth/drive.file'])
 
def upload_to_google_drive(file_path, file_name, folder_id):
    try:
        drive_service = build('drive', 'v3', credentials=drive_credentials)
 
        file_metadata = {
            'name': file_name,
            'parents': [folder_id]
        }
        media = MediaFileUpload(file_path, mimetype='application/octet-stream')
 
        file = drive_service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, webContentLink'
        ).execute()
 
        return file.get('webContentLink')
    except Exception as e:
        return str(e)
 
def delete_file_from_google_drive(file_url):
    # Extract file ID from the file URL
    file_id = file_url.split('/')[-2]
 
    try:
        drive_service = build('drive', 'v3', credentials=drive_credentials)
        drive_service.files().delete(fileId=file_id).execute()
    except Exception as e:
        print(f"Error deleting file from Google Drive: {str(e)}")
 
def update_profile_picture(cred_id, file_path, file_name, folder_id):
    try:
        # Check if there's an existing profile picture for the given cred_id
        select_query = "SELECT profile_picture FROM profile WHERE cred_id = %s"
        cursor.execute(select_query, (cred_id,))
        existing_picture_url = cursor.fetchone()
 
        if existing_picture_url and existing_picture_url[0]:
            # If there's an existing picture, delete it from Google Drive
            delete_file_from_google_drive(existing_picture_url[0])
 
        # Upload the new profile picture to Google Drive
        file_url = upload_to_google_drive(file_path, file_name, folder_id)
 
        # Update the profile table with the new profile picture URL
        update_query = "INSERT INTO profile (cred_id, profile_picture) VALUES (%s, %s) ON CONFLICT (cred_id) DO UPDATE SET profile_picture = %s"
        cursor.execute(update_query, (cred_id, file_url, file_url))
        conn.commit()
 
        return jsonify({'message': 'Profile picture updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)})
 
def view_profile_picture(cred_id):
    try:
        # Retrieve the current profile picture URL
        select_query = "SELECT profile_picture FROM profile WHERE cred_id = %s"
        cursor.execute(select_query, (cred_id,))
        profile_picture_url = cursor.fetchone()
 
        if profile_picture_url is not None:
            # Generate a random string
            random_string = str(uuid.uuid4().hex[:6])
 
            # Download the image from Google Drive
            image_data = download_file_from_google_drive(profile_picture_url[0])
 
            # Send the image as a file response
            return send_file(
                BytesIO(image_data),
                mimetype='image/jpeg',
                as_attachment=True,
                download_name=f"profile_picture_{cred_id}_{random_string}.jpg"
            )
        else:
            return jsonify({'message': 'Profile picture not found for the given cred_id'})
 
    except Exception as e:
        return jsonify({'message': 'Profile picture unavailable'})
 
def download_file_from_google_drive(file_url):
    try:
        # Extract file ID from the file URL
        file_id = file_url.split('id=')[1].split('&')[0]
        print(f"File ID: {file_id}")
 
        if file_id.lower() == 'drive.google.com':
            raise ValueError("Invalid file ID: 'drive.google.com'")
        
       
 
        drive_service = build('drive', 'v3', credentials=drive_credentials)
        request = drive_service.files().get_media(fileId=file_id)
        fh = BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
        fh.seek(0)  # Move the cursor to the beginning before returning the value
        return fh.getvalue()
    except ValueError as ve:
        return jsonify({'error': str(ve)})
 
    except Exception as e:
        return jsonify({'error': str(e)})
 

def upload_profile_picture():
    try:
        # Get cred_id from the request
        cred_id = request.form.get('cred_id')
 
        # Check if cred_id is present
        if not cred_id or not cred_id.isalnum():
            raise ValueError("Invalid or missing cred_id")
 
        # Check if a profile picture already exists for the given cred_id
        select_query = "SELECT profile_picture FROM profile WHERE cred_id = %s"
        cursor.execute(select_query, (cred_id,))
        existing_picture_url = cursor.fetchone()
 
        if existing_picture_url and existing_picture_url[0]:
            return jsonify({'error': 'Profile picture already exists for the given cred_id'})
 
        # Get the uploaded files
        files = request.files.getlist('file')
        if not files or len(files) == 0:
            raise ValueError("No file provided")
 
        # Check if more than one file was provided
        if len(files) != 1:
            raise ValueError("Only one file should be provided")
 
        file = files[0]
 
        # Check if the file has an allowed extension (you can customize this)
        allowed_extensions = {'jpg', 'jpeg', 'png', 'gif'}
        if '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            raise ValueError("Invalid file type. Allowed types: jpg, jpeg, png, gif")
 
        # Generate a unique filename with a limited length
        filename = f"{cred_id}_profile_picture_{str(uuid.uuid4().hex[:8])}.jpg"
 
        # Save the file to the temporary folder
        folder_path = '/home/geojoseph/Desktop/Mini Project/userprofilemanagement/app/static/images'
        os.makedirs(folder_path, exist_ok=True)  # Ensure the folder exists
        file_path = os.path.join(folder_path, filename)
        file.save(file_path)
 
        # Define the folder ID for Google Drive
        folder_id = '1DG8JROPikgbM3w5iQvUjPK94l8gjPDqH'  # Replace with the actual Google Drive folder ID
 
        # Upload the profile picture
        file_url = upload_to_google_drive(file_path, filename, folder_id)
 
        # Update the profile table with the new profile picture URL
        update_query = "INSERT INTO profile (cred_id, profile_picture) VALUES (%s, %s) ON CONFLICT (cred_id) DO UPDATE SET profile_picture = %s"
        cursor.execute(update_query, (cred_id, file_url, file_url))
        conn.commit()
 
        return jsonify({'message': 'Profile picture uploaded successfully'})
 
    except ValueError as ve:
        return jsonify({'error': str(ve)})
 
    except Exception as e:
        return jsonify({'error': str(e)})
 

def update_profile_pic():
    try:
        # Get cred_id from the request
        cred_id = request.form.get('cred_id')
 
        # Check if cred_id is present
        if not cred_id or not cred_id.isalnum():
            raise ValueError("Invalid or missing cred_id")
 
        # Get the uploaded files
        files = request.files.getlist('file')
 
        if not files or len(files) == 0:
            raise ValueError("No file provided")
 
        # Check if more than one file was provided
        if len(files) != 1:
            raise ValueError("Only one file should be provided")
 
        file = files[0]
 
        # Check if the file has an allowed extension (you can customize this)
        allowed_extensions = {'jpg', 'jpeg', 'png', 'gif'}
        if '.' in file.filename and file.filename.rsplit('.', 1)[1].lower() not in allowed_extensions:
            raise ValueError("Invalid file type. Allowed types: jpg, jpeg, png, gif")
 
        # Generate a unique filename with a limited length
        filename = f"{cred_id}_profile_picture_{str(uuid.uuid4().hex[:8])}.jpg"
 
        # Save the file to the temporary folder
        folder_path = '/home/geojoseph/Desktop/Mini Project/userprofilemanagement/app/static/images'
        os.makedirs(folder_path, exist_ok=True)  # Ensure the folder exists
        file_path = os.path.join(folder_path, filename)
        file.save(file_path)
 
        # Define the folder ID for Google Drive
        folder_id = '1DG8JROPikgbM3w5iQvUjPK94l8gjPDqH'  
 
        # Update the profile picture
        return update_profile_picture(cred_id, file_path, filename, folder_id)
 
    except ValueError as ve:
        return jsonify({'error': str(ve)})
 
    except Exception as e:
        return jsonify({'error': str(e)})
 

def delete_profile_pic():
    try:
        # Get cred_id from the request
        cred_id = request.form.get('cred_id')
 
        # Check if cred_id is present
        if not cred_id or not cred_id.isalnum():
            raise ValueError("Invalid or missing cred_id")
 
        # Retrieve the current profile picture URL
        select_query = "SELECT profile_picture FROM profile WHERE cred_id = %s"
        cursor.execute(select_query, (cred_id,))
        existing_picture_url = cursor.fetchone()
 
        if existing_picture_url and existing_picture_url[0]:
            # Delete the profile picture from Google Drive
            delete_file_from_google_drive(existing_picture_url[0])
 
            # Update the profile table to remove the profile picture URL
            update_query = "UPDATE profile SET profile_picture = NULL WHERE cred_id = %s"
            cursor.execute(update_query, (cred_id,))
            conn.commit()
 
            return jsonify({'message': 'Profile picture deleted successfully'})
        else:
            return jsonify({'message': 'No profile picture found for the given cred_id'})
 
    except ValueError as ve:
        return jsonify({'error': str(ve)})
 
    except Exception as e:
        return jsonify({'error': str(e)})
 
