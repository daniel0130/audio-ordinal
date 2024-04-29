// midiControl.js

const A4_MIDI_NUMBER = 69;
const A4_FREQUENCY = 440;
const arpNoteNames = [];
let isRecordingMIDI = false;
let midiRecording = [];
let playbackStartTime = 0;
let nextEventIndex = 0; // Initialize the nextEventIndex
var playbackInterval; // Declare playbackInterval globally
let recordingStartTime = 0; // Initialize recording start time
let isRecordingStarted = false; // Flag to track if recording has started


function onMIDISuccess(e) {
    let o = e.inputs.values();
    for (let e = o.next(); e && !e.done; e = o.next()) {
        e.value.onmidimessage = onMIDIMessage;
    }
}

function onMIDIFailure() {
    console.warn("Could not access your MIDI devices.");
    manageMIDIResources();  // Clear resources on failure
}
// Constants for MIDI message types
const MIDI_NOTE_ON = 0x90;
const MIDI_NOTE_OFF = 0x80;

function onMIDIMessage(e) {
    const data = e.data;
    if (data.length < 3) {
        console.error("Incomplete MIDI message received:", data);
        return;
    }

    const [statusByte, noteNumber, velocity] = data;
    const messageType = statusByte & 0xF0;
    const channel = statusByte & 0x0F;

    // Optionally, adjust or remove channel filtering if necessary
    if (channel >= 1 && channel <= 7) {
        console.log(`Ignoring MIDI message from channel: ${channel}`);
        return;
    }

    handleMIDIRecording(messageType, data);
    processMIDIMessage(messageType, noteNumber, velocity);
}

function handleMIDIRecording(messageType, data) {
    if (!isRecordingMIDI) return;

    const messageTime = performance.now() - (recordingStartTime || performance.now());
    if (messageType === MIDI_NOTE_ON && !isRecordingStarted) {
        recordingStartTime = performance.now();
        isRecordingStarted = true;
    }

    midiRecording.push({ timestamp: messageTime, message: data });
}

function processMIDIMessage(messageType, noteNumber, velocity) {
    switch (messageType) {
        case MIDI_NOTE_ON:
            handleNoteOn(noteNumber, velocity);
            break;
        case MIDI_NOTE_OFF:
            handleNoteOff(noteNumber);
            break;
        default:
            console.log(`Unhandled MIDI message type: ${messageType.toString(16)}`);
    }
}

function handleNoteOn(noteNumber, velocity) {
    if (velocity === 0) {
        handleNoteOff(noteNumber); // Some devices use a Note On with 0 velocity as Note Off
        return;
    }
    const frequency = midiNoteToFrequency(noteNumber);
    console.log(`Note On. MIDI note: ${noteNumber}, Frequency: ${frequency}`);
    if (isArpeggiatorOn) {
        arpNotes.push(frequency);
        updateArpNotesDisplay();
    } else {
        playMS10TriangleBass(frequency, velocity / 127);
    }
}

function handleNoteOff(noteNumber) {
    console.log(`Note Off. MIDI note: ${noteNumber}`);
    if (isArpeggiatorOn) {
        const frequency = midiNoteToFrequency(noteNumber);
        const index = arpNotes.indexOf(frequency);
        if (index !== -1) arpNotes.splice(index, 1);
    }
}

function midiNoteToFrequency(note) {
    return note < 0 || note > 127 ? null : Math.pow(2, (note - A4_MIDI_NUMBER) / 12) * A4_FREQUENCY;
}

function playNote(e, o = 1) {
    let n = 440 * Math.pow(2, (e - 69) / 12);
    playMS10TriangleBass(n, o);
}

function stopNote(e) {}

function getVolume() {
    return document.getElementById("volume").value / 100;
}

navigator.requestMIDIAccess ? navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure) : console.warn("WebMIDI is not supported in this browser.");

// Recording control functions
function startMIDIRecording() {
    isRecordingMIDI = true;
    midiRecording = []; // Reset the recording
    isRecordingStarted = false; // Reset recording started flag
    console.log('MIDI Recording started');

    // Start audio recording when MIDI recording starts
    if (window.startAudioRecording) {
        window.startAudioRecording();
        console.log('Audio recording started with MIDI recording.');
    }
}

function stopMIDIRecording() {
    if (isRecordingMIDI) {
        isRecordingMIDI = false;
        clearAllIntervals();  // Clear any playback intervals
        console.log('MIDI Recording stopped');
        isRecordingStarted = false; // Reset recording started flag

        // Stop audio recording with MIDI recording
        if (window.stopAudioRecording) {
            window.stopAudioRecording();
            console.log('Audio recording stopped with MIDI recording.');
        }
    }
}

// Playback functionality
function playBackMIDI() {
    clearAllIntervals();
    if (midiRecording.length > 0) {
        playbackStartTime = performance.now();
        nextEventIndex = 0;
        playbackInterval = setInterval(playbackNextMIDIEvent, 0);
        console.log('Playback started with ' + midiRecording.length + ' events.');
    } else {
        console.log('No MIDI events to play back.');
    }
}

function playbackNextMIDIEvent() {
    if (nextEventIndex < midiRecording.length) {
        const now = performance.now() - playbackStartTime;
        const nextEvent = midiRecording[nextEventIndex];
        if (now >= nextEvent.timestamp) {
            let midiMessage = new Uint8Array(Object.values(nextEvent.message));
            console.log('Converted MIDI message:', midiMessage);
            onMIDIMessage({ data: midiMessage });
            nextEventIndex++;
        }
    } else {
        clearInterval(playbackInterval);
        console.log('Playback stopped');
    }
}



// Function to record keyboard-triggered notes
function recordKeyboardNoteEvent(noteNumber, velocity, isNoteOn) {
    if (isRecordingMIDI) {
        let messageTime = performance.now();
        // Mimic MIDI message format: [status, noteNumber, velocity]
        let status = isNoteOn ? 144 : 128; // 144 for note on, 128 for note off
        let midiMessage = [status, noteNumber, velocity];
        midiRecording.push({ timestamp: messageTime, message: midiMessage });
    }
}

function clearAllIntervals() {
    if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = null;
        console.log('All playback intervals cleared.');
    }
}

function manageMIDIResources() {
    clearAllIntervals();  // Add more resource management as needed
}



// Event listener setup with error checking
function addMIDIControlEventListeners() {
    const recordButton = document.getElementById('recordMIDIButton');
    const stopRecordButton = document.getElementById('stopMIDIRecordButton');
    const playRecordButton = document.getElementById('playMIDIRecordButton');

    if (recordButton) recordButton.addEventListener('click', startMIDIRecording);
    if (stopRecordButton) stopRecordButton.addEventListener('click', stopMIDIRecording);
    if (playRecordButton) playRecordButton.addEventListener('click', playBackMIDI);
}

addMIDIControlEventListeners();

navigator.requestMIDIAccess ? navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure) : console.warn("WebMIDI is not supported in this browser.");