// eventListeners.js

const keyToMidiNote = {};
const noteNames = ["A", "W", "S", "E", "D", "F", "T", "G", "Y", "H", "U", "J", "K", "O", "L", "P"];
const startingMidiNote = 21;  // A0

for (let i = 0; i < noteNames.length; i++) {
    keyToMidiNote["Key" + noteNames[i]] = startingMidiNote + i;
}

document.addEventListener('keydown', function(event) {
    const midiNote = keyToMidiNote[event.code];
    if (midiNote) {
        const frequency = Math.pow(2, (midiNote - 69) / 12) * 440;
        playMS10TriangleBass(frequency);
    }
});


document.getElementById('arpToggle').addEventListener('click', toggleArpeggiator);
