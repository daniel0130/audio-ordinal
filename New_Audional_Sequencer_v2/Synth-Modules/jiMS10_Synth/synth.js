// synth.js
const audioContextOptions = { sampleRate: 48000 }; // Example: Set to 48000 Hz
window.context = new (window.AudioContext || window.webkitAudioContext)();
let currentOscillator = null;
window.gainNode = context.createGain();
window.gainNode.connect(context.destination);

// Function to ensure AudioContext is resumed
function resumeAudioContext() {
    if (context.state === 'suspended') {
        context.resume().then(() => {
            console.log("AudioContext resumed successfully");
        }).catch(e => console.error("Error resuming AudioContext:", e));
    }
}

function playMS10TriangleBass(frequency = null) {
    resumeAudioContext(); // Ensure the AudioContext is active
    console.log(`playMS10TriangleBass called with Frequency: ${frequency}`);

    // Stop and clear the previous oscillator if it exists
    if (currentOscillator) {
        currentOscillator.stop();
        currentOscillator.disconnect(); // Disconnect from the audio graph
        currentOscillator = null;
    }
    // Create audio components
    let oscillator = context.createOscillator();
    let gainNode = context.createGain();
    let filter = context.createBiquadFilter();
    let distortion = context.createWaveShaper();

    // Get user input from the HTML controls
    let waveformType = document.getElementById("waveform").value;
    let distortionAmount = parseFloat(document.getElementById("distortion").value);

    // Check if the waveform type is supported
    if (['sine', 'triangle', 'square', 'sawtooth'].includes(waveformType)) {
        oscillator.type = waveformType;
    } else {
        console.error("Unsupported waveform type: " + waveformType);
        return; // Exit the function if the waveform type is not supported
    }

    // Set oscillator frequency from the provided frequency or from the user interface
    oscillator.frequency.setValueAtTime(frequency || parseFloat(document.getElementById("note").value), context.currentTime);

    // Envelope and filter settings
    let attackTime = parseFloat(document.getElementById("attack").value) / 1000;
    let releaseTime = parseFloat(document.getElementById("release").value) / 1000;
    let cutoffFrequency = parseFloat(document.getElementById("cutoff").value);
    let resonance = parseFloat(document.getElementById("resonance").value);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(cutoffFrequency, context.currentTime);
    filter.Q.setValueAtTime(resonance, context.currentTime);

    distortion.curve = makeDistortionCurve(distortionAmount);
    distortion.oversample = '4x';

    // Gain control with attack and release envelope
    gainNode.gain.setValueAtTime(0, context.currentTime);
    const volume = getVolume(); // Assuming getVolume() is a function you've defined elsewhere

    gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + attackTime);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + attackTime + releaseTime);

    // Connect the audio processing graph
    oscillator.connect(distortion);
    distortion.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(window.gainNode);

    // Start and stop the oscillator based on the attack and release times
    oscillator.start();
    oscillator.stop(context.currentTime + attackTime + releaseTime);

    // Keep track of the current oscillator
    currentOscillator = oscillator;
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
