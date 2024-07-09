// arpControl.js

function startArpeggiator() {
    if (isArpeggiatorPaused) {
        console.log("[ARP CONTROL] Resuming arpeggiator from pause.");
        isArpeggiatorPaused = false;
    } else if (!isArpeggiatorOn) {
        console.log("[ARP CONTROL] Starting arpeggiator immediately.");
        playArpNotes();
        isArpeggiatorOn = true; // Ensure this flag is set to true when the arpeggiator is started
    }
}

function playArpeggiator() {
    console.log("[ARP CONTROL] Play button pressed.");
    startArpeggiator();
}

function pauseArpeggiator() {
    console.log("[ARP CONTROL] Arpeggiator paused.");
    isArpeggiatorPaused = true;
}

function stopArpeggiator() {
    console.log("[ARP CONTROL] Arpeggiator stopped and arpNotes cleared.");
    arpNotes.length = 0; // Clear the arpNotes array
    isArpeggiatorPaused = false;
}
