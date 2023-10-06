// arpeggiator.js

let isArpeggiatorOn = false;
let isArpeggiatorPaused = false;
let arpInterval;
let awaitingFirstBeat = true;  // Introduce this variable at the top of the file

const arpNotes = []; // Queue to hold notes for the arpeggiator

const arpSequencerChannel = new BroadcastChannel('sequencerChannel');
arpSequencerChannel.onmessage = function(event) {
    const type = event.data.type;

    if (type === 'beat' && awaitingFirstBeat) {
        awaitingFirstBeat = false;
        playArpNotes();  // Start the arpeggiator as soon as the first beat is received
    }    if (type === 'pause') {
        pauseArpeggiator();
    } else if (type === 'stop') {
        stopArpeggiator();
    } else if (type === 'resume') {
        startArpeggiator();
    }
};

function toggleArpeggiator() {
    isArpeggiatorOn = !isArpeggiatorOn;
    const arpButton = document.getElementById('arpToggle');
    
    if (isArpeggiatorOn) {
        arpButton.innerText = "Stop Arpeggiator";
        startArpeggiator();
    } else {
        arpButton.innerText = "Start Arpeggiator";
        stopArpeggiator();
    }
}

function startArpeggiator() {
    if (isArpeggiatorPaused) {
        // If the arpeggiator was paused, just restart the interval without changing the arpNotes
        isArpeggiatorPaused = false;
    } else if (!awaitingFirstBeat) {
        playArpNotes();
    }
}

function playArpNotes() {
    const tempo = parseFloat(document.getElementById('arpTempo').value);
    const intervalDuration = 60000 / tempo; // Convert BPM to ms per beat

    // Play the first note immediately
    playNextArpNote();

    arpInterval = setInterval(() => {
        playNextArpNote();
    }, intervalDuration);
}

function playNextArpNote() {
    if (arpNotes.length) {
        const pattern = document.getElementById('arpPattern').value;
        let noteToPlay;

        switch (pattern) {
            case "up":
                noteToPlay = arpNotes.shift();
                arpNotes.push(noteToPlay);
                break;
            case "down":
                noteToPlay = arpNotes.pop();
                arpNotes.unshift(noteToPlay);
                break;
            case "random":
                noteToPlay = arpNotes[Math.floor(Math.random() * arpNotes.length)];
                break;
        }

        playMS10TriangleBass(noteToPlay);
    }
}


function pauseArpeggiator() {
    isArpeggiatorPaused = true;
    clearInterval(arpInterval);
}

function stopArpeggiator() {
    clearInterval(arpInterval);
    arpNotes.length = 0; // Clear the arpNotes array
    isArpeggiatorPaused = false;
}


// This is just a basic example. You can add more functionality like adding/removing notes to arpNotes, changing patterns dynamically, etc.
