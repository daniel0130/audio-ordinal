// arpeggiator.js

let isArpeggiatorOn = false;
let isArpeggiatorPaused = false;
let awaitingFirstBeat = true;

const arpNotes = []; 

const arpSequencerChannel = new BroadcastChannel('sequencerChannel');
arpSequencerChannel.onmessage = function(event) {
    const type = event.data.type;

    if (type === 'beat' && awaitingFirstBeat) {
        awaitingFirstBeat = false;
        playArpNotes();  
    } else if (type === 'pause') {
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
        isArpeggiatorPaused = false;
    } else if (!awaitingFirstBeat) {
        playArpNotes();
    }
}

function playArpNotes() {
    const tempo = parseFloat(document.getElementById('arpTempo').value);
    const intervalDuration = 60 / tempo; // Convert BPM to seconds per beat

    // Schedule the first note to play immediately
    playNextArpNote();

    // Use the Web Audio API's timing mechanism instead of setInterval
    let nextTime = context.currentTime + intervalDuration;

    function schedule() {
        while (nextTime < context.currentTime + 0.1) {  // schedule notes for the next 100ms
            playNextArpNote();
            nextTime += intervalDuration;
        }
        window.requestAnimationFrame(schedule);
    }

    schedule();
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
    // Since we're not using setInterval, there's no clearInterval equivalent here.
    // Pausing is handled by the isArpeggiatorPaused flag.
}

function stopArpeggiator() {
    arpNotes.length = 0; // Clear the arpNotes array
    isArpeggiatorPaused = false;
}

// window.addEventListener('focus', function() {
//     if (context.state === 'suspended') {
//         context.resume();
//     }
// });
// This is just a basic example. You can add more functionality like adding/removing notes to arpNotes, changing patterns dynamically, etc.
