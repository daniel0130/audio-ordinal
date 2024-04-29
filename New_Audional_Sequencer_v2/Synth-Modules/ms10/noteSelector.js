// noteSelector.js

function populateNoteSelector() {
    const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

    function noteNameToFrequency(noteName, octave) {
        const index = NOTE_NAMES.indexOf(noteName);
        const midiNumber = index + (octave + 1) * 12;
        return Math.pow(2, (midiNumber - 69) / 12) * 440;
    }
    
    function frequencyToNoteName(frequency) {
        let midiNote = Math.round(12 * Math.log2(frequency / 440.0) + 69);
        let noteName = NOTE_NAMES[midiNote % 12];
        let octave = Math.floor(midiNote / 12) - 1;
        return noteName + octave;
    }

    window.noteNameToFrequency = noteNameToFrequency;
    window.frequencyToNoteName = frequencyToNoteName;

    let currentNoteIndex = 0;
    let currentOctave = 0;
    const noteSelector = document.getElementById('note');

    for (let i = 0; i < 88; i++) {
        const option = document.createElement('option');
        const noteName = noteNames[currentNoteIndex];
        const noteFrequency = Math.pow(2, (i - 49) / 12) * 440; // Calculate frequency based on A4 = 440Hz
        option.value = noteFrequency;
        option.textContent = noteName + currentOctave;
        noteSelector.appendChild(option);

        currentNoteIndex++;
        if (currentNoteIndex >= 12) {
            currentNoteIndex = 0;
            currentOctave++;
        }
    }
}

document.addEventListener('DOMContentLoaded', populateNoteSelector);
