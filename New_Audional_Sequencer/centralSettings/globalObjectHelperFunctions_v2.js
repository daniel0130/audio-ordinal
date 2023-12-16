// globalObjectHelperFunctions_v2.js

function updateProjectURLsUI(urls) {
    console.log("debugGlobalObjectToUI - entered");
    console.log("{debugGlobalObjectToUI} updateProjectURLsUI: updating with URLs", urls);

    urls.forEach((url, index) => {
        const urlButton = document.getElementById(`load-sample-button-${index}`);
        if (urlButton) {
            urlButton.textContent = url || 'Load New Audional'; // Default text if URL is empty
        }
    });

    console.log("Project URLs UI updated:", urls);
}

// Helper function to get the project URL for a channel
function getProjectUrlForChannel(channelIndex) {
    cons
    return window.unifiedSequencerSettings.getprojectUrlforChannel(channelIndex);
}

// 
function updateTrimSettingsUI(trimSettings) {
    console.log("debugGlobalObjectToUI - entered");
    console.log("{debugGlobalObjectToUI} updateTrimSettingsUI: updating with trimSettings", trimSettings);

    // Implement logic to update UI for trim settings
    console.log("Trim settings UI updated:", trimSettings);
    // Example: Update each trim setting input field
    trimSettings.forEach((setting, index) => {
        const startSlider = document.getElementById(`start-slider-${index}`);
        const endSlider = document.getElementById(`end-slider-${index}`);
        if (startSlider && endSlider) {
            startSlider.value = setting.startSliderValue;
            endSlider.value = setting.endSliderValue;
        }
    });
}
// 
function updateProjectChannelNamesUI(urlNames) {
    console.log("debugGlobalObjectToUI - entered");
    console.log("{debugGlobalObjectToUI} updateProjectChannelNamesUI: updating with URL names", urlNames); 
    // Implement logic to update UI for project URL names
    console.log("Project URL names UI updated:", urlNames);
    // Example: Update each URL name display
    urlNames.forEach((name, index) => {
        const nameDisplay = document.getElementById(`url-name-${index}`);
        if (nameDisplay) {
            nameDisplay.textContent = name;
        }
    });
}
// 
document.addEventListener('DOMContentLoaded', () => {
    // Assuming there are 16 sequences and 16 channels per sequence
    for (let seq = 0; seq < 16; seq++) {
        for (let ch = 0; ch < 16; ch++) {
            // Find or create a container for each channel's steps
            let channelStepsContainer = document.querySelector(`#channel-${ch}-steps-container`);
            if (!channelStepsContainer) {
                channelStepsContainer = document.createElement('div');
                channelStepsContainer.id = `channel-${ch}-steps-container`;
                channelStepsContainer.classList.add('steps-container');
                // Append the container to the appropriate place in the DOM
                // (This needs to be adjusted based on your actual DOM structure)
                document.body.appendChild(channelStepsContainer);
            }

            // Clear any existing buttons
            channelStepsContainer.innerHTML = '';

            // Create step buttons for each step in the channel
            for (let step = 0; step < 64; step++) {
                const button = document.createElement('button');
                button.classList.add('step-button');

                // Assign an ID to the button based on sequence, channel, and step index
                button.id = `Sequence${seq}-ch${ch}-step-${step}`;

                button.addEventListener('click', () => {
                    // Toggle the step state in the global object
                    let currentStepState = window.unifiedSequencerSettings.getStepState(seq, ch, step);
                    console.log(`[updateSpecificStepUI] [getStepState applied] Step button clicked: Sequence ${seq}, Channel ${ch}, Step ${step}, Current State: ${currentStepState}`);
                    window.unifiedSequencerSettings.updateStepState(seq, ch, step, !currentStepState);

                    console.log(`[updateSpecificStepUI] Step button clicked: Sequence ${seq}, Channel ${ch}, Step ${step}, New State: ${!currentStepState}`);

                    // Update the UI for the specific step
                    updateSpecificStepUI(seq, ch, step);
                });

                channelStepsContainer.appendChild(button);
            }
        }
    }
});






function updateBPMUI(bpm) {
    console.log("debugGlobalObjectToUI - entered");
    const bpmSlider = document.getElementById('bpm-slider');
    const bpmDisplay = document.getElementById('bpm-display');
    if (bpmSlider && bpmDisplay) {
        bpmSlider.value = bpm;
        bpmDisplay.textContent = bpm;
    }
}

function updateProjectNameUI(projectName) {
    console.log("debugGlobalObjectToUI - entered");
    const projectNameInput = document.getElementById('project-name');
    if (projectNameInput) {
        projectNameInput.value = projectName;
    }
}
// 
// 
// // Utility Functions
// 
function updateSpecificStepUI(currentSequence, channelIndex, stepIndex) {
    console.log("debugGlobalObjectToUI - entered");
    // Use the correct ID format to match the updated step button IDs
    const stepButtonId = `Sequence${currentSequence}-ch${channelIndex}-step-${stepIndex}`;
    console.log(`Looking for step button with ID: ${stepButtonId}`);

    const stepButton = document.getElementById(stepButtonId);

    if (stepButton) {
        let currentStepState = window.unifiedSequencerSettings.getStepState(currentSequence, channelIndex, stepIndex);
        console.log(`[updateSpecificStepUI] Step button found: Sequence ${currentSequence}, Channel ${channelIndex}, Step ${stepIndex}, Current State: ${currentStepState}`);

        if (currentStepState) {
            stepButton.classList.add('selected');
            console.log(`[updateSpecificStepUI] Added 'selected' class to step button with ID: ${stepButtonId}`);
        } else {
            stepButton.classList.remove('selected');
            console.log(`[updateSpecificStepUI] Removed 'selected' class from step button with ID: ${stepButtonId}`);
        }
    } else {
        console.error(`Step button not found for the given IDs: ${stepButtonId}`);
    }
}


function getProjectSequences() {
    console.log("debugGlobalObjectToUI - entered");
    const globalObject = window.unifiedSequencerSettings; // Assuming global object is accessible via window
    return window.unifiedSequencerSettings.getSettings('projectSequences');
}
// 
// let currentChannelIndex = null; // Define at a higher scope
// 
// function updateGlobalBPM(newBPM) {
//     window.unifiedSequencerSettings.setBPM(newBPM);
//     console.log(`[updateGlobalBPM] BPM updated to: ${newBPM}`);
// }
// 
// function setGlobalProjectName(projectName) {
//     window.unifiedSequencerSettings.setProjectName(projectName);
//     console.log(`[setGlobalProjectName] Project name updated to: ${projectName}`);
// }
// 
function setGlobalProjectURLs(urls) {
    console.log("debugGlobalObjectToUI - entered");
    window.unifiedSequencerSettings.setProjectURLs(urls);
    console.log(`[setGlobalProjectURLs] Project URLs updated:`, urls);
}
// 
function setTrimSettings(channelIndex, startSliderValue, endSliderValue) {
    // Validate the input values if necessary
    if (typeof startSliderValue !== 'number' || typeof endSliderValue !== 'number') {
        console.error('Invalid trim settings values');
        return;
    }

    // Update the trim settings in the global object
    window.unifiedSequencerSettings.setTrimSettings(channelIndex, startSliderValue, endSliderValue);
    console.log(`[setGlobalTrimSettings] Trim settings updated for channel ${channelIndex}: Start Slider Value = ${startSliderValue}, End Slider Value = ${endSliderValue}`);
}

// 
// function setGlobalProjectChannelNames(urlNames) {
//     window.unifiedSequencerSettings.setProjectChannelNames(urlNames);
//     console.log(`[setGlobalProjectChannelNames] Project URL names updated:`, urlNames);
// }
// 
// function setGlobalProjectSequences(sequences) {
//     window.unifiedSequencerSettings.setProjectSequences(sequences);
//     console.log(`[setGlobalProjectSequences] Project sequences updated:`, sequences);
// }
// 
// // UI Update Functions
// 
// function updateUIFromLoadedSettings() {
// 
//     const settings = window.unifiedSequencerSettings.getSettings('masterSettings');
//     console.log("Loaded settings:", settings);
// 
//     if (!settings) {
//         console.error("Settings are not loaded or undefined.");
//         return;
//     }
// 
//     updateProjectNameUI(settings.projectName);
//     updateBPMUI(settings.projectBPM);
//     updateProjectURLsUI(settings.projectURLs);
//     updateTrimSettingsUI(settings.trimSettings);
//     updateProjectChannelNamesUI(settings.projectChannelNames);
//     updateProjectSequencesUI(settings.projectSequences);
// }


function updateProjectSequencesUI(sequenceData) {
    console.log("debugGlobalObjectToUI - entered");
    console.log("{debugGlobalObjectToUI} [updateProjectSequencesUI] updateProjectSequencesUI: updating with sequences", sequenceData);

    // Log the total number of sequences being processed
    console.log(`[updateProjectSequencesUI] Total sequences to process: ${Object.keys(sequenceData).length}`);

    Object.keys(sequenceData).forEach(sequenceKey => {
        const sequence = sequenceData[sequenceKey];
        console.log(`[updateProjectSequencesUI] Processing sequence: ${sequenceKey}`);

        Object.keys(sequence).forEach(channelKey => {
            const steps = sequence[channelKey].steps; // Corrected to directly access the steps array
            // console.log(`[updateProjectSequencesUI] Processing channel: ${channelKey} in sequence: ${sequenceKey}`);

            if (Array.isArray(steps)) {
                // console.log(`[updateProjectSequencesUI] Total steps in channel ${channelKey}: ${steps.length}`);

                steps.forEach((step, index) => {
                    // Generate ID in the format used for step buttons
                const stepControlId = `${sequenceKey}-${channelKey}-step-${index}`;
                const stepControl = document.getElementById(stepControlId);

                    // console.log(`[updateProjectSequencesUI] Processing stepControl ID: ${stepControlId}, State: ${step}`);

                    if (stepControl) {
                        if (step === true) {
                            if (!stepControl.classList.contains('selected')) {
                                // console.log(`[updateProjectSequencesUI] Adding 'selected' class to stepControl: ${stepControlId}`);
                                stepControl.classList.add('selected');
                            }
                        } else {
                            if (stepControl.classList.contains('selected')) {
                                console.log(`[updateProjectSequencesUI] Removing 'selected' class from stepControl: ${stepControlId}`);
                                stepControl.classList.remove('selected');
                            }
                        }
                    } else {
                        // console.log(`[updateProjectSequencesUI] Step control not found for ID: ${stepControlId}`);
                    }
                });
            } else {
                console.log(`[updateProjectSequencesUI] Steps data for channel ${channelKey} in sequence ${sequenceKey} is not an array`);
            }
        });
    });
}






// function reflectStepStateInUI(currentSequence, channelIndex, stepIndex) {
//     const state = window.unifiedSequencerSettings.getStepState(currentSequence, channelIndex, stepIndex);
//     const stepButtonId = `${currentSequence}-ch${channelIndex}-step-${stepIndex}`;
//     const stepButton = document.getElementById(stepButtonId);
//     
//     if (stepButton) {
//         stepButton.classList.toggle('selected', state);
//     } else {
//         console.error('Step button not found for the given IDs');
//     }
// }
// 
// function clearSettings() {
//     if (window.unifiedSequencerSettings) {
//         window.unifiedSequencerSettings.clearMasterSettings();
//         console.log("[clearSettings] Settings cleared.");
//     } else {
//         console.error("window.unifiedSequencerSettings is not defined.");
//     }
// }
// 
// function loadNewSettings(jsonSettings) {
//     if (window.unifiedSequencerSettings) {
//         window.unifiedSequencerSettings.loadSettings(jsonSettings);
//         console.log("[loadNewSettings] Loaded settings:", jsonSettings);
//         updateUIFromLoadedSettings();
//         console.log("[loadNewSettings] New settings loaded and UI updated.");
//     } else {
//         console.error("window.unifiedSequencerSettings is not defined.");
//     }
// }
// 
// // Function to save trim settings
// function setTrimSettings(channelIndex, startSliderValue, endSliderValue) {
//     window.unifiedSequencerSettings.setTrimSettingsForChannel(channelIndex, startSliderValue, endSliderValue);
// }
// 
   // Function to get trim settings
   function getTrimSettings(channelIndex) {
    console.log("debugGlobalObjectToUI - entered");
       return window.unifiedSequencerSettings.getTrimSettings(channelIndex);
   }
// 
// function setStartSliderValue(trimmer, value) {
//     trimmer.startSliderValue = value;
//     if (trimmer.startSlider) {
//         trimmer.startSlider.value = value;
//     }
// }
// 
// function setEndSliderValue(trimmer, value) {
//     trimmer.endSliderValue = value;
//     if (trimmer.endSlider) {
//         trimmer.endSlider.value = value;
//     }
// }
// 
// function setIsLooping(trimmer, isLooping) {
//     trimmer.isLooping = isLooping;
//     // Additional logic to handle the looping state if needed
// }
// 
// function setGlobalProjectName(name) {
//     window.unifiedSequencerSettings.setProjectName(name);
// }
// 
// function setGlobalProjectURLs(urls) {
//     window.unifiedSequencerSettings.setProjectURLs(urls);
// }
// 
// function setGlobalTrimSettings(settings) {
//     window.unifiedSequencerSettings.setTrimSettings(settings);
// }
// 
// function setGlobalProjectChannelNames(names) {
//     window.unifiedSequencerSettings.setProjectChannelNames);
// }
// 
// function setGlobalProjectSequences(sequences) {
//     window.unifiedSequencerSettings.setProjectSequences(sequences);
// }