// synth.js

import { pianoFrequencies } from './frequencyTable.js';


let context = new (window.AudioContext || window.webkitAudioContext)();
let currentOscillator = null;

function getValidFrequency(frequencyInput) {
    let frequency = parseFloat(frequencyInput);
    if (isNaN(frequency) || frequency < 20 || frequency > 20000) {
        console.error("Invalid frequency value. Using default Middle C (261.63 Hz)");
        return 261.63; // Corrected default to Middle C
    }
    return frequency;
}

function getVolume() {
    let volumeControl = document.getElementById("volume");
    return volumeControl ? volumeControl.value / 100 : 1; // Assumes volume control is a slider from 0 to 100
}


function play() {
    let noteIndex = document.getElementById("noteSlider").value;
    let frequency = pianoFrequencies[noteIndex];
    playMS10TriangleBass(frequency);
}

function playMS10TriangleBass(frequency) {
    if (currentOscillator) {
        currentOscillator.forEach(osc => osc.stop());
    }
    currentOscillator = [];

    let primaryOscillator = createOscillator(frequency, document.getElementById("waveform").value);
    let subOscillator = createOscillator(frequency / 2, 'sine');
    let detuneOscillator = createOscillator(frequency, document.getElementById("waveform").value, 10);

    let gainNode = context.createGain();
    let filter = createFilter();
    let panner = new StereoPannerNode(context, {pan: 0}); // Implement stereo spread control if needed

    configureEnvelope(gainNode);

    [primaryOscillator, subOscillator, detuneOscillator].forEach(osc => {
        osc.connect(filter);
        currentOscillator.push(osc); // Store oscillators to manage later
    });

    filter.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(context.destination);

    currentOscillator.forEach(osc => osc.start());
}

function createOscillator(frequency, type, detune = 0) {
    let oscillator = context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.detune.setValueAtTime(detune, context.currentTime);
    return oscillator;
}

function createFilter() {
    let filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = document.getElementById("cutoff").value;
    filter.Q.value = document.getElementById("resonance").value;
    return filter;
}

function configureEnvelope(gainNode) {
    let attackTime = document.getElementById("attack").value / 1000;
    let releaseTime = document.getElementById("release").value / 1000;
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(getVolume(), context.currentTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + attackTime + releaseTime);
}

document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById("playButton");
    if (playButton) {
        playButton.addEventListener("click", play);
    } else {
        console.error("Play button not found");
    }
});

export { playMS10TriangleBass };
