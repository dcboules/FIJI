from flask import Flask
import RPi.GPIO as GPIO

app = Flask(__name__)

# Define the GPIO pins that the lights are connected to
LIGHT_PINS = [17, 18, 19, 20]

# Set up the GPIO pins for output
GPIO.setmode(GPIO.BCM)
GPIO.setup(LIGHT_PINS, GPIO.OUT)

@app.route('/light1/on')
def light1_on():
    GPIO.output(LIGHT_PINS[0], GPIO.HIGH)
    return 'Light 1 turned on'

@app.route('/light1/off')
def light1_off():
    GPIO.output(LIGHT_PINS[0], GPIO.LOW)
    return 'Light 1 turned off'

@app.route('/light2/on')
def light2_on():
    GPIO.output(LIGHT_PINS[1], GPIO.HIGH)
    return 'Light 2 turned on'

@app.route('/light2/off')
def light2_off():
    GPIO.output(LIGHT_PINS[1], GPIO.LOW)
    return 'Light 2 turned off'

@app.route('/light3/on')
def light3_on():
    GPIO.output(LIGHT_PINS[2], GPIO.HIGH)
    return 'Light 3 turned on'

@app.route('/light3/off')
def light3_off():
    GPIO.output(LIGHT_PINS[2], GPIO.LOW)
    return 'Light 3 turned off'

@app.route('/light4/on')
def light4_on():
    GPIO.output(LIGHT_PINS[3], GPIO.HIGH)
    return 'Light 4 turned on'

@app.route('/light4/off')
def light4_off():
    GPIO.output(LIGHT_PINS[3], GPIO.LOW)
    return 'Light 4 turned off'

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

