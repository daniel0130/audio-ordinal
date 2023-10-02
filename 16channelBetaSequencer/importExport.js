// importExport.js

let newJsonImport = false;


const EMPTY_CHANNEL = {
    "url": "",
    "mute": false,
    "triggers": []
};

let sequenceBPMs = Array(totalSequenceCount).fill(105);  // Initialize with 0 BPM for all sequences
let collectedURLsForSequences = Array(sequences.length).fill().map(() => []);



function exportSettings() {
    let allSequencesSettings = [];

    for (let seqIndex = 0; seqIndex < sequences.length; seqIndex++) {
        const sequence = sequences[seqIndex];
        let hasTriggers = false;  // Assume sequence has no triggers until proven otherwise
        let settings = {
            name: `Sequence_${seqIndex + 1}`,
            bpm: sequenceBPMs[seqIndex],
            channels: [],
        };

        for (let i = 0; i < 16; i++) {
            let channelSteps = sequence[i] || [];
            
            // Fetch URL from collectedURLsForSequences or set as an empty string
            let url = collectedURLsForSequences[seqIndex][i] || "";

            let triggers = [];
            channelSteps.forEach((stepState, stepIndex) => {
                if (stepState && stepIndex !== 0) {
                    triggers.push(stepIndex);
                }
            });

            let mute = channels[i] && channels[i].dataset ? channels[i].dataset.muted === 'true' : false;
            if (triggers.length > 0) {
                hasTriggers = true;  // The sequence has triggers if at least one channel has triggers
            }
            settings.channels.push({
                url: url,
                mute: mute,
                triggers: triggers
            });
        }

        if (!hasTriggers) {
            break;  // Stop the export process if the current sequence doesn't have any triggers
        }

        allSequencesSettings.push(settings);
    }

    let filename = `audiSeq_AllSequences.json`;
    return { settings: JSON.stringify(allSequencesSettings, null, 2), filename: filename };
}




function importSettings(settings) {
    console.log("Importing settings...");

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
            console.log("URLs for this sequence:", urlsForSequence);
            while (urlsForSequence.length < 16) {
                urlsForSequence.push("");
            }
            return urlsForSequence;
        });
        console.log("Final collectedURLsForSequences:", collectedURLsForSequences);
    }

    function isValidSequence(seq) {
        const isValid = seq && Array.isArray(seq.channels) && typeof seq.name === 'string';
        console.log(`Sequence ${seq.name} is valid: ${isValid}`);
        return isValid;
    }

    sequences = parsedSettings.map(seqSettings => {
        if (isValidSequence(seqSettings)) {
            sequenceNames.push(seqSettings.name);
        } else {
            console.error("One of the sequences in the imported array doesn't match the expected format.");
            return null;
        }
        return convertSequenceSettings(seqSettings);
    }).filter(Boolean);

    console.log("Extracted sequence names:", sequenceNames);

    sequenceBPMs = [];
    console.log("Updated sequenceBPMs:", sequenceBPMs);

    if (!Array.isArray(parsedSettings) && sequences.length > 0) {
        if (isValidSequence(parsedSettings)) {
            sequences.push(convertSequenceSettings(parsedSettings));
            sequenceBPMs.push(parsedSettings.bpm || 0);

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

        sequences = parsedSettings.map(seqSettings => {
            if (isValidSequence(seqSettings)) {
                sequenceBPMs.push(seqSettings.bpm || 0);

                let bpm = seqSettings.bpm;
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

    }
        // Set current sequence to last imported
        currentSequence = sequences.length;
        console.log("Number of sequences loaded:", sequences.length);  

        // Activate the quick play button
        setActiveSequence(currentSequence);
        console.log("setActiveSequence to:", currentSequence);  


        channelSettings = sequences[currentSequence - 1];
        updateUIForSequence(currentSequence);

        console.log("Final sequences array:", sequences);

        loadAndDisplaySequence(currentSequence);
    
        console.log("Import settings completed.");
       

console.log("Import settings completed.");

}


function convertSequenceSettings(settings) {
    let channels = settings.channels;
    if (channels.length < 16) {
        let emptyChannelsToAdd = 16 - channels.length;
        for (let i = 0; i < emptyChannelsToAdd; i++) {
            channels.push(EMPTY_CHANNEL);
        }
    }

    return channels.map(ch => {
        let convertedChannel = convertChannelToStepSettings(ch);
        console.log("Converted channel:", convertedChannel);
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


