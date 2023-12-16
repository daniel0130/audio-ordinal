// observers.js

// Assuming UnifiedSequencerSettings instance is accessible via a global variable
// For example, window.unifiedSequencerSettings

// Observer for Project Name
function updateProjectNameObserver(settings) {
    console.log("[observers] updateProjectNameObserver called with:", settings)
    if (settings && settings.masterSettings && settings.masterSettings.projectName) {
        console.log("[observers] Updating Project Name UI:", settings.masterSettings.projectName);

        updateProjectNameUI(settings.masterSettings.projectName);
    }
}

// Observer for BPM
function updateBPMObserver(settings) {
    console.log("[observers] updateBPMObserver called with:", settings)
    if (settings && settings.masterSettings && settings.masterSettings.projectBPM) {
        console.log("Updating BPM UI:", settings.masterSettings.projectBPM);

        updateBPMUI(settings.masterSettings.projectBPM);
    }
}

// Observer for Project URLs
function updateProjectURLsObserver(settings) {
    console.log("[observers] updateProjectURLsObserver called with:", settings)
    if (settings && settings.masterSettings && settings.masterSettings.projectURLs) {
        console.log("Updating Project URLs UI:", settings.masterSettings.projectURLs);
        unifiedSequencerSettings.updateAllLoadSampleButtonTexts();
        updateProjectURLsUI(settings.masterSettings.projectURLs);
    }
}

// Observer for Trim Settings
function updateTrimSettingsObserver(settings) {
    console.log("[observers] updateTrimSettingsObserver called with:", settings)    
    if (settings && settings.masterSettings && settings.masterSettings.trimSettings) {
        console.log("Updating Trim Settings UI:", settings.masterSettings.trimSettings);

        updateTrimSettingsUI(settings.masterSettings.trimSettings);
    }
}

// Observer for Project Channel Names
function updateProjectChannelNamesObserver(settings) {
    console.log("[observers] updateProjectChannelNamesObserver called with:", settings)
    if (settings && settings.masterSettings && settings.masterSettings.projectChannelNames) {
        console.log("Updating Project channel Names UI:", settings.masterSettings.projectChannelNames);

        settings.masterSettings.projectChannelNames.forEach((name, index) => {
            const channelLabel = document.querySelector(`#channel-name-${index}`);
            if (channelLabel) {
                channelLabel.textContent = name || 'Default Channel Name'; // Use a default name if empty
            }
        });
    }
}

// Observer for Project Sequences
function updateProjectSequencesObserver(settings) {
    console.log("[observers] updateProjectSequencesObserver called with:", settings)
    if (settings && settings.masterSettings && settings.masterSettings.projectSequences) {
        console.log("Updating Project Sequences UI:", settings.masterSettings.projectSequences);

         updateProjectSequencesUI(settings.masterSettings.projectSequences);
    }
}

// Register all observers
function registerObservers() {
    console.log("[observers] registerObservers called")
    if (window.unifiedSequencerSettings) {
        window.unifiedSequencerSettings.addObserver(updateProjectNameObserver);
        window.unifiedSequencerSettings.addObserver(updateBPMObserver);
        window.unifiedSequencerSettings.addObserver(updateProjectURLsObserver);
        window.unifiedSequencerSettings.addObserver(updateTrimSettingsObserver);
        window.unifiedSequencerSettings.addObserver(updateProjectChannelNamesObserver);
        window.unifiedSequencerSettings.addObserver(updateProjectSequencesObserver);
        window.unifiedSequencerSettings.addObserver(updateCurrentSequenceObserver);
        window.unifiedSequencerSettings.addObserver(updateTotalSequencesObserver);
    } else {
        console.error("UnifiedSequencerSettings instance not found.");
    }
}

function updateCurrentSequenceObserver(settings) {
    console.log("[Observer] updateCurrentSequenceObserver called with:", settings)
    if (settings && settings.masterSettings && typeof settings.masterSettings.currentSequence === 'number') {
        console.log("[Observer] Current Sequence changed:", settings.masterSettings.currentSequence);
    }
}


function updateTotalSequencesObserver(settings) {
    console.log("[Observer] updateTotalSequencesObserver called with:", settings)
    if (settings && settings.masterSettings && Array.isArray(settings.masterSettings.projectSequences)) {
        console.log("[Observer] Total number of Sequences changed:", settings.masterSettings.projectSequences.length);
    }
}




// Call registerObservers on script load
registerObservers();
