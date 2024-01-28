from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Replace 'postgresql://username:password@localhost/database_name' with your PostgreSQL connection string
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://geo:geo@localhost/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Mentor(db.Model):
    __tablename__ = 'mentor'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    # Add other columns as needed

@app.route('/mentors')
def display_mentors():
    mentors = Mentor.query.all()

    # Create a list of dictionaries from the objects
    mentors_list = [mentor.__dict__ for mentor in mentors]

    # Remove the internal attribute added by SQLAlchemy
    for mentor in mentors_list:
        mentor.pop('_sa_instance_state', None)

    # Return the data as a JSON response
    return jsonify(mentors_list)
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Replace 'postgresql://username:password@localhost/database_name' with your PostgreSQL connection string
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://geo:geo@localhost/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Mentor(db.Model):
    __tablename__ = 'mentor'
    
    id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String(50))
    # Add other columns as needed

@app.route('/mentors')
def display_mentors():
    mentors = Mentor.query.all()

    # Create a list of dictionaries from the objects
    mentors_list = [mentor.__dict__ for mentor in mentors]

    # Remove the internal attribute added by SQLAlchemy
    for mentor in mentors_list:
        mentor.pop('_sa_instance_state', None)

    # Return the data as a JSON response
    return jsonify(mentors_list)
