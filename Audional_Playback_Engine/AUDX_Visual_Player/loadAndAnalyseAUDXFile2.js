// loadAndAnalyseAUDXFile2.js

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES //

var globalJsonData = null;
let bpm = 0;
let activeSources = []; // Keeps track of active source nodes for stopping them
var globalAudioBuffers = [];
var globalTrimTimes = {}; // This will hold trim times for each channel
let currentStep = 0; // Tracks the current step within the sequence
let beatCount = 0; // Assuming you have a way to count beats
let barCount = 0; // Assuming you have a way to count bars
let currentSequence = 0; // New variable to track the index of the current sequence
let isPlaying = false; // Tracks playback state
let playbackTimeoutId = null; // Holds the timeout ID for stopping playback loop


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// JSON FILE LOADING AND ANALYSIS //

document.addEventListener('DOMContentLoaded', () => {
    loadAndProcessJson('OB1_Song_1.json'); // Adjust the path to where your JSON file is located
});

async function loadAndProcessJson(jsonPath) {
    try {
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        console.log("Loaded JSON data:", jsonData); // Log loaded JSON data

        // Assuming globalJsonData and other global variables/functions are accessible
        globalJsonData = jsonData;

        const stats = {
            channelsWithUrls: 0,
            sequencesCount: 0,
            activeStepsPerSequence: {},
            activeChannelsPerSequence: {},
            types: {}
        };

        analyzeJsonStructure(globalJsonData, '', stats);
        const playbackData = prepareForPlayback(globalJsonData, stats);
        // displayOutput(playbackData);

        await fetchAndProcessAudioData(playbackData.channelURLs);
        preprocessAndSchedulePlayback();
        // Place further initialization logic here if needed
    } catch (error) {
        console.error("Could not load JSON data:", error);
    }
}


const analyzeJsonStructure = (json, parentKey, stats, path = '') => {
    if (json.projectSequences && typeof json.projectSequences === 'object') {
        Object.entries(json.projectSequences).forEach(([seqKey, sequence]) => {
            stats.activeStepsPerSequence[seqKey] = 0;
            stats.activeChannelsPerSequence[seqKey] = [];
            Object.entries(sequence).forEach(([chKey, channel]) => {
                if (channel.steps && Array.isArray(channel.steps) && channel.steps.length > 0) {
                    stats.activeStepsPerSequence[seqKey] += channel.steps.length;
                    stats.activeChannelsPerSequence[seqKey].push(chKey);
                }
            });
        });
    }

    Object.entries(json).forEach(([key, value]) => {
        if (key !== 'projectSequences') {
            const type = Array.isArray(value) ? 'array' : typeof value;
            incrementTypeCount(stats.types, type);
            if (type === 'object' || type === 'array') {
                analyzeJsonStructure(value, key, stats, path ? `${path}.${key}` : key);
            }
        }
    });
};

const incrementTypeCount = (types, type) => {
    types[type] = (types[type] || 0) + 1;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// JSON FILE PREPARATION FOR PLAYBACK //

function prepareForPlayback(json, stats) {
    const { channelURLs, trimSettings, projectSequences, projectName, projectBPM } = json;

    // Update the global bpm variable with the projectBPM from the JSON
    bpm = projectBPM; // Ensure this is done before any use of bpm in your scheduling

    const trimTimes = trimSettings.map((trim, index) => ({
        channel: `Channel ${index + 1}`,
        startTrim: parseFloat(trim.startSliderValue),
        endTrim: parseFloat(trim.endSliderValue)
    }));

    const formattedTrimTimes = trimTimes.map(trim => `${trim.channel}: StartTrim=${trim.startTrim}, EndTrim=${trim.endTrim}`);

    // Populate globalTrimTimes with start and end trim times
    trimSettings.forEach((trim, index) => {
        const channel = `Channel ${index + 1}`;
        globalTrimTimes[channel] = {
            startTrim: parseFloat(trim.startSliderValue) / 100, // Convert to percentage
            endTrim: parseFloat(trim.endSliderValue) / 100 // Convert to percentage
        };
    });

    const formattedSequences = Object.entries(projectSequences).reduce((acc, [sequenceKey, sequenceValue]) => {
        acc[sequenceKey] = Object.entries(sequenceValue).map(([channelKey, channel]) => {
            const activeSteps = channel.steps.length > 0 ? channel.steps.join(', ') : 'No active steps';
            return `${channelKey}: [${activeSteps}]`;
        });
        return acc;
    }, {});

    return {
        projectName,
        bpm: projectBPM,
        channels: channelURLs.length,
        channelURLs,
        trimTimes: formattedTrimTimes,
        stats: {
            channelsWithUrls: stats.channelsWithUrls,
            sequencesCount: stats.sequencesCount,
            activeStepsPerSequence: stats.activeStepsPerSequence,
            activeChannelsPerSequence: stats.activeChannelsPerSequence,
        },
        sequences: formattedSequences
    };
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUDIO DATA FETCHING AND PROCESSING //

// Use async/await with fetch API for cleaner syntax
async function fetchAndProcessAudioData(urls) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Use Promise.all to wait for all fetches to complete
    await Promise.all(urls.map(async (url, index) => {
        const channelNumber = index + 1; // Assuming channel numbering starts at 1
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch from URL: ${url}, Status: ${response.status}`);
            const contentType = response.headers.get('Content-Type');

            // Process direct audio formats (wav, mp3)
            if (/audio\/wav/.test(contentType) || /audio\/mpeg/.test(contentType)) {
                const arrayBuffer = await response.arrayBuffer();
                const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                globalAudioBuffers.push({ buffer: decodedBuffer, channel: `Channel ${channelNumber}` });
                console.log(`AudioBuffer stored for direct audio content at index: ${index}, Channel: ${channelNumber}`);
            } else {
                // Handle non-direct audio formats (e.g., JSON or HTML with base64 encoded data)
                const text = await response.text();
                let base64AudioData;

                if (/application\/json/.test(contentType)) {
                    const json = JSON.parse(text);
                    base64AudioData = json.audioData;
                } else if (/text\/html/.test(contentType)) {
                    base64AudioData = extractBase64FromHTML(text);
                    console.log(`[Channel ${channelNumber}] Extracted base64 audio data from HTML.`);
                }

                if (base64AudioData) {
                    const audioData = base64ToArrayBuffer(base64AudioData.split(',')[1]);
                    const decodedBuffer = await audioCtx.decodeAudioData(audioData);
                    globalAudioBuffers.push({ buffer: decodedBuffer, channel: `Channel ${channelNumber}` });
                    console.log(`AudioBuffer stored for URL at index: ${index}, Channel: ${channelNumber}`);
                }
            }
        } catch (error) {
            console.error(`Error fetching or decoding audio for Channel ${channelNumber}:`, error);
        }
    }));
}

function extractBase64FromHTML(htmlText) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        const audioSource = doc.querySelector("audio[data-audionalSampleName] source");

        if (audioSource) {
            const src = audioSource.getAttribute("src");
            if (/^data:audio\/(wav|mp3);base64,/.test(src.toLowerCase())) {
                console.log("[importHTMLAudioData] Extracted base64 audio data.");
                return src;
            } else {
                console.error("[importHTMLAudioData] Audio data does not start with expected base64 prefix.");
            }
        } else {
            console.error("[importHTMLAudioData] Could not find the audio source element in the HTML content.");
        }
    } catch (error) {
        console.error("[importHTMLAudioData] Error parsing HTML content: ", error);
    }

    return null;
}

// Helper function to convert a base64 string to an ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    bytes.forEach((_, i) => bytes[i] = binaryString.charCodeAt(i));
    return bytes.buffer;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUTOMATIC SEQUENCE PLAYBACK and MESSAGING FUNCTIONS //


// Assuming global variables and initial setup are defined elsewhere
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const AudionalPlayerMessages = new BroadcastChannel('channel_playback');
let preprocessedSequences = {};
let nextNoteTime = 0; // The time when the next note is due.

function preprocessAndSchedulePlayback() {
    if (!globalJsonData?.projectSequences) {
        return console.error("Global sequence data is not available or empty.");
    }

    const bpm = globalJsonData.projectBPM;
    preprocessedSequences = Object.fromEntries(Object.entries(globalJsonData.projectSequences).map(([sequenceKey, channels]) => [
        sequenceKey,
        Object.fromEntries(Object.entries(channels).filter(([, channelData]) => channelData.steps?.length).map(([channelKey, { steps }]) => [
            channelKey,
            steps.map(step => ({ step, timing: step * (60 / bpm) }))
        ]))
    ]));

    console.log("Preprocessed sequences:", preprocessedSequences);
}

// Check if we need to resume the AudioContext due to browser restrictions
function ensureAudioContextState() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
            console.log('AudioContext resumed successfully.');
            startPlaybackLoop(); // Only start the playback loop after ensuring the AudioContext is running
        }).catch(console.error);
    }
}
document.addEventListener('click', ensureAudioContextState);


function startPlaybackLoop() {
    if (!globalJsonData) return;

    const bpm = globalJsonData.projectBPM || 120;
    const stepDuration = 60 / bpm / 4;
    nextNoteTime = audioCtx.currentTime;

    (function scheduler() {
        while (nextNoteTime < audioCtx.currentTime + 0.1) {
            const scheduleAheadTime = nextNoteTime - audioCtx.currentTime;
            playSequenceStep(scheduleAheadTime);
            nextNoteTime += stepDuration;
        }
        requestAnimationFrame(scheduler);
    })();
}

function playSequenceStep(scheduleAheadTime) {
    if (Object.keys(preprocessedSequences).length === 0) {
        console.error("Preprocessed sequence data is not available or empty.");
        return;
    }

    const sequenceKeys = Object.keys(preprocessedSequences);
    currentSequence %= sequenceKeys.length;
    const sequence = preprocessedSequences[sequenceKeys[currentSequence]];

    Object.entries(sequence).forEach(([channelKey, steps]) => {
        const stepDetail = steps.find(detail => detail.step === currentStep);
        if (stepDetail) {
            const scheduledTime = audioCtx.currentTime + scheduleAheadTime;
            playChannelStep(channelKey, stepDetail, scheduledTime);
        }
    });

    incrementStepAndSequence(sequenceKeys.length);
}

function playChannelStep(channelKey, stepDetail, scheduledTime) {
    const bufferKey = `Channel ${parseInt(channelKey.slice(2)) + 1}`;
    const audioBufferObj = globalAudioBuffers.find(obj => obj.channel === bufferKey);
    const trimTimes = globalTrimTimes[bufferKey];

    if (!(audioBufferObj?.buffer && trimTimes)) {
        console.error(`No audio buffer or trim times found for ${bufferKey}`);
        return;
    }

    playBuffer(audioBufferObj.buffer, trimTimes, bufferKey, scheduledTime);
}

function playBuffer(buffer, {startTrim, endTrim}, bufferKey, scheduledTime) {
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);

    const startTime = startTrim * buffer.duration;
    const duration = (endTrim - startTrim) * buffer.duration;

    console.log(`Channel ${bufferKey}: Scheduled play at ${scheduledTime}, Start Time: ${startTime}, Duration: ${duration}`);
    source.start(scheduledTime, startTime, duration);

    const channelNumber = parseInt(bufferKey.replace('Channel ', ''), 10);
    // Dispatch an event with the necessary data
        const event = new CustomEvent('audioPlayback', {
            detail: { action: "activeStep", channelIndex: channelNumber - 1, step: currentStep }
        });
        audioEventDispatcher.dispatchEvent(event);
    
        AudionalPlayerMessages.postMessage({
            action: "activeStep",
            channelIndex: channelNumber - 1,
            step: currentStep
        });
    }

function incrementStepAndSequence(sequenceLength) {
    currentStep = (currentStep + 1) % 64;
    if (currentStep === 0) {
        currentSequence = (currentSequence + 1) % sequenceLength;
    }
}

async function togglePlayback() {
    console.log(`[togglePlayback] ${isPlaying ? 'Stopping' : 'Initiating'} playback...`);
    isPlaying = !isPlaying;

    if (isPlaying) {
        if (audioCtx.state === 'suspended') await audioCtx.resume();
        startPlaybackLoop();
    } else {
        await audioCtx.suspend();
        resetPlayback();
    }
}

function resetPlayback() {
    currentSequence = 0;
    currentStep = 0;
}



document.addEventListener('keydown', async (event) => {
    if (event.key === ' ') {
        event.preventDefault();
        togglePlayback();
    }
});



// const transformSequencesForPlayback = (sequences, trimTimes, bpm) => {
//     const beatDuration = 60 / bpm; 

//     return Object.entries(sequences).map(([sequenceKey, sequenceValue]) => ({
//         sequenceKey,
//         channels: Object.entries(sequenceValue)
//             .filter(([, channel]) => channel.steps && channel.steps.length > 0)
//             .map(([channelKey, channel]) => ({
//                 channelKey,
//                 steps: channel.steps.map(step => ({
//                     step, 
//                     timing: step * beatDuration // 
//                 })),
//                 trim: trimTimes[`Channel ${channelKey}`]
//             }))
//     }));
// }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUDIONAL PLAYER BROADCAST MESSAGE MODULE //


// function emitMessage(type, data) {
//     AudionalPlayerMessages.postMessage({ type: type, data: data });
// }

// function emitBar(bar) {
//     emitMessage("bar", { bar: bar });
// }

// function emitBeat(beat, bar) {
//     emitMessage("beat", { beat: beat, bar: bar });
// }

// function emitPause() {
//     emitMessage("pause", {});
// }

// function emitResume() {
//     emitMessage("resume", {});
// }

// function emitStop() {
//     emitMessage("stop", {});
// }

// function emitPlay() {
//     emitMessage("play", {});
//     emitMessage("beat", { beat: beatCount, bar: barCount });
// }


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// KEY MAPPING AND USER CONTROLLED PLAYBACK FUNCTIONS //

// Key to channel mapping
const keyChannelMap = {
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
    '6': 6, '7': 7, '8': 8, '9': 9, '0': 10,
    'q': 11, 'w': 12, 'e': 13, 'r': 14, 't': 15, 'y': 16
};



let isReversePlay = false; // Flag to indicate if reverse play is enabled

// Attach keydown event listener to the document
document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase(); // Normalize key to lowercase to match the map
    if (event.shiftKey && key === 'r') {
        // Toggle reverse play flag on Shift + 'R' key press
        isReversePlay = !isReversePlay;
        console.log('Reverse play is now:', isReversePlay ? 'enabled' : 'disabled');
        return; // Exit the event listener to prevent playing audio for the Shift + 'R' key combination
    }

    if (keyChannelMap.hasOwnProperty(key)) {
        const channel = keyChannelMap[key];
        playAudioForChannel(channel);
    }
});


function playAudioForChannel(channelNumber) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume(); // Ensure the AudioContext is active
    }
    console.log('Playing audio for channel:', channelNumber);

    const channelName = `Channel ${channelNumber}`;
    const audioBufferObj = globalAudioBuffers.find(obj => obj.channel === channelName);

    if (audioBufferObj && audioBufferObj.buffer) {
        const source = audioCtx.createBufferSource();
        
        // Check if reverse play is enabled and reverse the buffer if so
        if (isReversePlay) {
            source.buffer = reverseAudioBuffer(audioBufferObj.buffer);
            // Start and end times should consider the entire buffer, as it's already reversed
            source.connect(audioCtx.destination);
            source.start(0, 0, source.buffer.duration);
        } else {
            const trimTimes = globalTrimTimes[channelName]; // Access trim times
            if (trimTimes) {
                const duration = audioBufferObj.buffer.duration;
                let startTime = duration * trimTimes.startTrim;
                let endTime = duration * trimTimes.endTrim;
                const playDuration = endTime - startTime;
                
                source.buffer = audioBufferObj.buffer;
                source.connect(audioCtx.destination);
                // Start playing the sound at the calculated start time for the calculated duration
                source.start(0, startTime, playDuration);
            }
        }
    } else {
        console.error('No audio buffer or trim times found for channel:', channelNumber);
    }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUDIO PROCESSING AND BUFFER MANIPULATION FUNCTIONS //

//  globalAudioBuffers is an array of objects with 'buffer' and 'channel' properties
// and audioCtx is an instance of AudioContext

function reverseAudioBuffer(audioBuffer) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    let reversedBuffer = audioCtx.createBuffer(numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);

    for (let channel = 0; channel < numberOfChannels; channel++) {
        const inputChannelData = audioBuffer.getChannelData(channel);
        const reversedChannelData = reversedBuffer.getChannelData(channel);

        for (let i = 0; i < audioBuffer.length; i++) {
            reversedChannelData[i] = inputChannelData[audioBuffer.length - 1 - i];
        }
    }

    return reversedBuffer;
}

