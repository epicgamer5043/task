import tkinter as tk
from tkinter import messagebox
from threading import Thread
from recorder import EventRecorder

class RecorderApp:
    def __init__(self, root):
        self.recorder = EventRecorder()
        self.root = root
        self.root.title("Recorder App")

        self.start_btn = tk.Button(root, text="Start Recording", command=self.start_recording)
        self.start_btn.pack()

        self.stop_btn = tk.Button(root, text="Stop Recording", command=self.stop_recording)
        self.stop_btn.pack()

        self.play_btn = tk.Button(root, text="Play Recording", command=self.play_recording)
        self.play_btn.pack()

        self.repetitions_entry = tk.Entry(root)
        self.repetitions_entry.pack()
        self.repetitions_entry.insert(0, "3")

        self.interval_entry = tk.Entry(root)
        self.interval_entry.pack()
        self.interval_entry.insert(0, "2")

    def start_recording(self):
        self.recorder.start_recording()
        messagebox.showinfo("Info", "Recording started")

    def stop_recording(self):
        self.recorder.stop_recording()
        self.recorder.save_events('events.json')
        messagebox.showinfo("Info", "Recording stopped and saved")

    def play_recording(self):
        self.recorder.load_events('events.json')
        repetitions = int(self.repetitions_entry.get())
        interval = int(self.interval_entry.get())

        def play():
            self.recorder.play_events(repetitions, interval)
            messagebox.showinfo("Info", "Playback finished")

        thread = Thread(target=play)
        thread.start()

# Create the main window
root = tk.Tk()
app = RecorderApp(root)
root.mainloop()
