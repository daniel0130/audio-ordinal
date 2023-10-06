// synth.js

let context = new (window.AudioContext || window.webkitAudioContext)();

function playMS10TriangleBass(frequency = null) {
    // Fetch values from DOM elements
    let waveformType = document.getElementById('waveform').value;
    let attack = parseFloat(document.getElementById('attack').value) / 1000;
    let release = parseFloat(document.getElementById('release').value) / 1000;
    let cutoff = parseFloat(document.getElementById('cutoff').value);
    let resonance = parseFloat(document.getElementById('resonance').value);
    let currentVolume = getVolume();

    // Error checks
    if (!isFinite(attack) || !isFinite(release) || !isFinite(cutoff) || !isFinite(resonance) || !isFinite(currentVolume)) {
        console.error("Invalid parameter values.");
        return;
    }

    if (frequency === null) {
        frequency = parseFloat(document.getElementById('note').value);
        if (!isFinite(frequency)) {
            console.error("Invalid frequency value:", frequency);
            return;  // Exit the function to prevent further errors
        }
    }

    // Ensure the audio context is running
    if (context.state === "suspended") {
        context.resume();
    }

    // Create and set up the oscillator
    let oscillator = context.createOscillator();
    oscillator.type = waveformType;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);

    // Create and set up the filter
    let filter = context.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = cutoff;
    filter.Q.value = resonance;

    // Create and set up the gain node for volume control
    let gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(currentVolume * 2, context.currentTime + attack);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + attack + release);

    // Connect the nodes in series: oscillator -> filter -> gain -> output
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    // Start the oscillator and schedule its stop
    oscillator.start();
    oscillator.stop(context.currentTime + attack + release);
}
