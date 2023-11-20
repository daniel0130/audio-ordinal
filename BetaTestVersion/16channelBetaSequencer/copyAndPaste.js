// copyAndPaste.js

// Introduce the flag at the top level
let isCopyPasteEvent = false;

let copiedData = null; // This will hold the copied data

document.addEventListener('DOMContentLoaded', function() {
    // Assuming this is the ID of your copy button
    const copyButton = document.getElementById('copy-sequence-settings');
    const pasteButton = document.getElementById('paste-button');

    if (copyButton) {
        copyButton.addEventListener('click', function() {
            // Logic to copy the sequence settings
            copiedData = {
                type: 'sequence',
                sequenceNumber: currentSequence,
                bpm: document.getElementById('bpm-slider').value,
                channelSettings: [...channelSettings],
                channelURLs: channelURLs[currentSequence - 1]
            };
            console.log('Sequence settings copied:', copiedData);

            // Start flashing animation on the paste button
            if (pasteButton) {
                pasteButton.classList.add('flashing');
            }

            // Show soft confirmation message
            showConfirmationTooltip('Copied sequence settings. Select another sequence to paste to.');
        });
    }

    if (pasteButton) {
        pasteButton.addEventListener('click', function() {
            if (!copiedData) {
                alert('No data copied to paste!');
                return;
            }

            if (currentSequence === copiedData.sequenceNumber) {
                alert('Please select a different sequence to paste the settings.');
                return;
            }

            pasteSettings();
            // Stop the flashing animation after pasting the settings
            this.classList.remove('flashing');
        });
    }
});

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


function pasteSettings() {
    let settingsToImport;

    // Check if the current sequence is empty and add a new sequence if needed
    if (!sequences[currentSequence - 1]) {
        sequences[currentSequence - 1] = Array(16).fill().map(() => [null].concat(Array(64).fill(false)));
    }
    console.log("P1 Copied data:", copiedData);

    if (copiedData.type === 'sequence') {
        settingsToImport = [{
            name: `Sequence_${currentSequence}`,
            bpm: copiedData.bpm,
            channels: copiedData.channelSettings.map((channel, index) => {
                return {
                    url: copiedData.channelURLs[index],
                    triggers: channel.map((step, stepIndex) => step ? stepIndex : null).filter(Boolean)
                };
            })
        }];
        // Update collectedURLsForSequences with the copied URLs for the current sequence
        collectedURLsForSequences[currentSequence - 1] = copiedData.channelURLs;

        // Update the BPM for the current sequence
        sequenceBPMs[currentSequence - 1] = copiedData.bpm;

    } else if (copiedData.type === 'channel') {
        // Update the specific channel's URL in collectedURLsForSequences
        collectedURLsForSequences[currentSequence - 1][copiedData.channelIndex] = copiedData.channelURL;

        // Get the current sequence settings
        settingsToImport = [{
            name: `Sequence_${currentSequence}`,
            bpm: document.getElementById('bpm-slider').value,
            channels: sequences[currentSequence - 1].map((channel, index) => {
                if (index === copiedData.channelIndex) {
                    return {
                        url: copiedData.channelURL,
                        triggers: copiedData.channelSetting.map((step, stepIndex) => step ? stepIndex : null).filter(Boolean)
                    };
                } else {
                    return {
                        url: channel[0],
                        triggers: channel.map((step, stepIndex) => step ? stepIndex : null).filter(Boolean)
                    };
                }
            })
        }];
    }
    pasteSequenceSettings(JSON.stringify(settingsToImport));
    console.log("P1 Settings to import:", settingsToImport);
    console.log('P1 Data pasted:', copiedData);
}

function pasteSequenceSettings(settings) {
    console.log("Pasting sequence settings...");

    let parsedSettings;

    try {
        parsedSettings = JSON.parse(settings);
        console.log("P1 Parsed settings for paste:", parsedSettings);
    } catch (error) {
        console.error("Error parsing settings for paste:", error);
        return;
    }

    function isValidSequence(seq) {
        const isValid = seq && Array.isArray(seq.channels) && typeof seq.name === 'string';
        console.log(`Sequence ${seq.name} is valid for paste: ${isValid}`);
        return isValid;
    }
    console.log("P1 Parsed settings before conversion:", parsedSettings);

    // Update collectedURLsForSequences with the parsed URLs for the current sequence
    collectedURLsForSequences[currentSequence - 1] = parsedSettings[0].channels.map(ch => ch.url);

    // Update the BPM for the current sequence
    sequenceBPMs[currentSequence - 1] = parsedSettings[0].bpm;

    // Build the sequences array for paste
    let pastedSequences = parsedSettings.map((seqSettings, index) => {
        if (isValidSequence(seqSettings)) {
            return convertSequenceSettings(seqSettings);
        } else {
            return null;
        }
    }).filter(Boolean);

    // If the current sequence is beyond the length of the sequences array, append the pasted sequence
    if (currentSequence > sequences.length) {
        sequences.push(pastedSequences[0]);
    } else {
        sequences[currentSequence - 1] = pastedSequences[0];
    }
    console.log("P1 Current sequence after paste:", sequences[currentSequence - 1]);

    // Ensure channelSettings is initialized for the current sequence
    channelSettings = sequences[currentSequence - 1];

    // Now, call functions that rely on channelSettings
    updateUIForSequence(currentSequence);
    saveCurrentSequence(currentSequence);

    console.log("P1 Pasted sequences array:", sequences);

    loadAndDisplaySequence(currentSequence);

    console.log("Paste sequence settings completed.");
}
