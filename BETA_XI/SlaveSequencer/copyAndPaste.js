// copyAndPaste.js

// Introduce the flag at the top level
let isCopyPasteEvent = false;

let copiedData = null; // This will hold the copied data

// Add a function to validate the updates in the global object and UI
function validateAndUpdateUI(sequenceIndex) {
    const sequenceSettings = window.unifiedSequencerSettings.getSequenceSettings(sequenceIndex);
    
    if (!isValidSequence(sequenceSettings)) {
        console.error(`[copyPasteDebug] Invalid sequence settings for sequence index: ${sequenceIndex}`);
        return;
    }

    // Call UI update function with the new sequence settings
    updateUIForSequence(sequenceIndex);
    console.log(`[copyPasteDebug] UI updated for sequence index: ${sequenceIndex}`);

    // Additional validation logic can be added here
}

document.addEventListener('DOMContentLoaded', function() {
    const copyButton = document.getElementById('copy-sequence-settings');
    const pasteButton = document.getElementById('paste-button');

    if (copyButton) {
        console.log('[copyPasteDebug] Copy button clicked.');
        copyButton.addEventListener('click', function() {
            const currentSequenceIndex = window.unifiedSequencerSettings.getCurrentSequence();
            const sequenceSettings = window.unifiedSequencerSettings.getSequenceSettings(currentSequenceIndex);
        
            // Deep copy the entire sequence settings
            copiedData = {
                type: 'sequence',
                sequenceSettings: JSON.parse(JSON.stringify(sequenceSettings))
            };
        
            console.log('[copyPasteDebug] Sequence settings copied:', copiedData);
            if (pasteButton) {
                pasteButton.classList.add('flashing');
            }
            showConfirmationTooltip('[copyPasteDebug] Copied sequence settings. Select another sequence to paste to.');
        });
    }

    if (pasteButton) {
        pasteButton.addEventListener('click', function() {
            console.log('[copyPasteDebug] pasteButton clicked');

            if (!copiedData || copiedData.type !== 'sequence') {
                alert('No sequence data copied to paste!');
                return;
            }

            const currentSequenceIndex = window.unifiedSequencerSettings.getCurrentSequence();
            console.log(`[copyPasteDebug] Current sequence index: ${currentSequenceIndex}`);

            // Replace the entire sequence settings of the target sequence with the copied data
            window.unifiedSequencerSettings.setSequenceSettings(currentSequenceIndex, copiedData.sequenceSettings);
            
            console.log(`[copyPasteDebug] Sequence settings pasted to sequence index ${currentSequenceIndex}: ${JSON.stringify(copiedData)}`);
            updateUIForSequence(currentSequenceIndex);
            console.log(`[copyPasteDebug] updateUIForSequence called with sequence index: ${currentSequenceIndex}`);
            console.log(`[copyPasteDebug] Current sequence index according to the global object is now: ${window.unifiedSequencerSettings.getCurrentSequence()}`);

            this.classList.remove('flashing');
            validateAndUpdateUI(currentSequenceIndex);
        });
    }
});

function isValidSequence(seq) {
    if (!seq || typeof seq !== 'object') {
        console.log('[copyPasteDebug] Sequence is not an object.');
        return false;
    }

    // Check if all channels in the sequence are valid
    for (let channelKey in seq) {
        const channel = seq[channelKey];
        if (!isValidChannel(channel)) {
            console.log(`[copyPasteDebug] Invalid channel data in sequence: ${channelKey}`);
            return false;
        }
    }

    console.log('[copyPasteDebug] Sequence is valid for paste.');
    return true;
}

function isValidChannel(channel) {
    return channel 
           && Array.isArray(channel.steps) 
           && typeof channel.mute === 'boolean' 
           && typeof channel.url === 'string';
}

function showConfirmationTooltip(message) {
    const tooltip = document.createElement('div');
    tooltip.innerText = message;
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#333';
    tooltip.style.color = 'white';
    tooltip.style.padding = '5px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.top = '50%';
    tooltip.style.left = '50%';
    tooltip.style.transform = 'translate(-50%, -50%)';
    tooltip.style.zIndex = '1000';

    document.body.appendChild(tooltip);

    setTimeout(() => {
        tooltip.remove();
    }, 3000);
}