// index_v2.1.1.1.js

const activeTimeouts = new Set();
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffersCache = []; // Cache for audio buffers
let isInitialPlay = true; // Flag to check if it's the initial play
if (!audioContext) alert('Web Audio API is not supported in this browser');




let BPM, isLooping = true, isStoppedManually = false, cumulativeOffset = 0, sequenceData;
const activeSources = new Set();

const customLog = (message, isError = false) => {
    console[isError ? 'error' : 'log'](message);
};

const base64ToArrayBuffer = base64 => {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
};

// Updated function with caching mechanism
const fetchAndDecodeAudio = async (url) => {
    if (audioBuffersCache[url]) {
        return audioBuffersCache[url]; // Use cached buffer if available
    }
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        let arrayBuffer;
        if (contentType && contentType.includes('audio/')) {
            arrayBuffer = await response.arrayBuffer(); // Directly use ArrayBuffer for audio content
        } else {
            // Additional content-type checks and conversions to ArrayBuffer
            const text = await response.text();
            if (contentType && contentType.includes('application/json')) {
                const base64String = JSON.parse(text).audioData.split(',')[1];
                arrayBuffer = base64ToArrayBuffer(base64String);
            } else if (contentType && contentType.includes('text/html')) {
                // Extract base64 audio data from HTML and convert
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const audioDataElement = doc.querySelector('audio[data-base64]');
                if (!audioDataElement) throw new Error('Audio data not found in HTML');
                const base64String = audioDataElement.getAttribute('data-base64').split(',')[1];
                arrayBuffer = base64ToArrayBuffer(base64String);
            } else {
                throw new Error(`Unsupported content type: ${contentType}`);
            }
        }
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffersCache[url] = audioBuffer; // Cache the decoded buffer
        return audioBuffer;
    } catch (error) {
        customLog(`Error loading audio file: ${error}`, true);
        return null;
    }
};

// Load audio file simplification assumes fetchAndDecodeAudio only throws for critical errors
const loadAudioFile = url => url ? fetchAndDecodeAudio(url) : customLog('URL is invalid or missing', true);


const calculateTrimTimes = (trimSettings, totalDuration) => {
    const startTime = Math.max(0, (trimSettings.startSliderValue / 100) * totalDuration),
        endTime = (trimSettings.endSliderValue / 100) * totalDuration;
    return { startTime, duration: Math.max(0, endTime - startTime) };
};

const calculateStepTime = () => 60 / BPM / 4;

const createAndStartAudioSource = (audioBuffer, trimSettings, playbackTime, channelIndex) => {
    if (!audioBuffer) return;

    const { startTime, duration } = calculateTrimTimes(trimSettings, audioBuffer.duration);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    
    // Adjust playbackTime to ensure seamless looping
    const scheduledStartTime = audioContext.currentTime + playbackTime + cumulativeOffset;
    source.start(scheduledStartTime, startTime, duration);

    // Store reference for potential future adjustments
    activeSources.add({ source, scheduledEndTime: scheduledStartTime + duration });
};

const playAudio = async () => {
    if (!sequenceData || !sequenceData.projectURLs || !sequenceData.projectSequences) {
        customLog("No valid sequence data available. Cannot play audio.", true);
        return;
    }
    BPM = sequenceData.projectBPM;

    // This time, we won't stop audio but rather allow sequences to overlap slightly during the loop transition
    // stopAudio(); // Consider removing or reworking this call to fit the new seamless logic

    // Initial buffer loading logic remains unchanged
    if (isInitialPlay) {
        audioBuffersCache = await Promise.all(sequenceData.projectURLs.map(loadAudioFile));
        isInitialPlay = false;
    }

    if (!audioBuffersCache.some(buffer => buffer)) {
        customLog("No valid audio data available for any channel. Cannot play audio.", true);
        return;
    }

    let lastSequenceEndTime = audioContext.currentTime; // Continuously increment, never reset

    Object.entries(sequenceData.projectSequences).forEach(([sequenceName, channels], sequenceIndex) => {
        const sequenceDuration = 64 * calculateStepTime();

        Object.entries(channels).forEach(([channelName, channelData], channelIndex) => {
            const { steps } = channelData, audioBuffer = audioBuffersCache[channelIndex], trimSetting = sequenceData.trimSettings ? sequenceData.trimSettings[channelIndex] : undefined;
            if (audioBuffer && steps) steps.forEach((active, stepIndex) => {
                if (active) {
                    const playbackTime = lastSequenceEndTime + stepIndex * calculateStepTime() - audioContext.currentTime;
                    schedulePlaybackForStep(audioBuffer, trimSetting, playbackTime, channelIndex, stepIndex, sequenceIndex);
                }
            });
        });

        lastSequenceEndTime += sequenceDuration;
    });

    // Seamlessly continue playback by scheduling the next play without resetting times
    // Use `lastSequenceEndTime - audioContext.currentTime` to delay the next loop just right
    if (isLooping && !isStoppedManually) {
        const delayForNextLoop = Math.max(0, lastSequenceEndTime - audioContext.currentTime);
        setTimeout(playAudio, delayForNextLoop * 1000); // Schedule the next loop to start right after the last sequence ends
    }
};

const schedulePlaybackForStep = (audioBuffer, trimSettings, playbackTime, channelIndex, stepIndex, sequenceIndex) => {
    createAndStartAudioSource(audioBuffer, trimSettings, playbackTime, channelIndex);
    const delayUntilPlayback = playbackTime * 1000;

    const timeoutId = setTimeout(() => {
        console.log(`Playing sequence ${sequenceIndex} channel ${channelIndex} step ${stepIndex}`);
        document.dispatchEvent(new CustomEvent('channelPlaybackStarted', { detail: { sequenceIndex, channelIndex, stepIndex } }));
    }, delayUntilPlayback);

    activeTimeouts.add(timeoutId);
};


// Adjust or remove stopAudio as needed, considering that activeSources are now managed differently
const stopAudio = () => {
    activeSources.forEach(entry => {
        const { source } = entry;
        source.stop();
        source.disconnect();
    });
    activeSources.clear();

    activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    activeTimeouts.clear();

    isStoppedManually = true;
    // Possibly manage isLooping here to prevent new loops from starting
};

// Setup UI Handlers simplified by using optional chaining and removing redundant checks
const setupUIHandlers = () => {
    document.getElementById('playButton')?.addEventListener('click', () => { isLooping = true; playAudio(); });
    document.getElementById('stopButton')?.addEventListener('click', stopAudio);

    document.getElementById('fileInput')?.addEventListener('change', async (event) => {
        try {
            const file = event.target.files[0];
            if (!file) throw new Error('No file selected');
            sequenceData = JSON.parse(await file.text());
            validateAudioData(sequenceData);
            document.getElementById('playButton').disabled = false;
        } catch (err) {
            document.getElementById('playButton').disabled = true;
            customLog(`Error processing sequence data: ${err}`, true);
        }
    });
};

setupUIHandlers();

const validateAudioData = (data) => {
    if (!data.trimSettings || !data.projectSequences?.Sequence0?.ch0?.steps || data.projectSequences.Sequence0.ch0.steps.length !== 64 || !data.projectBPM) {
        throw new Error('Invalid or missing data in JSON');
    }
};

const readFileAsJSON = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(JSON.parse(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
});


document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        // Assuming sequenceData is a global variable in your script
        sequenceData = JSON.parse(e.target.result);

        // New logic to log master settings as soon as the file is loaded
        if (!sequenceData || !sequenceData.projectURLs || !sequenceData.projectSequences) {
            console.error("No valid sequence data available. Cannot play audio.");
            return;
        }
        const totalSequences = Object.keys(sequenceData.projectSequences).length;
        console.log(`Master Settings: BPM=${sequenceData.projectBPM}, Channels=${sequenceData.projectURLs.length}, Total Sequences=${totalSequences}`);

        // Initialize audio or validate sequence data here if needed
    };
    reader.readAsText(file);
});
