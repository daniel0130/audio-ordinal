// midiController.js

import { pianoFrequencies } from './frequencyTable.js';
import { playMS10TriangleBass } from './synth.js';

// Check if the Web MIDI API is supported by the browser
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);
} else {
    console.log('Web MIDI API not supported in this browser.');
}

// Function called when MIDI access is successfully obtained
function onMIDISuccess(midiAccess) {
    // Listen for connect/disconnect events on MIDI devices
    midiAccess.onstatechange = onStateChange;

    // Access inputs and outputs
    let inputs = midiAccess.inputs;

    // Attach event listeners for MIDI input devices
    inputs.forEach(function(input) {
        console.log('MIDI Input:', input);
        input.onmidimessage = onMIDIMessage;
    });
}

// Function to handle state change events
function onStateChange(event) {
    let port = event.port, state = port.state, name = port.name, type = port.type;
    if (type == "input")
        console.log('State change:', name, state);
}

// Function called when there is a failure in accessing MIDI
function onMIDIFailure() {
    console.log('Failed to access MIDI devices.');
}

// Function to handle incoming MIDI messages
function onMIDIMessage(message) {
    let command = message.data[0];
    let note = message.data[1];
    let velocity = message.data[2];

    switch (command) {
        case 144: // Note On message
            if (velocity > 0) {
                noteOn(note, velocity);
            } else {
                noteOff(note);
            }
            break;
        case 128: // Note Off message
            noteOff(note);
            break;
        // Add more cases to handle other types of messages, if needed
    }
}

// Function to handle Note On
function noteOn(note, velocity) {
    // Assuming your pianoFrequencies array starts with A0 at index 0
    const midiNoteNumberOffset = 21; // A0 MIDI note number
    if (note >= midiNoteNumberOffset && note < midiNoteNumberOffset + pianoFrequencies.length) {
        const frequency = pianoFrequencies[note - midiNoteNumberOffset];
        playMS10TriangleBass(frequency, velocity);
    }
}


// Function to handle Note Off
function noteOff(note) {
    console.log(`Note Off: ${note}`);
    // Implement logic for stopping the note, if necessary
    // This might involve modifying the synth to handle note off events
}

