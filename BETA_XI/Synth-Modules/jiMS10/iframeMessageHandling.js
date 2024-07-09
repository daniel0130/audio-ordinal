// iframeMessageHandling.js 
// is a script that listens for messages from the parent window and responds to them by updating the synthesizer state. 
// It also listens for messages from the synthesizer iframe and responds to them by updating the parent window. The script uses a BroadcastChannel to communicate between the parent window and the synthesizer iframe. 
// The script also handles setting the active channel index for the synthesizer.
// iframeMessageHandling.js 
export const SYNTH_CHANNEL = new URLSearchParams(window.location.search).get('channelIndex');

import { loadSettingsFromObject, loadFromLocalStorage } from './saveLoadHandler.js';
import { getMidiRecording, setMidiRecording } from './midiRecording.js';
import { initializeChannelIndex } from './activeSynthChannelIndex.js';
import { loadArpNotesFromLocalStorage, startArpeggiator, stopArpeggiator } from './arpeggiator.js';

const sequencerChannel = new BroadcastChannel(`synth_channel_${SYNTH_CHANNEL}`);

const initializeSynthesizer = () => {
    // Set the active channel index first
    initializeChannelIndex(SYNTH_CHANNEL);
    
    // Load arpeggiator notes from local storage
    loadFromLocalStorage();

    // Proceed with any other initialization tasks
    // setupAudioContext();
    // setupEventListeners();
    loadArpNotesFromLocalStorage();
};

// Dedicated channel for stopping all synths
const stopChannel = new BroadcastChannel('stopAllSynthsChannel');
stopChannel.onmessage = (event) => {
    console.log('[Iframe] Stop all synths received');
    if (event.data.type === 'stopAll') {
        console.log('[Iframe] Stop all synths received');
        stopArpeggiator();  // Your function to stop synths
    }
};

sequencerChannel.addEventListener("message", (event) => {
    console.log(`[PARENT MESSAGE] ms10 messageEventListener] Received message: ${JSON.stringify(event.data)}`);

    // Ignore the channel index check and process all messages
    switch (event.data.type) {
        case 'startArpeggiator':
            startArpeggiator();
            console.log(`Arpeggiator started for channel ${SYNTH_CHANNEL}`);
            break;
        case 'stopArpeggiator':
            stopArpeggiator();
            console.log(`Arpeggiator stopped for channel ${SYNTH_CHANNEL}`);
            break;
        case 'step':
            console.log(`[ms10 messageEventListener] Received step: ${event.data.data.step}`);
            onSequencerStep(event.data.data.step);
            clearTimeout(externalStepTimeout);
            externalStepTimeout = setTimeout(() => {
                console.log(`[ms10] No external steps received for an extended period. Stopping arpeggiator.`);
                stopArpeggiator();
            }, 250);
            window.parent.postMessage({ type: 'confirmStep', step: event.data.data.step }, '*');
            break;
        case 'setArpNotes':
            const receivedArpNotes = event.data.arpNotes;
            console.log(`[ms10 messageEventListener] Received Arpeggiator notes: ${JSON.stringify(receivedArpNotes)}`);
            if (Array.isArray(receivedArpNotes)) {
                arpNotes = receivedArpNotes;
                updateArpNotesDisplay();
                console.log(`[ms10 messageEventListener] Arpeggiator notes updated: ${JSON.stringify(arpNotes)}`);
            } else {
                console.error(`[ms10 messageEventListener] Invalid Arpeggiator notes format: ${typeof receivedArpNotes}`);
            }
            window.parent.postMessage({ type: 'confirmArpNotes', arpNotes: event.data.arpNotes }, '*');
            break;
        case 'setMidiRecording':
            if (SYNTH_CHANNEL === null) {
                console.error("[ms10 messageEventListener] Error: Attempting to set MIDI recording without a valid channel index.");
                return;
            }
            const receivedMidiRecording = event.data.midiRecording;
            console.log(`[ms10 messageEventListener] Received MIDI recording for channel ${SYNTH_CHANNEL}: ${JSON.stringify(receivedMidiRecording)}`);
            setMidiRecording(receivedMidiRecording, 0); // Pass channel 0 as placeholder
            let currentMidiRecording = getMidiRecording(0); // Get the updated recording to log
            console.log(`[ms10 messageEventListener] MIDI recording updated: ${currentMidiRecording.length} events`);
            console.log(`[ms10 messageEventListener] Current MIDI recording array: ${JSON.stringify(currentMidiRecording)}`);
            window.parent.postMessage({ type: 'confirmMidiRecording', midiRecording: event.data.midiRecording }, '*');
            break;
        case 'setSynthSettings':
            const receivedSettings = event.data.settings;
            console.log(`[ms10 messageEventListener] Received Synth settings: ${JSON.stringify(receivedSettings)}`);
            loadSettingsFromObject(receivedSettings);
            window.parent.postMessage({ type: 'confirmSynthSettings', settings: event.data.settings }, '*');
            break;
        case 'setChannelIndex':
            initializeChannelIndex(event.data.channelIndex);
            updateUIWithChannelIndex(event.data.channelIndex);
            break;
    }
});

window.addEventListener('message', (event) => {
    console.log('Received message:', event.data);

    if (!event.data) return;

    switch (event.data.type) {
        case 'setChannelIndex':
            initializeChannelIndex(event.data.channelIndex);
            updateUIWithChannelIndex(event.data.channelIndex);
            break;
        case 'setBPM':
            console.log(`Updating BPM display to: ${event.data.bpm}`);
            updateBPMDisplay(event.data.bpm);
            break;
    }
}, false);

function updateUIWithChannelIndex(channelIndex) {
    const channelDisplay = document.getElementById('sequencerChannelDisplay');
    if (channelDisplay) {
        channelDisplay.textContent = `Channel: ${channelIndex}`;
    } else {
        console.error("Channel display element not found!");
    }
}

function updateBPMDisplay(bpm) {
    console.log(`Inside updateBPMDisplay with bpm: ${bpm}`);
    const bpmDisplay = document.getElementById('bpmDisplay');
    if (bpmDisplay) {
        bpmDisplay.textContent = `BPM: ${bpm}`;
    } else {
        console.error("BPM display element not found!");
    }
}

window.addEventListener('DOMContentLoaded', initializeSynthesizer);
