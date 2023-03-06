
from flask import Flask, jsonify, request
from flask_mysqldb import MySQL
import RPi.GPIO as GPIO

app = Flask(__name__)

# Configure database
app.config['MYSQL_HOST'] = '71.94.151.15:3600'
app.config['MYSQL_USER'] = 'dcboules'
app.config['MYSQL_PASSWORD'] = 'FIJIPass'
app.config['MYSQL_DB'] = 'SmartLock_Schema"'
mysql = MySQL(app)

# Define the GPIO pins for the lights
lights = {
    1: 17,
    2: 18,
    3: 19,
    4: 20
}

# Define the initial state of the lights
light_state = {
    1: False,
    2: False,
    3: False,
    4: False
}

# Set up GPIO
GPIO.setmode(GPIO.BCM)
for pin in lights.values():
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, False)


@app.route('/lights', methods=['GET'])
def get_lights():
    cur = mysql.connection.cursor()
    cur.execute('SELECT id, name, is_on, user_id FROM lights')
    lights = cur.fetchall()
    cur.close()
    return jsonify(lights)


@app.route('/lights/<int:light_id>', methods=['GET'])
def get_light(light_id):
    cur = mysql.connection.cursor()
    cur.execute('SELECT id, name, is_on, user_id FROM lights WHERE id = %s', (light_id,))
    light = cur.fetchone()
    cur.close()
    return jsonify(light)


@app.route('/lights/<int:light_id>', methods=['PUT'])
def toggle_light(light_id):
    cur = mysql.connection.cursor()
    cur.execute('SELECT is_on FROM lights WHERE id = %s', (light_id,))
    is_on = cur.fetchone()[0]
    new_state = not is_on
    cur.execute('UPDATE lights SET is_on = %s WHERE id = %s', (new_state, light_id))
    mysql.connection.commit()
    cur.close()
    GPIO.output(lights[light_id], new_state)
    return jsonify({'success': True})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
