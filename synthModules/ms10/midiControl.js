// midiControl.js

const A4_MIDI_NUMBER = 69;
const A4_FREQUENCY = 440.0;

const arpNoteNames = []; // parallel array to arpNotes

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);
} else {
    console.warn("WebMIDI is not supported in this browser.");
}

function onMIDISuccess(midiAccess) {
    let inputs = midiAccess.inputs.values();
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = onMIDIMessage;
    }
}

function onMIDIFailure() {
    console.warn("Could not access your MIDI devices.");
}

function onMIDIMessage(message) {
    console.log("Received MIDI message:", message.data);

    let command = message.data[0] & 0xF0; // Mask the channel bits to get the message type
    let midiNote = message.data[1];
    let velocity = (message.data.length > 2) ? message.data[2] : 0;

    switch (command) {
        case 0x90: // noteOn for all channels
            if (velocity > 0) {
                let frequency = midiNoteToFrequency(midiNote);
                console.log(`Note On. MIDI note: ${midiNote}, Frequency: ${frequency}`);
                if (isArpeggiatorOn) {
                    arpNotes.push(frequency);
                  
                } else {
                    playMS10TriangleBass(frequency, velocity / 127);  // Normalize velocity to [0, 1]
                }
            }
            break;
        case 0x80: // noteOff for all channels
            console.log(`Note Off. MIDI note: ${midiNote}`);
            if (isArpeggiatorOn) {
                let frequency = midiNoteToFrequency(midiNote);
                let index = arpNotes.indexOf(frequency);
                if (index !== -1) {
                    arpNotes.splice(index, 1);
                }
            }
            break;
        default:
            console.log(`Unhandled MIDI message type: ${command}`);
            break;
    }
}


function midiNoteToFrequency(midiNote) {
    if (midiNote < 0 || midiNote > 127) {
        console.error("Invalid MIDI note:", midiNote);
        return null;
    }
    return Math.pow(2, (midiNote - A4_MIDI_NUMBER) / 12) * A4_FREQUENCY;
}

function playNote(midiNote, velocity = 1) {
    // Convert MIDI note to frequency
    let frequency = Math.pow(2, (midiNote - 69) / 12) * 440;
    playMS10TriangleBass(frequency, velocity);  // Pass velocity to the synth function
}

function stopNote(midiNote) {
    // Stop the note if your synthesizer supports it
    // This requires a more advanced architecture where you keep track of playing notes
}

function getVolume() {
    const volumeSlider = document.getElementById('volume');
    return volumeSlider.value / 100; // convert to a value between 0 and 1
}
