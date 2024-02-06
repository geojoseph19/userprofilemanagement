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
@account_controller.route('/resetPassword',methods=['POST'])
def api_v1_resetPassword():
    return reset_password()

#Update password
@account_controller.route('/updatepwd', methods=['POST'])
def updatepwd():
    return fun_updatepwd()

@account_controller.route('/uploadProfilePic', methods=['POST'])
def user_upload_profile_picture():
    return upload_profile_picture()

@account_controller.route('/viewProfilePic/<string:cred_id>', methods=['GET'])
def view_profile_pic(cred_id):
    return view_profile_picture(cred_id)

@account_controller.route('/updateProfilePic', methods=['POST'])
def user_update_profile_pic():
    return update_profile_pic()

@account_controller.route('/deleteProfilePic', methods=['POST'])
def user_delete_profile_pic():
    return delete_profile_pic()


