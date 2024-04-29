// saveLoadMidiRecordingJsonFiles.js

// Helper functions for abbreviation and expansion
const settingsMap = {
    waveform: 'wf', note: 'nt', attack: 'atk', release: 'rls',
    cutoff: 'ctf', resonance: 'rsn', volume: 'vol'
};

// Toggle between abbreviating and expanding data
function toggleData(data, operation = 'abbreviate') {
    const toggleSettings = (obj, reverse = false) => 
        Object.entries(obj).reduce((acc, [key, value]) => {
            const newKey = reverse ? Object.keys(settingsMap).find(k => settingsMap[k] === key) : settingsMap[key];
            acc[newKey || key] = value;
            return acc;
        }, {});

    if (operation === 'abbreviate') {
        if (data.midiRecording) {
            data.mR = data.midiRecording.map(({ timestamp, message }) => ({ ts: timestamp, msg: message }));
            delete data.midiRecording;
        }
        if (data.settings) {
            data.st = toggleSettings(data.settings);
            delete data.settings;
        }
    } else {
        if (data.mR) {
            data.midiRecording = data.mR.map(({ ts, msg }) => ({ timestamp: ts, message: msg }));
            delete data.mR;
        }
        if (data.st) {
            data.settings = toggleSettings(data.st, true);
            delete data.st;
        }
    }
    return data;
}

// Retrieve synth settings from DOM
function getSynthSettings() {
    return Object.keys(settingsMap).reduce((acc, key) => {
        acc[key] = document.getElementById(key).value;
        return acc;
    }, {});
}

// Save MIDI recording to a JSON file
function saveMIDIRecording() {
    const data = toggleData({ midiRecording, settings: getSynthSettings() }, 'abbreviate');
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.href = dataStr;
    downloadAnchorNode.download = "midiRecording.json";
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Load MIDI recording from a JSON file
function loadMIDIRecording(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const data = toggleData(JSON.parse(event.target.result), 'expand');
        midiRecording = data.midiRecording;
        setSynthSettings(data.settings);
    };
    reader.readAsText(file);
}

// Apply loaded settings to synth sliders
function setSynthSettings(settings) {
    Object.entries(settings).forEach(([key, value]) => {
        const slider = document.getElementById(key);
        if (slider) {
            slider.value = value;
            slider.dispatchEvent(new Event('input'));
        }
    });
}

// Setup event listeners
document.getElementById('createMidiJsonFile').addEventListener('click', saveMIDIRecording);
document.getElementById('loadMidiJsonFile').addEventListener('change', loadMIDIRecording);

// This optimized version simplifies data processing by merging abbreviation and expansion logic into a single function.
// It also improves readability and efficiency by using modern JavaScript features such as template literals, arrow functions, and destructuring assignments.
