// loadSynthModule.js

// Define presetData globally
const presetData = {
    preset1: {
        channels: Array.from({ length: 16 }, () => ({ steps: Array(4096).fill(false), mute: false, url: null, type: 'audio' }))
    }
};

let tabInterface = null;

function toggleDisplay(elements, show) {
    elements.forEach(element => {
        element.style.display = show ? 'block' : 'none';
    });
}

function loadSynth(channelIndex, loadSampleButton, bpmValue) {
    console.log(`[PARENT] Loading synth for channel index: ${channelIndex}`);
    
    if (!tabInterface) { // Create tabbed interface if it doesn't exist
        tabInterface = createTabbedInterface();
    } else {
        showFloatingWindow(); // Show the floating window if it already exists
    }

    addTab(tabInterface.tabContainer, tabInterface.iframeContainer, `jiMS10`, channelIndex, loadSampleButton.id);

    const iframe = tabInterface.iframeContainer.querySelector(`iframe[data-channel='${channelIndex}']`);
    if (iframe) {
        iframe.onload = () => {
            console.log('[PARENT] iframe onload triggered');
            console.log('[PARENT] Sending setChannelIndex with channelIndex:', channelIndex);
            sendMessageToIframe(iframe, { type: 'setChannelIndex', channelIndex });

            console.log('[PARENT] Sending setBPM with bpmValue:', bpmValue);
            sendMessageToIframe(iframe, { type: 'setBPM', bpm: bpmValue });

            // Set the channel type to synth
            if (!presetData.preset1.channels[channelIndex]) {
                presetData.preset1.channels[channelIndex] = { steps: Array(4096).fill(false), mute: true, url: null, type: 'synth' };
            } else {
                presetData.preset1.channels[channelIndex].type = 'synth';
            }

            console.log(`[PARENT] Channel type set to synth for channel index: ${channelIndex}`);
            console.log(presetData.preset1.channels[channelIndex]);

            if (loadSampleButton) {
                console.log('[PARENT] Updating button text to "jiMS10 Synth Loaded"');
                loadSampleButton.textContent = `jiMS10 Synth ${channelIndex}`;
                window.unifiedSequencerSettings.setChannelName(channelIndex, `Ch ${channelIndex} : jiMS10 Synth`);
                window.unifiedSequencerSettings.updateLoadSampleButtonText(channelIndex, loadSampleButton);
                window.unifiedSequencerSettings.updateUIForSequence(window.unifiedSequencerSettings.settings.masterSettings.currentSequence);
            } else {
                console.error('[PARENT] Load sample button not found:', loadSampleButton.id);
            }
        };
    } else {
        console.error('[PARENT] iframe not found for channel index:', channelIndex);
    }
}


function sendMessageToIframe(iframe, message) {
    console.log('[PARENT] Sending message to iframe:', message);
    iframe.contentWindow.postMessage(message, '*');
}

function listenForChildMessages(channelIndex, savedSettings) {
    window.addEventListener('message', (event) => {
        const { type, data } = event.data;
        console.log(`[PARENT] Received ${type}: ${JSON.stringify(data)}`);
        if (type === 'updateArpNotes' || type === 'updateMidiRecording') {
            savedSettings[type === 'updateArpNotes' ? 'arpNotes' : 'midiRecording'] = data;
        }
    });
}

function getSettingsFromLocalStorage(channelIndex) {
    const settings = localStorage.getItem(`synthSettings_${channelIndex}`);
    return settings ? JSON.parse(settings) : {};
}


// Function to stop the arpeggiator and synthesizer for all channels
// Initialize the BroadcastChannel outside of the stopAllSynths function to avoid re-creating it unnecessarily
const stopChannel = new BroadcastChannel('stopAllSynthsChannel');

function stopAllSynths() {
    console.log('[stopAllSynths] Stopping all synths');
    try {
        // Post the message to stop all synths
        stopChannel.postMessage({ type: 'stopAll' });
    } catch (error) {
        console.error('Error posting message on stopChannel:', error);
    }
}

// Ensure the channel is closed when the window or document is unloaded to clean up resources
window.addEventListener('beforeunload', () => {
    stopChannel.close();
    console.log('BroadcastChannel closed');
});

