from ..services.userAccountServices import *
from flask import Flask


app=Flask(__name__)

#Route to request for OTP to recover account
@app.route('/api/v1/accountRecovery',methods=['POST'])
def request_otp():
    return otp_mail()

#Route to verify OTP
@app.route('/api/v1/verifyOTP',methods=['GET'])
def otp_verificate():
    return verify_otp()


#Route to reset password
@app.route('/api/v1/resetPassw',methods=['POST'])
def reset_user_password():
    return reset_password()