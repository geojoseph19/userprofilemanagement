import random
import string
import time
from flask import jsonify,request
import re
import bcrypt


# Store generated OTPs
otp_database={}


# Generate OTP
def generate_otp():
    otp=''.join(random.choices('0123456789',k=6))
    
    return otp


# Check time-validity of OTP
def is_valid_otp(email,otp):                        # To be modified to incorporate database operations
    if email in otp_database:
        otp_info=otp_database[email]
        current_time=time.time()
        if current_time<=otp_info['expiry_time'] and otp==otp_info['otp']:
            return True
        else:
            del otp_database[email]
    return False
    

#function to check for valid email address
def is_valid_email(email):
    # Regular expression pattern for valid email address
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    
    # Check if the email matches the pattern
    if re.match(pattern, email):
        return True
    else:
        return False
    

 
#Password Encryption
def hash_password(password):
 
    return repr(bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()))