// synth.js
let context = new (window.AudioContext || window.webkitAudioContext)();
let currentOscillator = null;

function playMS10TriangleBass(frequency = null) {
       console.log(`playMS10TriangleBass called with Frequency: ${frequency},`);
    if (currentOscillator) {
        currentOscillator.stop();
        currentOscillator = null;
    }

    let oscillator = context.createOscillator();
    let gainNode = context.createGain();
    let filter = context.createBiquadFilter();

    let waveformType = document.getElementById("waveform").value;
    oscillator.type = waveformType;

    if (frequency === null) {
        frequency = parseFloat(document.getElementById("note").value);
        if (!isFinite(frequency)) {
            console.error("Invalid frequency value:", frequency);
            return;
        }
    }

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    let attackTime = document.getElementById("attack").value / 1000;
    let releaseTime = document.getElementById("release").value / 1000;
    let cutoffFrequency = document.getElementById("cutoff").value;
    let resonance = document.getElementById("resonance").value;

    filter.type = "lowpass";
    filter.frequency.value = cutoffFrequency;
    filter.Q.value = resonance;

    gainNode.gain.setValueAtTime(0, context.currentTime);
    const volume = getVolume();

    gainNode.gain.linearRampToValueAtTime(2 * volume, context.currentTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + attackTime + releaseTime);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + attackTime + releaseTime);

    currentOscillator = oscillator;
}

let nextNoteTime = context.currentTime;
