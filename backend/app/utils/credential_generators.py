import psycopg2
from config import db_params
import random, datetime
import string
import bcrypt


#Generate random temporary password
def generate_password(length):

    characters = string.ascii_letters + string.digits + string.punctuation

    password = [random.choice(string.ascii_uppercase),
                random.choice(string.ascii_lowercase),
                random.choice(string.digits),
                random.choice(string.punctuation)]

    password.extend(random.choice(characters) for _ in range(length - 4))

    # Shuffle characters
    random.shuffle(password)

    # Convert the list of characters to a string
    password = ''.join(password)

    return password

#Generate username
def generate_cred_id():
    #USRX231001
    centurycode = {2:"X",3:"Y",4:"Z"}
 
    current_year = datetime.datetime.now().year
    current_year = int(str(current_year)[0])

    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''SELECT cred_id FROM credentials ORDER BY timestamp DESC''')
            last_username = cursor.fetchone()

    last_username = last_username[0]
    id_number = int(last_username[4:]) + 1
           
    username = "USR"+ centurycode[current_year] + str(id_number)

    return username

#Generate new credentials id 
# def generate_cred_id():
#     with psycopg2.connect(**db_params) as conn:
#         with conn.cursor() as cursor:
#             cursor.execute('''SELECT cred_id FROM credentials ORDER BY timestamp DESC''')
#             last_credid = cursor.fetchone()

#             credid = last_credid[0]
#             credid = int(credid[1:]) + 1
#             credid = "c"+ str(credid)

#             return credid
        
#Generate new project id
def generate_project_id():
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor() as cursor:
            cursor.execute('''SELECT prj_id FROM project ORDER BY timestamp DESC''')
            last_projectid = cursor.fetchone()

            print(last_projectid)
            projectid = last_projectid[0]
            print(projectid)
            projectid = int(projectid[3:]) + 1
            print(projectid)
            projectid = "PRJ"+ str(projectid)

            print(projectid)

            return projectid 

#Password Encryption
def hash_password(password):

    return repr(bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()))
