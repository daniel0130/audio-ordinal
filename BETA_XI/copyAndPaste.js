// copyAndPaste.js

document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copy-sequence-settings');
    const pasteButton = document.getElementById('paste-button');
    let copiedData = null; // Holds the copied sequence data

    // Helper function to show confirmation tooltips
    function showConfirmationTooltip(message) {
        const tooltip = document.createElement('div');
        tooltip.innerText = message;
        tooltip.style.position = 'fixed';
        tooltip.style.background = '#333';
        tooltip.style.color = 'white';
        tooltip.style.padding = '10px 20px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.top = '20px';
        tooltip.style.right = '20px';
        tooltip.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        tooltip.style.zIndex = '1000';
        tooltip.style.opacity = '0';
        tooltip.style.transition = 'opacity 0.5s';

        document.body.appendChild(tooltip);

        // Fade in
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 100);

        // Fade out after 3 seconds
        setTimeout(() => {
            tooltip.style.opacity = '0';
            // Remove after transition
            setTimeout(() => {
                tooltip.remove();
            }, 500);
        }, 3000);
    }

    // Helper function to validate a sequence
    function isValidSequence(seq) {
        if (!seq || typeof seq !== 'object') {
            console.warn('[copyPasteDebug] Sequence is not an object.');
            return false;
        }

        for (let channelKey in seq) {
            const channel = seq[channelKey];
            if (!isValidChannel(channel)) {
                console.warn(`[copyPasteDebug] Invalid channel data in sequence: ${channelKey}`);
                return false;
            }
        }

        console.log('[copyPasteDebug] Sequence is valid for paste.');
        return true;
    }

    // Helper function to validate a channel
    function isValidChannel(channel) {
        return channel &&
               Array.isArray(channel.steps) &&
               typeof channel.mute === 'boolean' &&
               typeof channel.url === 'string';
    }

    // Helper function to update the UI for a specific sequence
    function updateUIForSequence(sequenceIndex) {
        // Implement your UI update logic here
        // For example:
        // renderSequence(sequenceIndex);
        console.log(`[copyPasteDebug] UI updated for sequence index: ${sequenceIndex}`);
    }

    // Helper function to validate and update UI
    function validateAndUpdateUI(sequenceIndex) {
        const sequenceSettings = window.unifiedSequencerSettings.getSequenceSettings(sequenceIndex);

        if (!isValidSequence(sequenceSettings)) {
            console.error(`[copyPasteDebug] Invalid sequence settings for sequence index: ${sequenceIndex}`);
            return;
        }

        updateUIForSequence(sequenceIndex);
    }

    // Copy Button Event Listener
    if (copyButton) {
        copyButton.addEventListener('click', () => {
            const currentSequenceIndex = window.unifiedSequencerSettings.getCurrentSequence();
            const sequenceSettings = window.unifiedSequencerSettings.getSequenceSettings(currentSequenceIndex);

            // Deep copy the entire sequence settings
            copiedData = {
                type: 'sequence',
                sequenceSettings: JSON.parse(JSON.stringify(sequenceSettings)),
                sourceSequenceIndex: currentSequenceIndex
            };

            console.log('[copyPasteDebug] Sequence settings copied:', copiedData);

            // Add flashing effect to paste button to indicate availability
            pasteButton.classList.add('flashing');

            // Show confirmation tooltip
            showConfirmationTooltip(`All Steps for All Channels in Sequence ${currentSequenceIndex} copied to clipboard.`);
        });
    }

    // Paste Button Event Listener
    if (pasteButton) {
        pasteButton.addEventListener('click', () => {
            console.log('[copyPasteDebug] Paste button clicked.');

            if (!copiedData || copiedData.type !== 'sequence') {
                alert('No sequence data copied to paste!');
                return;
            }

            // Prompt user to select number of sequences to paste
            const pasteOptions = [1, 2, 4, 8];
            let numberOfSequencesToPaste = prompt(`How many sequences would you like to paste? (${pasteOptions.join(', ')})`, '1');

            if (numberOfSequencesToPaste === null) {
                // User cancelled the prompt
                return;
            }

            numberOfSequencesToPaste = parseInt(numberOfSequencesToPaste, 10);

            if (!pasteOptions.includes(numberOfSequencesToPaste)) {
                alert(`Invalid selection. Please enter one of the following numbers: ${pasteOptions.join(', ')}`);
                return;
            }

            const currentSequenceIndex = window.unifiedSequencerSettings.getCurrentSequence();
            const startingSequenceIndex = currentSequenceIndex; // Changed from current +1 to current

            // Check for potential overwrites
            let overwrite = false;
            for (let i = 0; i < numberOfSequencesToPaste; i++) {
                const targetIndex = startingSequenceIndex + i;
                const targetSequence = window.unifiedSequencerSettings.getSequenceSettings(targetIndex);
                if (targetSequence && Object.keys(targetSequence).length > 0) {
                    overwrite = true;
                    break;
                }
            }

            if (overwrite) {
                const userConfirmed = confirm('Pasting will overwrite existing steps in the target sequence(s). Do you want to continue?');
                if (!userConfirmed) {
                    return;
                }
            }

            // Proceed with pasting
            for (let i = 0; i < numberOfSequencesToPaste; i++) {
                const targetIndex = startingSequenceIndex + i;
                const newSequenceSettings = JSON.parse(JSON.stringify(copiedData.sequenceSettings));

                window.unifiedSequencerSettings.setSequenceSettings(targetIndex, newSequenceSettings);
                console.log(`[copyPasteDebug] Sequence settings pasted to sequence index ${targetIndex}:`, newSequenceSettings);
                validateAndUpdateUI(targetIndex);
            }

            // Update UI for all pasted sequences
            for (let i = 0; i < numberOfSequencesToPaste; i++) {
                const targetIndex = startingSequenceIndex + i;
                updateUIForSequence(targetIndex);
            }

            // Show confirmation tooltip
            if (numberOfSequencesToPaste === 1) {
                showConfirmationTooltip(`1 sequence pasted to Sequence ${startingSequenceIndex}.`);
            } else {
                showConfirmationTooltip(`${numberOfSequencesToPaste} sequences pasted starting at Sequence ${startingSequenceIndex}.`);
            }

            // Remove flashing effect
            pasteButton.classList.remove('flashing');
        });
    }
});
