from flask import Flask, jsonify, request, session, redirect, url_for
from flask_session import Session
import psycopg2
import bcrypt
import json
from config import db_params
from credentials import hash_password
from session_manager import *

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
            return jsonify({'error':'Username field empty'})
        if not password:
            return jsonify({'error':'Password field empty'})
        else:
            
            try:
                with psycopg2.connect(**db_params) as conn:
                    with conn.cursor() as cursor:
                        cursor.execute('''SELECT cred_id, password_hash, role_id FROM credentials WHERE username = %s''', (username,))
                        results = cursor.fetchone()
            except psycopg2.Error as e:
                    return jsonify({'error': 'Error adding project! Please try again...'}),e
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

                        if role_id == 0:
                            return redirect(url_for('admin_home'))
                        
                        elif role_id == 1:
                            return redirect(url_for('mentor_home'))
                        
                        elif role_id == 2:
                            return redirect(url_for('student_home'))
                        
                        else:
                            return jsonify({'error':'Role id not found in dict'})
                        
                    
                        # return jsonify({'message': f'Authentication successful! Logging in as {username},{roles[role_id]}'}), 200
                    else:
                        return jsonify({'error': 'Incorrect password'}), 401
                    

    return jsonify({'error': 'Username not found!'}), 401
                


    

def fun_logout():
    try:
        session.clear()
        return redirect(url_for('temp'))
    
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
        if old_pwd is None:
            raise ValueError('Missing old password field in JSON data')
        elif new_pwd is None:
            raise ValueError('Missing new password field in JSON data')
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    
    else:
        if not old_pwd:
            return jsonify({'error':'Old password field empty'})
        if not new_pwd:
            return jsonify({'error':'New password field empty'})
        else:

            username = get_session_data('username')

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
                

                #check if two textboxes of new & retype password is same


