from flask import Flask, request
import RPi.GPIO as GPIO

app = Flask(__name__)
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
led_pins = [18, 23, 24, 25]
GPIO.setup(led_pins, GPIO.OUT)

@app.route('/light/<int:led_number>/<action>')
def control_led(led_number, action):
    if led_number < 1 or led_number > len(led_pins):
        return f"Invalid LED number. Must be between 1 and {len(led_pins)}"

    if action not in ['on', 'off']:
        return "Invalid action. Must be 'on' or 'off'"

    led_pin = led_pins[led_number - 1]
    is_on = GPIO.input(led_pin)

    if (action == 'on' and not is_on) or (action == 'off' and is_on):
        GPIO.output(led_pin, not is_on)

    return f"LED {led_number} turned {action}"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
