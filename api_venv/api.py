from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from flask_restx import Api, Resource, fields
from datetime import datetime, timedelta
from dotenv import load_dotenv
import RPi.GPIO as GPIO
import bcrypt
import random
import string
import jwt
import uuid
import os

load_dotenv()
# Initialize GPIO
GPIO.setmode(GPIO.BCM)

# Set the GPIO pins for the lights
light_pins = {
    17:('Room 1', False), 
    18:('Room 2', False), 
    19:('Room 3', False), 
    20:('Office', False)
}

for pin, (name, status) in light_pins.items():
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.LOW)

app = Flask(__name__)
CORS(app)
api = Api(app, version='1.0', title='Project Fiji API', description='An API for Raspberry Pi')

# Configure MySQL
app.config['MYSQL_HOST']        = os.getenv('MYSQL_HOST')
app.config['MYSQL_PORT']        = int(os.getenv('MYSQL_PORT'))
app.config['MYSQL_USER']        = os.getenv('MYSQL_USER')
app.config['MYSQL_DB']          = os.getenv('MYSQL_DB')
app.config['MYSQL_PASSWORD']    = os.getenv('MYSQL_PASSWORD')
secret_key                      = os.getenv('secret_key')

mysql = MySQL(app)

# Define models
user_model = api.model('User', {
    'id': fields.Integer(readonly=True, description='The user unique identifier'),
    'email': fields.String(required=True, description='The user email'),
    'password': fields.String(required=True, description='The user password'),
    'role': fields.Boolean(required=True, description='The user role (admin or staff)'), #  0:staff, 1:admin
    'organization_code': fields.String(description='The organization code for admin users')
})

organization_model = api.model('Organization', {
    'organization_code': fields.String(readonly=True, description='The organization unique code'),
    'organization_name': fields.String(required=True, description='The organization name')
})

login_model = api.model('login', {
    'email': fields.String(required=True, description='The user email'),
    'password': fields.String(required=True, description='The user password')
})

light_model = api.model('Light', {
    'id': fields.Integer(readonly=True, description='The light unique identifier'),
    'name': fields.String(required=True, description='The light name'),
    'status': fields.Boolean(required=True, description='The light status (on or off)'),
})

user_light_model = api.model('UserLight', {
    'user_id': fields.Integer(required=True, description='The user unique identifier'),
    'light_id': fields.Integer(required=True, description='The light unique identifier')
})

# Define namespaces
auth_ns = api.namespace('auth', description='Authentication operations')
users_ns = api.namespace('users', description='User operations')
lights_ns = api.namespace('lights', description='Light operations')

def create_token(user):
    payload = {
        'id': user['id'],
        'email': user['email'],
        'role': user['role'],
        'exp': datetime.utcnow() + timedelta(hours=24)  # Set an expiration time for the token
    }
    print(f"Creating token for user: {user}")
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    print(f"Generated token: {token}")
    return token

def decode_token(token):
    try: 
        print(f"Decoding token: {token}")
        decoded_token = jwt.decode(token, secret_key, algorithms=['HS256'])
        print(f"Decoded token: {decoded_token}")
        return decoded_token
    except jwt.ExpiredSignatureError:
        print("Token expired")
        return None
    except jwt.InvalidTokenError:
        print("Invalid token")
        return None

def get_organization_by_code(organization_code):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM organizations WHERE organization_code = %s", (organization_code,))
        result = cur.fetchone()
        return result
    except Exception as e:
        print(e)
        return None

def get_user_by_email(email):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", [email])
    result = cur.fetchone()
    cur.close()
    if result:
        user = {
            'id': result[0],
            'email': result[1],
            'password': result[2],
            'role': result[3],
            'organization_code': result[4]
        }
        return user
    return None
    
def get_user_by_id(user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE id = %s", [user_id])
    result = cur.fetchone()
    cur.close()
    if result:
        user = {
            'id': result[0],
            'email': result[1],
            'password': result[2],
            'role': result[3],
            'organization_code': result[4]
        }
        return user
    return None

def generate_organization_code(n):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=n))

def is_organization_code_unique(organization_code):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM users WHERE organization_code = %s", [organization_code])
    user = cur.fetchone()
    cur.close()
    
    return user is None

def get_lights_by_user(user_id):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM lights WHERE user_id = %s", [user_id])
    lights = cur.fetchall()
    cur.close()
    return lights

def get_all_lights(user_id):
    user = get_user_by_id(user_id)
    cur = mysql.connection.cursor()
    if user['role'] == 1:  # If the user is an admin
        cur.execute("SELECT l.id, l.name, l.status, ul.user_id FROM lights AS l LEFT JOIN user_light AS ul ON l.id = ul.light_id")
    else:  # If the user is a staff member
        cur.execute("SELECT l.id, l.name, l.status, ul.user_id FROM lights AS l LEFT JOIN user_light AS ul ON l.id = ul.light_id WHERE ul.user_id = %s", [user_id])
    lights = cur.fetchall()
    cur.close()

    return lights


def initialize_lights():
    cur = mysql.connection.cursor()

    for pin, (name, status) in light_pins.items():
        status_int = int(status)
        cur.execute("INSERT INTO lights (id, name, status) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE name = %s, status = %s",
                    (pin, name, status_int, name, status_int))

    mysql.connection.commit()
    cur.close()

    return {'message': 'Lights initialized successfully'}, 201

@app.before_first_request
def before_first_request():
    initialize_lights()


# Implement routes using Flask-RESTx resources
@auth_ns.route('/register')
class Register(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        role = data.get('role')
        org_code = data.get('organization_code')

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        cur = mysql.connection.cursor()
        if role:  # Admin user (role = 1)
            # Generate a unique organization code for the admin
            unique_org_code = str(uuid.uuid4())[:8]

            # Insert the new organization
            cur.execute("INSERT INTO organizations (organization_code) VALUES (%s)", (unique_org_code,))
            mysql.connection.commit()

            # Insert the new admin user
            cur.execute("INSERT INTO users (email, password, role, organization_code) VALUES (%s, %s, %s, %s)",
                        (email, hashed_password, role, unique_org_code))
            mysql.connection.commit()

            cur.close()  # Close the cursor
            return {'message': 'Admin user registered successfully', 'organization_code': unique_org_code}, 201

        else:  # Staff user (role = 0)
            # Check if the provided organization code exists
            cur.execute("SELECT id FROM organizations WHERE organization_code = %s", (org_code,))
            org_id = cur.fetchone()

            if org_id:
                # If the organization code exists, insert the new staff user
                cur.execute("INSERT INTO users (email, password, role, organization_code) VALUES (%s, %s, %s, %s)",
                            (email, hashed_password, role, org_code))
                mysql.connection.commit()

                cur.close()  # Close the cursor
                return {'message': 'Staff user registered successfully'}, 201
            else:
                # If the organization code does not exist, return an error message
                cur.close()  # Close the cursor
                return {'message': 'Invalid organization code'}, 400


@auth_ns.route('/login')
class Login(Resource):
    @api.expect(login_model, validate=True)
    def post(self):
        email = api.payload['email']
        password = api.payload['password'].encode('utf-8')

        user = get_user_by_email(email)

        if user and bcrypt.checkpw(password, user['password'].encode('utf-8')):
            # Create a token for the authenticated user
            token = create_token(user)

            # Include the token in the response
            return {'message': 'Login successful', 'user': user, 'token': token}, 200
        else:
            return {'message': 'Invalid email or password'}, 401

@users_ns.route('/<int:user_id>')
@users_ns.response(404, 'User not found')
class User(Resource):
    @api.marshal_with(user_model)
    def get(self, user_id):
        user = get_user_by_id(user_id)
        if user:
            return user
        else:
            api.abort(404, 'User not found')


@lights_ns.route('/')
class LightList(Resource):
    @api.marshal_list_with(light_model)
    def get(self):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return {'message': 'Missing token'}, 401

        decoded_token = decode_token(token)
        if not decoded_token:
            return {'message': 'Invalid token'}, 401

        user_id = decoded_token['id']
        lights = get_all_lights(user_id)
        return [{'id': light[0], 'name': light[1], 'status': bool(light[2]), 'user_id': light[3]} for light in lights]

@lights_ns.route('/<int:light_id>/control')
@api.response(404, 'Light not found')
class LightControl(Resource): 
    @api.expect(light_model, validate=True)
    def post(self, light_id):
        status = api.payload['status']

        if light_id in light_pins:
            GPIO.output(light_id, GPIO.HIGH if status else GPIO.LOW)
            light_pins[light_id] = status

            cur = mysql.connection.cursor()
            cur.execute("UPDATE lights SET status = %s WHERE id = %s", (status, light_id))
            mysql.connection.commit()
            cur.close()
            
            return {'message': f'Light {light_id} is turned {"on" if status else "off"}'}, 200
        else:
            api.abort(404, 'Light not found')

            

@lights_ns.route('/<int:light_id>/assign')
@api.response(404, 'Light not found')
class LightAssign(Resource):
    @api.expect(user_light_model, validate=True)
    def post(self, light_id):
        user_id = api.payload['user_id']

        if light_id in light_pins:
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO user_light (user_id, light_id) VALUES (%s, %s)", (user_id, light_id))
            mysql.connection.commit()
            cur.close()
            return {'message': f'Light {light_id} is assigned to user {user_id}'}, 200
        else:
            api.abort(404, 'Light not found')



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
