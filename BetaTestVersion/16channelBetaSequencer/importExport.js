// importExport.js

let newJsonImport = false;
let liveSequences = [];  // New array to keep track of "live" sequences



const EMPTY_CHANNEL = {
    "url": "",
    "mute": false,
    "triggers": []
};

let sequenceBPMs = Array(totalSequenceCount).fill(105);  // Initialize with 0 BPM for all sequences
let collectedURLsForSequences = Array(sequences.length).fill().map(() => []);



// Function to mark a sequence as "live" when edited
function markSequenceAsLive(seqIndex) {
    if (!liveSequences.includes(seqIndex)) {
        liveSequences.push(seqIndex);
    }
}

// Call this function whenever a sequence is edited
// For example, when a URL is added or a step is toggled
// You need to identify these places in your code and call this function

function exportSettings() {
   // console.log("exportSettings: collectedURLsForSequences before export:", collectedURLsForSequences);

    let allSequencesSettings = [];

    for (let seqIndex of liveSequences) {  // Only export "live" sequences
        const sequence = sequences[seqIndex];
        let settings = {
            name: `Sequence_${seqIndex + 1}`,
            bpm: sequenceBPMs[seqIndex],
            channels: [],
        };

        for (let i = 0; i < 16; i++) {
            let channelSteps = sequence[i] || [];
            let url = sequence[i] && sequence[i][0] ? sequence[i][0] : "";
            let triggers = [];
            channelSteps.forEach((stepState, stepIndex) => {
                if (stepState && stepIndex !== 0) {
                    triggers.push(stepIndex);
                }
            });

            let mute = channels[i] && channels[i].dataset ? channels[i].dataset.muted === 'true' : false;
            settings.channels.push({
                url: url,
                mute: mute,
                triggers: triggers
            });
        }

        allSequencesSettings.push(settings);
    }

    let filename = `Audional_Sequencer_Settings.json`;
    return { settings: JSON.stringify(allSequencesSettings, null, 2), filename: filename };
}



function importSettings(settings) {
    console.log("Importing settings...");
    channels.forEach(channel => {
        const channelIndex = parseInt(channel.dataset.id.split('-')[1]) - 1;
        updateMuteState(channel, false); // unmute
        setChannelVolume(channelIndex, 1); // set volume to 1
    });


    let parsedSettings;
    let sequenceNames = [];
    newJsonImport = true;

    try {
        parsedSettings = JSON.parse(settings);
        console.log("Parsed settings:", parsedSettings);
    } catch (error) {
        console.error("Error parsing settings:", error);
        return;
    }

    if (parsedSettings && Array.isArray(parsedSettings)) {
        collectedURLsForSequences = parsedSettings.map(seq => {
            let urlsForSequence = seq.channels.map(ch => ch.url || "");
           // console.log("URLs for this sequence:", urlsForSequence);
            while (urlsForSequence.length < 16) {
                urlsForSequence.push("");
            }
            return urlsForSequence;
        });
       // console.log("Final collectedURLsForSequences:", collectedURLsForSequences);
    }

    function isValidSequence(seq) {
        const isValid = seq && Array.isArray(seq.channels) && typeof seq.name === 'string';
       // console.log(`Sequence ${seq.name} is valid: ${isValid}`);
        return isValid;
    }

    console.log("Initial sequenceBPMs:", sequenceBPMs);

    // Build the sequences array first
    sequences = parsedSettings.map((seqSettings, index) => {
        if (isValidSequence(seqSettings)) {
            sequenceBPMs[index] = seqSettings.bpm || 105;  // Update the BPM value using the correct index
            return convertSequenceSettings(seqSettings);
        } else {
            return null;
        }
    }).filter(Boolean);

    // Now, construct the sequenceBPMs array based on the valid sequences
    sequenceBPMs = sequences.map((seq, index) => {
        return parsedSettings[index].bpm || 105; // Default to 105 if bpm is not provided
    });

    console.log("Extracted sequence names:", sequenceNames);

    sequenceBPMs = Array(totalSequenceCount).fill(105); // Initialize with 105 BPM for all sequences
    console.log("Updated sequenceBPMs:", sequenceBPMs);

    if (!Array.isArray(parsedSettings) && sequences.length > 0) {
        if (isValidSequence(parsedSettings)) {
            sequences.push(convertSequenceSettings(parsedSettings));

            let bpm = parsedSettings.bpm;
            let bpmSlider = document.getElementById('bpm-slider');
            let bpmDisplay = document.getElementById('bpm-display');
            bpmSlider.value = bpm;
            bpmDisplay.innerText = bpm;
            bpmSlider.dispatchEvent(new Event('input'));
        } else {
            console.error("Imported JSON doesn't match expected format.");
            return;
        }
    } else {
        if (!Array.isArray(parsedSettings)) {
            if (isValidSequence(parsedSettings)) {
                parsedSettings = [parsedSettings];
            } else {
                console.error("Imported JSON doesn't match expected format.");
                return;
            }
        }

        sequences = parsedSettings.map((seqSettings, seqIndex) => {
            if (isValidSequence(seqSettings)) {
                sequenceBPMs[seqIndex] = seqSettings.bpm || 105; // Update the BPM value

                // After processing all sequences
                let bpm = sequenceBPMs[0];
                let bpmSlider = document.getElementById('bpm-slider');
                let bpmDisplay = document.getElementById('bpm-display');
                bpmSlider.value = bpm;
                bpmDisplay.innerText = bpm;
                bpmSlider.dispatchEvent(new Event('input'));


                return convertSequenceSettings(seqSettings);
            } else {
                console.error("One of the sequences in the imported array doesn't match the expected format.");
                return null;
            }

            
        }).filter(Boolean);
        console.log("Final sequenceBPMs:", sequenceBPMs);
        console.log("Final sequences:", sequences);
        
        // Mark all loaded sequences as "live"
        for (let i = 0; i < sequences.length; i++) {
            liveSequences.push(i);
        }
    }


    // Set current sequence to the first one
    currentSequence = 1;
    console.log("Setting current sequence to:", currentSequence);

    // Activate the quick play button for sequence 1
    setActiveSequence(currentSequence);
    console.log("setActiveSequence to:", currentSequence);

    channelSettings = sequences[currentSequence - 1];
    sequences[currentSequence - 1] = channelSettings;

    const currentSeqSettings = parsedSettings[0]; // since currentSequence is set to 1
    currentSeqSettings.channels.forEach((channelData, channelIndex) => {
        const channel = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"]`);
        if (channelData.mute !== undefined) { // Only if mute is defined in the JSON
            updateMuteState(channel, channelData.mute);
        }
        if (channelData.volume !== undefined) { // Only if volume is defined in the JSON
            setChannelVolume(channelIndex, channelData.volume);
        }
    });

    updateUIForSequence(currentSequence);
    saveCurrentSequence(currentSequence);

    console.log("Final sequences array:", sequences);

    loadAndDisplaySequence(currentSequence);

    console.log("Import settings completed.");
}

// Function to mark a sequence as "live" when edited
function markSequenceAsLive(seqIndex) {
    if (!liveSequences.includes(seqIndex)) {
        liveSequences.push(seqIndex);
    }
}

function convertSequenceSettings(settings) {
    let channels = settings.channels;
    if (channels.length < 16) {
        let emptyChannelsToAdd = 16 - channels.length;
        for (let i = 0; i < emptyChannelsToAdd; i++) {
            channels.push(EMPTY_CHANNEL);
        }
        // console.log("Converted channel:", convertedChannel);
    }

    return channels.map(ch => {
        let convertedChannel = convertChannelToStepSettings(ch);
       //  console.log("Converted channel:", convertedChannel);
        return convertedChannel;
    });
}

function convertChannelToStepSettings(channel) {
    let stepSettings = [channel.url].concat(Array(64).fill(false)); // Store the URL at the 0th index

    channel.triggers.forEach(i => {
        stepSettings[i] = true;
    });

    return stepSettings;
}