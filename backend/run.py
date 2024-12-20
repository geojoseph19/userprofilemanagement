import logging
from flask import Flask, jsonify, redirect, url_for, session
from flask_session import Session
from flask_cors import CORS
from datetime import timedelta

from app.controller.login_controller import login_controller
from app.controller.account_controller import account_controller
from app.controller.admin_controller import admin_controller
from app.controller.mentor_contoller import mentor_controller
from app.controller.student_controller import student_controller

app=Flask(__name__)

CORS(app,supports_credentials=True)  # Enable CORS for all routes

app.secret_key = 'your_secret_key'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SAMESITE'] = 'none'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
app.config['SESSION_COOKIE_SECURE'] = True

server_session = Session(app)

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


