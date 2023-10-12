// importExport.js

const EMPTY_CHANNEL = {
    "url": "",
    "mute": false,
    "triggers": []
};

let newJsonImport = false;
let sequenceBPMs = Array(totalSequenceCount).fill(105);
let collectedURLsForSequences = Array(sequences.length).fill().map(() => []);

function exportSettings() {
    let allSequencesSettings = [];

    // Update the current sequence in the sequences array with the channelSettings
    sequences[currentSequence - 1] = channelSettings;

    sequences.forEach((sequence, seqIndex) => {
        let hasTriggers = false;
        let settings = {
            name: `Sequence_${seqIndex + 1}`,
            bpm: sequenceBPMs[seqIndex],
            channels: [],
        };

        for (let i = 0; i < 16; i++) {
            let channelSteps = sequence[i] || [];
            let url = sequence[i] && sequence[i][0] ? sequence[i][0] : "";
            let triggers = channelSteps.slice(1).map((stepState, stepIndex) => stepState ? stepIndex + 1 : false).filter(Boolean);

            let mute = channels[i] && channels[i].dataset ? channels[i].dataset.muted === 'true' : false;
            if (triggers.length > 0) hasTriggers = true;

            settings.channels.push({ url, mute, triggers });
        }

        if (hasTriggers) allSequencesSettings.push(settings);
    });

    let filename = `Audional_Sequencer_Settings.json`;
    return { settings: JSON.stringify(allSequencesSettings, null, 2), filename };
}

function importSettings(settings) {
    channels.forEach(channel => {
        const channelIndex = parseInt(channel.dataset.id.split('-')[1]) - 1;
        updateMuteState(channel, false);
        setChannelVolume(channelIndex, 1);
    });

    let parsedSettings;
    newJsonImport = true;

    try {
        parsedSettings = JSON.parse(settings);
    } catch (error) {
        console.error("Error parsing settings:", error);
        return;
    }

    if (!Array.isArray(parsedSettings)) {
        parsedSettings = [parsedSettings];
    }

    collectedURLsForSequences = parsedSettings.map(seq => {
        let urlsForSequence = seq.channels.map(ch => ch.url || "");
        return urlsForSequence.concat(Array(16 - urlsForSequence.length).fill(""));
    });

    sequences = parsedSettings.map(seqSettings => isValidSequence(seqSettings) ? convertSequenceSettings(seqSettings) : null).filter(Boolean);

    sequenceBPMs = parsedSettings.map(seq => seq.bpm || 105);

    if (sequences.length === 0) {
        console.error("Imported JSON doesn't match expected format.");
        return;
    }

    currentSequence = 1;
    setActiveSequence(currentSequence);
    channelSettings = sequences[currentSequence - 1];

    const currentSeqSettings = parsedSettings[0];
    currentSeqSettings.channels.forEach((channelData, channelIndex) => {
        const channel = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"]`);
        if (channelData.mute !== undefined) updateMuteState(channel, channelData.mute);
        if (channelData.volume !== undefined) setChannelVolume(channelIndex, channelData.volume);
    });

    updateUIForSequence(currentSequence);
    saveCurrentSequence(currentSequence);
    loadAndDisplaySequence(currentSequence);
}

function isValidSequence(seq) {
    return seq && Array.isArray(seq.channels) && typeof seq.name === 'string';
}

function convertSequenceSettings(settings) {
    return settings.channels.map(ch => convertChannelToStepSettings(ch)).concat(Array(16 - settings.channels.length).fill(EMPTY_CHANNEL));
}

function convertChannelToStepSettings(channel) {
    let stepSettings = [channel.url].concat(Array(64).fill(false));
    channel.triggers.forEach(i => {
        stepSettings[i] = true;
    });
    return stepSettings;
}
