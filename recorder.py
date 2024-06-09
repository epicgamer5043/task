import pyautogui
import time
import json
from pynput import mouse, keyboard

class EventRecorder:
    def __init__(self):
        self.mouse_listener = None
        self.keyboard_listener = None
        self.events = []
        self.recording = False

    def start_recording(self):
        self.recording = True
        self.events = []

        # Start mouse listener
        self.mouse_listener = mouse.Listener(on_click=self.on_click, on_move=self.on_move)
        self.mouse_listener.start()

        # Start keyboard listener
        self.keyboard_listener = keyboard.Listener(on_press=self.on_press)
        self.keyboard_listener.start()

    def stop_recording(self):
        self.recording = False

        if self.mouse_listener:
            self.mouse_listener.stop()

        if self.keyboard_listener:
            self.keyboard_listener.stop()

    def on_click(self, x, y, button, pressed):
        if self.recording:
            event = {
                'type': 'click',
                'x': x,
                'y': y,
                'button': str(button),
                'pressed': pressed,
                'timestamp': time.time()
            }
            self.events.append(event)

    def on_move(self, x, y):
        if self.recording:
            event = {
                'type': 'move',
                'x': x,
                'y': y,
                'timestamp': time.time()
            }
            self.events.append(event)

    def on_press(self, key):
        if self.recording:
            event = {
                'type': 'keypress',
                'key': str(key),
                'timestamp': time.time()
            }
            self.events.append(event)

    def save_events(self, filename):
        with open(filename, 'w') as f:
            json.dump(self.events, f)

    def load_events(self, filename):
        with open(filename, 'r') as f:
            self.events = json.load(f)

    def play_events(self, repetitions, interval):
        for _ in range(repetitions):
            start_time = time.time()
            for event in self.events:
                event_time = event['timestamp'] - self.events[0]['timestamp']
                time.sleep(event_time - (time.time() - start_time))

                if event['type'] == 'move':
                    pyautogui.moveTo(event['x'], event['y'])
                elif event['type'] == 'click':
                    if event['pressed']:
                        pyautogui.mouseDown(x=event['x'], y=event['y'], button=event['button'])
                    else:
                        pyautogui.mouseUp(x=event['x'], y=event['y'], button=event['button'])
                elif event['type'] == 'keypress':
                    pyautogui.press(event['key'])

# Example usage
if __name__ == "__main__":
    recorder = EventRecorder()

    print("Starting recording...")
    recorder.start_recording()
    time.sleep(10)  # Record for 10 seconds
    print("Stopping recording...")
    recorder.stop_recording()

    recorder.save_events('events.json')
    recorder.load_events('events.json')

    repetitions = 3
    interval = 2
    print(f"Playing back events {repetitions} times with {interval} second interval...")
    recorder.play_events(repetitions, interval)
