class UnifiedSequencerSettings {
    constructor(audioContext, numSequences = 64, numChannels = 16) {
        this.audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        this.numSequences = numSequences;
        this.numChannels = numChannels;
        this.globalPlaybackSpeed = 1;
        this.channelPlaybackSpeed = new Array(this.numChannels).fill(1); // Default speed is normal (1x)
        this.observers = [];
        this.gainNodes = [];
        this.sourceNodes = []; // Array to hold source nodes

        this.settings = {
            masterSettings: {
                projectName: 'New Audx Project',
                artistName: '', // Initialize with default empty string
                projectBPM: 120,
                currentSequence: 0,
                channelURLs: new Array(this.numChannels).fill(''),
                channelVolume: new Array(this.numChannels).fill(0.5),
                channelPlaybackSpeed: new Array(this.numChannels).fill(1), // Default speed is normal (1x)
                trimSettings: Array.from({ length: this.numChannels }, () => ({ start: 0.01, end: 100.00, length: 0 })),
                projectChannelNames: new Array(this.numChannels).fill('Load Sample'),
                channelSettings: this.initializeChannelSettings(numChannels), // Initialize channelSettings
                projectSequences: this.initializeSequences(this.numSequences, this.numChannels, 64)
            }
        };

        this.initializeGainNodes();
        this.initializeSourceNodes(); // Initialize source nodes
        this.checkSettings = this.checkSettings.bind(this);
        this.clearMasterSettings = this.clearMasterSettings.bind(this);
        this.loadSettings = this.loadSettings.bind(this);
        this.formatURL = this.formatURL.bind(this);
        this.setChannelVolume = this.setChannelVolume.bind(this);
        this.setChannelPlaybackSpeed = this.setChannelPlaybackSpeed.bind(this); // Bind the new method
        this.updateTotalSequences = this.updateTotalSequences.bind(this);
    }

    initializeSourceNodes() {
        for (let i = 0; i < this.numChannels; i++) {
            const source = this.audioContext.createBufferSource(); // Create a new buffer source node
            source.playbackRate.setValueAtTime(this.settings.masterSettings.channelPlaybackSpeed[i], this.audioContext.currentTime);
            source.connect(this.gainNodes[i]); // Connect each source to its corresponding gain node
            this.sourceNodes.push(source);
        }
    }

    initializeGainNodes() {
        console.log("Initializing gain nodes");
        for (let i = 0; i < this.numChannels; i++) {
            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(this.settings.masterSettings.channelVolume[i], this.audioContext.currentTime);
            gainNode.connect(this.audioContext.destination);
            this.gainNodes[i] = gainNode;
            console.log(`Gain node ${i} initialized with volume ${this.settings.masterSettings.channelVolume[i]}`);
        }
    }

    setChannelVolume(channelIndex, volume) {
        console.log(`Setting volume for channel ${channelIndex} to ${volume}`);
        const gainNode = this.gainNodes[channelIndex];

        if (!gainNode) {
            console.error(`No gain node found for channel ${channelIndex}`);
            return;
        }

        gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
        this.settings.masterSettings.channelVolume[channelIndex] = volume;
        console.log(`Volume for channel ${channelIndex} set to ${volume}`);

        // Store the volume in local storage for persistence
        localStorage.setItem(`channelVolume_${channelIndex}`, volume.toString());
    }

    getChannelVolume(channelIndex) {
        return this.settings.masterSettings.channelVolume[channelIndex] || 1; // Default volume is 1
    }

    async loadSettings(jsonSettings) {
        console.log("[internalPresetDebug] loadSettings entered");
        try {
            this.clearMasterSettings();
            console.log("[internalPresetDebug] Received JSON Settings:", jsonSettings);
    
            // Parse the incoming JSON
            const parsedSettings = typeof jsonSettings === 'string' ? JSON.parse(jsonSettings) : jsonSettings;
    
            // Detect if the data is highly serialized and if so, decompress it
            const settingsToLoad = this.isHighlySerialized(parsedSettings)
                ? await this.decompressSerializedData(parsedSettings)
                : parsedSettings;
    
            // Proceed with loading the settings (regular or deserialized)
            this.settings.masterSettings.currentSequence = 0;
            this.settings.masterSettings.projectName = settingsToLoad.projectName;
            this.settings.masterSettings.projectBPM = settingsToLoad.projectBPM;
    
            if (settingsToLoad.artistName) {
                this.settings.masterSettings.artistName = settingsToLoad.artistName;
            }
    
            this.globalPlaybackSpeed = settingsToLoad.globalPlaybackSpeed || 1;
            this.channelPlaybackSpeed = settingsToLoad.channelPlaybackSpeed || new Array(16).fill(1);
    
            this.initializeGainNodes();
    
            // Ensure URLs are formatted and buffers are ready
            if (settingsToLoad.channelURLs) {
                const baseDomain = "https://ordinals.com";
    
                const urlPromises = settingsToLoad.channelURLs.map(async (url, index) => {
                    // Check if the URL is missing a domain and add it if necessary
                    if (url.startsWith("/")) {
                        url = `${baseDomain}${url}`;
                    }
    
                    const formattedUrl = await this.formatURL(url);
                    this.settings.masterSettings.channelURLs[index] = formattedUrl;
    
                    // Trigger the fetch, decode, and store process here
                    await fetchAudio(formattedUrl, index);
                });
    
                await Promise.all(urlPromises);
            }
    
            // Set volumes
            if (settingsToLoad.channelVolume) {
                settingsToLoad.channelVolume.forEach((volume, index) => {
                    this.setChannelVolume(index, volume);
                });
            }
    
            this.settings.masterSettings.trimSettings = settingsToLoad.trimSettings;
            this.settings.masterSettings.projectChannelNames = settingsToLoad.projectChannelNames;
            this.sortAndApplyProjectSequences(settingsToLoad);
    
            console.log("[internalPresetDebug] Master settings after update:", this.settings.masterSettings);
            this.updateProjectNameUI(this.settings.masterSettings.projectName);
            this.updateBPMUI(this.settings.masterSettings.projectBPM);
            this.updateAllLoadSampleButtonTexts();
            this.updateProjectChannelNamesUI(this.settings.masterSettings.projectChannelNames);
    
            this.setCurrentSequence(0);
            this.updateUIForSequence(this.settings.masterSettings.currentSequence);
            handleSequenceTransition(0);
    
        } catch (error) {
            console.error('[internalPresetDebug] Error loading settings:', error);
        }
    }
    
    
    
    isHighlySerialized(parsedSettings) {
        // A basic heuristic to detect highly serialized data
        const keys = Object.keys(parsedSettings);
        const numericKeyCount = keys.filter(key => /^\d+$/.test(key)).length;
        return numericKeyCount / keys.length > 0.5; // If more than 50% of keys are numeric
    }
    
    async decompressSerializedData(serializedData) {
        const keyMap = {
            0: 'projectName',
            1: 'artistName',
            2: 'projectBPM',
            3: 'currentSequence',
            4: 'channelURLs',
            5: 'channelVolume',
            6: 'channelPlaybackSpeed',
            7: 'trimSettings',
            8: 'projectChannelNames',
            9: 'startSliderValue',
            10: 'endSliderValue',
            11: 'totalSampleDuration',
            12: 'start',
            13: 'end',
            14: 'projectSequences',
            15: 'steps'
        };
    
        const reverseKeyMap = Object.fromEntries(Object.entries(keyMap).map(([k, v]) => [v, +k]));
        const channelMap = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A-Z
    
        const deserialize = (data) => {
            const deserializedData = {};
    
            for (const [key, value] of Object.entries(data)) {
                const originalKey = keyMap[key] ?? key;
    
                if (originalKey === 'channelURLs' || originalKey === 'projectChannelNames') {
                    deserializedData[originalKey] = value; // Just map the array directly
                } else if (Array.isArray(value)) {
                    deserializedData[originalKey] = ['projectChannelNames'].includes(originalKey)
                        ? value.map((v, i) => channelMap[i] ?? v)
                        : value.map(v => typeof v === 'number' ? v : deserialize(v));
                } else if (typeof value === 'object' && value !== null) {
                    deserializedData[originalKey] = originalKey === 'projectSequences'
                        ? Object.entries(value).reduce((acc, [seqKey, channels]) => {
                            const originalSeqKey = seqKey.replace('s', 'Sequence');
                            const restoredChannels = Object.entries(channels).reduce((chAcc, [chKey, chValue]) => {
                                const index = channelMap.indexOf(chKey);
                                const originalChKey = `ch${index !== -1 ? index : chKey}`;
                                if (chValue[reverseKeyMap['steps']]?.length) {
                                    chAcc[originalChKey] = { steps: decompressSteps(chValue[reverseKeyMap['steps']]) };
                                }
                                return chAcc;
                            }, {});
                            if (Object.keys(restoredChannels).length) acc[originalSeqKey] = restoredChannels;
                            return acc;
                        }, {})
                        : deserialize(value);
                } else {
                    deserializedData[originalKey] = value;
                }
            }
    
            return deserializedData;
        };
    
        const decompressSteps = steps => {
            const decompressed = [];
    
            steps.forEach(step => {
                if (typeof step === 'number') {
                    decompressed.push(step);
                } else if (typeof step === 'object' && step.r) {
                    for (let i = step.r[0]; i <= step.r[1]; i++) {
                        decompressed.push(i);
                    }
                } else if (typeof step === 'string' && step.endsWith('r')) {
                    decompressed.push({ index: parseInt(step.slice(0, -1), 10), reverse: true });
                }
            });
    
            return decompressed;
        };
    
        return deserialize(serializedData);
    }
    
    sortAndApplyProjectSequences(parsedSettings) {
        if (parsedSettings.projectSequences) {
            Object.keys(parsedSettings.projectSequences).forEach(sequenceKey => {
                const sequence = parsedSettings.projectSequences[sequenceKey];
                Object.keys(sequence).forEach(channelKey => {
                    const channel = sequence[channelKey];
                    let newSteps = Array.from({ length: 64 }, () => ({
                        isActive: false,
                        isReverse: false,
                        volume: 1,
                        pitch: 1
                    }));
                    
                    channel.steps.forEach(stepData => {
                        let index;
                        let isReverse = false;
                        if (typeof stepData === 'object' && stepData.index !== undefined) {
                            index = stepData.index - 1; // Adjusting for zero-based indexing
                            isReverse = stepData.reverse || false;
                        } else if (typeof stepData === 'number') {
                            index = stepData - 1; // Adjusting for zero-based indexing
                        }
                        if (index !== undefined) {
                            newSteps[index] = {
                                isActive: true,
                                isReverse: isReverse,
                                volume: 1,
                                pitch: 1
                            };
                        }
                    });
    
                    // Assign new steps to the channel
                    this.settings.masterSettings.projectSequences[sequenceKey][channelKey].steps = newSteps;
    
                    // Ensure mute and url fields exist, for internal consistency
                    this.settings.masterSettings.projectSequences[sequenceKey][channelKey].mute = false;
                    this.settings.masterSettings.projectSequences[sequenceKey][channelKey].url = "";
                });
            });
        }
    }
    

    exportSettings(pretty = true) {
        const settingsClone = JSON.parse(JSON.stringify(this.settings.masterSettings));
        settingsClone.currentSequence = 0;
    
        // Include global and channel-specific playback speeds
        settingsClone.globalPlaybackSpeed = this.globalPlaybackSpeed;
        settingsClone.channelPlaybackSpeed = Array.isArray(this.channelPlaybackSpeed) ? [...this.channelPlaybackSpeed] : new Array(16).fill(1);
    
        // Ensure that channelVolume is an array before trying to spread it
        settingsClone.channelVolume = Array.isArray(this.settings.masterSettings.channelVolume) ? [...this.settings.masterSettings.channelVolume] : new Array(16).fill(1);
    
        // Include artistName if it exists
        if (this.settings.masterSettings.artistName) {
            settingsClone.artistName = this.settings.masterSettings.artistName;
        }
    
        for (let sequenceKey in settingsClone.projectSequences) {
            const sequence = settingsClone.projectSequences[sequenceKey];
            for (let channelKey in sequence) {
                const channel = sequence[channelKey];
                const activeSteps = [];
    
                channel.steps.forEach((step, index) => {
                    if (step.isActive || step.isReverse) {
                        const stepData = { index: index + 1 };
    
                        if (step.isReverse) stepData.reverse = true;
    
                        const stepVolume = step.volume !== undefined ? step.volume : 1;
                        if (stepVolume !== 1) stepData.volume = stepVolume;
                        if (step.pitch !== 1) stepData.pitch = step.pitch;
    
                        if (Object.keys(stepData).length > 1) {
                            activeSteps.push(stepData);
                        } else {
                            activeSteps.push(index + 1);
                        }
                    }
                });
    
                channel.steps = activeSteps;
    
                delete channel.mute;
                delete channel.url;
            }
        }
    
        const exportedSettings = JSON.stringify(settingsClone, null, pretty ? 2 : 0);
        console.log("[exportSettings] Exported Settings:", exportedSettings);
    
        const serializedSettings = this.serialize(settingsClone);
        const serializedExportedSettings = JSON.stringify(serializedSettings);
        console.log("[exportSettings] Serialized Exported Settings:", serializedExportedSettings);
    
        this.downloadJSON(exportedSettings, 'full_format.json');
        this.downloadJSON(serializedExportedSettings, 'serialized_format.json');
    }
    
    serialize(data) {
        const keyMap = {
            projectName: 0,
            artistName: 1,
            projectBPM: 2,
            currentSequence: 3,
            channelURLs: 4,
            channelVolume: 5,
            channelPlaybackSpeed: 6,
            trimSettings: 7,
            projectChannelNames: 8,
            startSliderValue: 9,
            endSliderValue: 10,
            totalSampleDuration: 11,
            start: 12,
            end: 13,
            projectSequences: 14,
            steps: 15
        };
    
        const reverseChannelMap = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    
        const roundToFourDecimals = num => Math.round(num * 10000) / 10000;
    
        const compressSteps = steps => {
            if (!steps.length) return [];
    
            const compressed = [];
            let start = null, end = null, inRange = false;
    
            steps.forEach(step => {
                if (typeof step === 'number') {
                    if (start === null) {
                        start = end = step;
                    } else if (step === end + 1) {
                        end = step;
                        inRange = true;
                    } else {
                        compressed.push(inRange ? { r: [start, end] } : start);
                        start = end = step;
                        inRange = false;
                    }
                } else if (step.index !== undefined && step.reverse) {
                    if (start !== null) {
                        compressed.push(inRange ? { r: [start, end] } : start);
                        start = end = null;
                        inRange = false;
                    }
                    compressed.push(`${step.index}r`);
                }
            });
    
            if (start !== null) compressed.push(inRange ? { r: [start, end] } : start);
    
            return compressed;
        };
    
        const serializeData = data => {
            const serializedData = {};
    
            for (const [key, value] of Object.entries(data)) {
                const shortKey = keyMap[key] ?? key;
    
                if (key === 'channelURLs') {
                    serializedData[shortKey] = value;
                } else if (Array.isArray(value)) {
                    serializedData[shortKey] = ['projectChannelNames'].includes(key)
                        ? value.map((v, i) => reverseChannelMap[i] ?? v)
                        : value.map(v => typeof v === 'number' ? roundToFourDecimals(v) : serializeData(v));
                } else if (typeof value === 'object' && value !== null) {
                    serializedData[shortKey] = key === 'projectSequences'
                        ? Object.entries(value).reduce((acc, [seqKey, channels]) => {
                            const shortSeqKey = seqKey.replace('Sequence', 's');
                            const filteredChannels = Object.entries(channels).reduce((chAcc, [chKey, chValue]) => {
                                const letter = reverseChannelMap[parseInt(chKey.replace('ch', ''), 10)] ?? chKey;
                                if (chValue.steps?.length) {
                                    chAcc[letter] = { [keyMap['steps']]: compressSteps(chValue.steps) };
                                }
                                return chAcc;
                            }, {});
                            if (Object.keys(filteredChannels).length) acc[shortSeqKey] = filteredChannels;
                            return acc;
                        }, {})
                        : serializeData(value);
                } else {
                    serializedData[shortKey] = typeof value === 'number' ? roundToFourDecimals(value) : value;
                }
            }
    
            return serializedData;
        };
    
        return serializeData(data);
    }
    
    downloadJSON(content, fileName) {
        const blob = new Blob([content], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }
    
    
    
    
    
async formatURL(url) {
// Asynchronous operation example (placeholder)
return new Promise(resolve => setTimeout(() => resolve(url), 100)); // Simulates async processing
}


    setGlobalPlaybackSpeed(speed) {
        this.globalPlaybackSpeed = speed;
        this.sourceNodes.forEach(sourceNode => {
            if (sourceNode && sourceNode.buffer) { // Ensure the node is initialized and has a buffer
                sourceNode.playbackRate.setValueAtTime(speed, this.audioContext.currentTime);
            }
        });
        console.log(`Global playback speed set to ${speed}x`);
    }

    setChannelPlaybackSpeed(channelIndex, speed) {
        if (channelIndex < 0 || channelIndex >= this.channelPlaybackSpeed.length) {
            console.error("Channel index out of bounds");
            return;
        }
    
        // Update the channel-specific playback speed
        this.channelPlaybackSpeed[channelIndex] = speed;
    
        // Ensure the source node exists and has a buffer before updating the playback rate
        const sourceNode = this.sourceNodes[channelIndex];
        if (sourceNode && sourceNode.buffer) {
            sourceNode.playbackRate.setValueAtTime(speed, this.audioContext.currentTime);
            console.log(`Playback speed for channel ${channelIndex} set to ${speed}x`);
        } else {
            console.log(`Source node for channel ${channelIndex} is not initialized or lacks a buffer.`);
        }
    }
    
    updatePlaybackSpeed(channelIndex) {
        // This function should be called only when a source node exists
        const sourceNode = this.sourceNodes[channelIndex];
        if (sourceNode && sourceNode.buffer) {
            sourceNode.playbackRate.setValueAtTime(this.channelPlaybackSpeed[channelIndex], this.audioContext.currentTime);
            console.log(`Playback speed for channel ${channelIndex} updated to ${this.channelPlaybackSpeed[channelIndex]}x`);
        } else {
            console.log(`Source node for channel ${channelIndex} is not initialized or lacks a buffer.`);
        }
    }
    

    // New method to update the total number of sequences
    updateTotalSequences() {
        let lastActiveSequence = -1;
        for (let seq = 0; seq < this.numSequences; seq++) {
            const sequence = this.settings.masterSettings.projectSequences[`Sequence${seq}`];
            if (!sequence) continue; // Skip if sequence is not defined
            for (let ch = 0; ch < this.numChannels; ch++) {
                const channel = sequence[`ch${ch}`];
                if (channel && channel.steps.some(step => step.isActive)) {
                    lastActiveSequence = seq;
                    break;
                }
            }
        }
        this.numSequences = lastActiveSequence + 1;
        console.log(`Total sequences updated to ${this.numSequences}`);
    }

    checkSettings() {
        console.log("Current Global Settings:", this.settings);
    }

    initializeChannelSettings(numChannels) {
        let channelSettings = {};
        for (let ch = 0; ch < numChannels; ch++) {
            channelSettings[`ch${ch}`] = { volume: 1, pitch: 1 };
        }
        return channelSettings;
    }

    initializeSequences(numSequences = this.numSequences, numChannels = this.numChannels, numSteps = 64) {
        let sequenceData = {};
        for (let seq = 0; seq < numSequences; seq++) {
            sequenceData[`Sequence${seq}`] = this.initializeChannels(numChannels, numSteps);
        }
        return sequenceData;
    }

    initializeChannels(numChannels, numSteps) {
        let channels = {};
        for (let ch = 0; ch < numChannels; ch++) {
            channels[`ch${ch}`] = {
                steps: Array.from({ length: numSteps }, () => ({
                    isActive: false,
                    isReverse: false,
                    volume: 1,
                    pitch: 1,
                })),
                mute: false,
                url: ''
            };
        }
        return channels;
    }

            // Inside the UnifiedSequencerSettings class
            getStepSettings(sequenceIndex, channelIndex, stepIndex) {
                const sequence = this.settings.masterSettings.projectSequences[`Sequence${sequenceIndex}`];
                const channel = sequence && sequence[`ch${channelIndex}`];
                const step = channel && channel.steps[stepIndex];
                if (step) {
                    return {
                        isActive: step.isActive,
                        isReverse: step.isReverse,
                        volume: step.volume,
                        pitch: step.pitch
                    };
                } else {
                    console.error('Invalid sequence, channel, or step index in getStepSettings');
                    // Return default values if the step is not found
                    return {
                        isActive: false,
                        isReverse: false,
                        volume: 1,
                        pitch: 1
                    };
                }
            }

            

            getStepStateAndReverse(currentSequence, channelIndex, stepIndex) {

                const sequence = this.settings.masterSettings.projectSequences[`Sequence${currentSequence}`];
                const channel = sequence && sequence[`ch${channelIndex}`];
                if (channel && stepIndex < channel.steps.length) {
                const step = channel.steps[stepIndex];
                // console.log(`[getStepStateAndReverse entered] Step state for sequence ${currentSequence}, channel ${channelIndex}, step ${stepIndex}:`, step);

                return { isActive: step.isActive, isReverse: step.isReverse };
                } else {
                console.error('Invalid sequence, channel, or step index in getStepStateAndReverse');
                return { isActive: false, isReverse: false };
                }
            }
            
            
            
            updateStepState(currentSequence, channelIndex, stepIndex, state) {
                console.log("updateStepState entered");
                const existingStepState = this.getStepStateAndReverse(currentSequence, channelIndex, stepIndex);
                if (typeof state === 'boolean') {
                    this.updateStepStateAndReverse(currentSequence, channelIndex, stepIndex, state, existingStepState.isReverse);
                    this.updateTotalSequences(); // Update total sequences
                } else {
                    console.error('Invalid state type in updateStepState');
                }
            }
            

            getStepState(currentSequence, channelIndex, stepIndex) {
                // console.log("getStepState entered");
                const sequence = this.settings.masterSettings.projectSequences[`Sequence${currentSequence}`];
                const channel = sequence && sequence[`ch${channelIndex}`];
                if (channel && stepIndex < channel.steps.length) {
                    const step = channel.steps[stepIndex];
                    // Return the isActive state of the step
                    // console.log(`getStepState Step at Seq: ${currentSequence}, Ch: ${channelIndex}, Step: ${stepIndex} is active: ${step.isActive}`);
                    return step.isActive;
                } else {
                    console.error('Invalid sequence, channel, or step index in getStepState');
                    return false;
                }
            }
            
            
        
            toggleStepState(sequenceIndex, channelIndex, stepIndex) {
                const step = this.settings.masterSettings.projectSequences[`Sequence${sequenceIndex}`][`ch${channelIndex}`].steps[stepIndex];
                // Toggle the active state of the step object
                step.isActive = !step.isActive;
                this.updateTotalSequences(); // Update total sequences
                this.notifyObservers();
            }
            
            toggleStepReverseState(sequenceIndex, channelIndex, stepIndex) {
                const step = this.settings.masterSettings.projectSequences[`Sequence${sequenceIndex}`][`ch${channelIndex}`].steps[stepIndex];
                // Toggle the reverse state of the step object
                step.isReverse = !step.isReverse;
                this.updateTotalSequences(); // Update total sequences
                this.notifyObservers();
            }
        
           /**
 * Updates the activation state and direction of a specific step in a project sequence.
 * @param {number} currentSequence - The current sequence index.
 * @param {number} channelIndex - The index of the channel within the sequence.
 * @param {number} stepIndex - The index of the step within the channel.
 * @param {boolean} isActive - Whether the step should be active.
 * @param {boolean} isReverse - Whether the step should be in reverse mode.
 * @throws {Error} If any input is invalid or the step cannot be found.
 */
updateStepStateAndReverse(currentSequence, channelIndex, stepIndex, isActive, isReverse) {
    // Validate inputs
    if (typeof currentSequence !== 'number' || typeof channelIndex !== 'number' || typeof stepIndex !== 'number' ||
        typeof isActive !== 'boolean' || typeof isReverse !== 'boolean') {
        throw new Error('Invalid input types');
    }

    // Using optional chaining to simplify object navigation
    const step = this.settings?.masterSettings?.projectSequences?.[`Sequence${currentSequence}`]?.[`ch${channelIndex}`]?.steps?.[stepIndex];

    // Check if the step exists
    if (step) {
        step.isActive = isActive;
        step.isReverse = isReverse;
        this.updateTotalSequences(); // Update total sequences
    } else {
        throw new Error('Invalid sequence, channel, or step index in updateStepStateAndReverse');
    }
}


            getChannelVolume(channelIndex) {
                const channelSettings = this.settings.masterSettings.channelSettings || {};
                return channelSettings[`ch${channelIndex}`]?.volume || 1; // Default volume is 1
            }

            getChannelPitch(channelIndex) {
                const channelSettings = this.settings.masterSettings.channelSettings || {};
                return channelSettings[`ch${channelIndex}`]?.pitch || 1; // Default pitch is 1
            }

            getStepVolume(sequenceIndex, channelIndex, stepIndex) {
                const step = this.getStepSettings(sequenceIndex, channelIndex, stepIndex);
                return step.volume;
            }
            
            getStepPitch(sequenceIndex, channelIndex, stepIndex) {
                const step = this.getStepSettings(sequenceIndex, channelIndex, stepIndex);
                return step.pitch;
            }

            // setChannelVolume(channelIndex, volume) {
            //     if (!this.settings.masterSettings.channelSettings) {
            //         this.settings.masterSettings.channelSettings = {};
            //     }
            //     if (!this.settings.masterSettings.channelSettings[`ch${channelIndex}`]) {
            //         this.settings.masterSettings.channelSettings[`ch${channelIndex}`] = {};
            //     }
            //     this.settings.masterSettings.channelSettings[`ch${channelIndex}`].volume = volume;
                
            //     // Notify observers to update the UI or other components if necessary
            //     this.notifyObservers();
            // }

            setChannelPitch(channelIndex, pitch) {
                if (!this.settings.masterSettings.channelSettings) {
                    this.settings.masterSettings.channelSettings = {};
                }
                if (!this.settings.masterSettings.channelSettings[`ch${channelIndex}`]) {
                    this.settings.masterSettings.channelSettings[`ch${channelIndex}`] = {};
                }
                this.settings.masterSettings.channelSettings[`ch${channelIndex}`].pitch = pitch;
                
                // Notify observers to update the UI or other components if necessary
                this.notifyObservers();
            }

            setStepVolume(channelIndex, stepIndex, volume) {
                const sequence = this.settings.masterSettings.currentSequence;
                const channel = this.settings.masterSettings.projectSequences[`Sequence${sequence}`]?.[`ch${channelIndex}`];
                const step = channel?.steps[stepIndex];
                if (step) {
                    step.volume = volume;
                } else {
                    console.error('Invalid sequence, channel, or step index in setStepVolume');
                }
                
                // Notify observers to update the UI or other components if necessary
                this.notifyObservers();
            }

            setStepPitch(channelIndex, stepIndex, pitch) {
                const sequence = this.settings.masterSettings.currentSequence;
                const channel = this.settings.masterSettings.projectSequences[`Sequence${sequence}`]?.[`ch${channelIndex}`];
                const step = channel?.steps[stepIndex];
                if (step) {
                    step.pitch = pitch;
                } else {
                    console.error('Invalid sequence, channel, or step index in setStepPitch');
                }
                
                // Notify observers to update the UI or other components if necessary
                this.notifyObservers();
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
        // console.log("getTrimSettings entered");
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
    

            // Corrected to accept a parameter for the current sequence index
            updateUIForSequence(currentSequenceIndex) {
                const channels = document.querySelectorAll('.channel');
            
                channels.forEach((channel, channelIndex) => {
                    const stepButtons = channel.querySelectorAll('.step-button');
                    stepButtons.forEach((button, stepIndex) => {
                        const { isActive, isReverse } = this.getStepStateAndReverse(currentSequenceIndex, channelIndex, stepIndex);
                        button.classList.toggle('selected', isActive);
                        button.classList.toggle('reverse', isReverse);
                    });
                });
            
                // Debounced update to avoid excessive calls
                if (!this._scheduledUpdate) {
                    this._scheduledUpdate = true;
                    requestAnimationFrame(() => {
                        this._scheduledUpdate = false;
                        this.updateUIForSequence(this.settings.masterSettings.currentSequence);
                    });
                }
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
        // console.log("getprojectUrlforChannel entered");
        return this.settings.masterSettings.channelURLs[channelIndex];
    }

    // setChannelURLs(urls) {
    //     console.log("setChannel entered");
    //     this.settings.masterSettings.channelURLs = urls;
    //     console.log(`[setChannelURLs] Channel URLs set:`, urls);
    
    //     // Correctly calling the method within the same class
    //     this.updateAllLoadSampleButtonTexts();
    // }

    setProjectName(name) {
        console.log("setProjectName entered");
        this.settings.masterSettings.projectName = name;
        console.log(`[setProjectName] Project name set to: ${name}`);
    }

     

    clearMasterSettings() {
        console.log("[clearMasterSettings] Current masterSettings before clearing:", this.settings.masterSettings);
    
        // Reset basic project settings to defaults
        this.settings.masterSettings.projectName = 'New Audx Project';
        this.settings.masterSettings.artistName = ''; // Reset artist name to default empty string
        this.settings.masterSettings.projectBPM = 120; // Default BPM
        this.settings.masterSettings.currentSequence = 0; // Initialize to first sequence
    
        // Ensure channel URLs are reset to defaults
        this.settings.masterSettings.channelURLs = new Array(16).fill('');
    
        // Reset channel names to a default or empty value
        this.settings.masterSettings.projectChannelNames = new Array(16).fill('Load Sample');
    
        // Maintain the volume settings to avoid undefined errors when accessed
        this.settings.masterSettings.channelVolume = new Array(16).fill(1);
    
        // Reset trim settings for each channel
        this.settings.masterSettings.trimSettings = Array.from({ length: 16 }, () => ({
            start: 0.01, 
            end: 100.00, 
            length: 0
        }));
    
        // Maintain default playback speeds
        this.settings.masterSettings.channelPlaybackSpeed = new Array(16).fill(1); // Default speed is normal (1x)
    
        // Reinitialize sequences to default state
        this.settings.masterSettings.projectSequences = this.initializeSequences(64, 16, 64);
    
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
        // console.log('[SequenceChangeDebug] setCurrentSequence called with sequence:', currentSequence);
        
        this.settings.masterSettings.currentSequence = currentSequence;
        // console.log(`[SequenceChangeDebug] [setCurrentSequence] currentSequence set to: ${currentSequence}`);
        // console.log(`[SequenceChangeDebug] [setCurrentSequence] Object currentSequence set to: ${this.settings.masterSettings.currentSequence}`);
        if (this.settings.masterSettings.currentSequence !== currentSequence) {
            this.settings.masterSettings.currentSequence = currentSequence;
            this.notifyObservers();
        }
    }

    // Method to get the current sequence
    getCurrentSequence() {
        // console.log("getCurrentSequence entered");
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
        
        console.log("[checkSettings] Current masterSettings:");
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
    setChannelName(channelIndex, name) {
        console.log("[setChannelName] Entered method.");
        if (this.isValidIndex(channelIndex)) {
            if (this.settings.masterSettings.projectChannelNames[channelIndex] !== name) {
                this.settings.masterSettings.projectChannelNames[channelIndex] = name;
                console.log(`[setChannelName] Channel ${channelIndex} name set to: ${name}`);
                // Update UI after setting the channel name
                this.updateProjectChannelNamesUI(channelIndex, name);
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

    updateProjectChannelNamesUI(channelIndex, name) {
        const defaultName = 'Load Sample'; // Default placeholder
        let effectiveName = name;

        // Safely access the URL to use as a fallback name
        const channelUrl = this.settings.masterSettings.channelURLs[channelIndex];
        const urlName = channelUrl ? channelUrl.split('/').pop().split('#')[0] : defaultName;

        if (!effectiveName) {
            effectiveName = urlName;
        }

        console.log("[updateProjectChannelNamesUI] Updating with name:", effectiveName);

        // Ensure the UI is updated
        const nameDisplay = document.getElementById(`channel-name-${channelIndex}`);
        if (nameDisplay) {
            nameDisplay.textContent = effectiveName;
        }

        // Also update the name in the global settings array to prevent issues on export or re-load
        this.settings.masterSettings.projectChannelNames[channelIndex] = effectiveName;
    }

    getChannelName(channelIndex) {
        console.log("getChannelName entered");
        return this.settings.masterSettings.projectChannelNames[channelIndex];
    }

    setProjectSequences(sequenceData) {
        console.log("setProjectSequences entered");
        this.settings.masterSettings.projectSequences = sequenceData;
        console.log(`[setProjectSequences] Project sequences set:`, sequenceData);
        console.log('[setProjectSequences] currentSequence set to:', this.settings.masterSettings.currentSequence);
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


    // WORKING VERSION
    updateLoadSampleButtonText(channelIndex, button) {
        console.log("updateLoadSampleButtonText entered");

        // Ensure the button exists
        if (!button) {
            console.error(`updateLoadSampleButtonText: Button not found for channelIndex ${channelIndex}`);
            return;
        }

        let buttonText = 'Load New Audional'; // Default text
        console.log(`[updateLoadSampleButtonText] Default text: ${buttonText}`);

        // Check if masterSettings are correctly initialized
        if (!this.settings || !this.settings.masterSettings) {
            console.error('updateLoadSampleButtonText: masterSettings not properly initialized');
            button.textContent = buttonText;
            return;
        }

        // Accessing projectChannelNames and channelURLs from settings
        const { projectChannelNames, channelURLs } = this.settings.masterSettings;

        // Check if arrays are correctly initialized
        if (!Array.isArray(projectChannelNames) || !Array.isArray(channelURLs)) {
            console.error('updateLoadSampleButtonText: projectChannelNames or channelURLs is not an array');
            button.textContent = buttonText;
            return;
        }

        // Check if indices exist in the arrays
        const channelName = projectChannelNames[channelIndex];
        const loadedUrl = channelURLs[channelIndex];

        console.log(`[updateLoadSampleButtonText] Channel Name: ${channelName}, Loaded URL: ${loadedUrl}`);

        if (channelName) {
            buttonText = channelName;
        } else if (loadedUrl) {
            // Extract the desired portion of the URL
            const urlParts = loadedUrl.split('/');
            const lastPart = urlParts[urlParts.length - 1];
            buttonText = lastPart;
        }

        console.log(`[updateLoadSampleButtonText] Final button text: ${buttonText}`);
        
        // Update button text
        button.textContent = buttonText;
    }

    // updateProjectChannelNamesUI(channelIndex, name) {
    //     const defaultName = 'Load Sample'; // Default placeholder
    //     let effectiveName = name;
    
    //     // Safely access the URL to use as a fallback name
    //     const channelUrl = this.settings.masterSettings.channelURLs[channelIndex];
    //     const urlName = channelUrl ? channelUrl.split('/').pop().split('#')[0] : defaultName;
    
    //     if (!effectiveName) {
    //         effectiveName = urlName;
    //     }
    
    //     console.log("[updateProjectChannelNamesUI] Updating with name:", effectiveName);
    
    //     // Ensure the UI is updated
    //     const nameDisplay = document.getElementById(`channel-name-${channelIndex}`);
    //     if (nameDisplay) {
    //         nameDisplay.textContent = effectiveName;
    //     }
    
    //     // Also update the name in the global settings array to prevent issues on export or re-load
    //     this.settings.masterSettings.projectChannelNames[channelIndex] = effectiveName;
    // }
    
    
    
    

    ////NON-WORKING VERSION
    // updateLoadSampleButtonText(channelIndex) {
    //     console.log("[updateLoadSampleButtonText] Entered update function for channel:", channelIndex);
    //         // Attempt to find the button by its ID
    //         const button = document.getElementById(`load-sample-button-${channelIndex}`);
            
    //         if (button) {
    //     const button = document.getElementById(`load-sample-button-${channelIndex}`);
    //     if (!button) {
    //         console.error(`[updateLoadSampleButtonText] Button for channel ${channelIndex} not found.`);
    //         return; // Exit if button is not found to prevent errors
    //     }
    //     console.log("[updateLoadSampleButtonText] Button found:", button);
    
    //     let buttonText = 'Load New Audional'; // Default text
    //     console.log("[updateLoadSampleButtonText] Default button text set.");
    
    //     // Accessing projectChannelNames and channelURLs from settings
    //     const channelName = this.settings.masterSettings.projectChannelNames[channelIndex];
    //     const loadedUrl = this.settings.masterSettings.channelURLs[channelIndex];
    
    //     console.log("[updateLoadSampleButtonText] Retrieved channel name:", channelName);
    //     console.log("[updateLoadSampleButtonText] Retrieved loaded URL:", loadedUrl);
    
    //     if (channelName) {
    //         buttonText = channelName; // Use the channel name if available
    //         console.log("[updateLoadSampleButtonText] Button text updated with channel name:", buttonText);
    //     } else if (loadedUrl) {
    //         // Extract the desired portion of the URL
    //         const urlParts = loadedUrl.split('/');
    //         const lastPart = urlParts[urlParts.length - 1];
    //         buttonText = lastPart; // Use the last part of the URL if no name is provided
    //         console.log("[updateLoadSampleButtonText] Button text updated with last part of URL:", buttonText);
    //     }
    
    //     // Update button text
    //     button.textContent = buttonText;
    //     } else {
    //         console.warn(`[updateLoadSampleButtonText] Button for channel ${channelIndex} not found.`);
    //     }
    // }


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
