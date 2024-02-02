from flask import session

def set_session_data(key, value):
    session[key] = value

def get_session_data(key):
    return session.get(key)

def clear_session():
    session.clear()
