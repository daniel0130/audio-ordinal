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
    console.log("MIDI access granted.");
    let o = e.inputs.values();
    for (let e = o.next(); e && !e.done; e = o.next()) {
        e.value.onmidimessage = onMIDIMessage;
    }
}

function onMIDIFailure() {
    console.warn("Failed to access MIDI devices.");
    manageMIDIResources();  // Clear resources on failure
}
// Constants for MIDI message types
const MIDI_NOTE_ON = 0x90;
const MIDI_NOTE_OFF = 0x80;

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



function onMIDIMessage(event) {
    // Destructure the event data first to access statusByte, noteNumber, and velocity.
    const [statusByte, noteNumber, velocity] = event.data;
    const messageType = statusByte & 0xF0;  // Extract the message type from status byte
    const channel = statusByte & 0x0F;  // Extract the MIDI channel

     // Ignore Control Change messages (0xB0) and messages from channels 1 to 7.
     if (messageType === 0xB0 || (channel >= 1 && channel <= 7)) {
        // console.log('Control Change message ignored or channel not targeted.');
        return;  // Skip further processing for these conditions
    }

    // Log the MIDI message for debugging.
    console.log(`MIDI message received: ${event.data}`);

   

    // Handle MIDI messages based on type
    switch (messageType) {
        case MIDI_NOTE_ON:
            // Handle the Note On event, only if velocity > 0 (otherwise, treat as Note Off)
            if (velocity > 0) {
                playMS10TriangleBass(midiNoteToFrequency(noteNumber), velocity / 127);
                // Start recording if this is the first note and recording has not started
                if (!isRecordingAudioStarted) {
                    window.startAudioRecording();
                    isRecordingAudioStarted = true;
                    console.log('Audio recording started with first MIDI note.');
                }
                // Record the Note On event
                handleMIDIRecording(messageType, [statusByte, noteNumber, velocity]);
            } else {
                // If velocity is 0, treat this as a Note Off event
                handleNoteOff(noteNumber);
            }
            break;
        case MIDI_NOTE_OFF:
            // Handle the Note Off event
            playMS10TriangleBass(midiNoteToFrequency(noteNumber), 0);
            handleMIDIRecording(messageType, [statusByte, noteNumber, velocity]);
            break;
        default:
            console.log(`Unhandled MIDI message type: ${messageType.toString(16)}`);
            break;
    }
}

// function midiNoteToFrequency(noteNumber) {
//     // Calculate frequency from MIDI note number, assuming A4 = 440Hz at MIDI note 69
//     return A4_FREQUENCY * Math.pow(2, (noteNumber - A4_MIDI_NUMBER) / 12);
// }

// function handleNoteOff(noteNumber) {
//     // Log note off for debugging
//     console.log(`Note Off. MIDI note: ${noteNumber}`);
// }


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


// Playback functionality
function playBackMIDI() {
    console.log(`Playback starting with ${midiRecording.length} events.`);
    if (midiRecording.length === 0) {
        console.log('No MIDI events to play back.');
        return;
    }

    playbackStartTime = performance.now();
    midiRecording.forEach((event, index) => {
        const eventTime = playbackStartTime + event.timestamp;  // Correct time when event should be played
        const currentTime = performance.now();
        let delay = eventTime - currentTime;  // Calculate the delay based on current time

        if (delay < 0) {
            console.log(`Event ${index} missed its playback time by ${-delay}ms and will be played immediately.`);
            delay = 0;
        }

        setTimeout(() => {
            playMIDINote(event.message);
            console.log(`Event ${index} playing at ${performance.now()}ms, scheduled for ${eventTime}ms.`);
        }, delay);
    });
}

function playMIDINote(message) {
    console.log(`Playing MIDI message at time: ${performance.now()}:`, message);
    const midiMessage = new Uint8Array(Object.values(message));
    console.log(`Playing MIDI message:`, midiMessage, `at scheduled time: ${performance.now()}ms`);
    onMIDIMessage({ data: midiMessage });
}


function handleMIDIRecording(messageType, data) {
    console.log(`Recording MIDI event: Type=${messageType}, Data=${data}, Time=${performance.now() - recordingStartTime}`);
    const currentTime = performance.now();
    if (!recordingStartTime) {
        recordingStartTime = currentTime;  // Ensure recording start time is set at the first event
    }
    const messageTime = currentTime - recordingStartTime;
    midiRecording.push({ timestamp: messageTime, message: data });
    console.log(`Recording MIDI event at ${currentTime}ms, ${messageTime}ms after recording start.`);
}



// Ensure this function captures all note events
function recordKeyboardNoteEvent(noteNumber, velocity, isNoteOn) {
    console.log(`Recording keyboard note event: Note=${noteNumber}, Velocity=${velocity}, isNoteOn=${isNoteOn}`);
    if (isRecordingMIDI) {
        let messageTime = performance.now();
        let status = isNoteOn ? MIDI_NOTE_ON : MIDI_NOTE_OFF;  // Use constants for clarity
        let midiMessage = [status, noteNumber, velocity];
        midiRecording.push({ timestamp: messageTime, message: midiMessage });
    }
}

// Recording control functions
function startMIDIRecording() {
    console.log('MIDI Recording started.');
    isRecordingMIDI = true;
    midiRecording = []; // Reset the recording
    console.log('MIDI Recording Active');
   
}

function stopMIDIRecording() {
    console.log('MIDI Recording stopped.');
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


function clearAllIntervals() {
    console.log('Clearing all intervals.');
    if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = null;
        console.log('All playback intervals cleared.');
    }
}

function manageMIDIResources() {
    console.log('Managing MIDI resources. clearAllIntervals() called.');
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

