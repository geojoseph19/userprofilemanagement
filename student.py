import psycopg2
from flask import Flask,request,jsonify
from config import db_params

app=Flask(__name__)


#----------------FUNCTIONS------------------------------------------------

#Display all student details
def fun_student_home():

    data = request.json
    st_id = data.get('st_id')
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''SELECT * FROM student WHERE st_id=%s''', (st_id,))
            student = cursor.fetchone()

    if student:
        return jsonify({'student': student})
    else:
        return jsonify({'error': 'Student not found'}), 404
    

#Update student details
def fun_update_student():

    data = request.json
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

    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            # Construct SQL UPDATE statement dynamically based on provided fields
            update_query = '''UPDATE student SET {} WHERE 
                st_id = %s'''.format(', '.join([f'{key} = %s' for key in update_fields if update_fields[key] is not None]))

            # Extract values for the fields to update
            update_values = [update_fields[key] for key in update_fields if update_fields[key] is not None]
            update_values.append(st_id)

            # Execute the dynamic SQL UPDATE statement
            cursor.execute(update_query, update_values)

    conn.commit()

    return jsonify({'message': 'Student information updated successfully'})


#View student achievements
def fun_view_student_achievements():

    data = request.json
    st_id = data.get('st_id')

    try:
        # Connect to the database
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                # Execute SQL query to retrieve achievement details for the student
                cursor.execute('''
                    SELECT a.ach_id, a.ach_name, a.desc, a.points
                    FROM achievements a
                    INNER JOIN std_ach sa ON a.ach_id = sa.ach_id
                    WHERE sa.st_id = %s
                ''', (st_id,))
                
                # Fetch all the rows
                achievements = cursor.fetchall()

                # Convert the result to a list of dictionaries
                achievements_list = [
                    {'achievement_id': row[0], 'achievement_name': row[1], 'description': row[2], 'points': row[3]}
                    for row in achievements
                ]

        return jsonify({'achievements': achievements_list}), 200

    except psycopg2.Error as e:
        return jsonify({'error': str(e)}), 500


#View assigned project
def fun_view_assigned_project():
        
    data = request.json
    st_id = data.get('st_id')

    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''
                            SELECT p.prj_id, p.pr_name, p.start_date, p.end_date,
                            m.m_id, m.m_fname, m.m_mname, m.m_lname
                        FROM 
                            st_project sp
                        INNER JOIN 
                            project p ON sp.prj_id = p.prj_id
                        INNER JOIN 
                            mentor m ON p.m_id = m.m_id
                        WHERE 
                            sp.st_id = %s''', (st_id,))
            
            project = cursor.fetchall()
            
            project_details = [
                    {'project_id': row[0], 'project_name': row[1], 'start_date': row[2], 'end_date': row[3], 
                     'mentor_id': row[4], 'mentor_fname':row[5], 'mentor_mname':row[6], 'mentor_lname':row[7] }
                    for row in project
                ]
            
        return jsonify({'project': project_details}), 200






#-----------------ROUTES---------------------------------------------------

#Display all student details
@app.route('/student/home', methods=['GET'])
def student_home():
    return fun_student_home()
    

#Update student details
@app.route('/student/editprofile', methods=['PUT'])
def update_student():
    return fun_update_student()


#View student achievements
@app.route('/student/achievements', methods=['GET'])
def view_student_achievements():
    return fun_view_student_achievements()
   

#View assigned project
@app.route('/student/project', methods=['GET'])
def view_assigned_project():
    return fun_view_assigned_project()

                                      





# Run Flask app
if __name__ == '__main__':
    app.run(debug=True)