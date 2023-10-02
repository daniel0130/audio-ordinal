// sequenceChannelSettings.js

let currentSequence = 1;
let totalSequenceCount = 64;


// Create an initial state for all 16 channels, with 64 steps each set to 'off' (false)

// Utility function to create an array with a default value
function createArray(length, defaultValue) {
    return Array(length).fill(defaultValue);
}

let channelSettings = createArray(16, [null].concat(createArray(64, false)));
let sequences = createArray(totalSequenceCount, createArray(16, [null].concat(createArray(64, false))));


function updateSequenceData(callback) {
    const sequenceData = jsonData[currentSequence - 1];
    if (sequenceData) {
        callback(sequenceData);
    }
}

function updateChannelSettingsForSequence() {
    updateSequenceData((sequenceData) => {
        sequenceData.channels.forEach((channel, index) => {
            channel.triggers.forEach(trigger => {
                channelSettings[index][trigger] = true; // set the trigger step to 'on'
            });
        });
    });
}

function updateChannelURLsForSequence() {
    updateSequenceData((sequenceData) => {
        sequenceData.channels.forEach((channel, index) => {
            channelURLs[currentSequence - 1][index] = channel.url;
        });
    });
}




// Create a two-dimensional array to store the URLs for each channel for every sequence
var channelURLs = Array(totalSequenceCount).fill().map(() => Array(16).fill(''));


// A function to be called whenever the sequence changes or JSON data is loaded
function onSequenceOrDataChange() {
  // reset channelSettings to initial state
  channelSettings = Array(16).fill().map(() => [null].concat(Array(64).fill(false)));
  // update the settings and URLs for the current sequence
  updateChannelSettingsForSequence();
  updateChannelURLsForSequence();
  const currentUrls = channelURLs;
  console.log(`URLs for Current Sequence (${currentSequence}) after data change:`, currentUrls);

}

// Function to add URLs to our structure
function addURLsToSequenceArrays(urls) {
    console.log("Received URLs to add:", urls);
    urls.forEach((url, index) => {
        channelURLs[currentSequence - 1][index] = url;
    });
    console.log("Updated channelURLs:", channelURLs);
}

// Call this function whenever the sequence changes
function changeSequence(seq) {
  currentSequence = seq;
  onSequenceOrDataChange();
}

// Assuming your load button calls the loadJson function, make sure to also call onSequenceOrDataChange after loading new JSON data



// Log initial channel settings
console.log("Initial channel settings:", channelSettings);


function loadChannelSettingsFromPreset(preset) {
    preset.channels.forEach((channelData, channelIndex) => {
        let stepSettings = [null].concat(Array(64).fill(false));  // Add placeholder for 0th index
        channelData.triggers.forEach(trigger => {
            // Account for 1-indexing
            stepSettings[trigger] = true;
        });
        channelSettings[channelIndex] = stepSettings;
        console.log(`Loaded settings for Channel-${channelIndex + 1}:`, channelSettings[channelIndex]);
        
        // Fetch audio data
        if (channelData.url) {
            const loadSampleButton = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"] .load-sample-button`);
            fetchAudio(channelData.url, channelIndex, loadSampleButton);
            console.log(`Channel-${channelIndex + 1} fetchAudio called`);
        }
    });

    // Save the loaded preset to the current sequence
    saveCurrentSequence(currentSequence);
}


/**
 * Updates a specific step's state for a given channel.
 * @param {number} channelIndex - The index of the channel (0 to 15).
 * @param {number} stepIndex - The index of the step (0 to 63).
 * @param {boolean} state - The new state of the step (true for on, false for off).
 */
function updateStep(channelIndex, stepIndex, state) {
    // Account for 1-indexing
    channelSettings[channelIndex][stepIndex + 1] = state;
    
    // Log updated settings for the specific channel after the update
    console.log(`Updated settings for Channel-${channelIndex + 1}:`, channelSettings[channelIndex]);
}

/**
 * Gets the current settings for a specific channel.
 * @param {number} channelIndex - The index of the channel (0 to 15).
 * @returns {Array} An array of 64 boolean values representing the step button states for the given channel.
 */
function getChannelSettings(channelIndex) {
    return channelSettings[channelIndex];
}

/**
 * Sets the settings for a specific channel.
 * @param {number} channelIndex - The index of the channel (0 to 15).
 * @param {Array} settings - An array of 64 boolean values representing the step button states.
 */
function setChannelSettings(channelIndex, settings) {
    channelSettings[channelIndex] = settings;
    
    // Log the settings for the specific channel after they are set
    console.log(`Settings set for Channel-${channelIndex + 1}:`, channelSettings[channelIndex]);
}

function saveCurrentSequence(sequenceNumber) {
    sequences[sequenceNumber - 1] = [...channelSettings];
    console.log(`Saved settings for Sequence ${sequenceNumber}:`, sequences[sequenceNumber - 1]);
    const urlsForSavedSequence = channelSettings.map(channelData => channelData[0]);
    console.log(`Saved URLs for Sequence ${sequenceNumber}:`, urlsForSavedSequence);

}



function loadSequence(sequenceNumber) {

    // Check if the sequence exists and initialize if not
    if (!sequences[sequenceNumber - 1]) {
        // If the sequence doesn't exist, initialize it with default settings
        sequences[sequenceNumber - 1] = Array(16).fill().map(() => [null].concat(Array(64).fill(false)));
    }

    // Set the BPM slider and display to match the current sequence's BPM
    let bpm = sequenceBPMs[sequenceNumber - 1];  // Get the BPM for the current sequence
    let bpmSlider = document.getElementById('bpm-slider');
    let bpmDisplay = document.getElementById('bpm-display');
    bpmSlider.value = bpm;
    bpmDisplay.innerText = bpm;
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

// Use loadNextSequence inside the event listener
document.getElementById('next-sequence').addEventListener('click', loadNextSequence);

function updateActiveQuickPlayButton() {
    // Remove 'active' class from all buttons
    quickPlayButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Add 'active' class to current sequence button
    const activeBtn = quickPlayButtons[currentSequence - 1];
    activeBtn.classList.add('active');
}

function updateUIForSequence(sequenceNumber) {
    if (sequenceNumber > 0 && sequenceNumber <= sequences.length) {
        channelSettings = sequences[sequenceNumber - 1];
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


function insertQuickPlayButtons() {
    console.log("insertQuickPlayButtons called!");

    const checkBox = document.getElementById('continuous-play');
    const quickPlayButton = document.getElementById('quick-play-button');

    if (checkBox && quickPlayButton) {
        for (let j = 0; j < 16; j++) {
            const quickBtn = createQuickPlayButton(j + 1);
            console.log(`Created Quick Play Button for Sequence_${j+1}`);
            checkBox.parentNode.insertBefore(quickBtn, quickPlayButton);
            console.log(`Added Quick Play Button for Sequence_${j+1} to DOM`);
        }
    } else {
        console.error("Either checkBox or quickPlayButton is missing!");
    }
}

insertQuickPlayButtons();

// Now that the quickplay buttons have been inserted, we can set up their event listeners.
quickPlayButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const sequenceIndex = parseInt(button.dataset.sequenceIndex, 10);
        currentSequence = sequenceIndex;
        loadSequence(sequenceIndex);

        // Update the display and highlight the active button
        document.getElementById('current-sequence-display').textContent = `Sequence ${currentSequence}`;
        updateActiveQuickPlayButton();
    });
});


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

