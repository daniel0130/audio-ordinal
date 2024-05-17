// additionalEffects.js

function sendResizeMessage() {
    const minWidth = 300;  // Set your minimum width here
    const minHeight = 150; // Set your minimum height here

    // Reset the dimensions to minimum before recalculating
    document.documentElement.style.width = `${minWidth}px`;
    document.documentElement.style.height = `${minHeight}px`;

    // Force recalculation of dimensions
    let height = document.documentElement.scrollHeight;
    let width = document.documentElement.scrollWidth;

    // Ensure the dimensions are at least the minimum required size
    if (width < minWidth) width = minWidth;
    if (height < minHeight) height = minHeight;

    console.log(`Document width: ${document.documentElement.scrollWidth}, height: ${document.documentElement.scrollHeight}`);
    console.log(`Calculated width: ${width}, height: ${height}`);
    window.parent.postMessage({ type: 'resize', width, height }, '*');
}

// Call sendResizeMessage whenever the content size changes
window.addEventListener('load', () => {
    console.log('Load event triggered');
    sendResizeMessage();
});
window.addEventListener('resize', () => {
    console.log('Resize event triggered');
    sendResizeMessage();
});

// Ensure the dropdown menu element is correct and send resize message on change
const effectSelect = document.getElementById('effect-select');
if (effectSelect) {
    effectSelect.addEventListener('change', () => {
        console.log('Effect select change event triggered');
        setTimeout(() => {
            document.documentElement.style.width = '300px'; // force reset to min width
            document.documentElement.style.height = '150px'; // force reset to min height
            sendResizeMessage();
        }, 100);  // Adding a delay to ensure content updates
    });
}

// Observe changes in the controls container
const controlsContainer = document.getElementById('controls-container');
if (controlsContainer) {
    const observer = new MutationObserver(() => {
        console.log('Mutation observed in controls container');
        setTimeout(() => {
            document.documentElement.style.width = '300px'; // force reset to min width
            document.documentElement.style.height = '150px'; // force reset to min height
            sendResizeMessage();
        }, 100);  // Adding a delay to ensure content updates
    });
    observer.observe(controlsContainer, { childList: true, subtree: true });
}



const getBPM = () => {
    const defaultBPM = 120;
    try {
        const bpm = parseFloat(window.parent.document.getElementById('arpTempo').value);
        return isNaN(bpm) ? defaultBPM : bpm;
    } catch (error) {
        console.error("BPM element not found. Using default BPM of 120.");
        return defaultBPM;
    }
};

const generateImpulseResponse = (audioContext, duration, decay = 2.0) => {
    const sampleRate = audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = audioContext.createBuffer(2, length, sampleRate);
    const [impulseL, impulseR] = [impulse.getChannelData(0), impulse.getChannelData(1)];

    for (let i = 0; i < length; i++) {
        const n = length - i;
        const value = (Math.random() * 2 - 1) * Math.pow(n / length, decay);
        impulseL[i] = value;
        impulseR[i] = value;
    }
    return impulse;
};

const createReverb = (audioContext) => {
    const convolver = audioContext.createConvolver();
    const wetLevel = audioContext.createGain();
    const dryLevel = audioContext.createGain();
    const bypass = audioContext.createGain();
    const reverbBuffers = {
        vocalBooth: generateImpulseResponse(audioContext, 0.1),
        mediumRoom: generateImpulseResponse(audioContext, 0.5),
        largeHall: generateImpulseResponse(audioContext, 1.5)
    };

    wetLevel.gain.value = 0.5;
    dryLevel.gain.value = 0.5;
    bypass.gain.value = 0.0; // Effect is off by default

    return {
        convolverNode: convolver,
        wetLevelNode: wetLevel,
        dryLevelNode: dryLevel,
        bypassNode: bypass,
        setReverbLevel: (level) => { wetLevel.gain.value = level; },
        setDryLevel: (level) => { dryLevel.gain.value = level; },
        setReverbType: (type) => {
            if (reverbBuffers[type]) {
                convolver.buffer = reverbBuffers[type];
            } else {
                console.warn(`Reverb buffer for ${type} not available.`);
            }
        },
        toggleBypass: (isOn) => { bypass.gain.value = isOn ? 0.0 : 1.0; }
    };
};

const createDelay = (audioContext) => {
    const delay = audioContext.createDelay();
    const feedback = audioContext.createGain();
    const wetLevel = audioContext.createGain();
    const bypass = audioContext.createGain();

    delay.delayTime.value = 60 / getBPM();
    feedback.gain.value = 0.5;
    wetLevel.gain.value = 0.5;
    bypass.gain.value = 0.0; // Effect is off by default

    delay.connect(feedback);
    feedback.connect(delay);

    return {
        delayNode: delay,
        wetLevelNode: wetLevel,
        bypassNode: bypass,
        setDelayTime: (time) => { delay.delayTime.value = time; },
        setFeedback: (gain) => { feedback.gain.value = gain; },
        setWetLevel: (gain) => { wetLevel.gain.value = gain; },
        updateWithBPM: () => { delay.delayTime.value = 60 / getBPM(); },
        toggleBypass: (isOn) => { bypass.gain.value = isOn ? 0.0 : 1.0; }
    };
};

const createChorus = (audioContext) => {
    const chorus = audioContext.createDelay();
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();
    const bypass = audioContext.createGain();

    chorus.delayTime.value = 0.005;
    lfo.frequency.value = 1.5;
    lfoGain.gain.value = 0.002;
    bypass.gain.value = 0.0; // Effect is off by default

    lfo.connect(lfoGain);
    lfoGain.connect(chorus.delayTime);
    lfo.start();

    return {
        chorusNode: chorus,
        bypassNode: bypass,
        setDepth: (depth) => { lfoGain.gain.value = depth; },
        setRate: (rate) => { lfo.frequency.value = rate; },
        toggleBypass: (isOn) => { bypass.gain.value = isOn ? 0.0 : 1.0; }
    };
};

const createDistortion = (audioContext) => {
    const distortion = audioContext.createWaveShaper();
    const bypass = audioContext.createGain();

    const makeDistortionCurve = (amount) => {
        const k = amount || 50;
        const n_samples = 44100;
        const curve = new Float32Array(n_samples);
        const deg = Math.PI / 180;
        for (let i = 0; i < n_samples; ++i) {
            const x = i * 2 / n_samples - 1;
            curve[i] = (3 + k) * x * 20 * deg / (Math.PI + k * Math.abs(x));
        }
        return curve;
    };

    distortion.curve = makeDistortionCurve(400);
    distortion.oversample = '4x';
    bypass.gain.value = 0.0; // Effect is off by default

    return {
        distortionNode: distortion,
        bypassNode: bypass,
        setAmount: (amount) => { distortion.curve = makeDistortionCurve(amount); },
        toggleBypass: (isOn) => { bypass.gain.value = isOn ? 0.0 : 1.0; }
    };
};

const createFilter = (audioContext, type = 'lowpass') => {
    const filter = audioContext.createBiquadFilter();
    const bypass = audioContext.createGain();

    filter.type = type;
    filter.frequency.value = 1000;
    filter.Q.value = 1;
    bypass.gain.value = 0.0; // Effect is off by default

    return {
        filterNode: filter,
        bypassNode: bypass,
        setFrequency: (frequency) => { filter.frequency.value = frequency; },
        setQuality: (q) => { filter.Q.value = q; },
        toggleBypass: (isOn) => { bypass.gain.value = isOn ? 0.0 : 1.0; }
    };
};

const createTremolo = (audioContext) => {
    const tremolo = audioContext.createGain();
    const lfo = audioContext.createOscillator();
    const lfoGain = audioContext.createGain();
    const bypass = audioContext.createGain();

    lfo.frequency.value = getBPM() / 60;
    lfoGain.gain.value = 0.5;
    bypass.gain.value = 0.0; // Effect is off by default

    lfo.connect(lfoGain);
    lfoGain.connect(tremolo.gain);
    lfo.start();

    return {
        tremoloNode: tremolo,
        bypassNode: bypass,
        setRate: (rate) => { lfo.frequency.value = rate; },
        setDepth: (depth) => { lfoGain.gain.value = depth; },
        updateWithBPM: () => { lfo.frequency.value = getBPM() / 60; },
        toggleBypass: (isOn) => { bypass.gain.value = isOn ? 0.0 : 1.0; }
    };
};
