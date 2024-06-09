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
            }
        };
        events.push(recordedEvent);
    }
}

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

function resetRecording() {
    events = [];
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
    resetRecordingBtn.disabled = true;
    playRecordingBtn.disabled = true;
}

function playRecording() {
    if (events.length === 0) return;

    let previousTime = events[0].timestamp;
    let repetitionCount = 0;

    function executeEvent(event) {
        if (event.type === 'mousemove') {
            const simulatedEvent = new MouseEvent('mousemove', {
                clientX: event.details.x,
                clientY: event.details.y,
            });
            document.dispatchEvent(simulatedEvent);
        } else if (event.type === 'click') {
            const simulatedEvent = new MouseEvent('click', {
                clientX: event.details.x,
                clientY: event.details.y,
            });
            document.dispatchEvent(simulatedEvent);
        } else if (event.type === 'keydown') {
            const simulatedEvent = new KeyboardEvent('keydown', {
                key: event.details.key,
                keyCode: event.details.keyCode,
            });
            document.dispatchEvent(simulatedEvent);
        }
    }

    function playEvents() {
        if (repetitionCount < repetitions) {
            const startTime = Date.now();
            for (let event of events) {
                const delay = event.timestamp - previousTime;
                setTimeout(() => {
                    executeEvent(event);
                }, delay);
            }
            repetitionCount++;
            previousTime = events[0].timestamp + (Date.now() - startTime);
            setTimeout(playEvents, interval);
        }
    }

    playEvents();
}

function applySettings() {
    repetitions = parseInt(repetitionsInput.value);
    interval = intervalSelect.value === 'custom' ? parseInt(customIntervalInput.value) : parseInt(intervalSelect.value);
}

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

function loadPreset() {
    const selectedPreset = presetSelect.value;
    if (presets[selectedPreset]) {
        events = presets[selectedPreset];
        playRecordingBtn.disabled = false;
    }
}

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
