import re

# Function to validate email format
def is_valid_email(email):
    pattern = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return bool(re.match(pattern, email))

#Phone number validation
def is_valid_phone(phone):
    # Regular expression pattern for international phone numbers
    pattern = r'^(\+[0-9]{1,3}\s?)?(\([0-9]+\)\s?)?[0-9]{10}$'
    return bool(re.match(pattern, phone))

#Validate password
def is_valid_password(password):
    # Password should be at least 8 characters long
    if len(password) < 8:
        return False
    
    # Password should contain at least one uppercase letter
    if not re.search(r'[A-Z]', password):
        return False
    
    # Password should contain at least one lowercase letter
    if not re.search(r'[a-z]', password):
        return False
    
    # Password should contain at least one digit
    if not re.search(r'\d', password):
        return False
    
    # Password should contain at least one special character
    if not re.search(r'[!@#$%^&*()-+=]', password):
        return False
    
    # Password meets all criteria
    return True

