from flask import Flask, jsonify, request
import psycopg2
import bcrypt
 
app = Flask(__name__)
 
def db_conn():
    conn = psycopg2.connect(database="postgres", host="localhost", user="geo", password="geo", port="5432")
    return conn
 
conn = db_conn()
cursor = conn.cursor()
 
def validate_login_data(data):
    if not data:
        raise ValueError('No data provided for login')
    if 'username' not in data:
        raise ValueError('No username provided for login')
    if 'password' not in data:
        raise ValueError('No password provided for login')
    return data['username'], data['password']
 
def fun_login():
    try:
        data = request.json
        username, password = validate_login_data(data)
 
        # Execute the SQL query to fetch the user by username
        select_query = "SELECT cred_id, username, password_hash FROM credentials WHERE username = %s"
        cursor.execute(select_query, (username,))
        result = cursor.fetchone()
 
        if result:
            cred_id, stored_username, password_hash = result
 
            # Use bcrypt to check the password
            if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
                # If the password is correct
                if stored_username == 'admin':
                    # If username is 'admin', display admin login successful
                    return jsonify({'message': 'Admin Login successful', 'user_type': 'admin'}), 200
 
                # Check if cred_id exists in the mentor table
                mentor_query = "SELECT m_id, m_fname, m_lname, qualifctn FROM mentor WHERE cred_id = %s"
                cursor.execute(mentor_query, (cred_id,))
                mentor_result = cursor.fetchone()
 
                if mentor_result:
                    # If cred_id is in mentor table, fetch mentor details
                    return jsonify({'message': 'Login successful', 'user_type': 'mentor', 'details': mentor_result}), 200
                else:
                    # If cred_id is not in mentor table, fetch student details
                    student_query = '''SELECT s.st_id, s.fname AS fname, s.lname AS lname, d.dept_name
                                       FROM student s
                                       JOIN credentials c ON s.cred_id = c.cred_id
                                       JOIN departments d ON s.dept_id = d.dept_id
                                       WHERE c.cred_id = %s'''
                    cursor.execute(student_query, (cred_id,))
                    student_result = cursor.fetchone()
 
                    if student_result:
                        return jsonify({'message': 'Login successful', 'user_type': 'student', 'details': student_result}), 200
                    else:
                        return jsonify({'error': 'Invalid credentials'}), 401
            else:
                # If the password is incorrect
                return jsonify({'error': 'Invalid password'}), 401
        else:
            # If the user is not found
            return jsonify({'error': 'User not found'}), 401
 
    except ValueError as ve:
        return jsonify({'error': f'Invalid input: {str(ve)}'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500
 
 
@app.route('/login', methods=['POST'])
def login():
    return fun_login()
 
if __name__ == '__main__':
    app.run(debug=True)