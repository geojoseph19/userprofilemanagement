import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import jsonify

def send_mail(email,username,fname,mname,lname,content_type,data):

    recipient_email = email
    username = username
    password = data
    fname = fname
    mname = mname
    lname = lname
    otp = data
    # SMTP server settings
    smtp_server = 'smtp-relay.brevo.com'
    port = 587
    smtp_username = 'admn17843@gmail.com'
    smtp_password = 'AdtfBJznNx6cCOX0' 
    smtp_sender_email = 'admin@university.com'

    # Create a multipart message
    message = MIMEMultipart()
    message['From'] = smtp_sender_email
    message['To'] = recipient_email

    # Add message body
    new_user = f"""
Dear {fname} {mname} {lname},
 
Welcome to the University Portal! We are excited to have you on board. Below are your login credentials:
 
Username: {username}
Password: {password}
 
To access the portal, please follow these steps:
1. Visit the University Portal login page: http://127.0.0.1:5000/login
2. Enter your username and temporary password.
3. Change your password from Edit profile --> Update password.
 
For security reasons, please keep your login credentials confidential.
 
Best regards,
 
X University
Tower C - 11th Floor, 
IBC KNOWLEDGE PARK, 
4/1, Bannerghatta Rd, 
Bhavani Nagar, S.G. Palya, 
Bengaluru, Karnataka 560029
"""
    
    otp = f"""
Dear {fname} {mname} {lname},

You are receiving this email because a request was made to reset your password. To proceed with the reset, please use the following OTP code:

OTP Code: {otp}

This OTP is valid for 5 minutes. Please do not share this OTP with anyone for security reasons.
If you did not request this password reset, please ignore this email.

Sincerely,
 
X University
Tower C - 11th Floor, 
IBC KNOWLEDGE PARK, 
4/1, Bannerghatta Rd, 
Bhavani Nagar, S.G. Palya, 
Bengaluru, Karnataka 560029
"""
    
    if content_type == "newuser":
        body = new_user
        message['Subject'] = 'Login Credentials - University Portal'
    elif content_type == "otp":
        body = otp
        message['Subject'] = 'OTP for Account Recovery - University Portal'
    else: return jsonify({'else': 'Unknown mail content type'})

    message.attach(MIMEText(body, 'plain'))

    # Connect to the SMTP server
    server = smtplib.SMTP(smtp_server, port)
    server.starttls()
    server.login(smtp_username, smtp_password)

    server.send_message(message)

    # Disconnect from the server
    server.quit()

    return f'Email sent to {recipient_email}!'


def hide_email(email):
    parts = email.split('@')
    username = parts[0]
    domain = parts[1]
    hidden_username = username[0] + '*'*(len(username)-2) + username[-1] if len(username) > 2 else '*'*len(username)
    hidden_email = hidden_username + '@' + domain
    return hidden_email
