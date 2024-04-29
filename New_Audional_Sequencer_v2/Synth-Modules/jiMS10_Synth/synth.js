// synth.js
const audioContextOptions = { sampleRate: 48000 }; // Example: Set to 48000 Hz
window.context = new (window.AudioContext || window.webkitAudioContext)();
let currentOscillator = null;
window.gainNode = context.createGain();
window.gainNode.connect(context.destination);
let noteCount = 0; // Counter for notes played

// Global objects to track oscillators by frequency
const activeOscillators = {};

// Function to ensure AudioContext is resumed
function resumeAudioContext() {
    if (context.state === 'suspended') {
        context.resume().then(() => {
            console.log("AudioContext resumed successfully");
        }).catch(e => console.error("Error resuming AudioContext:", e));
    }
}

// Function to purge old oscillators if there are too many
function purgeAudioNodes() {
    console.log("Purging unused audio nodes");
    Object.keys(activeOscillators).forEach(key => {
        activeOscillators[key].stop();
        activeOscillators[key].disconnect();
        delete activeOscillators[key];
    });
}

function playMS10TriangleBass(frequency = null) {
    resumeAudioContext(); // Ensure the AudioContext is active
    console.log(`playMS10TriangleBass called with Frequency: ${frequency}`);

    // Increment note count and check for purge
    noteCount++;
    if (noteCount >= 5) { // Purge every 40 notes
        purgeAudioNodes();
    }

    // Stop and clear the previous oscillator if it exists
    if (currentOscillator) {
        currentOscillator.stop();
        currentOscillator.disconnect();
        currentOscillator = null;
    }

    // Create and setup audio components as before
    let oscillator = context.createOscillator();
    let gainNode = context.createGain();
    let filter = context.createBiquadFilter();
    let distortion = context.createWaveShaper();
    setupOscillatorAndComponents(oscillator, gainNode, filter, distortion, frequency);

    // Start and stop the oscillator based on the attack and release times
    oscillator.start();
    oscillator.stop(context.currentTime + parseFloat(document.getElementById("release").value) / 1000);

    // Keep track of the current oscillator
    currentOscillator = oscillator;
}

function setupOscillatorAndComponents(oscillator, gainNode, filter, distortion, frequency) {
    // Configuration and setup logic as previously defined
    let waveformType = document.getElementById("waveform").value;
    let distortionAmount = parseFloat(document.getElementById("distortion").value);
    oscillator.type = waveformType;
    oscillator.frequency.setValueAtTime(frequency || parseFloat(document.getElementById("note").value), context.currentTime);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(parseFloat(document.getElementById("cutoff").value), context.currentTime);
    filter.Q.setValueAtTime(parseFloat(document.getElementById("resonance").value), context.currentTime);
    distortion.curve = makeDistortionCurve(distortionAmount);
    distortion.oversample = '4x';
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(getVolume(), context.currentTime + parseFloat(document.getElementById("attack").value) / 1000);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + (parseFloat(document.getElementById("attack").value) + parseFloat(document.getElementById("release").value)) / 1000);
    oscillator.connect(distortion);
    distortion.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(window.gainNode);
}



function makeDistortionCurve(amount) {
    let n_samples = 44100,
        curve = new Float32Array(n_samples),
        deg = Math.PI / 180,
        i = 0,
        x;
    for ( ; i < n_samples; ++i ) {
        x = i * 2 / n_samples - 1;
        curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}
