import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_mail(email,username,password,fname,mname,lname):

    recipient_email = email
    username = username
    password = password
    fname = fname
    mname = mname
    lname = lname
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
    message['Subject'] = 'Login Credentials - University Portal'

    # Add message body
    body = f"""
Dear {fname} {mname} {lname},
 
Welcome to the University Portal! We are excited to have you on board. Below are your login credentials:
 
Username: {username}
Temporary Password: {password}
 
To access the portal, please follow these steps:
1. Visit the University Portal login page: http://127.0.0.1:5000/login
2. Enter your username and temporary password.
3. Upon first login, you will be prompted to change your password.
 
For security reasons, please keep your login credentials confidential.
 
Best regards,
 
X University
Tower C - 11th Floor, 
IBC KNOWLEDGE PARK, 
4/1, Bannerghatta Rd, 
Bhavani Nagar, S.G. Palya, 
Bengaluru, Karnataka 560029
"""
    message.attach(MIMEText(body, 'plain'))

    # Connect to the SMTP server
    server = smtplib.SMTP(smtp_server, port)
    server.starttls()
    server.login(smtp_username, smtp_password)

    server.send_message(message)

    # Disconnect from the server
    server.quit()

    return f'Email sent to {recipient_email}!'

