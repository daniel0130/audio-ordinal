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
let isRecordingAudioStarted = false; // Flag to track if recording has started


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

function handleMIDIRecording(messageType, data) {
    if (!isRecordingMIDI) return;

    const messageTime = performance.now() - (recordingStartTime || performance.now());
    if (messageType === MIDI_NOTE_ON && !isRecordingAudioStarted) {
        recordingStartTime = performance.now();
        isRecordingAudioStarted = true;
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

// Recording control functions
function startMIDIRecording() {
    isRecordingMIDI = true;
    midiRecording = []; // Reset the recording
    console.log('MIDI Recording Active');
   
}

function stopMIDIRecording() {
    if (isRecordingMIDI) {
        isRecordingMIDI = false;
        clearAllIntervals();  // Clear any playback intervals
        console.log('MIDI Recording stopped');
        isRecordingAudioStarted = false; // Reset recording started flag

        // Stop audio recording with MIDI recording
        if (window.stopAudioRecording) {
            window.stopAudioRecording();
            console.log('Audio recording stopped with MIDI recording.');
        }
    }
}


function onMIDIMessage(event) {
    const [statusByte, noteNumber, velocity] = event.data;
    const messageType = statusByte & 0xF0;
    const channel = statusByte & 0x0F;

    // Correct handling of channel filtering
    if (channel >= 1 && channel <= 7) return;

    // Handle MIDI messages based on type
    switch (messageType) {
        case MIDI_NOTE_ON:
            if (velocity > 0) {
                playMS10TriangleBass(midiNoteToFrequency(noteNumber), velocity / 127);
    
                // Ensure recording starts with the first note
                if (!isRecordingAudioStarted) {
                    window.startAudioRecording();
                    isRecordingAudioStarted = true;
                    console.log('Audio recording started with first MIDI note.');
                }
                // Ensure MIDI recording is called for note on events
                handleMIDIRecording(messageType, [statusByte, noteNumber, velocity]);
            } else {
                // Handle note off expressed as note on with zero velocity
                handleNoteOff(noteNumber);
            }
            break;
        case MIDI_NOTE_OFF:
            playMS10TriangleBass(midiNoteToFrequency(noteNumber), 0);
            handleMIDIRecording(messageType, [statusByte, noteNumber, velocity]);
            break;
        default:
            console.log(`Unhandled MIDI message type: ${messageType.toString(16)}`);
    }
}


// This function should handle both note on and note off events
function handleNoteOn(noteNumber, velocity) {
    if (velocity === 0) {
        handleNoteOff(noteNumber);
        return;
    }
    const frequency = midiNoteToFrequency(noteNumber);
    console.log(`Note On. MIDI note: ${noteNumber}, Frequency: ${frequency}`);
  
        playMS10TriangleBass(frequency, velocity / 127);
}

function handleNoteOff(noteNumber) {
    console.log(`Note Off. MIDI note: ${noteNumber}`);
        const frequency = midiNoteToFrequency(noteNumber);
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



// Ensure this function captures all note events
function recordKeyboardNoteEvent(noteNumber, velocity, isNoteOn) {
    if (isRecordingMIDI) {
        let messageTime = performance.now();
        let status = isNoteOn ? MIDI_NOTE_ON : MIDI_NOTE_OFF;  // Use constants for clarity
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

