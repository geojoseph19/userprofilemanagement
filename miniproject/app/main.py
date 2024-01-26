import psycopg2
from psycopg2 import sql
from flask import Flask,request,jsonify
from miniproject.config import db_params


app=Flask(__name__)


# Function to update mentor profile
def update_mentor_profile(m_id,qualification):
    try:
        with psycopg2.connect(**db_params) as conn:
            with conn.cursor() as cursor:
                cursor.execute('''UPDATE mentor SET qualification=%s WHERE m_id=%s''',(qualification,m_id))
                conn.commit()
        return True
    except psycopg2.error as e:
        return False


# Route to update mentor profile
@app.route('/mentor/<string:username>/profile',method=['PUT'])
def update_profile(m_id):
    request_data=request.json
    new_qual=request_data.get('qualification')
    if new_qual is None:
        return jsonify({'error':'Qualification not provided!'}),400
    
    success=update_mentor_profile(m_id,new_qual)
    if success:
        return jsonify({'message':'Profile updated successfully!'})
    else:
        return jsonify({'error':'failed to update mentor profile!'}),500

