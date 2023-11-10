// sequenceChannelSettings_Part2.js

function saveCurrentSequence(sequenceNumber) {
    sequences[sequenceNumber - 1] = [...channelSettings];
    console.log(`from saveCurrentSequence: Saved settings for Sequence ${sequenceNumber}:`, sequences[sequenceNumber - 1]);
    const urlsForSavedSequence = channelSettings.map(channelData => channelData[0]);
    console.log(`from saveCurrentSequence: Saved URLs for Sequence ${sequenceNumber}:`, urlsForSavedSequence);

}


function loadSequence(sequenceNumber) {

    // Check if the sequence exists and initialize if not
    if (!sequences[sequenceNumber - 1]) {
        // If the sequence doesn't exist, initialize it with default settings
        sequences[sequenceNumber - 1] = Array(16).fill().map(() => [null].concat(Array(64).fill(false)));
    }

    // Assertion to ensure valid indexing
    if (sequenceNumber - 1 < 0 || sequenceNumber - 1 >= sequenceBPMs.length) {
        console.error(`Invalid sequenceNumber: ${sequenceNumber}`);
        return;
    }   

    // Set the BPM slider and display to match the current sequence's BPM
    let bpm = sequenceBPMs[sequenceNumber - 1];  // Get the BPM for the current sequence
    let bpmSlider = document.getElementById('bpm-slider');
    let bpmDisplay = document.getElementById('bpm-display');
    bpmSlider.value = bpm;
    bpmDisplay.innerText = bpm;
// Add event listener to BPM slider to update sequence data when BPM changes
    bpmSlider.addEventListener('input', function() {
        let newBpm = parseInt(bpmSlider.value);
        updateSequenceData({
            sequenceIndex: currentSequence - 1, // Assuming 0-based indexing
            bpm: newBpm
        });
    });

    bpmSlider.dispatchEvent(new Event('input')); // Update the sequencer's BPM

    
    const sequenceChannels = sequences[sequenceNumber - 1];
    if (!sequenceChannels) {
        console.error(`Sequence ${sequenceNumber} is not found in sequences.`, sequences);
        return;
    }

    if (!Array.isArray(sequenceChannels)) {
        console.error(`Sequence ${sequenceNumber} is not an array.`, sequenceChannels);
        return;
    }
    const urlsForSequence = sequenceChannels.map(channelData => channelData[0]);
    console.log(`URLs for Sequence ${sequenceNumber}:`, urlsForSequence);

    // Loaded settings for Sequence
    console.log(`Loaded settings for Sequence ${sequenceNumber}:`, sequenceChannels);

    // Update the UI to reflect the loaded sequence
    updateUIForSequence(sequenceNumber);

    // Update the currentSequence
    currentSequence = sequenceNumber;

    sequenceChannels.forEach((channelData, channelIndex) => {
        const currentUrl = channelData[0]; // Assuming the URL is at the 0th index of channelData array
        const channelElement = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"]`);
        const previousUrl = channelElement.dataset.originalUrl;

        if (currentUrl && currentUrl !== previousUrl) {
            const loadSampleButton = channelElement.querySelector('.load-sample-button');
            fetchAudio(currentUrl, channelIndex, loadSampleButton);
        }
    });
}


function loadNextSequence() {
    if (currentSequence < totalSequenceCount) {
        // Save current sequence's settings
        saveCurrentSequence(currentSequence);

        // Increment the current sequence number
        currentSequence++;

        // Load the next sequence's settings
        loadSequence(currentSequence);

        // Update the displayed number
        const sequenceDisplayElement = document.getElementById('current-sequence-display');
        if (sequenceDisplayElement) {
            sequenceDisplayElement.textContent = 'Sequence ' + currentSequence;
        }
        
        updateActiveQuickPlayButton();
    } else {
        console.warn("You've reached the last sequence.");
    }
}


function updateUIForSequence(sequenceNumber) {
    if (sequenceNumber > 0 && sequenceNumber <= sequences.length) {
        channelSettings = sequences[sequenceNumber - 1];
        saveCurrentSequence(currentSequence);

        // Rest of the function remains unchanged...
    } else {
        console.error("Invalid sequence number:", sequenceNumber);
    }
    const sequenceSettings = sequences[sequenceNumber - 1];
    channels.forEach((channel, index) => {
        const stepButtons = channel.querySelectorAll('.step-button');
        const toggleMuteButtons = channel.querySelectorAll('.toggle-mute');

        // Clear all step buttons and toggle mute states
        stepButtons.forEach(button => button.classList.remove('selected'));
        toggleMuteButtons.forEach(button => button.classList.remove('toggle-mute'));

        // Update the steps based on the sequence settings
        sequenceSettings[index].forEach((stepState, pos) => {
            // Skip the 0th position (our placeholder)
            if (pos === 0) return;

            if (stepState) {
                stepButtons[pos - 1].classList.add('selected');
            }
        });

        // You can add similar logic for updating other UI elements like toggle mute states, volume, etc.
    });
}

// Listen for the custom event and then load and display sequence 1
window.addEventListener('setupComplete', function() {
    loadAndDisplaySequence(1);
});


// Use loadNextSequence inside the event listener
document.getElementById('next-sequence').addEventListener('click', loadNextSequence);







document.getElementById('prev-sequence').addEventListener('click', function() {
    if (currentSequence > 1) {
        // Save current sequence's settings
        saveCurrentSequence(currentSequence);

        // Decrement the current sequence number and load its settings
        currentSequence--;
        loadSequence(currentSequence);
        
        // Update the display and highlight the active button
        document.getElementById('current-sequence-display').textContent = `Sequence ${currentSequence}`;
        updateActiveQuickPlayButton();
    } else {
        console.warn("You're already on the first sequence.");
    }
});

