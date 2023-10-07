// tempoSync.js

console.log("[MS10] tempoSync.js script loaded and running!");

let syncBeat = 1; // Initialize syncBeat to 1
let syncBar = 1; // Initialize syncBar to 1

const sequencerChannel = new BroadcastChannel('sequencerChannel');

sequencerChannel.onmessage = function(event) {
    const type = event.data.type;
    const data = event.data.data;

    console.log(`[MS10] Message received on sequencerChannel: ${type}`);

    if (type === 'beat') {
        console.log(`syncBeat ${syncBeat} - syncBar ${syncBar}`); // Log the current syncBeat and syncBar

        syncBeat++; // Increment the syncBeat

        if (syncBeat > 4) {
            syncBeat = 1; // Reset the syncBeat
            syncBar++; // Increment the syncBar
        }
    } else if (type === 'BPMUpdate') {
        // Handle the BPM update
        const updatedBPM = data;
    
        // Update the MS10's BPM slider
        const arpTempoSlider = document.getElementById('arpTempo');
        arpTempoSlider.value = updatedBPM;
    
        // Update the arpeggiator's internal BPM
        // Given the precision of the Web Audio API, we don't need to manually stop and restart the arpeggiator
        // The timing will adjust smoothly due to the changes in the arpeggiator.js
    
        console.log(`Updated BPM: ${updatedBPM}`);
    } else if (type === 'pause') {
        if (isArpeggiatorOn) {
            stopArpeggiator();
        }
    } else if (type === 'resume') {
        if (!isArpeggiatorOn) {
            startArpeggiator();
        }
    } else if (type === 'stop') {
        if (isArpeggiatorOn) {
            stopArpeggiator();
        }
        syncBeat = 1; // Reset syncBeat
        syncBar = 1; // Reset syncBar
    }

    console.log(`syncBeat ${syncBeat} - syncBar ${syncBar}`); // Log the updated syncBeat and syncBar
};

