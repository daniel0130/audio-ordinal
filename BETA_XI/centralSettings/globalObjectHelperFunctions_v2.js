// globalObjectHelperFunctions_v2.js

// 

let isModalOpen = false;

function openModal() {
    isModalOpen = true;
    // Code to open the modal
}

function closeModal() {
    isModalOpen = false;
    // Code to close the modal
}



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



function setGlobalChannelURLs(urls) {
    console.log("debugGlobalObjectToUI - entered");
    window.unifiedSequencerSettings.setChannelURLs(urls);
}

// 
// 
// // Utility Functions
// 
function updateSpecificStepUI(currentSequence, channelIndex, stepIndex) {
    console.log("debugGlobalObjectToUI - entered");
    const stepButtonId = `Sequence${currentSequence}-ch${channelIndex}-step-${stepIndex}`;
    console.log(`Looking for step button with ID: ${stepButtonId}`);

    const stepButton = document.getElementById(stepButtonId);

    if (stepButton) {
        let currentStepState = window.unifiedSequencerSettings.getStepState(currentSequence, channelIndex, stepIndex);
        if (currentStepState) {
            stepButton.classList.add('selected');
        } else {
            stepButton.classList.remove('selected');
        }
    } else {
        console.error(`Step button not found for the given IDs: ${stepButtonId}`);
    }
}



function getProjectSequences() {
    console.log("debugGlobalObjectToUI - entered");
    return window.unifiedSequencerSettings.getSettings('projectSequences');
}

function getTrimSettings(channelIndex) {
    console.log("debugGlobalObjectToUI - entered");
    return window.unifiedSequencerSettings.getTrimSettings(channelIndex);
}

function setTrimSettings(channelIndex, startSliderValue, endSliderValue) {
    if (typeof startSliderValue !== 'number' || typeof endSliderValue !== 'number') {
        console.error('Invalid trim settings values');
        return;
    }

    console.log(`Setting trim settings for channel ${channelIndex}: start = ${startSliderValue}, end = ${endSliderValue}`);
    window.unifiedSequencerSettings.setTrimSettings(channelIndex, startSliderValue, endSliderValue);

    // Ensure the trim settings UI is updated to reflect changes
    const trimSettings = window.unifiedSequencerSettings.getTrimSettings(channelIndex);
    updateTrimSettingsUI([trimSettings]);
}


// Update function with modal state check
function updateTrimSettingsUI(trimSettings) {
    if (!isModalOpen) {
        console.log("Modal is not open, skipping updateTrimSettingsUI");
        return;
    }

    console.log("debugGlobalObjectToUI - entered");
    console.log("{debugGlobalObjectToUI} updateTrimSettingsUI: updating with trimSettings", trimSettings);

    trimSettings.forEach((setting, index) => {
        const startSlider = document.getElementById(`start-slider-${index}`);
        const endSlider = document.getElementById(`end-slider-${index}`);

        if (startSlider && endSlider) {
            startSlider.value = setting.startSliderValue;
            endSlider.value = setting.endSliderValue;

            // Log details about the sliders and settings
            console.log(`Sliders found for index ${index}. Setting values:`);
            console.log(`Start Slider: Element ID: start-slider-${index}, Value: ${startSlider.value}`);
            console.log(`End Slider: Element ID: end-slider-${index}, Value: ${endSlider.value}`);
        } else {
            // Use the throttled warning function
            console.warn(`Sliders not found for index ${index}. Start: ${setting.startSliderValue}, End: ${setting.endSliderValue}`);
            if (!document.getElementById(`start-slider-${index}`)) {
                console.warn(`Start slider (start-slider-${index}) not found in DOM.`);
            }
            if (!document.getElementById(`end-slider-${index}`)) {
                console.warn(`End slider (end-slider-${index}) not found in DOM.`);
            }
        }
    });

    // Additional check to verify if trimSettings has all necessary values
    trimSettings.forEach((setting, index) => {
        if (typeof setting.startSliderValue !== 'number' || typeof setting.endSliderValue !== 'number') {
            console.error(`Invalid slider values for index ${index}. Start: ${setting.startSliderValue}, End: ${setting.endSliderValue}`);
        } else {
            console.log(`Valid slider values for index ${index}. Start: ${setting.startSliderValue}, End: ${setting.endSliderValue}`);
        }
    });
}

// Throttle function to limit the frequency of updates
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

// Throttled update function
const throttledUpdateTrimSettingsUI = throttle((trimSettings) => {
    updateTrimSettingsUI(trimSettings);
}, 1000); // 1 second throttle limit

// // Event listeners for modal open and close
// document.getElementById('openModalButton').addEventListener('click', openModal);
// document.getElementById('closeModalButton').addEventListener('click', closeModal);





function updateProjectSequencesUI(sequenceData) {
    console.log("debugGlobalObjectToUI - entered");
    console.log("{debugGlobalObjectToUI} [updateProjectSequencesUI] updateProjectSequencesUI: updating with sequences", sequenceData);

    // Log the total number of sequences being processed
    const numSequences = Object.keys(sequenceData).length;
    console.log(`[updateProjectSequencesUI] Total sequences to process: ${numSequences}`);

    Object.keys(sequenceData).forEach(sequenceKey => {
        const sequence = sequenceData[sequenceKey];
        console.log(`[updateProjectSequencesUI] Processing sequence: ${sequenceKey}`);

        Object.keys(sequence).forEach(channelKey => {
            const steps = sequence[channelKey].steps;
            if (Array.isArray(steps)) {
                steps.forEach((step, index) => {
                    const stepControlId = `${sequenceKey}-${channelKey}-step-${index}`;
                    const stepControl = document.getElementById(stepControlId);
                    if (stepControl) {
                        if (step.isActive) {
                            stepControl.classList.add('selected');
                        } else {
                            stepControl.classList.remove('selected');
                        }
                    }
                });
            } else {
                console.log(`[updateProjectSequencesUI] Steps data for channel ${channelKey} in sequence ${sequenceKey} is not an array`);
            }
        });
    });
}







// 

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

// document.addEventListener('DOMContentLoaded', () => {
//     // Assuming there are 16 sequences and 16 channels per sequence
//     for (let seq = 0; seq < 16; seq++) {
//         for (let ch = 0; ch < 16; ch++) {
//             // Find or create a container for each channel's steps
//             let channelStepsContainer = document.querySelector(`#channel-${ch}-steps-container`);
//             if (!channelStepsContainer) {
//                 channelStepsContainer = document.createElement('div');
//                 channelStepsContainer.id = `channel-${ch}-steps-container`;
//                 channelStepsContainer.classList.add('steps-container');
//                 // Append the container to the appropriate place in the DOM
//                 // (This needs to be adjusted based on your actual DOM structure)
//                 document.body.appendChild(channelStepsContainer);
//             }

//             // Clear any existing buttons
//             channelStepsContainer.innerHTML = '';

//             // Create step buttons for each step in the channel
//             for (let step = 0; step < 64; step++) {
//                 const button = document.createElement('button');
//                 button.classList.add('step-button');

//                 // Assign an ID to the button based on sequence, channel, and step index
//                 button.id = `Sequence${seq}-ch${ch}-step-${step}`;

//                 button.addEventListener('click', () => {
//                     // Toggle the step state in the global object
//                     let currentStepState = window.unifiedSequencerSettings.getStepState(seq, ch, step);
//                     console.log(`[updateSpecificStepUI] [getStepState applied] Step button clicked: Sequence ${seq}, Channel ${ch}, Step ${step}, Current State: ${currentStepState}`);
//                     window.unifiedSequencerSettings.updateStepState(seq, ch, step, !currentStepState);

//                     console.log(`[updateSpecificStepUI] Step button clicked: Sequence ${seq}, Channel ${ch}, Step ${step}, New State: ${!currentStepState}`);

//                     // Update the UI for the specific step
//                     updateSpecificStepUI(seq, ch, step);
//                 });

//                 channelStepsContainer.appendChild(button);
//             }
//         }
//     }
// });



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


// function updateProjectURLsUI(urls) {
//     console.log("debugGlobalObjectToUI - entered");
//     console.log("{debugGlobalObjectToUI} updateProjectURLsUI: updating with URLs", urls);

//     urls.forEach((url, index) => {
//         const urlButton = document.getElementById(`load-sample-button-${index}`);
//         if (urlButton) {
//             urlButton.textContent = url || 'Load New Audional'; // Default text if URL is empty
//         }
//     });

//     console.log("Project URLs UI updated:", urls);
// }

// Helper function to get the project URL for a channel