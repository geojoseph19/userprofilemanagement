from flask import Blueprint
from app.services.account import *

account_controller = Blueprint('account', __name__)


#-----------------------------ACCOUNT-SETTINGS--------------------------------

#Route to request for OTP to recover account
@account_controller.route('/api/v1/accountRecovery',methods=['POST'])
def request_otp():
    return otp_mail()

#Route to verify OTP
@account_controller.route('/api/v1/verifyOTP',methods=['GET'])
def otp_verificate():
    return verify_otp()


#Route to reset password
@account_controller.route('/api/v1/resetPassw/<string:username>',methods=['POST'])
def reset_user_password(username):
    return reset_password(username)

#Update password
@account_controller.route('/updatepwd', methods=['POST'])
def updatepwd():
    return fun_updatepwd()
