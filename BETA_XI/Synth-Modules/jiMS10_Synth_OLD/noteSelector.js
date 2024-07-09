   // noteSelector.js
   const musicalNotes = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
    const keyNames = ["A","W","S","E","D","F","T","G","Y","H","U","J","K","O","L","P"];
    const keyToMidiNote = {};
    const startingMidiNote = 21;

    for (let e = 0; e < keyNames.length; e++) {
        keyToMidiNote["Key" + keyNames[e]] = 21 + e;
    }

    window.noteNameToFrequency = function(t, o) {
        const n = musicalNotes.indexOf(t) + 12 * (o + 1);
        return 440 * Math.pow(2, (n - 69) / 12);
    }

    window.frequencyToNoteName = function(t) {
        let o = Math.round(12 * Math.log2(t / 440) + 69);
        return musicalNotes[o % 12] + (Math.floor(o / 12) - 1);
    }

    function populateNoteSelectorWithKeys() {
        const noteDropdown = document.getElementById('note');
        let octave = 0;
        let noteIndex = 0;
        let keyIndex = 0;  // Initialize a separate index for the keyNames array
        let c1Frequency = null; // Initialize the frequency for C1
    
        for (let i = 0; i < 88; i++) {
            const option = document.createElement('option');
            const frequency = 440 * Math.pow(2, (i - 49) / 12);
    
            // Check if the current note is C1 and capture its frequency
            if (musicalNotes[noteIndex] === "C" && octave === 1) {
                c1Frequency = frequency;
            }
            
            option.value = frequency;
            option.textContent = `${musicalNotes[noteIndex]}${octave} | ${keyNames[keyIndex]}`;
            noteDropdown.appendChild(option);
            
            noteIndex++;
            keyIndex++;
            if (noteIndex >= 12) {
                noteIndex = 0;
                octave++;
            }
            if (keyIndex >= keyNames.length) {  // Cycle through the keyNames array
                keyIndex = 0;
            }
        }
    
        // Set the default value to C1's frequency
        if (c1Frequency) {
            noteDropdown.value = c1Frequency;
        }
    }

    document.addEventListener("DOMContentLoaded", populateNoteSelectorWithKeys);

    document.addEventListener("keydown", function(e) {
        const midiNote = keyToMidiNote[e.code];
        if (midiNote) {
            const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
            console.log(`[KEYDOWN] Key: ${e.code}, MIDI note: ${midiNote}, Frequency: ${frequency}`);
            playMS10TriangleBass(frequency);
            arpNotes.push(frequency);
            updateArpNotesDisplay();
    
            // Record the note event
            if (typeof window.recordKeyboardNoteEvent === 'function') {
                window.recordKeyboardNoteEvent(midiNote, 127, true); // Assuming velocity 127 for key press
            }
        }
    });

   document.addEventListener("keyup", function(e) {
        const o = keyToMidiNote[e.code];
        if (o) {
            console.log(`[KEYUP] Key: ${e.code}, MIDI note: ${o}`);
            if (typeof stopMS10TriangleBass === 'function') {
                stopMS10TriangleBass(); // Check if the function exists before calling it
            } else {
                console.warn("stopMS10TriangleBass function is not defined.");
            }
        }
    });
   