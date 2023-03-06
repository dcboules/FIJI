import RPi.GPIO as GPIO
import time

# Set up the GPIO pins
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)
pins = [17, 18, 19, 20]
GPIO.setup(pins, GPIO.OUT)

# Define a function to toggle the LED on or off
def toggle(pin):
    if GPIO.input(pin):
        GPIO.output(pin, GPIO.LOW)
    else:
        GPIO.output(pin, GPIO.HIGH)

# Define a function to turn on all LEDs
def turn_on_all():
    for pin in pins:
        GPIO.output(pin, GPIO.HIGH)

# Define a function to turn off all LEDs
def turn_off_all():
    for pin in pins:
        GPIO.output(pin, GPIO.LOW)

# Main loop
while True:
    # Get input from user
    user_input = input("Enter a number (1-4) or 'a' to turn on all LEDs: ")

    # Toggle the appropriate LED(s)
    if user_input == '1':
        toggle(pins[0])
    elif user_input == '2':
        toggle(pins[1])
    elif user_input == '3':
        toggle(pins[2])
    elif user_input == '4':
        toggle(pins[3])
    elif user_input == 'a':
        turn_on_all()

    # Turn off all LEDs if user enters anything else
    else:
        turn_off_all()

# Clean up
GPIO.cleanup()
