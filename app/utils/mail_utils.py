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
    smtp_sender_email = 'admn17843@gmail.com'

    # Create a multipart message
    message = MIMEMultipart()
    message['From'] = smtp_sender_email
    message['To'] = recipient_email
    message['Subject'] = 'Login Credentials - University Portal'

    # Add message body
    body = f'Welcome {fname} {mname} {lname}, Your login credentials are Username : {username} Password : {password} '
    message.attach(MIMEText(body, 'plain'))

    # Connect to the SMTP server
    server = smtplib.SMTP(smtp_server, port)
    server.starttls()
    server.login(smtp_username, smtp_password)

    server.send_message(message)

    # Disconnect from the server
    server.quit()

    return f'Email sent to {recipient_email}!'

