from flask import session

def set_session_data(key, value):
    session[key] = value

def get_session_data(key):
    return session.get(key)

def clear_session():
    session.clear()

def check_login(role_type):
    if get_session_data('logged_in') != True or get_session_data('role_type') != role_type:
        return False
    else : return True
