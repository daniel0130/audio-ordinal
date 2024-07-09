// allIOnOneSynthengine.js


// Global Variables
const A4_MIDI_NUMBER = 69;
const A4_FREQUENCY = 440;
const arpNoteNames = [];
let isArpeggiatorOn = false;

let isRecordingMIDI = false;
let midiRecording = [];
let currentOscillator = null;
let playbackInterval;
let context = new (window.AudioContext || window.webkitAudioContext)();
let nextEventIndex = 0;
let playbackStartTime = 0;

// Helper function to expand abbreviated properties
function expandData(data) {
    // Expand the MIDI recording array
    if (data.mR) {
        data.midiRecording = data.mR.map(rec => ({
            timestamp: rec.ts,
            message: rec.msg
        }));
        delete data.mR;
    }

    // Expand settings
    if (data.st) {
        data.settings = abbreviateSettings(data.st, false);
        delete data.st;
    }

    return data;
}

// Helper function to map settings to abbreviated form and vice versa
function abbreviateSettings(settings, isAbbreviating = true) {
    const mapping = {
        waveform: 'wf',
        note: 'nt',
        attack: 'atk',
        release: 'rls',
        cutoff: 'ctf',
        resonance: 'rsn',
        volume: 'vol'
    };

    const result = {};
    for (const key in settings) {
        const newKey = isAbbreviating ? mapping[key] : Object.keys(mapping).find(k => mapping[k] === key);
        result[newKey] = settings[key];
    }
    return result;
}


// Updated load function
function loadMIDIRecording(fileContent) {
    let data = JSON.parse(fileContent);

    // Expand data
    if (data.mR) {
        midiRecording = data.mR.map(rec => ({
            timestamp: rec.ts,
            message: new Uint8Array(Object.values(rec.msg))
        }));
    }

    // Apply the settings
    if (data.st) {
        setSynthSettings(data.st);
    }

    console.log('MIDI Recording loaded:', midiRecording);
    console.log('Synth settings applied:', synthSettings);
}


function setSynthSettings(settings) {
    console.log('[setSynthSettings] - Received settings:', settings);

    // Update the global synthSettings with the loaded settings
    if (settings.wf) synthSettings.waveform = settings.wf;
    if (settings.nt) synthSettings.note = parseFloat(settings.nt);
    if (settings.atk) synthSettings.attack = parseFloat(settings.atk) / 1000; // Assuming the value is in milliseconds
    if (settings.rls) synthSettings.release = parseFloat(settings.rls) / 1000; // Assuming the value is in milliseconds
    if (settings.ctf) synthSettings.cutoff = parseFloat(settings.ctf);
    if (settings.rsn) synthSettings.resonance = parseFloat(settings.rsn);
    if (settings.vol) synthSettings.volume = parseFloat(settings.vol) / 100; // Assuming the value is in a range of 0-100

    console.log('Synth settings updated:', synthSettings);
}


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


// Function to start playback of MIDI recording
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

// Function to play the next MIDI event
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

// Function to generate sound from MIDI note data
function playNoteFromMIDI(midiMessage) {
    let noteNumber = midiMessage[1];
    let velocity = midiMessage[2];

    console.log(`playNoteFromMIDI - Note Number: ${noteNumber}, Velocity: ${velocity}`);

    if (velocity > 0) {
        let frequency = midiNoteToFrequency(noteNumber);
        console.log(`playNoteFromMIDI - Playing note. Frequency: ${frequency}`);
        playMS10TriangleBass(frequency, velocity / 127);
    } else {
        console.log(`playNoteFromMIDI - Note Off. MIDI note: ${noteNumber}`);
    }
}

// Convert MIDI note number to frequency
function midiNoteToFrequency(e) {
    return e < 0 || e > 127 ? (console.error("Invalid MIDI note:", e), null) : Math.pow(2, (e - A4_MIDI_NUMBER) / 12) * A4_FREQUENCY;
}

// Synthesizer sound generation function

// Global Variables for Synthesizer Settings
let synthSettings = {
    waveform: 'sawtooth',  // Default waveform
    note: 440,             // Default note (A4)
    attack: 0.01,          // Default attack time in seconds
    release: 0.5,          // Default release time in seconds
    cutoff: 2000,          // Default cutoff frequency
    resonance: 1,          // Default resonance
    volume: 0.5            // Default volume
};

// Updated playMS10TriangleBass function
function playMS10TriangleBass(frequency = synthSettings.note) {
    console.log(`playMS10TriangleBass - Frequency: ${frequency}, Volume: ${synthSettings.volume}`);
    console.log(`Synth Settings - Waveform: ${synthSettings.waveform}, Attack: ${synthSettings.attack}, Release: ${synthSettings.release}, Cutoff: ${synthSettings.cutoff}, Resonance: ${synthSettings.resonance}`);

    if (currentOscillator) {
        currentOscillator.stop();
        currentOscillator = null;
    }

    let oscillator = context.createOscillator();
    let gainNode = context.createGain();
    let filter = context.createBiquadFilter();

    oscillator.type = synthSettings.waveform;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    filter.type = "lowpass";
    filter.frequency.value = synthSettings.cutoff;
    filter.Q.value = synthSettings.resonance;

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(2 * synthSettings.volume, context.currentTime + synthSettings.attack);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + synthSettings.attack + synthSettings.release);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + synthSettings.attack + synthSettings.release);

    currentOscillator = oscillator;
}


// Updated setSynthSettings function
function setSynthSettings(settings) {
    console.log('[setSynthSettings] Setting loaded synth settings:', settings);

    // Update the global synthSettings with the loaded settings
    synthSettings = { ...synthSettings, ...settings };
    console.log('Synth settings updated:', synthSettings);
}

// Additional utility functions as needed

// Example usage
// loadMIDIRecording(fileContent); // Load MIDI and settings from a JSON file content
// playBackMIDI(); // Start playback
