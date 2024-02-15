import logging
from flask import Flask, jsonify, redirect, url_for, session
from flask_session import Session
from flask_cors import CORS

from app.controller.login_controller import login_controller
from app.controller.account_controller import account_controller
from app.controller.admin_controller import admin_controller
from app.controller.mentor_contoller import mentor_controller
from app.controller.student_controller import student_controller

app=Flask(__name__)

CORS(app)  # Enable CORS for all routes

app.config['SESSION_TYPE'] = 'filesystem'  
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.secret_key = 'secret_key'

Session(app)

#Error logs
logging.basicConfig(filename='error.log', level=logging.ERROR)

#Blueprint registration
app.register_blueprint(login_controller)
app.register_blueprint(account_controller)
app.register_blueprint(admin_controller)
app.register_blueprint(mentor_controller)
app.register_blueprint(student_controller)

#----------------------------------------------------------------------------------------------------------------------------------------------------------

#Global Error Handler
@app.errorhandler(Exception)
def handle_error(error):
    # Log the error to the error.log file
    logging.exception("An error occurred:")

    # Extract the status code from the exception, if available
    status_code = getattr(error, 'code', 500)
    error_message = str(error)

    
    # Extracting the error code from the error message if available
    error_code = None
    if ':' in error_message:
        error_code = error_message.split(':')[0].strip()

    if ':' in error_message:
        error_message = error_message.split(':')[1].strip()

    #return jsonify({'error': error_message}), status_code   

    return jsonify({'error': error_message, 'error_code': error_code}), status_code

#--------------------------------------------------------------------------------------------------------------------------------------------------------

if __name__ == '__main__':
    app.run(debug=True)


