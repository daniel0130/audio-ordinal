// arpToggle.js


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
