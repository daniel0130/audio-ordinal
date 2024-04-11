// globalObjectClass.js

class UnifiedSequencerSettings {
    constructor() {
        this.observers = [];

        this.settings = {
            masterSettings: {
                projectName: 'New Audx Project', // Set the project name placeholder
                projectBPM: 120,
                currentSequence: 0, // Initialize with a default value
                channelURLs: new Array(16).fill(''), // Initialize with empty strings or appropriate defaults

                // projectURLs: new Array(16).fill(''), 
                trimSettings: Array.from({ length: 16 }, () => ({
                    start: 0.01,
                    end: 100.00,
                    length: 0
                })),
                projectChannelNames: new Array(16).fill(''), // Placeholder for channel names
                projectSequences: this.initializeSequences(16, 16, 64) // Adjust dimensions as needed
            }
            
        };


        // Bind methods
            this.checkSettings = this.checkSettings.bind(this);
            this.clearMasterSettings = this.clearMasterSettings.bind(this);
        }

        initializeSequences(numSequences, numChannels, numSteps) {
            console.log("initializeSequences entered", numSequences, numChannels, numSteps);
            
            let sequenceData = {};
            for (let seq = 0; seq < numSequences; seq++) {
                sequenceData[`Sequence${seq}`] = this.initializeChannels(numChannels, numSteps);
            }
            return sequenceData;
        }
        
        initializeChannels(numChannels, numSteps) {
            let channels = {};
            for (let ch = 0; ch < numChannels; ch++) {
                // In globalObjectClass.js, within initializeChannels or similar method
                channels[`ch${ch}`] = {
                    steps: Array.from({ length: numSteps }, () => [false, false]), // [isActive, isReverse]
                    mute: false,
                    url: ''
                };
            }
            return channels;
        }

        getStepStateAndReverse(currentSequence, channelIndex, stepIndex) {
            console.log("getStepStateAndReverse entered");
            const sequence = this.settings.masterSettings.projectSequences[`Sequence${currentSequence}`];
            const channel = sequence && sequence[`ch${channelIndex}`];
            if (channel && stepIndex < channel.steps.length) {
                let step = channel.steps[stepIndex];
                // Check if step is in the old boolean format and convert it to the new array format on-the-fly
                if (typeof step === 'boolean') {
                    step = [step, false]; // Convert to array format: [isActive, isReverse]
                }
                const [isActive, isReverse] = step;
                return { isActive, isReverse };
            } else {
                console.error('Invalid sequence, channel, or step index in getStepStateAndReverse');
                return { isActive: false, isReverse: false };
            }
        }
        
        
        updateStepState(currentSequence, channelIndex, stepIndex, state) {
            console.log("updateStepState entered");
            if (channelIndex < 1) {
                console.log(`[updateStepState] Called with Sequence: ${currentSequence}, Channel: ${channelIndex}, Step: ${stepIndex}, State: ${state}`);
            }
            // Check if state is an array to maintain compatibility with new structure.
            const existingStepState = this.getStepStateAndReverse(currentSequence, channelIndex, stepIndex);
            // If state is true or false, it's a simple activation/deactivation without reverse info.
            if (typeof state === 'boolean') {
                this.updateStepStateAndReverse(currentSequence, channelIndex, stepIndex, state, existingStepState.isReverse);
            } else {
                console.error('Invalid state type in updateStepState');
            }
        }

        getStepState(currentSequence, channelIndex, stepIndex) {
            console.log("getStepState entered");
            if (channelIndex < 1) {
                console.log(`[getStepState] Called with Sequence: ${currentSequence}, Channel: ${channelIndex}, Step: ${stepIndex}`);
            }
            const stepInfo = this.getStepStateAndReverse(currentSequence, channelIndex, stepIndex);
            if (stepInfo) {
                // Return only the isActive part for backward compatibility.
                return stepInfo.isActive;
            } else {
                console.error('Invalid sequence, channel, or step index in getStepState');
                return false;
            }
        }

     
        
        
      
        toggleStepState(sequenceIndex, channelIndex, stepIndex) {
            // Assuming the sequence and channel indexes are already validated
            let step = this.settings.masterSettings.projectSequences[`Sequence${sequenceIndex}`][`ch${channelIndex}`].steps[stepIndex];
            if (!Array.isArray(step)) step = [false, false]; // Initialize if not already an array
            step[0] = !step[0]; // Toggle the active state
            this.settings.masterSettings.projectSequences[`Sequence${sequenceIndex}`][`ch${channelIndex}`].steps[stepIndex] = step;
    
            // Notify observers of the change
            this.notifyObservers();
        }
    
        toggleStepReverseState(sequenceIndex, channelIndex, stepIndex) {
            let step = this.settings.masterSettings.projectSequences[`Sequence${sequenceIndex}`][`ch${channelIndex}`].steps[stepIndex];
            if (!Array.isArray(step)) step = [false, false]; // Initialize if not already an array
            step[1] = !step[1]; // Toggle the reverse state
            this.settings.masterSettings.projectSequences[`Sequence${sequenceIndex}`][`ch${channelIndex}`].steps[stepIndex] = step;
    
            // Notify observers of the change
            this.notifyObservers();
        }


       
        updateStepStateAndReverse(currentSequence, channelIndex, stepIndex, isActive, isReverse) {
            const sequence = this.settings.masterSettings.projectSequences[`Sequence${currentSequence}`];
            const channel = sequence && sequence[`ch${channelIndex}`];
            if (channel && stepIndex < channel.steps.length) {
                channel.steps[stepIndex] = [isActive, isReverse];
                console.log(`Step at Seq: ${currentSequence}, Ch: ${channelIndex}, Step: ${stepIndex} updated to Active: ${isActive}, Reverse: ${isReverse}`);
            } else {
                console.error('Invalid sequence, channel, or step index in updateStepStateAndReverse');
            }
        }
        
        
        
      
    
    exportSettings() {
        const settingsClone = JSON.parse(JSON.stringify(this.settings.masterSettings));
        settingsClone.currentSequence = 0;
    
        for (let sequenceKey in settingsClone.projectSequences) {
            const sequence = settingsClone.projectSequences[sequenceKey];
            for (let channelKey in sequence) {
                const channel = sequence[channelKey];
                const activeSteps = [];
                channel.steps.forEach((step, index) => {
                    if (step[0]) { // If step is active
                        if (step.length > 1 && step[1]) {
                            // Log details about the step being saved with reverse playback
                            console.log(`[exportSettings] Saving step with reverse: Sequence ${sequenceKey}, Channel ${channelKey}, Step ${index + 1}`);
                            activeSteps.push({ index: index + 1, reverse: step[1] });
                        } else {
                            activeSteps.push(index + 1);
                        }
                    }
                });
                channel.steps = activeSteps;
            }
        }
    
        const exportedSettings = JSON.stringify(settingsClone);
        console.log("[exportSettings] Exported Settings:", exportedSettings);
        return exportedSettings;
    }
    
    
    loadSettings(jsonSettings) {
        console.log("[internalPresetDebug] loadSettings entered");
        try {
            // First, clear the current project settings to ensure a clean state
            this.clearMasterSettings();
    
            console.log("[internalPresetDebug] Received JSON Settings:", jsonSettings);
            const parsedSettings = typeof jsonSettings === 'string' ? JSON.parse(jsonSettings) : jsonSettings;
            console.log("[internalPresetDebug] Parsed Settings:", parsedSettings);
    
            // Reset to sequence zero for a clean start
            this.settings.masterSettings.currentSequence = 0;
    
            // Apply the basic settings directly
            this.settings.masterSettings.projectName = parsedSettings.projectName;
            this.settings.masterSettings.projectBPM = parsedSettings.projectBPM;
            
            // Process and apply channel URLs with proper formatting
            if (parsedSettings.channelURLs) {
                for (let i = 0; i < parsedSettings.channelURLs.length; i++) {
                    this.settings.masterSettings.channelURLs[i] = formatURL(parsedSettings.channelURLs[i]);
                }
            }
            
            // Directly assign trim settings and channel names
            this.settings.masterSettings.trimSettings = parsedSettings.trimSettings;
            this.settings.masterSettings.projectChannelNames = parsedSettings.projectChannelNames;
    
            // Deserialize and apply project sequences step settings
            if (parsedSettings.projectSequences) {
                Object.keys(parsedSettings.projectSequences).forEach(sequenceKey => {
                    let sequence = parsedSettings.projectSequences[sequenceKey];
                    Object.keys(sequence).forEach(channelKey => {
                        let channel = sequence[channelKey];
                        let steps = new Array(64).fill([false, false]); // Initialize with the new steps structure
                        channel.steps.forEach(stepData => {
                            // Check if stepData is an object (for reverse settings) or just an index (for active steps)
                            if (typeof stepData === 'object' && stepData.index) {
                                const index = stepData.index - 1; // Adjusting for zero-based indexing
                                steps[index] = [true, stepData.reverse || false];
                                     // Log step reconstitution details, especially for reverse playback
                            console.log(`[loadSettings] Loading step with reverse: Sequence ${sequenceKey}, Channel ${channelKey}, Step ${index + 1}, Reverse: ${stepData.reverse}`);
                       
                            } else if (typeof stepData === 'number') {
                                const index = stepData - 1; // Adjusting for zero-based indexing
                                steps[index] = [true, false]; // Mark as active, no reverse
                            }
                        });
                        // Directly assign deserialized steps to the appropriate sequence and channel
                        this.settings.masterSettings.projectSequences[sequenceKey][channelKey].steps = steps;
                    });
                });
            }

    
            console.log("[internalPresetDebug] Master settings after update:", this.settings.masterSettings);
    
            // Update UI elements based on the new settings
            this.updateAllLoadSampleButtonTexts();
            // Notify observers to reflect changes in the UI and other dependent components
            this.notifyObservers();
    
            // Additionally, ensure that the UI is updated to reflect the reset to sequence zero.
            this.updateUIForSequenceZero();
            
        } catch (error) {
            console.error('[internalPresetDebug] Error loading settings:', error);
        }
    }
    
    

    initializeTrimSettings(numSettings) {
        console.log("initializeTrimSettings entered");
        if (channelIndex < 1) {
        console.log("initializeTrimSettings", numSettings);
        }
        return Array.from({ length: numSettings }, () => ({
            start: 0,
            end: 100,
            length: 0
        }));
    }

    updateTrimSettingsUI(trimSettings) {
        // Implement logic to update UI for trim settings
        console.log("Trim settings UI entered and updated:", trimSettings);
        // Example: Update each trim setting input field
        trimSettings.forEach((setting, index) => {
            const startSlider = document.getElementById(`start-slider-${index}`);
            const endSlider = document.getElementById(`end-slider-${index}`);
            if (startSlider && endSlider) {
                startSlider.value = setting.start;
                endSlider.value = setting.end;
            }
        });
    }


    // Method to register an observer
    addObserver(observerFunction) {
     
        console.log("addObserver", observerFunction);
        
        this.observers.push(observerFunction);
    }

    // Method to notify all observers
    notifyObservers() {
   
        console.log('[SequenceChangeDebug] Notifying observers of changes.');        
        this.observers.forEach(observerFunction => observerFunction(this.settings));
    }

    setTrimSettings(channelIndex, start, end) {
        console.log("setTrimSettings entered");
        if (channelIndex < 1) {
            console.log("setTrimSettings", channelIndex, start, end);
        }
        if (this.isValidIndex(channelIndex)) {
            const currentSettings = this.settings.masterSettings.trimSettings[channelIndex];
            if (currentSettings) {
                Object.assign(currentSettings, { start, end });
            } else {
                console.error(`Trim settings not found for channel index: ${channelIndex}`);
            }
        } else {
            console.error(`Invalid channel index: ${channelIndex}`);
        }
    }
    
    getTrimSettings(channelIndex) {
        console.log("getTrimSettings entered");
        const trimSettings = this.settings.masterSettings.trimSettings[channelIndex];
        // Ensure there are always valid default values
        return trimSettings || { start: 0, end: 1 }; // Use 0 and 1 (100%) as defaults if necessary
      }
      

    updateTrimSettingsUI(trimSettings) {
        console.log("updateTrimSettingsUI entered", trimSettings);
        // Implement logic to update UI for trim settings
        console.log("Trim settings UI updated:", trimSettings);
        // Example: Update each trim setting input field
        trimSettings.forEach((setting, index) => {
            const startSlider = document.getElementById(`start-slider-${index}`);
            const endSlider = document.getElementById(`end-slider-${index}`);
            if (startSlider && endSlider) {
                startSlider.value = setting.start;
                endSlider.value = setting.end;
            }
        });
    }


      
        
        
            isValidIndex(index) {
                    console.log("isValidIndex entered");
                return index >= 0 && index < 16; // Directly checking against 16
            }
    
          
        
            updateUIForSequenceZero() {
                console.log("UI updated for sequence zero.");
            
                // Assuming you have a way to select the current sequence UI element
                const sequenceSelector = document.querySelector('.current-sequence-selector');
                if (sequenceSelector) {
                    sequenceSelector.value = 'Sequence0'; // Or however your sequence selector is structured
                }
            
                // Reset step buttons to their default state for sequence zero
                const channels = document.querySelectorAll('.channel');
                channels.forEach((channel, channelIndex) => {
                    const stepButtons = channel.querySelectorAll('.step-button');
                    stepButtons.forEach((button, stepIndex) => {
                        const stepState = this.getStepState(0, channelIndex, stepIndex);
                        if (stepState) {
                            button.classList.add('selected');
                        } else {
                            button.classList.remove('selected');
                        }
                    });
                });
            }
            

            // Corrected to accept a parameter for the current sequence index
        updateUIForSequence(currentSequenceIndex) {
            console.log("[Debug] Updating UI for Sequence:", currentSequenceIndex);

            // Dynamically setting the selector to match the current sequence
            const sequenceSelector = document.querySelector('.current-sequence-selector');
            if (sequenceSelector) {
                // Update to dynamically set the value based on currentSequenceIndex
                sequenceSelector.value = `Sequence${currentSequenceIndex}`;
            }
            
            // Reset step buttons to their default state for the current sequence
            const channels = document.querySelectorAll('.channel');
            channels.forEach((channel, channelIndex) => {
                const stepButtons = channel.querySelectorAll('.step-button');
                stepButtons.forEach((button, stepIndex) => {
                    // Corrected to use currentSequenceIndex instead of hardcoding to 0
                    const stepState = this.getStepState(currentSequenceIndex, channelIndex, stepIndex);
                    if (stepState) {
                        button.classList.add('selected');
                    } else {
                        button.classList.remove('selected');
                    }
                });
            });
        }

            


        // Method to add a URL to the channelURLs array
        addChannelURL(index, url) {
            if (index >= 0 && index < this.settings.masterSettings.channelURLs.length) {
                console.log(`[addChannelURL] Adding URL to channel ${index}: ${url}`);
                this.settings.masterSettings.channelURLs[index] = url;
                this.notifyObservers(); // Notify observers about the change, if necessary
            } else {
                console.error(`[addChannelURL] Invalid channel index: ${index}`);
            }
        }

        // Helper function to retrieve a URL from the channelURLs array
        getChannelURL(index) {
            if (index >= 0 && index < this.settings.masterSettings.channelURLs.length) {
                console.log(`[getChannelURL] Retrieving URL from channel ${index}: ${this.settings.masterSettings.channelURLs[index]}`);
                return this.settings.masterSettings.channelURLs[index];
            } else {
                console.error(`[getChannelURL] Invalid channel index: ${index}`);
                return null; // or throw an error as per your application's requirements
            }
        }



    getprojectUrlforChannel(channelIndex) {
        console.log("getprojectUrlforChannel entered");
        return this.settings.masterSettings.channelURLs[channelIndex];
    }

    setChannelURLs(urls) {
        console.log("setChannel entered");
        this.settings.masterSettings.channelURLs = urls;
        console.log(`[setChannelURLs] Channel URLs set:`, urls);
    
        // Correctly calling the method within the same class
        this.updateAllLoadSampleButtonTexts();
    }

    setProjectName(name) {
        console.log("setProjectName entered");
        this.settings.masterSettings.projectName = name;
        console.log(`[setProjectName] Project name set to: ${name}`);
    }

     

        clearMasterSettings() {
            console.log("[clearMasterSettings] Current masterSettings before clearing:", this.settings.masterSettings);

            this.settings.masterSettings = {
                projectName: '',
                projectBPM: 120,
                currentSequence: 0, // Initialize with a default value
                channelURLs: new Array(16).fill(''), // Initialize with empty strings or appropriate defaults

                // projectURLs: new Array(16).fill(''),
                trimSettings: Array.from({ length: 16 }, () => ({
                    start: 0.01,
                    end: 100.00,
                    length: 0
                })),
                projectChannelNames: new Array(16).fill(''),
                projectSequences: this.initializeSequences(16, 16, 64)
            };
            console.log("[clearMasterSettings] Master settings cleared.");
        }




    // Example of a method that changes settings
    setProjectName(channelIndex, name) {
        console.log("setProjectName entered");
        if (channelIndex < 1) {
        console.log("setProjectName", channelIndex, name);
        }
        this.settings.masterSettings.projectName[channelIndex] = name;
        this.notifyObservers(); // Notify observers about the change
    }

    // Method to update the current sequence
    setCurrentSequence(currentSequence) {
        console.log('[SequenceChangeDebug] setCurrentSequence called with sequence:', currentSequence);
        
        this.settings.masterSettings.currentSequence = currentSequence;
        console.log(`[SequenceChangeDebug] [setCurrentSequence] currentSequence set to: ${currentSequence}`);
        console.log(`[SequenceChangeDebug] [setCurrentSequence] Object currentSequence set to: ${this.settings.masterSettings.currentSequence}`);
        if (this.settings.masterSettings.currentSequence !== currentSequence) {
            this.settings.masterSettings.currentSequence = currentSequence;
            this.notifyObservers();
        }
    }

    // Method to get the current sequence
    getCurrentSequence() {
        console.log("getCurrentSequence entered");
        return this.settings.masterSettings.currentSequence;
    }

    getSequenceSettings(sequenceIndex) {
        console.log("getSequenceSettings entered");
        const sequenceKey = `Sequence${sequenceIndex}`;
        return this.settings.masterSettings.projectSequences[sequenceKey];
    }

    setSequenceSettings(sequenceIndex, sequenceSettings) {
        console.log("setSequenceSettings entered");
        const sequenceKey = `Sequence${sequenceIndex}`;
        this.settings.masterSettings.projectSequences[sequenceKey] = sequenceSettings;
    }
    


    getSettings(key) {
    
        console.log("getSettings entered", key);
        
        if (key === 'masterSettings') {
            console.log("[getSettings] Retrieved all masterSettings:", this.settings.masterSettings);
            return this.settings.masterSettings;
        } else if (key) {
            const settingValue = this.settings.masterSettings[key];
            console.log(`[getSettings] Retrieved setting for key '${key}':`, settingValue);
            return settingValue;
        } else {
            console.log("[getSettings] Retrieved all settings:", this.settings);
            return this.settings;
        }
    }

    // Nested function for manual checking
    checkSettings() {
        console.log("checkSettings entered");
        
        console.log("[checkSettings] Current masterSettings:", this.settings.masterSettings);
        return this.settings.masterSettings;
    }

   
    updateProjectSequencesUI() {
        console.log("updateProjectSequencesUI entered");
        if (channelIndex < 1) {
        console.log("updateProjectSequencesUI");
        }
        const projectSequences = this.getSettings('projectSequences');
        // Assuming you have a method to update the UI for each sequence
        projectSequences.forEach((sequence, index) => {
            updateSequenceUI(index, sequence);
        });
    }

    

    updateSetting(key, value, channelIndex = null) {
        console.log("updateSetting entered");
        if (channelIndex < 1) {
        console.log(`[updateSetting] Called with key: ${key}, value: ${value}, channelIndex: ${channelIndex}`);
        }
        if (channelIndex !== null && Array.isArray(this.settings.masterSettings[key])) {
            this.settings.masterSettings[key][channelIndex] = value;
        } else if (key in this.settings.masterSettings) {
            this.settings.masterSettings[key] = value;
        } else {
            console.error(`Setting ${key} does not exist in masterSettings`);
        }
    }

    updateSampleDuration(duration, channelIndex) {
        console.log("updateSampleDuration entered");
        if (channelIndex < 1) {
            console.log(`[updateSampleDuration] Called with duration: ${duration}, channelIndex: ${channelIndex}`);
        }
        if (this.isValidIndex(channelIndex)) {
            this.settings.masterSettings.trimSettings[channelIndex].length = duration;
        } else {
            console.error(`Invalid channel index: ${channelIndex}`);
        }
    }

    getBPM() {
        return this.settings.masterSettings.projectBPM;
    }

    setBPM(newBPM) {
        this.settings.masterSettings.projectBPM = newBPM;
    }

    
    // setTrimSettings(settings) {
    //     this.settings.masterSettings.trimSettings = settings;
    //     console.log(`[setTrimSettings] Trim settings set:`, settings);
    // }

        // Method to update the name of a specific channel
/**
 * Updates the name of a specific project channel and notifies observers of the change.
 * @param {number} channelIndex - The index of the channel to update.
 * @param {string} name - The new name for the channel.
 * @returns {boolean} Indicates whether the update was successful.
 */
        setProjectChannelName(channelIndex, name) {
            console.log("setProjectChannelName entered");
            if (this.isValidIndex(channelIndex)) {
                if (this.settings.masterSettings.projectChannelNames[channelIndex] !== name) {
                    this.settings.masterSettings.projectChannelNames[channelIndex] = name;
                    console.log(`[setChannelName] Channel ${channelIndex} name set to: ${name}`);
                    this.notifyObservers(); // Notify observers about the change
                    return true; // Indicate success
                } else {
                    console.log(`[setChannelName] No change for channel ${channelIndex}. Name remains: ${name}`);
                    return false; // Indicate no change was made
                }
            } else {
                console.error(`[setChannelName] Invalid channel index: ${channelIndex}`);
                return false; // Indicate failure due to invalid index
            }
        }

        


    setProjectSequences(sequenceData) {
        console.log("setProjectSequences entered");
        this.settings.masterSettings.projectSequences = sequenceData;
        console.log(`[setProjectSequences] Project sequences set:`, sequenceData);
        console.log ('[setProjectSequences] currentSequence set to:', this.settings.masterSettings.currentSequence)
    }


  
    
        
        // Helper function to ensure array length
        ensureArrayLength(array, length, defaultValue) {
            console.log("ensureArrayLength entered");
            while (array.length < length) {
                array.push(defaultValue);
            }
        }
            
    
        updateAllLoadSampleButtonTexts() {
            console.log("updateAllLoadSampleButtonTexts entered");
            const channels = document.querySelectorAll('.channel');
            channels.forEach((channel, index) => {
                const loadSampleButton = channel.querySelector('.load-sample-button');
                if (loadSampleButton) {
                    // Use an arrow function to maintain 'this' context
                    (() => {
                        this.updateLoadSampleButtonText(index, loadSampleButton);
                    })();
                }
            });
        }
    
    
    updateLoadSampleButtonText(channelIndex, button) {
        console.log("updateLoadSampleButtonText entered");
        let buttonText = 'Load New Audional'; // Default text
    
        // Accessing projectChannelNames and channelURLs from settings
        const channelName = this.settings.masterSettings.projectChannelNames[channelIndex];
        const loadedUrl = this.settings.masterSettings.channelURLs[channelIndex];
    
        if (channelName) {
            buttonText = channelName;
        } else if (loadedUrl) {
            // Extract the desired portion of the URL
            const urlParts = loadedUrl.split('/');
            const lastPart = urlParts[urlParts.length - 1];
            buttonText = lastPart;
        }
    
        // Update button text
        button.textContent = buttonText;
    }


    // Additional methods for updating UI
    updateProjectNameUI(projectName) {
        console.log("Project name UI entered and updated:", projectName);
        const projectNameInput = document.getElementById('project-name');
        if (projectNameInput) {
            projectNameInput.value = projectName || "AUDX Project";
            console.log("Project name UI updated:", projectName);
        }
    }

    updateBPMUI(bpm) {
        const bpmSlider = document.getElementById('bpm-slider');
        const bpmDisplay = document.getElementById('bpm-display');
        if (bpmSlider && bpmDisplay) {
            bpmSlider.value = bpm;
            bpmDisplay.textContent = bpm;
            console.log("BPM UI updated:", bpm);
        }
    }

    updateChannelURLsUI(urls) {
        // Implement logic to update UI for project URLs
        console.log("Project URLs UI entered and updated:", urls);
        // Example: Update each URL input field
        urls.forEach((url, index) => {
            const urlInput = document.getElementById(`url-input-${index}`);
            if (urlInput) {
                urlInput.value = url;
            }
        });
    }


    updateProjectChannelNamesUI(urlNames) {
        // Implement logic to update UI for project URL names
        console.log("Project URL names UI entered and updated:", urlNames);
        // Example: Update each URL name display
        urlNames.forEach((name, index) => {
            const nameDisplay = document.getElementById(`url-name-${index}`);
            if (nameDisplay) {
                nameDisplay.textContent = name;
            }
        });
    }

    ensureArrayLength(array, maxLength) {
        while (array.length < maxLength) {
            array.push(this.getDefaultArrayElement());
        }
    }
    
    getDefaultArrayElement() {
        // Return the default element structure
        // For example, for trimSettings:
        return { start: 0.01, end: 100.00, length: 0 };
    }
    
   
    
}



window.unifiedSequencerSettings = new UnifiedSequencerSettings();
