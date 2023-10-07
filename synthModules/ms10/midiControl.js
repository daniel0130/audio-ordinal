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
    let command = message.data[0];
    let midiNote = message.data[1];
    let velocity = (message.data.length > 2) ? message.data[2] : 0;

    switch (command) {
        case 144: // noteOn
            if (velocity > 0) {
                let frequency = midiNoteToFrequency(midiNote);
                let noteName = window.frequencyToNoteName(frequency);
                console.log(`[MIDI] noteOn: MIDI note ${midiNote}, Note: ${noteName}, Frequency: ${frequency}`);
                if (isArpeggiatorOn) {
                    playMS10TriangleBass(frequency, velocity / 127);

                    arpNotes.push(frequency);
                    arpNoteNames.push(noteName); // parallel addition
                    console.log(`[MIDI] Added note to arpNotes: ${midiNote}. Current arpNotes: [${arpNoteNames}]`);
                }
            }
            break;
        case 128: // noteOff
            if (isArpeggiatorOn) {
                let frequency = midiNoteToFrequency(midiNote);
                let noteName = window.frequencyToNoteName(frequency);
                console.log(`[MIDI] noteOff: MIDI note ${midiNote}, Note: ${noteName}, Frequency: ${frequency}`);
                let index = arpNotes.indexOf(frequency);
                if (index !== -1) {
                    arpNotes.splice(index, 1);
                    arpNoteNames.splice(index, 1); // parallel removal
                    console.log(`[MIDI] Removed note from arpNotes: ${midiNote}. Current arpNotes: [${arpNoteNames}]`);
                }
            }
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
