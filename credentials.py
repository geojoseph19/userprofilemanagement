from config import db_params
import random
import string

#generate random temporary password
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




#---------TESTAREA----------

def generate_userid(acc_type):
    userid =""
    # 1 = student
    # 2 = mentor



    return userid

x = 2
generate_userid(x)