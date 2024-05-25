// midiRecording.js

import { handleNoteEvent, onMIDISuccess, onMIDIFailure, notifyParentOfUpdate } from './midiUtils.js';
import { SYNTH_CHANNEL } from './iframeMessageHandling.js';

document.addEventListener('DOMContentLoaded', () => {
    setupMIDIControls();
    requestMIDIAccess();
    loadMidiRecordingsFromLocalStorage(SYNTH_CHANNEL);  // Load the recordings
});

function setupMIDIControls() {
    const recordMidiButton = document.getElementById('RecordMidi');
    const playMidiButton = document.getElementById('PlayMidi');
    const timingAdjustSlider = document.getElementById('timingAdjust');

    recordMidiButton.addEventListener('click', handleRecordButtonClick);
    playMidiButton.addEventListener('click', handlePlayButtonClick);
    timingAdjustSlider.addEventListener('change', handleTimingAdjust);
}

function requestMIDIAccess() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
        console.warn('WebMIDI is not supported in this browser.');
    }
}

let isRecording = false;
let isWarning = false;
let warningTimeout;

let isPlaying = false;
const recordings = new Map();
let playbackTimeouts = [];

function handleRecordButtonClick() {
    const channelIndex = SYNTH_CHANNEL;
    const recordButton = document.getElementById('RecordMidi');
    const warningMessage = document.getElementById('recordWarning');

    console.log(`[handleRecordButtonClick] Button pressed for channel ${channelIndex}`);

    // Stop playback if it's currently playing
    if (isPlaying) {
        stopMidiPlayback();
        updatePlayButton();
    }

    if (isWarning) {
        clearTimeout(warningTimeout);
        warningMessage.style.display = 'none';
        startRecording(channelIndex);
        recordButton.textContent = 'RECORDING...';
        recordButton.classList.remove('flash');
        recordButton.classList.add('on');
        isWarning = false;
        console.log(`[handleRecordButtonClick] Recording started for channel ${channelIndex}`);
    } else if (isRecording) {
        stopRecording(channelIndex);
        recordButton.textContent = 'Record Midi';
        recordButton.classList.remove('on');
        console.log(`[handleRecordButtonClick] Recording stopped for channel ${channelIndex}`);
        isRecording = false;
    } else {
        warningMessage.style.display = 'block';
        isWarning = true;
        warningTimeout = setTimeout(() => {
            warningMessage.style.display = 'none';
            recordButton.classList.remove('flash');
            isWarning = false;
        }, 3000);
        recordButton.classList.add('flash');
        console.log(`[handleRecordButtonClick] Warning: About to record on channel ${channelIndex}`);
    }

    console.log(`[handleRecordButtonClick] isRecording: ${isRecording}`);
    const recordingExists = recordings.has(channelIndex) ? 'exists' : 'does not exist';
    console.log(`[handleRecordButtonClick] Recording array for channel ${channelIndex} ${recordingExists}`);

    if (recordings.has(channelIndex)) {
        console.log(`[handleRecordButtonClick] Current recording for channel ${channelIndex}:`, JSON.stringify(recordings.get(channelIndex)));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const recordButton = document.getElementById('RecordMidi');

    // Create the main warning message
    const warningMessage = document.createElement('div');
    warningMessage.id = 'recordWarning';
    warningMessage.style.fontSize = '15px'; // Larger text for the main warning
    warningMessage.textContent = 'Warning: This will overwrite the previous recording!';

    // Create the smaller text message
    const smallerMessage = document.createElement('div');
    smallerMessage.id = 'recordInfo';
    smallerMessage.style.fontSize = '12px'; // Smaller text size
    smallerMessage.textContent = 'Click again to commence recording';

    // Append both messages to the body
    warningMessage.appendChild(smallerMessage);
    document.body.appendChild(warningMessage);
});

function handlePlayButtonClick() {
    const playButton = document.getElementById('PlayMidi');
    if (isRecording) {
        stopRecording(SYNTH_CHANNEL);
        updateRecordButton();
    }

    if (isPlaying) {
        stopMidiPlayback();
    } else {
        playMidiRecording();
    }
    updatePlayButton();
}

function updateRecordButton() {
    const recordButton = document.getElementById('RecordMidi');
    if (isRecording) {
        recordButton.textContent = 'RECORDING...';
        recordButton.classList.add('on');
    } else {
        recordButton.textContent = 'Record Midi';
        recordButton.classList.remove('on');
    }
}

function updatePlayButton() {
    const playButton = document.getElementById('PlayMidi');
    if (isPlaying) {
        playButton.textContent = 'Stop Midi Recording';
    } else {
        playButton.textContent = 'Play Recorded Midi';
    }
}

function handleTimingAdjust() {
    const channelIndex = SYNTH_CHANNEL;
    const nudgeValue = parseFloat(this.value);
    const midiRecording = getMidiRecording(channelIndex);
    if (midiRecording.length > 0) {
        adjustPlaybackTiming(midiRecording, nudgeValue);
    }
    this.value = 0;
}

export function playMidiRecording() {
    const channelIndex = SYNTH_CHANNEL;
    const midiRecording = getMidiRecording(channelIndex);
    console.log(`[playMidiRecording] Channel Index: ${channelIndex}`);
    console.log(`[playMidiRecording] Checking midiRecording array: ${JSON.stringify(midiRecording)}`);
    if (midiRecording.length === 0) {
        console.log('[playMidiRecording] No MIDI recording to play');
        return;
    }

    if (isPlaying) {
        console.log('[playMidiRecording] Playback already in progress. Stopping current playback.');
        stopMidiPlayback();
    }

    isPlaying = true;
    updatePlayButton();

    const startTime = performance.now();
    const recordingStartTimestamp = midiRecording[0].timestamp;
    const nudgeValue = parseFloat(document.getElementById('timingAdjust').value);
    const nudgeOffset = (nudgeValue / 100) * (midiRecording[midiRecording.length - 1].timestamp - recordingStartTimestamp);

    midiRecording.forEach((event, index) => {
        if (event.isNoteOn) {
            let adjustedTimestamp = event.timestamp + nudgeOffset;
            const delay = adjustedTimestamp - recordingStartTimestamp + (performance.now() - startTime);

            console.log(`[playMidiRecording] Scheduling event ${index + 1}/${midiRecording.length}: Note On - ${event.note} at ${delay.toFixed(2)}ms for channel: ${channelIndex}`);
            const timeoutId = setTimeout(() => {
                handleNoteEvent(event.note, event.velocity, event.isNoteOn);
            }, delay);
            playbackTimeouts.push(timeoutId);
        }
    });

    document.getElementById('timingAdjust').value = 0;
    console.log(`[playMidiRecording] Playback initiated for Channel Index: ${channelIndex}`);
}

export function stopMidiPlayback() {
    playbackTimeouts.forEach(clearTimeout);
    playbackTimeouts = [];
    isPlaying = false;
    updatePlayButton();
    console.log('[stopMidiPlayback] MIDI playback stopped');
}

function adjustPlaybackTiming(midiRecording, nudgeValue) {
    const recordingStartTime = midiRecording[0].timestamp;
    const nudgeOffset = (nudgeValue / 100) * (midiRecording[midiRecording.length - 1].timestamp - recordingStartTime);
    midiRecording.forEach((event, index) => {
        let adjustedTimestamp = event.timestamp + nudgeOffset;
        adjustedTimestamp = Math.max(adjustedTimestamp, performance.now());
        const delay = adjustedTimestamp - performance.now();
        setTimeout(() => handleNoteEvent(event.note, event.velocity, event.isNoteOn), delay);
    });
}

export function startRecording(channelIndex) {
    if (channelIndex == null) return;
    isRecording = true;
    updateRecordButton();
    recordings.set(channelIndex, []);
}

export function stopRecording(channelIndex) {
    if (channelIndex == null) return;
    isRecording = false;
    updateRecordButton();
    saveMidiRecordingsToLocalStorage(channelIndex);  // Save the recording
    notifyParentOfUpdate('updateMidiRecording', recordings.get(channelIndex), channelIndex);
}


export function recordMidiEvent(event, channelIndex = SYNTH_CHANNEL) {
    console.log(`[recordMidiEvent] Received event on channel ${channelIndex}`);
    if (channelIndex == null || !isRecording) {
        console.log(`[recordMidiEvent] Ignored: Recording not active or channelIndex is null.`);
        return;
    }

    const timestamp = performance.now();
    const command = event.data[0] & 0xf0;
    const note = event.data[1];
    const velocity = event.data.length > 2 ? event.data[2] : 0;
    console.log(`[recordMidiEvent] MIDI event data: Command=${command}, Note=${note}, Velocity=${velocity}, Timestamp=${timestamp}`);

    const isNoteOn = command === 144 && velocity > 0;
    if (isNoteOn) {
        let recording = getMidiRecording(channelIndex);
        recording.push({ note, velocity, isNoteOn, timestamp });
        setMidiRecording(recording, channelIndex);
        console.log(`[recordMidiEvent] Event recorded. Total events: ${recording.length}`);
    } else {
        console.log(`[recordMidiEvent] Ignored: Non-noteOn event or zero velocity.`);
    }
}

export function getMidiRecording(channelIndex) {
    if (!recordings.has(channelIndex)) {
        recordings.set(channelIndex, []);
    }
    return recordings.get(channelIndex);
}

export function setMidiRecording(recording, channelIndex) {
    if (channelIndex == null) return;
    recordings.set(channelIndex, [...recording]);
    notifyParentOfUpdate('updateMidiRecording', recording, channelIndex);
    console.log(`[setMidiRecording] Recording set for channel ${channelIndex}. Recording length: ${recording.length}`);
}

export function addMidiRecording(event, channelIndex) {
    if (channelIndex == null || !isRecording) return;
    if (!recordings.has(channelIndex)) {
        recordings.set(channelIndex, []);
    }
    const timestamp = performance.now();
    const command = event.data[0] & 0xf0;
    const note = event.data[1];
    const velocity = event.data.length > 2 ? event.data[2] : 0;
    const isNoteOn = command === 144 && velocity > 0;
    if (isNoteOn) {
        const recording = recordings.get(channelIndex);
        recording.push({ note, velocity, isNoteOn, timestamp });
        recordings.set(channelIndex, recording);
    }
}

export function clearMidiRecording(channelIndex) {
    if (channelIndex == null) return;
    recordings.set(channelIndex, []);
}


const saveMidiRecordingsToLocalStorage = (channelIndex) => {
    const midiSettings = {
        channel: channelIndex,
        recordings: getMidiRecording(channelIndex)
    };
    localStorage.setItem(`midi_settings_channel_${channelIndex}`, JSON.stringify(midiSettings));
    console.log(`MIDI recordings for channel ${channelIndex} saved to local storage.`);
};

export const loadMidiRecordingsFromLocalStorage = (channelIndex) => {
    const savedSettings = localStorage.getItem(`midi_settings_channel_${channelIndex}`);
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        recordings.set(channelIndex, settings.recordings);
        console.log(`Loaded MIDI recordings for channel ${channelIndex} from local storage.`);
    } else {
        console.log(`No saved MIDI recordings found for channel ${channelIndex}.`);
    }
};
