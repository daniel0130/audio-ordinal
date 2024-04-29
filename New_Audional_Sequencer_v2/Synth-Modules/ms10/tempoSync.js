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
            console.log(`[MS10] Stopping arpeggiator due to pause message at ${new Date().toISOString()}`);
            stopArpeggiator();
        }
    } else if (type === 'resume') {
        if (!isArpeggiatorOn) {
            console.log(`[MS10] Starting arpeggiator due to resume message at ${new Date().toISOString()}`);
            startArpeggiator();
        }
    } else if (type === 'stop') {
        if (isArpeggiatorOn) {
            console.log(`[MS10] Stopping arpeggiator due to stop message at ${new Date().toISOString()}`);
            stopArpeggiator();
        }
        console.log(`[MS10] Resetting syncBeat and syncBar due to stop message at ${new Date().toISOString()}`);
        syncBeat = 1; // Reset syncBeat
        syncBar = 1; // Reset syncBar
    } else if (type === 'play') {
        console.log(`[MS10] Playing arpeggiator due to play message at ${new Date().toISOString()}`);
        playArpeggiator();
    }

    console.log(`syncBeat ${syncBeat} - syncBar ${syncBar}`); // Log the updated syncBeat and syncBar
};
