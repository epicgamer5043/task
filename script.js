<script>
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
        let simulatedEvent;
        if (event.type === 'mousemove') {
            simulatedEvent = new MouseEvent('mousemove', {
                clientX: event.details.x,
                clientY: event.details.y,
            });
            document.dispatchEvent(simulatedEvent);
        } else if (event.type === 'click') {
            simulatedEvent = new MouseEvent('click', {
                clientX: event.details.x,
                clientY: event.details.y,
            });
            document.dispatchEvent(simulatedEvent);
        } else if (event.type === 'keydown') {
            simulatedEvent = new KeyboardEvent('keydown', {
                key: event.details.key,
                keyCode: event.details.keyCode,
            });
            document.dispatchEvent(simulatedEvent);
        }
    }

    function playNextEvent(index) {
        if (index < events.length) {
            const event = events[index];
            const delay = event.timestamp - previousTime;
            previousTime = event.timestamp;

            setTimeout(() => {
                executeEvent(event);
                playNextEvent(index + 1);
            }, delay);
        } else {
            repetitionCount += 1;
            if (repetitionCount < repetitions) {
                setTimeout(() => {
                    previousTime = events[0].timestamp;
                    playNextEvent(0);
                }, interval);
            }
        }
    }

    playNextEvent(0);
}

function applySettings() {
    repetitions = parseInt(repetitionsInput.value);
    interval = intervalSelect.value === 'custom' ? parseInt(customIntervalInput.value) : parseInt(intervalSelect.value);
}

function addVariable() {
    const variable = {
        name: `Variable ${variables.length + 1}`,
        value: '',
    };
    variables.push(variable);

    const variableElement = document.createElement('div');
    variableElement.className = 'variable';
    variableElement.innerHTML = `
        <label>${variable.name}</label>
        <input type="text" value="${variable.value}" oninput="updateVariableValue(${variables.length - 1}, this.value)">
        <button onclick="removeVariable(${variables.length - 1}, this)">Remove</button>
    `;
    variableList.appendChild(variableElement);
}

function updateVariableValue(index, value) {
    variables[index].value = value;
}

function removeVariable(index, button) {
    variables.splice(index, 1);
    button.parentElement.remove();
}

function savePreset() {
    const presetName = prompt('Enter a name for this preset:');
    if (presetName) {
        presets[presetName] = {
            events: JSON.parse(JSON.stringify(events)),
            variables: JSON.parse(JSON.stringify(variables)),
        };
        const option = document.createElement('option');
        option.value = presetName;
        option.textContent = presetName;
        presetSelect.appendChild(option);
    }
}

function loadPreset() {
    const presetName = presetSelect.value;
    if (presetName && presets[presetName]) {
        events = JSON.parse(JSON.stringify(presets[presetName].events));
        variables = JSON.parse(JSON.stringify(presets[presetName].variables));

        variableList.innerHTML = '';
        variables.forEach((variable, index) => {
            const variableElement = document.createElement('div');
            variableElement.className = 'variable';
            variableElement.innerHTML = `
                <label>${variable.name}</label>
                <input type="text" value="${variable.value}" oninput="updateVariableValue(${index}, this.value)">
                <button onclick="removeVariable(${index}, this)">Remove</button>
            `;
            variableList.appendChild(variableElement);
        });
    }
}

startRecordingBtn.addEventListener('click', startRecording);
stopRecordingBtn.addEventListener('click', stopRecording);
resetRecordingBtn.addEventListener('click', resetRecording);
playRecordingBtn.addEventListener('click', playRecording);
applySettingsBtn.addEventListener('click', applySettings);
addVariableBtn.addEventListener('click', addVariable);
savePresetBtn.addEventListener('click', savePreset);
loadPresetBtn.addEventListener('click', loadPreset);

intervalSelect.addEventListener('change', () => {
    customIntervalInput.style.display = intervalSelect.value === 'custom' ? 'block' : 'none';
});
</script>
