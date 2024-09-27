from flask import Flask, jsonify, request, session, redirect, url_for, make_response
from flask_session import Session
import psycopg2
import bcrypt
import json
from config import db_params
from ..utils.credential_generators import hash_password
from ..utils.session_manager import *
from ..utils.response_utils import *

def fun_login():
    try:
        data = request.json
        if data is None:
            raise ValueError('Invalid JSON data: Request body is empty')
        
        username = data.get('username')
        password = data.get('password')
        if username is None:
            raise ValueError('Missing username field in JSON data')
        if password is None:
            raise ValueError('Missing password field in JSON data')
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    else:
        if not username:
            #return generate_response('Username field empty',400)
            return jsonify({'error':'Username field empty'}),400
        if not password:
            return jsonify({'error':'Password field empty'}),400
        else:
            
            try:
                with psycopg2.connect(**db_params) as conn:
                    with conn.cursor() as cursor:
                        cursor.execute('''SELECT cred_id, password_hash, role_id FROM credentials WHERE username = %s''', (username,))
                        results = cursor.fetchone()
            except psycopg2.Error as e:
                    return jsonify({'error': 'Error fetching credentials'}),e
            else:
                roles = {0:'admin',1:'mentor',3:'student'}

                if results:
                    cred_id, password_hash, role_id = results

                    #taking the str hash from database and converting to byte
                    password_hash = repr(password_hash)
                    password_hash = password_hash[3:-2]
                    
                    #checking if pwd is correct
                    if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):

                        set_session_data('logged_in',True)
                        set_session_data('username',username)

                        try:
                            with psycopg2.connect(**db_params) as conn:
                                with conn.cursor() as cursor:
                                    cursor.execute('''SELECT r.role_type
                                                        FROM credentials c
                                                        INNER JOIN roles r ON c.role_id = r.role_id
                                                        WHERE c.username = %s''', (username,))
                                    role_type = cursor.fetchone()[0]

                                    set_session_data('role_type',role_type)
                        except psycopg2.Error as e:
                            return jsonify({'error': 'Unable to fetch role type'}),e

                        if role_type == "admin":
                            #return redirect(url_for('admin.admin_home'))
                            return jsonify({'success': 'Login successful','role_type':role_type}), 200
                        
                        elif role_type == "mentor":
                            #return redirect(url_for('mentor.mentor_home'))
                            return jsonify({'success': 'Login successful','role_type':role_type}), 200
                        
                        elif role_type == "student":
                            #return redirect(url_for('student.student_home'))
                            return jsonify({'success': 'Login successful','role_type':role_type}), 200
                        
                        else : return jsonify({'error': 'Role type not found'})
                    
                        # return jsonify({'message': f'Authentication successful! Logging in as {username},{roles[role_id]}'}), 200
                    else:
                        return jsonify({'error': 'Incorrect password'}), 400
                    

    return jsonify({'error': 'User not found!'}), 400
                


    

def fun_logout():
    try:

        session.clear()
        response = make_response({'success':'Logged out successfully'})

        # Set the SameSite attribute to None
        response.set_cookie('session', '', samesite='None', secure=True)    
        #return redirect(url_for('login.temp'))
        return response
        
    
    except Exception as e:
        # Log the exception or handle it as needed
        return jsonify({'error': 'An error occurred'})

    

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


            if new_pwd == new_pwd_retype:
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
                        return jsonify({'error': 'Incorrect password'}), 400
                
            else:
                return jsonify({'error': 'New password and re-enter new password fields does not match'}), 400
    


