// arpeggiator.js

let isArpeggiatorOn = false;
let isArpeggiatorPaused = false;
let nextArpNoteTimeout;

const arpNotes = []; 


const arpSequencerChannel = new BroadcastChannel('sequencerChannel');
arpSequencerChannel.onmessage = function(event) {
    const type = event.data.type;
    console.log(`[ARP] Received message: ${type} at ${new Date().toISOString()}`);

    if (type === 'beat') {
        
            // Clear the timeout for the next arp note (if any)
            clearTimeout(nextArpNoteTimeout);

            // Play the next arp note in sync with the sequencer's beat
            playNextArpNote();

            // Schedule the next arp note
            const tempo = parseFloat(document.getElementById('arpTempo').value);
            const intervalDuration = 60 / tempo * 1000; // Convert BPM to milliseconds per beat
            nextArpNoteTimeout = setTimeout(playNextArpNote, intervalDuration);
        
    } else if (type === 'pause') {
        pauseArpeggiator();
    } else if (type === 'stop') {
        stopArpeggiator();
    } else if (type === 'resume') {
        startArpeggiator();
    } else if (type === 'play') {
        console.log(`[ARP] Play button pressed at ${new Date().toISOString()}`);
        if (!isArpeggiatorOn && !isArpeggiatorPaused) {
            playNextArpNote(); // Play the first note immediately
            isArpeggiatorOn = true; // Set the arpeggiator to on
        }
    }
};

function playArpNotes() {
    playNote(arpNotes[0]); // Immediately play the first note

    const tempo = parseFloat(document.getElementById('arpTempo').value);
    const intervalDuration = 60 / tempo * 1000; // Convert BPM to milliseconds per beat

    function schedule() {
        playNextArpNote();
        setTimeout(schedule, intervalDuration);
    }

    // Delay the scheduling of the next arp note to synchronize with the next beat
    const delay = intervalDuration - (new Date().getTime() - new Date('2023-10-07T21:58:20.130Z').getTime()) % intervalDuration;
    setTimeout(schedule, delay);
}

function updateArpNotes(action, note, noteName) {
    if (action === "add") {
        arpNotes.push(note);
        arpNoteNames.push(noteName);
    } else if (action === "remove") {
        let index = arpNotes.indexOf(note);
        if (index !== -1) {
            arpNotes.splice(index, 1);
            arpNoteNames.splice(index, 1);
        }
    }
    console.log(`[ARP] ${action} note: ${noteName}. Current arpNotes: [${arpNoteNames.join(", ")}]`);
}

function playNextArpNote() {
    if (arpNotes.length) {
        const pattern = document.getElementById('arpPattern').value;
        let noteToPlay;
        let noteNameToPlay;

        if (arpNotes.length === 1) {
            noteToPlay = arpNotes[0];
            noteNameToPlay = arpNoteNames[0];
        } else {
            switch (pattern) {
                case "up":
                    noteToPlay = arpNotes.shift();
                    noteNameToPlay = arpNoteNames.shift();
                    arpNotes.push(noteToPlay);
                    arpNoteNames.push(noteNameToPlay);
                    break;
                case "down":
                    noteToPlay = arpNotes.pop();
                    noteNameToPlay = arpNoteNames.pop();
                    arpNotes.unshift(noteToPlay);
                    arpNoteNames.unshift(noteNameToPlay);
                    break;
                case "random":
                    let randomIndex = Math.floor(Math.random() * arpNotes.length);
                    noteToPlay = arpNotes[randomIndex];
                    noteNameToPlay = arpNoteNames[randomIndex];
                    break;
            }
        }

        playMS10TriangleBass(noteToPlay);
        console.log(`[ARP] Played note: ${noteNameToPlay} (Frequency: ${noteToPlay}) at ${new Date().toISOString()}`); 
    }
}