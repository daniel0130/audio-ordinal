// saveLoadHandler.js
import { clearMidiRecording, addMidiRecording, getMidiRecording } from './midiRecording.js';
import { arpNotes, isArpeggiatorOn, startArpeggiator, stopArpeggiator } from './arpeggiator.js';
import { updateUIFromSettings } from './uiHandler.js';

const SYNTH_CHANNEL = new URLSearchParams(window.location.search).get('channelIndex');

const channelSettingsMap = new Map();

export function saveToLocalStorage(settings) {
    const settingsKey = `synth_settings_${SYNTH_CHANNEL}`;
    localStorage.setItem(settingsKey, JSON.stringify(settings));
}

export function loadFromLocalStorage() {
    const settingsKey = `synth_settings_${SYNTH_CHANNEL}`;
    try {
        const settingsJSON = localStorage.getItem(settingsKey);
        if (settingsJSON) {
            const settings = JSON.parse(settingsJSON);
            loadSettingsFromObject(settings);
        } else {
            loadDefaultSettings();
        }
    } catch (e) {
        console.error('Failed to load settings from local storage:', e);
        loadDefaultSettings();  // Fallback to default settings on error
    }
}

export function loadDefaultSettings() {
    const defaultSettings = {
        waveform: 'Sawtooth',  // Default waveform setting from the screenshot
        attack: 25,            // Assumed default value from the screenshot
        release: 75,           // Assumed default value from the screenshot
        cutoff: 600,           // Assumed default value from the screenshot
        resonance: 40,         // Assumed default value from the screenshot
        volume: 80,            // Assumed default value from the screenshot
        arpTempo: 120,         // Default BPM setting from the screenshot
        arpPattern: 'Up',      // Default pattern, placeholder as it's not visible in the screenshot
        arpSpeed: '1/16',      // Default speed, placeholder as it's not visible in the screenshot
        timingAdjust: 0,       // Default adjustment, placeholder as it's not visible in the screenshot
        arpNotes: [],          // Empty array for arp notes
        midiRecording: []      // Assuming no MIDI recording is loaded by default
    };

    // Apply the default settings to the UI
    updateUIFromSettings(defaultSettings);

    // Update these settings in local storage as well
    saveToLocalStorage(defaultSettings);
}

// Function to retrieve the current settings of the synthesizer
export function getCurrentSynthSettings() {
    return {
        channelIndex: SYNTH_CHANNEL,
        waveform: document.getElementById('waveform').value,
        attack: document.getElementById('attack').value,
        release: document.getElementById('release').value,
        cutoff: document.getElementById('cutoff').value,
        resonance: document.getElementById('resonance').value,
        volume: document.getElementById('volume').value,
        arpTempo: document.getElementById('arpTempo').value,
        arpPattern: document.getElementById('arpPattern').value,
        arpSpeed: document.getElementById('arpSpeed').value,
        timingAdjust: document.getElementById('timingAdjust').value,
        arpNotes: [...arpNotes],
        midiRecording: getMidiRecording()
    };
}

// Function to save current settings to a file
export function saveSettings() {
    const settings = getCurrentSynthSettings();
    const settingsJson = JSON.stringify(settings, null, 2);
    const blob = new Blob([settingsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    channelSettingsMap.set(SYNTH_CHANNEL, url);

    const a = document.createElement('a');
    a.href = url;
    a.download = `synth_settings_channel_${SYNTH_CHANNEL}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to load settings from a file
export function loadSettings(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const settings = JSON.parse(e.target.result);
        if (settings.channelIndex === SYNTH_CHANNEL) {
            loadSettingsFromObject(settings);
        } else {
            console.error(`Loaded settings do not match the current channel index: ${SYNTH_CHANNEL}`);
        }
    };
    reader.readAsText(file);
}

// Function to apply loaded settings to the synthesizer
export function loadSettingsFromObject(settings) {
    console.log('Loading settings from object:', settings);

    // Update UI and system state from settings
    updateUIFromSettings(settings);
    arpNotes.splice(0, arpNotes.length, ...settings.arpNotes);
    clearMidiRecording();
    settings.midiRecording.forEach(event => addMidiRecording(event));

    if (isArpeggiatorOn) {
        stopArpeggiator();
        startArpeggiator();
    }
}

// Setup UI event listeners
document.getElementById('saveSettings').addEventListener('click', saveSettings);
document.getElementById('loadSettingsFile').addEventListener('change', loadSettings);
document.getElementById('loadSettingsButton').addEventListener('click', () => document.getElementById('loadSettingsFile').click());

