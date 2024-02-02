from flask import Flask, jsonify, request, session, redirect, url_for
from flask_session import Session
import psycopg2
import bcrypt
from config import db_params
from credentials import hash_password
 

def fun_login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''SELECT cred_id, password_hash, role_id FROM credentials WHERE username = %s''', (username,))
                results = cursor.fetchone()

                roles = {0:'admin',1:'mentor',3:'student'}

                if results:
                    cred_id, password_hash, role_id = results

                    #taking the str hash from database and converting to byte
                    password_hash = repr(password_hash)
                    password_hash = password_hash[3:-2]
                    
                    #checking if pwd is correct
                    if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):

                        session['logged_in'] = True
                        session['username'] = username

                        if role_id == 0:
                            return redirect(url_for('/student/home'))
                        
                        elif role_id == 1:
                            return redirect(url_for('student_home'))
                        
                        elif role_id == 2:
                            return redirect(url_for('/student/home'))
                        
                        else:
                            return jsonify({'error':'Role id not found in dict'})
                        
                    
                    return jsonify({'message': f'Authentication successful! Logging in as {username},{roles[role_id]}'}), 200
                else:
                    return jsonify({'error': 'Incorrect password'}), 401




                    
                    
      


    except psycopg2.Error as e:
        return jsonify({'error':'Invalid inputs'})
    

def fun_logout():
    try:
        session.clear()
        return redirect(url_for('login'))
    
    except Exception as e:
        # Log the exception or handle it as needed
        return jsonify({'error': 'An error occurred'})

    

        
 


