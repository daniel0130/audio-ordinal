// midiRecorder.js

console.log('midiRecorder.js loaded');

let playbackInterval;
let playbackStartTime = 0;
let nextEventIndex = 0;
let isRecordingMIDI = false;
let midiRecording = [];

// Starts MIDI recording and initializes necessary variables
function startMIDIRecording() {
    if (!isRecordingMIDI) {
        isRecordingMIDI = true;
        midiRecording = [];
        document.getElementById('recordMIDIButton').classList.add('active');
        console.log('MIDI Recording started');

        // Start audio recording
        window.startAudioRecording();  // Call startRecording from audioRecorder.js
        window.isAudioRecordingStarted = true;
    }
}


// Stops MIDI recording and also triggers stopping of audio recording
function stopMIDIRecording() {
    if (isRecordingMIDI) {
        isRecordingMIDI = false;
        document.getElementById('recordMIDIButton').classList.remove('active');
        console.log('MIDI Recording stopped');
        window.stopAudioRecording();
    }
}

// Plays back recorded MIDI events from midiRecording array
function playBackMIDI() {
    if (midiRecording.length > 0) {
        playbackStartTime = performance.now();
        nextEventIndex = 0;
        playbackInterval = setInterval(playbackNextMIDIEvent, 0);
        document.getElementById('playMIDIRecordButton').classList.add('active');
        console.log('Playback started');

        // Start recording audio
        startAudioRecording();
    }
}

function stopMIDIPlayback() {
    clearInterval(playbackInterval);
    document.getElementById('playMIDIRecordButton').classList.remove('active');
    console.log('Playback stopped');

    // Stop recording audio
    stopAudioRecording();
}

// Handles the playback of the next MIDI event in the queue
function playbackNextMIDIEvent() {
    const now = performance.now() - playbackStartTime;
    if (nextEventIndex < midiRecording.length && now >= midiRecording[nextEventIndex].timestamp) {
        handleMIDIEvent(midiRecording[nextEventIndex].message);
        console.log('Playing MIDI Event:', midiRecording[nextEventIndex].message);
        nextEventIndex++;
    } else if (nextEventIndex >= midiRecording.length) {
        clearInterval(playbackInterval);
        document.getElementById('playMIDIRecordButton').classList.remove('active');
        console.log('Playback completed');
    }
}

function handleMIDIEvent(message) {
    console.log('Handling MIDI event:', message);
    if (!window.isAudioRecordingStarted) {
        console.log('Starting audio recording due to first MIDI event.');
    }
}



// Records individual MIDI events into the midiRecording array
function recordMIDIEvent(message) {
    if (isRecordingMIDI) {
        const currentTime = performance.now();
        const timestamp = currentTime - playbackStartTime;
        midiRecording.push({ timestamp, message });
        console.log('Recorded MIDI Event:', message, 'at timestamp:', timestamp);
    }
}

// Set up for recording, includes metronome count
function prepareToRecordMIDI() {
    let metronomeCount = 0;
    let metronomeInterval = setInterval(() => {
        console.log('Metronome Click');
        playMetronome();
        metronomeCount++;
        if (metronomeCount >= 4) {
            clearInterval(metronomeInterval);
            startMIDIRecording();
        }
    }, 500);
}

// Ensure global accessibility
window.recordMIDIEvent = recordMIDIEvent;

// Add global access to audio recording controls
window.startAudioRecording = () => {
    audioChunks.length = 0;  // Ensure to clear previous recordings
    recorder.start();
    console.log('Audio recording started with MIDI playback.');
};

window.stopAudioRecording = () => {
    recorder.stop();
    console.log('Audio recording stopped with MIDI playback.');
};