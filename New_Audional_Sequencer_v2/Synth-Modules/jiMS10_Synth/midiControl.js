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
}

function onMIDIMessage(e) {
    let data = e.data;
    console.log("Received MIDI message:", e.data);
    console.log('playbackRecordingDEBUG: Received MIDI message:', e.data);

    // Check if data is in object format and convert to array if necessary
    if (!Array.isArray(data)) {
        data = [data[0], data[1], data[2]];
    }

    let statusByte = e.data[0];
    let messageType = statusByte & 0xF0; // Get the message type
    let channel = statusByte & 0x0F; // Get the MIDI channel

  
    // Filter out messages from channels 2-8
    if (channel >= 1 && channel <= 7) {
        return; // Ignore messages from these channels
    }

    if (isRecordingMIDI && messageType === 144 && !isRecordingStarted) {
        // Start recording from the first note-on message
        recordingStartTime = performance.now();
        isRecordingStarted = true;
    }

    if (isRecordingMIDI && isRecordingStarted) {
        let messageTime = performance.now() - recordingStartTime;
        midiRecording.push({ timestamp: messageTime, message: e.data });
    }

    let noteNumber = e.data[1];
    let velocity = e.data.length > 2 ? e.data[2] : 0;

    console.log(`Status Byte: ${statusByte}, Message Type: ${messageType}, Channel: ${channel}`);
    console.log(`Note Number: ${noteNumber}, Velocity: ${velocity}`);

    // Process Note On/Off messages
    switch (messageType) {
        case 144: // Note On
            if (velocity > 0) {
                let frequency = midiNoteToFrequency(noteNumber);
                console.log(`Note On. MIDI note: ${noteNumber}, Frequency: ${frequency}`);
                if (isArpeggiatorOn) {
                    arpNotes.push(frequency);
                    updateArpNotesDisplay();
                } else {
                    playMS10TriangleBass(frequency, velocity / 127);
                }
            }
            break;
        case 128: // Note Off
            console.log(`Note Off. MIDI note: ${noteNumber}`);
            if (isArpeggiatorOn) {
                let frequency = midiNoteToFrequency(noteNumber);
                let index = arpNotes.indexOf(frequency);
                if (index !== -1) arpNotes.splice(index, 1);
            }
            break;
        default:
            console.log(`Unhandled MIDI message type: ${messageType}`);
    }
}

function midiNoteToFrequency(e) {
    return e < 0 || e > 127 ? (console.error("Invalid MIDI note:", e), null) : Math.pow(2, (e - A4_MIDI_NUMBER) / 12) * A4_FREQUENCY;
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
}

function stopMIDIRecording() {
    isRecordingMIDI = false;
    console.log('MIDI Recording stopped');
    isRecordingStarted = false; // Reset recording started flag
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

// Playback functionality
function playBackMIDI() {
    if (midiRecording.length > 0) {
        playbackStartTime = performance.now(); // Update playbackStartTime
        nextEventIndex = 0; // Reset the nextEventIndex
        playbackInterval = setInterval(playbackNextMIDIEvent, 0);
        console.log('playbackRecordingDEBUG: Playback started with ' + midiRecording.length + ' events.');
    } else {
        console.log('playbackRecordingDEBUG: No MIDI events to play back.');
    }
}

function playbackNextMIDIEvent() {
    if (nextEventIndex < midiRecording.length) {
        const now = performance.now() - playbackStartTime;
        const nextEvent = midiRecording[nextEventIndex];
    if (now >= nextEvent.timestamp) {
        let midiMessage = new Uint8Array(Object.values(nextEvent.message));
        console.log('Converted MIDI message:', midiMessage);
        onMIDIMessage({ data: midiMessage }); // Adjusted to pass Uint8Array
        nextEventIndex++;
    }
    } else {
        clearInterval(playbackInterval);
        console.log('playbackRecordingDEBUG: Playback stopped');
    }
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
