from flask import Flask, jsonify, request
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

                    password_hash = repr(password_hash)
                    password_hash = password_hash[3:-2]

                    if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):



                        return jsonify({'message': f'Authentication successful! Logging in as {username},{roles[role_id]}'}), 200
                    else:
                        return jsonify({'error': 'Incorrect password'}), 401



    except psycopg2.Error as e:
        return jsonify({'error':'Invalid inputs'})
        
 


