// synth.js

let context = new (window.AudioContext || window.webkitAudioContext)();

function playMS10TriangleBass(frequency = null) {
    let oscillator = context.createOscillator();
    let gainNode = context.createGain();
    let filter = context.createBiquadFilter();

    let waveformType = document.getElementById('waveform').value;
    oscillator.type = waveformType;

    if (frequency === null) {
        frequency = parseFloat(document.getElementById('note').value);
        if (!isFinite(frequency)) {
            console.error("Invalid frequency value:", frequency);
            return;  // Exit the function to prevent further errors
        }
    }

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    let attack = document.getElementById('attack').value / 1000;
    let release = document.getElementById('release').value / 1000;
    let cutoff = document.getElementById('cutoff').value;
    let resonance = document.getElementById('resonance').value;

    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    filter.Q.value = resonance;

    gainNode.gain.setValueAtTime(0, context.currentTime);
    const currentVolume = getVolume();
    gainNode.gain.linearRampToValueAtTime(currentVolume * 2, context.currentTime + attack); // Adjusted gain based on volume
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + attack + release);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + attack + release);
}
