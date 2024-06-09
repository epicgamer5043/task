let isRecording = false;
let events = [];
let variables = [];
let repetitions = 1;
let interval = 0;

const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const playRecordingBtn = document.getElementById('playRecording');
const repetitionsInput = document.getElementById('repetitions');
const intervalSelect = document.getElementById('interval');
const customIntervalInput = document.getElementById('customInterval');
const applySettingsBtn = document.getElementById('applySettings');
const addVariableBtn = document.getElementById('addVariable');
const variableList = document.getElementById('variableList');
const eventList = document.getElementById('eventList');

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
        displayEvent(recordedEvent);
    }
}

function displayEvent(event) {
    const eventItem = document.createElement('li');
    eventItem.innerText = `${event.type} at (${event.details.x}, ${event.details.y}) ${event.details.key ? `Key: ${event.details.key}` : ''}`;
    eventList.appendChild(eventItem);
}

function startRecording() {
    isRecording = true;
    events = [];
    eventList.innerHTML = '';
    startRecordingBtn.disabled = true;
    stopRecordingBtn.disabled = false;
    playRecordingBtn.disabled = true;
    document.addEventListener('mousemove', recordEvent);
    document.addEventListener('click', recordEvent);
    document.addEventListener('keydown', recordEvent);
}

function stopRecording() {
    isRecording = false;
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
    playRecordingBtn.disabled = false;
    document.removeEventListener('mousemove', recordEvent);
    document.removeEventListener('click', recordEvent);
    document.removeEventListener('keydown', recordEvent);
}

function playRecording() {
    if (events.length === 0) return;

    let previousTime = events[0].timestamp;
    let repetitionCount = 0;

    function executeEvent(event) {
        switch (event.type) {
            case 'mousemove':
                simulateMouseMove(event.details.x, event.details.y);
                break;
            case 'click':
                simulateMouseClick(event.details.x, event.details.y);
                break;
            case 'keydown':
                simulateKeyPress(event.details.key);
                break;
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

function simulateMouseMove(x, y) {
    const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: x,
        clientY: y
    });
    document.dispatchEvent(mouseMoveEvent);
}

function simulateMouseClick(x, y) {
    const clickEvent = new MouseEvent('click', {
        clientX: x,
        clientY: y
    });
    document.dispatchEvent(clickEvent);
}

function simulateKeyPress(key) {
    const keyEvent = new KeyboardEvent('keydown', { key: key });
    document.dispatchEvent(keyEvent);
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

startRecordingBtn.addEventListener('click', startRecording);
stopRecordingBtn.addEventListener('click', stopRecording);
playRecordingBtn.addEventListener('click', playRecording);
applySettingsBtn.addEventListener('click', applySettings);
intervalSelect.addEventListener('change', () => {
    customIntervalInput.style.display = intervalSelect.value === 'custom' ? 'inline' : 'none';
});
addVariableBtn.addEventListener('click', addVariable);
