import psycopg2
from psycopg2 import sql
from flask import Flask,request,jsonify
from config import db_params

app=Flask(__name__)

#Display all student details
@app.route('/student/<string:st_id>/home', methods=['GET'])
def student_home(st_id):
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''SELECT * FROM student WHERE st_id=%s''', (st_id,))
            student = cursor.fetchone()

    if student:
        return jsonify({'student': student})
    else:
        return jsonify({'error': 'Student not found'}), 404
    

@app.route('/student/editprofile', methods=['PUT'])
def update_student():
    # Extract data from the request
    data = request.json

    # Extract student ID and fields to update
    st_id = data.get('st_id')
    update_fields = {
        'fname': data.get('fname'),
        'mname': data.get('mname'),
        'lname': data.get('lname'),
        'sex': data.get('sex'),
        'email': data.get('email'),
        'sphoneno': data.get('sphoneno'),
        'address': data.get('address'),
        'guardian': data.get('guardian'),
        'gphoneno': data.get('gphoneno')
    }

    # Connect to the database
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            # Construct SQL UPDATE statement dynamically based on provided fields
            update_query = '''
                UPDATE student
                SET {}
                WHERE st_id = %s
            '''.format(', '.join([f'{key} = %s' for key in update_fields if update_fields[key] is not None]))

            # Extract values for the fields to update
            update_values = [update_fields[key] for key in update_fields if update_fields[key] is not None]
            update_values.append(st_id)

            # Execute the dynamic SQL UPDATE statement
            cursor.execute(update_query, update_values)

    # Commit the transaction
    conn.commit()

    # Return a success message
    return jsonify({'message': 'Student information updated successfully'})



# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)