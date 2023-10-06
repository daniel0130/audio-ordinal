// noteSelector.js

function populateNoteSelector() {
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
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
