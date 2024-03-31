// loadAndAnalyseAUDXFile2.js

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GLOBAL VARIABLES //

var globalAudioBuffers = [];
var globalTrimTimes = {}; // This will hold trim times for each channel
let isPlaying = false; // Tracks playback state
let activeSources = []; // Keeps track of active source nodes for stopping them
var globalJsonData = null;

// Initialize the AudioContext at a scope accessible by playAudioForChannel
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// JSON FILE LOADING AND ANALYSIS //

// Updated JSON file loading and analysis to set globalJsonData
document.getElementById('jsonInput').addEventListener('change', ({target}) => {
    const {files} = target;
    const file = files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = ({target}) => {
            // Parse and store JSON data in global scope
            globalJsonData = JSON.parse(target.result);

            const stats = {
                channelsWithUrls: 0,
                sequencesCount: 0,
                activeStepsPerSequence: {},
                activeChannelsPerSequence: {},
                types: {}
            };

            analyzeJsonStructure(globalJsonData, '', stats);
            const playbackData = prepareForPlayback(globalJsonData, stats);
            displayOutput(playbackData);
            fetchAndProcessAudioData(playbackData.channelURLs); // Process audio data
        };
        reader.readAsText(file);
    }
});

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

function displayOutput(playbackData) {
    const replacer = (key, value) => {
        if (Array.isArray(value)) {
            const isNumberArray = value.every(item => typeof item === 'number');
            const isChannelArray = value.every(item => typeof item === 'string' && item.startsWith('ch'));
            if (isNumberArray || isChannelArray) {
                return `[${value.join(', ')}]`;
            }
        }
        return value;
    };

    const formattedOutput = JSON.stringify(playbackData, replacer, 2);
    document.getElementById('output').textContent = formattedOutput;
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



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// KEY MAPPING AND USER CONTROLLED PLAYBACK FUNCTIONS //

// Key to channel mapping
const keyChannelMap = {
    '1': 1, '2': 2, '3': 3, '4': 4, '5': 5,
    '6': 6, '7': 7, '8': 8, '9': 9, '0': 10,
    'q': 11, 'w': 12, 'e': 13, 'r': 14, 't': 15, 'y': 16
};

// Attach keydown event listener to the document
document.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase(); // Normalize key to lowercase to match the map
    if (keyChannelMap.hasOwnProperty(key)) {
        const channel = keyChannelMap[key];
        playAudioForChannel(channel);
    }
});


//  globalAudioBuffers is an array of objects with 'buffer' and 'channel' properties
// and audioCtx is an instance of AudioContext

function playAudioForChannel(channelNumber) {
    console.log('Playing audio for channel:', channelNumber);

    const channelName = `Channel ${channelNumber}`;
    const audioBufferObj = globalAudioBuffers.find(obj => obj.channel === channelName);
    const trimTimes = globalTrimTimes[channelName];

    if (audioBufferObj && audioBufferObj.buffer && trimTimes) {
        const source = audioCtx.createBufferSource();
        source.buffer = audioBufferObj.buffer;

        const duration = source.buffer.duration;
        const startTime = duration * trimTimes.startTrim;
        const endTime = duration * trimTimes.endTrim;
        const playDuration = endTime - startTime;

        source.connect(audioCtx.destination);

        // Start playing the sound at the calculated start time and for the calculated duration
        source.start(0, startTime, playDuration);
    } else {
        console.error('No audio buffer or trim times found for channel:', channelNumber);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUTOMATIC SEQUENCE PLAYBACK FUNCTIONS //

const transformSequencesForPlayback = (sequences, trimTimes, bpm) => {
    const beatDuration = 60 / bpm; // Duration of a beat in seconds

    return Object.entries(sequences).map(([sequenceKey, sequenceValue]) => ({
        sequenceKey,
        channels: Object.entries(sequenceValue)
            .filter(([, channel]) => channel.steps && channel.steps.length > 0)
            .map(([channelKey, channel]) => ({
                channelKey,
                steps: channel.steps.map(step => ({
                    step, // This could be a step number or timing information
                    timing: step * beatDuration // Timing calculation example
                })),
                trim: trimTimes[`Channel ${channelKey}`]
            }))
    }));
}

const scheduleSequencePlayback = (playbackData, audioBuffers, audioCtx) => {
    console.log('[scheduleSequencePlayback] Scheduling playback for sequences...');
    playbackData.forEach(({channels}) => channels.forEach(channelData => {
        // Parse the channel key to extract the numeric part, adjusting for JSON's 0-based indexing
        let channelNumber = parseInt(channelData.channelKey.replace('ch', '')) + 1;
        let channelName = `Channel ${channelNumber}`;  // This matches the naming convention used in the manual playback
        
        console.log(`[scheduleSequencePlayback] Accessing buffer for ${channelName}`);
        const audioBufferObj = audioBuffers.find(obj => obj.channel === channelName);
        
        if (!audioBufferObj) {
            console.error(`[scheduleSequencePlayback] No audio buffer found for ${channelName}.`);
            return;
        }

        console.log(`[scheduleSequencePlayback] Playing ${channelName} with buffer`, audioBufferObj.buffer);
        
        channelData.steps.forEach(({timing}) => {
            const source = audioCtx.createBufferSource();
            source.buffer = audioBufferObj.buffer;
            console.log(`[scheduleSequencePlayback] Scheduling ${channelName} at timing: ${timing}`);
            source.connect(audioCtx.destination);

            // Apply trim times if available, otherwise start at 0
            const trim = globalTrimTimes[channelName] || {startTrim: 0, endTrim: source.buffer.duration};
            const startTime = trim.startTrim * source.buffer.duration;
            const endTime = trim.endTrim * source.buffer.duration;
            source.start(audioCtx.currentTime + timing, startTime, endTime - startTime);
        });
    }));
};


const togglePlayback = async () => {
    console.log('[togglePlayback] Called');
    
    if (audioCtx.state === 'suspended') {
        console.log('[togglePlayback] AudioContext is suspended, resuming...');
        await audioCtx.resume();
        console.log('[togglePlayback] AudioContext resumed.');
    }

    if (!isPlaying) {
        if (!globalJsonData) {
            console.error('No JSON data loaded.');
            return;
        }

        console.log('[togglePlayback] Initiating playback...');
        const playbackData = transformSequencesForPlayback(globalJsonData.projectSequences, globalTrimTimes, globalJsonData.projectBPM);
        scheduleSequencePlayback(playbackData, globalAudioBuffers, audioCtx);
        console.log('[togglePlayback] Playback initiated.');
        isPlaying = true;
    } else {
        console.log('[togglePlayback] Stopping playback, suspending AudioContext...');
        await audioCtx.suspend();
        activeSources.forEach(source => source.stop());
        activeSources = [];
        console.log('[togglePlayback] Playback stopped and AudioContext suspended.');
        isPlaying = false;
    }
};



// A function to start automatic sequence playback using the spacebar
// Attach the event listener to the document
document.addEventListener('keydown', async function(event) {
    console.log('Key pressed:', event.key);
    if (event.key === ' ') {
        event.preventDefault(); // Prevent any default action triggered by the spacebar
        togglePlayback(); // This now ensures audio context is resumed if suspended.
    }
});


// // Attach the event listener to the document
// document.addEventListener('keydown', async (event) => {
//     console.log('Key pressed:', event.key);
//     if (event.key === ' ') {
//         event.preventDefault(); // Prevent any default action triggered by the spacebar
//         togglePlayback();
//     }
// });


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PLAYBACK FUNCTIONS //

// function schedulePlayback(playbackData, audioBuffers) {
//     if (!window.AudioContext) return; // Ensure the AudioContext is supported
//     const audioCtx = new AudioContext();
//     const bpm = playbackData.bpm;
//     const beatDuration = 60 / bpm; // Duration of a beat in seconds

//     // Assuming playbackData.sequences is structured correctly based on the description
//     playbackData.sequences.forEach((sequence, sequenceIndex) => {
//         sequence.forEach((step, stepIndex) => {
//             step.forEach(channelKey => {
//                 const bufferIndex = playbackData.channelURLs.findIndex(url => url.includes(channelKey));
//                 if (bufferIndex !== -1) {
//                     const audioBuffer = audioBuffers[bufferIndex];
//                     if (audioBuffer) {
//                         const source = audioCtx.createBufferSource();
//                         source.buffer = audioBuffer;
//                         source.connect(audioCtx.destination);
//                         const stepStartTime = stepIndex * beatDuration;
//                         source.start(audioCtx.currentTime + stepStartTime);
//                         // Assuming `trimTimes` has been applied during buffer preparation
//                     }
//                 }
//             });
//         });
//     });
// }
