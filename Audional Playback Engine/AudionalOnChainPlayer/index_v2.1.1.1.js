// index_v2.1.1.1.js

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
if (!audioContext) alert('Web Audio API is not supported in this browser');

const channelPlaybackBroadcast = new BroadcastChannel('channel_playback');
const activeTimeouts = new Set();
let audioBuffersCache = new Map(); // Changed from array to Map for efficient lookup
let isInitialPlay = true, loopTimeoutId = null, BPM, isLooping = true, isStoppedManually = false, cumulativeOffset = 0, sequenceData;
const activeSources = new Set();

// Simplified logging function
const customLog = (message, isError = false) => console[isError ? 'error' : 'log'](message);
const base64ToArrayBuffer = base64 => Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;

const fetchAndDecodeAudio = async (url) => {
    // Check if the buffer already exists in the cache
    if (audioBuffersCache.has(url)) {
        console.log(`[Player Debugging] Buffer already cached for URL: ${url}`);
        return audioBuffersCache.get(url);
    }

    try {
        const fullUrl = formatURL(url); // Ensure URL formatting for consistency
        console.log('[Player Debugging] fetchAndDecodeAudio entered. URL:', fullUrl);

        const response = await fetch(fullUrl);
        const contentType = response.headers.get('Content-Type');
        let audioData;

        // Handle HTML content that may contain embedded audio data
        if (contentType && contentType.includes('text/html')) {
            console.log('[Player Debugging] HTML content detected, extracting audio data...');
            const htmlText = await response.text();
            const extractedAudioData = await importHTMLAudioData(htmlText);
            if (!extractedAudioData) {
                console.log('[Player Debugging] No audio data extracted from HTML content.');
                return null;
            }

            audioData = extractedAudioData.startsWith('data:') ?
                base64ToArrayBuffer(extractedAudioData.split(',')[1]) :
                await fetch(extractedAudioData).then(res => res.arrayBuffer());
        } else {
            // Directly handle audio file content
            audioData = await response.arrayBuffer();
        }

        // Decode the audio data and add it to the cache upon success
        return new Promise((resolve, reject) => {
            audioContext.decodeAudioData(audioData, buffer => {
                console.log('[Player Debugging] Audio data decoded successfully. URL:', fullUrl);
                audioBuffersCache.set(fullUrl, buffer);
                resolve(buffer);
            }, error => {
                console.error('[Player Debugging] Failed to decode audio data:', error);
                reject(error);
            });
        });
    } catch (error) {
        console.error('[Player Debugging] Error fetching or processing audio data:', error);
        return null;
    }
};


// Simplified loadAudioFile, removed redundant checks
const loadAudioFile = url => fetchAndDecodeAudio(url);

const calculateTrimTimes = (trimSettings, totalDuration) => ({
    startTime: Math.max(0, (trimSettings.start / 100) * totalDuration),
    duration: Math.max(0, (trimSettings.end / 100) * totalDuration - Math.max(0, (trimSettings.start / 100) * totalDuration))
});

const calculateStepTime = () => 60 / BPM / 4;

const createAndStartAudioSource = (audioBuffer, trimSettings, playbackTime, channelIndex) => {
    const { startTime, duration } = calculateTrimTimes(trimSettings, audioBuffer.duration);
    console.log(`Channel ${channelIndex}: Scheduled to start at ${scheduledStartTime} with duration ${duration}`);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    const scheduledStartTime = audioContext.currentTime + playbackTime + cumulativeOffset;
    source.start(scheduledStartTime, startTime, duration);
    activeSources.add({ source, scheduledEndTime: scheduledStartTime + duration });
};

// In the part of the code where you initiate playback
const initiatePlayback = async () => {
    if (audioContext.state !== 'running') {
        console.log('[Player Debugging] Attempting to resume AudioContext');
        await audioContext.resume();
    }

    // Fetch and decode audio for each URL and store the promises in an array
    const bufferPromises = sequenceData.channelURLs.map(url => fetchAndDecodeAudio(url));

    Promise.all(bufferPromises)
        .then(buffers => {
            console.log('[Player Debugging] All audio buffers loaded successfully.');
            playAudio(); // Assuming playAudio does not need the buffers directly passed but uses a globally accessible cache
        })
        .catch(error => {
            console.error('[Player Debugging] Error loading one or more audio buffers:', error);
        });
};


// Function to start audio playback, assuming buffers are passed and ready for use
const playAudio = () => {
    console.log('[Player Debugging] Starting playback with loaded buffers...');

    if (!sequenceData || !sequenceData.channelURLs || !sequenceData.projectSequences) {
        console.log("No valid sequence data available. Cannot play audio.", true);
        return;
    }

    isStoppedManually = false;
    isLooping = true;
    BPM = sequenceData.projectBPM;
    let lastSequenceEndTime = audioContext.currentTime; // Continuous increment, never reset

    // Iterate through each sequence and channel for playback
    Object.entries(sequenceData.projectSequences).forEach(([sequenceName, channels]) => {
        const sequenceDuration = 64 * calculateStepTime();
        
        Object.entries(channels).forEach(([channelName, channelData], channelIndex) => {
            const audioBuffer = audioBuffersCache.get(sequenceData.channelURLs[channelIndex]);
            const trimSettings = sequenceData.trimSettings[channelIndex] || { start: 0, end: 100 }; // Fallback to default trim settings if none provided

            if (audioBuffer) {
                channelData.steps.forEach((isActive, stepIndex) => {
                    if (isActive) {
                        const playbackTime = lastSequenceEndTime + stepIndex * calculateStepTime();
                        createAndStartAudioSource(audioBuffer, trimSettings, playbackTime, channelIndex);
                    }
                });
            }
        });

        lastSequenceEndTime += sequenceDuration;
    });

    // Schedule the next play without resetting times for seamless looping
    if (isLooping && !isStoppedManually) {
        const delayForNextLoop = Math.max(0, lastSequenceEndTime - audioContext.currentTime);
        loopTimeoutId = setTimeout(playAudio, delayForNextLoop * 1000); // Convert to milliseconds
    }
};


const schedulePlaybackForStep = (audioBuffer, trimSettings, playbackTime, channelIndex, stepIndex, sequenceIndex) => {
    const createAndStartAudioSource = (audioBuffer, trimSettings, playbackTime, channelIndex) => {
        if (!audioBuffer) {
            console.log(`No audioBuffer for channel index: ${channelIndex}`);
            return;
        }
        const { startTime, duration } = calculateTrimTimes(trimSettings, audioBuffer.duration);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        const scheduledStartTime = audioContext.currentTime + playbackTime + cumulativeOffset;
        source.start(scheduledStartTime, startTime, duration);
        console.log(`Audio source started for channel index: ${channelIndex} at ${scheduledStartTime}, duration: ${duration}`);
        activeSources.add({ source, scheduledEndTime: scheduledStartTime + duration });
    };
}

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

    if (loopTimeoutId !== null) {
        clearTimeout(loopTimeoutId); // Clear the loop scheduling timeout
        loopTimeoutId = null; // Reset the reference
    }

    channelPlaybackBroadcast.postMessage({ action: "stop" });

    isStoppedManually = true; // Ensure this flag is correctly managed in your logic
    isLooping = false;
    // Consider toggling isLooping as necessary based on your app's needs
};

document.addEventListener('DOMContentLoaded', () => {
    const playButton = document.getElementById('playButton');
    const stopButton = document.getElementById('stopButton');
    const fileInput = document.getElementById('fileInput');

    playButton.addEventListener('click', async () => {
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        if (!audioBuffersCache.size || Array.from(audioBuffersCache.values()).every(buffer => !buffer)) {
            customLog("No audio buffers available for playback.", true);
            return;
        }

        console.log("Audio buffers ready for playback:", Array.from(audioBuffersCache.entries()));

        isLooping = true; 
        playAudio();
    });

    stopButton.addEventListener('click', stopAudio);

    fileInput.addEventListener('change', handleFileInputChange);
});

async function handleFileInputChange(event) {
    const file = event.target.files[0];
    if (file) {
        try {
            const text = await readFileAsJSON(file);
            processAndValidateSequenceData(text);
            document.getElementById('playButton').disabled = false;
        } catch (error) {
            console.error(`Error processing sequence data: ${error}`);
            document.getElementById('playButton').disabled = true;
        }
    } else {
        customLog('No file selected or an error occurred.', true);
        document.getElementById('playButton').disabled = true;
    }
}

function processAndValidateSequenceData(data) {
    if (!data.projectSequences || Object.values(data.projectSequences).some(sequence => 
        Object.values(sequence).some(channel => 
            !channel.steps || !Array.isArray(channel.steps) || channel.steps.some(step => typeof step !== 'number')))) {
        throw new Error('Invalid or missing data in sequence steps');
    }
    // Initialize sequenceData object if not already initialized
    sequenceData = sequenceData || {};
    // Assign properties from the input data
    sequenceData.projectURLs = data.channelURLs ? data.channelURLs.map(url => formatURL(url)) : [];
    sequenceData.projectBPM = data.projectBPM;
    sequenceData.trimSettings = data.trimSettings;
}

const readFileAsJSON = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(JSON.parse(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
});

const BASE_ORDINALS_URL = 'https://ordinals.com/content/';

function isValidOrdinalsUrl(url) {
    const regex = new RegExp(`^${BASE_ORDINALS_URL}[a-f0-9]{64}i\\d+$`);
    return regex.test(url);
}

function formatId(id) {
    const regex = new RegExp(`^[a-f0-9]{64}i\\d+$`);
    if (!regex.test(id)) {
        console.error("Invalid ID format:", id);
        return null;
    }
    return id;
}

function formatURL(url) {
    if (url.startsWith(BASE_ORDINALS_URL)) {
        return url;
    }
    const regexPattern = new RegExp(`^${BASE_ORDINALS_URL}${BASE_ORDINALS_URL}(.+)`);
    const match = url.match(regexPattern);
    if (match && match[1]) {
        return BASE_ORDINALS_URL + match[1];
    }
    if (url.match(/^[a-f0-9]{64}i\d+$/)) {
        return BASE_ORDINALS_URL + url;
    }
    return url;
}

function toFullUrl(id) {
    if (!id) return null;
    return BASE_ORDINALS_URL + formatId(id);
}

function extractIdFromUrl(url) {
    if (!isValidOrdinalsUrl(url)) {
        console.error("Invalid Ordinals URL:", url);
        return null;
    }
    return url.replace(BASE_ORDINALS_URL, '');
}

async function importHTMLAudioData(htmlContent, index) {
    console.log("[importHTMLSampleData] Entered function with index: ", index);
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const sourceElement = doc.querySelector('audio[data-audionalSampleName] source');
  
        if (sourceElement) {
            const base64AudioData = sourceElement.getAttribute('src');
            if (base64AudioData.toLowerCase().startsWith('data:audio/wav;base64,') || base64AudioData.toLowerCase().startsWith('data:audio/mp3;base64,')) {
                console.log("[importHTMLSampleData] Extracted base64 audio data.");
                return base64AudioData;
            } else {
                console.error("[importHTMLSampleData] Audio data does not start with expected base64 prefix.");
            }
        } else {
            console.error("[importHTMLSampleData] Could not find the audio source element in the HTML content.");
        }
    } catch (error) {
        console.error("[importHTMLSampleData] Error parsing HTML content: ", error);
    }
    return null;
}
