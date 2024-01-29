from flask import Flask, jsonify, request
import psycopg2

app = Flask(__name__)

def db_conn():
    conn = psycopg2.connect(database="postgres", host="localhost", user="adil", password="root", port="5432")
    return conn

conn = db_conn()
cursor = conn.cursor()

def is_admin(username, password):
    # Check if the provided username and password correspond to an admin in the credentials table
    select_admin_query = "SELECT 1 FROM credentials WHERE username = %s AND password = %s AND is_admin = TRUE"
    cursor.execute(select_admin_query, (username, password))
    return cursor.fetchone() is not None

def create_student(data):
    # Execute the SQL query to add a new student with the 'dob' field
    insert_student_query = """
        INSERT INTO students (fname, mname, lname, sex, email, sphoneno, address, guardian, gphoneno, cred_id, dept_id, dob)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING st_id
    """
    cursor.execute(insert_student_query, (
        data['fname'], data['mname'], data['lname'], data['sex'],
        data['email'], data['sphoneno'], data['address'],
        data['guardian'], data['gphoneno'], data['cred_id'], data['dept_id'], data['dob']
    ))
    new_student_id = cursor.fetchone()[0]
    conn.commit()
    return new_student_id

def update_student(student_id, data):
    # Execute the SQL query to update an existing student
    update_student_query = """
        UPDATE students
        SET fname = %s, mname = %s, lname = %s, sex = %s, email = %s, sphoneno = %s,
            address = %s, guardian = %s, gphoneno = %s, cred_id = %s, dept_id = %s, dob = %s
        WHERE st_id = %s
    """
    cursor.execute(update_student_query, (
        data['fname'], data['mname'], data['lname'], data['sex'],
        data['email'], data['sphoneno'], data['address'],
        data['guardian'], data['gphoneno'], data['cred_id'], data['dept_id'], data['dob'], student_id
    ))
    conn.commit()

# ... (similar functions for mentor)

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        if is_admin(username, password):
            return jsonify({'message': 'Admin login successful'}), 200
        else:
            return jsonify({'error': 'Invalid admin credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/create_student', methods=['POST'])
def admin_create_student():
    try:
        data = request.json
        # Assuming you receive student details including fname, mname, lname, etc.
        new_student_id = create_student(data)
        return jsonify({'message': 'Student created successfully', 'st_id': new_student_id}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/admin/update_student/<int:student_id>', methods=['PUT'])
def admin_update_student(student_id):
    try:
        data = request.json
        update_student(student_id, data)
        return jsonify({'message': 'Student updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ... (similar routes for mentor)

if __name__ == '__main__':
    app.run(debug=True)
