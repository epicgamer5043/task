// Global variables
let isRecording = false;
let events = [];
let variables = [];
let presets = {};
let repetitions = 1;
let interval = 0;

const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const resetRecordingBtn = document.getElementById('resetRecording');
const playRecordingBtn = document.getElementById('playRecording');
const repetitionsInput = document.getElementById('repetitions');
const intervalSelect = document.getElementById('interval');
const customIntervalInput = document.getElementById('customInterval');
const applySettingsBtn = document.getElementById('applySettings');
const addVariableBtn = document.getElementById('addVariable');
const variableList = document.getElementById('variableList');
const presetSelect = document.getElementById('presetSelect');
const savePresetBtn = document.getElementById('savePreset');
const loadPresetBtn = document.getElementById('loadPreset');

// Function to record events
function recordEvent(event) {
    if (isRecording) {
        const recordedEvent = {
            type: event.type,
            timestamp: Date.now(),
            details: {
                x: event.clientX,
                y: event.clientY,
                key: event.key,
                keyCode: event.keyCode,
                button: event.button
            }
        };
        events.push(recordedEvent);
    }
}

// Start recording
function startRecording() {
    isRecording = true;
    events = [];
    startRecordingBtn.disabled = true;
    stopRecordingBtn.disabled = false;
    resetRecordingBtn.disabled = false;
    playRecordingBtn.disabled = true;
    document.addEventListener('mousemove', recordEvent);
    document.addEventListener('click', recordEvent);
    document.addEventListener('keydown', recordEvent);
}

// Stop recording
function stopRecording() {
    isRecording = false;
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
    resetRecordingBtn.disabled = false;
    playRecordingBtn.disabled = false;
    document.removeEventListener('mousemove', recordEvent);
    document.removeEventListener('click', recordEvent);
    document.removeEventListener('keydown', recordEvent);
}

// Reset recording
function resetRecording() {
    events = [];
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
    resetRecordingBtn.disabled = true;
    playRecordingBtn.disabled = true;
}

// Function to play events
function playRecording() {
    if (events.length === 0) return;

    let repetitionCount = 0;
    const baseTimestamp = events[0].timestamp;

    function executeEvent(event) {
        if (event.type === 'mousemove') {
            simulateMouseMove(event.details.x, event.details.y);
        } else if (event.type === 'click') {
            simulateMouseClick(event.details.x, event.details.y, event.details.button);
        } else if (event.type === 'keydown') {
            simulateKeyPress(event.details.key, event.details.keyCode);
        }
    }

    function playEvents(startTime) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        events.forEach(event => {
            const eventTime = event.timestamp - baseTimestamp;
            if (elapsedTime >= eventTime) {
                executeEvent(event);
            }
        });
    }

    function startRepetition() {
        if (repetitionCount >= repetitions) return;
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            playEvents(startTime);
        }, 1);

        setTimeout(() => {
            clearInterval(intervalId);
            repetitionCount++;
            if (repetitionCount < repetitions) {
                setTimeout(startRepetition, interval);
            }
        }, events[events.length - 1].timestamp - baseTimestamp);
    }

    startRepetition();
}

// Simulate mouse move
function simulateMouseMove(x, y) {
    const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: x,
        clientY: y,
        bubbles: true,
        cancelable: true,
        view: window
    });
    document.dispatchEvent(mouseMoveEvent);
}

// Simulate mouse click
function simulateMouseClick(x, y, button) {
    const mouseClickEvent = new MouseEvent('click', {
        clientX: x,
        clientY: y,
        button: button,
        bubbles: true,
        cancelable: true,
        view: window
    });
    document.dispatchEvent(mouseClickEvent);
}

// Simulate key press
function simulateKeyPress(key, keyCode) {
    const keyPressEvent = new KeyboardEvent('keydown', {
        key: key,
        keyCode: keyCode,
        bubbles: true,
        cancelable: true,
        view: window
    });
    document.dispatchEvent(keyPressEvent);
}

// Apply settings
function applySettings() {
    repetitions = parseInt(repetitionsInput.value);
    interval = intervalSelect.value === 'custom' ? parseInt(customIntervalInput.value) : parseInt(intervalSelect.value);
}

// Add variable
function addVariable() {
    const variableContainer = document.createElement('div');
    variableContainer.classList.add('variable');

    const label = document.createElement('label');
    label.innerText = `Variable ${variables.length + 1}:`;

    const input = document.createElement('input');
    input.type = 'text';

    const removeBtn = document.createElement('button');
    removeBtn.innerText = 'Remove';
    removeBtn.addEventListener('click', () => {
        variableList.removeChild(variableContainer);
        variables = variables.filter(v => v !== input);
    });

    variableContainer.appendChild(label);
    variableContainer.appendChild(input);
    variableContainer.appendChild(removeBtn);

    variableList.appendChild(variableContainer);
    variables.push(input);
}

// Save preset
function savePreset() {
    const presetName = prompt("Enter a name for the preset:");
    if (presetName) {
        presets[presetName] = events.slice();
        const option = document.createElement('option');
        option.value = presetName;
        option.text = presetName;
        presetSelect.add(option);
    }
}

// Load preset
function loadPreset() {
    const selectedPreset = presetSelect.value;
    if (presets[selectedPreset]) {
        events = presets[selectedPreset];
        playRecordingBtn.disabled = false;
    }
}

// Event listeners
startRecordingBtn.addEventListener('click', startRecording);
stopRecordingBtn.addEventListener('click', stopRecording);
resetRecordingBtn.addEventListener('click', resetRecording);
playRecordingBtn.addEventListener('click', playRecording);
applySettingsBtn.addEventListener('click', applySettings);
intervalSelect.addEventListener('change', () => {
    customIntervalInput.style.display = intervalSelect.value === 'custom' ? 'inline' : 'none';
});
addVariableBtn.addEventListener('click', addVariable);
savePresetBtn.addEventListener('click', savePreset);
loadPresetBtn.addEventListener('click', loadPreset);
