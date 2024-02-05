from flask import Blueprint
from app.services.account import *

account_controller = Blueprint('account', __name__, url_prefix="/api/v1")


#-----------------------------ACCOUNT-SETTINGS--------------------------------

#Route to request for OTP to recover account
@account_controller.route('/accountRecovery',methods=['POST'])
def api_v1_accountRecovery():
    return otp_mail()
 
#Route to verify OTP
@account_controller.route('/verifyOTP',methods=['GET'])
def api_v1_verifyOTP():
    return verify_otp()
 
#Route to reset password
@account_controller.route('/resetPassword',methods=['GET'])
def api_v1_resetPassword():
    return reset_password()

#Update password
@account_controller.route('/updatepwd', methods=['POST'])
def updatepwd():
    return fun_updatepwd()
