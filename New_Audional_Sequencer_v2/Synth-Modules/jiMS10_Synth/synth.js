// synth.js
const audioContextOptions = { sampleRate: 48000 }; // Example: Set to 48000 Hz
window.context = new (window.AudioContext || window.webkitAudioContext)();
let currentOscillator = null;
window.gainNode = context.createGain();
window.gainNode.connect(context.destination);
let noteCount = 0; // Counter for notes played

let globalSequencerChannelIndex = null;

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

    // Listen for messages from the parent window
    window.addEventListener('message', event => {
        if (event.origin !== window.location.origin) return;
    
        // Check for the correct property key based on what you send from the parent
        if (typeof event.data.channelIndex !== 'undefined') {
            globalSequencerChannelIndex = event.data.channelIndex;
            console.log('[synth.js] Received channel index:', globalSequencerChannelIndex);
        } else {
            console.error('Channel index was not provided in the message');
        }
    });

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


function setupOscillatorAndComponents(oscillator, gainNode, filter, distortion, frequency) {
    let attackTime = parseFloat(document.getElementById("attack").value) / 1000;
    let releaseTime = parseFloat(document.getElementById("release").value) / 1000;

    // Apply ADSR envelope based on the current UI settings
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + attackTime + releaseTime);

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

