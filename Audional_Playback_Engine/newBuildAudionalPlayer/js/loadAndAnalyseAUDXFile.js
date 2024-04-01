// loadAndAnalyseAUDXFile.js

document.getElementById('jsonInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const json = JSON.parse(e.target.result);

            // Initialize stats here or ensure it's properly populated before passing
            let stats = {
                channelsWithUrls: 0,
                sequencesCount: 0,
                activeStepsPerSequence: {},
                activeChannelsPerSequence: {},
                types: {}
            };
            // Right before calling analyzeJsonStructure in the FileReader onload
            stats.channelsWithUrls = json.channelURLs ? json.channelURLs.length : 0;
            stats.sequencesCount = json.projectSequences ? Object.keys(json.projectSequences).length : 0;

            // Perform JSON structure analysis to populate stats

            analyzeJsonStructure(json, '', stats);


        
            const playbackData = prepareForPlayback(json, stats);
            displayOutput(playbackData);

            // Correctly check if all data has been processed after displayOutput
            if (checkAllDataProcessed(stats)) {
                console.log('All data processed. Ready for the next stage.');
            } else {
                console.log('Data processing incomplete.');
            }
        };
        reader.readAsText(file);
    }
    });

// Assume other functions (analyzeJsonStructure, incrementTypeCount, prepareForPlayback, displayOutput) remain unchanged


function analyzeJsonStructure(json, parentKey = '', stats, path = '') {
    if (json.projectSequences && typeof json.projectSequences === 'object') {
        Object.keys(json.projectSequences).forEach(seqKey => {
            const sequence = json.projectSequences[seqKey];
            stats.activeStepsPerSequence[seqKey] = 0;
            stats.activeChannelsPerSequence[seqKey] = []; // Initialize list of active channels for this sequence

            Object.keys(sequence).forEach(chKey => {
                const channel = sequence[chKey];
                if (channel.steps && Array.isArray(channel.steps) && channel.steps.length > 0) {
                    stats.activeStepsPerSequence[seqKey] += channel.steps.length;
                    stats.activeChannelsPerSequence[seqKey].push(chKey); // Add channel as active
                }
            });
        });
    }

    Object.keys(json).forEach(key => {
        if (key !== 'projectSequences') {
            const value = json[key];
            const type = Array.isArray(value) ? 'array' : typeof value;
            incrementTypeCount(stats.types, type);

            if (type === 'object' || type === 'array') {
                analyzeJsonStructure(value, key, stats, path ? `${path}.${key}` : key);
            }
        }
    });
}

function incrementTypeCount(types, type) {
    types[type] = (types[type] || 0) + 1;
}

// function prepareForPlayback(json, stats) {
//     // Prepare raw data and formatted strings in parallel
//     const channelsData = json.channelURLs.map((url, index) => {
//         const trim = json.trimSettings[index];
//         // Raw data for buffering
//         const raw = {
//             url,
//             startTrim: parseFloat(trim.startSliderValue),
//             endTrim: parseFloat(trim.endSliderValue)
//         };
//         // Formatted data for display
//         const formatted = {
//             channel: `Channel ${index + 1}`,
//             url,
//             formattedTrim: `StartTrim=${raw.startTrim.toFixed(3)}s, EndTrim=${raw.endTrim.toFixed(3)}s`
//         };

//         // Fetch and decode audio data
//         const audioData = fetchAndDecodeAudioData(url);

//         return { raw, formatted, audioData };
//     });

//     // Extract separately the raw and formatted data for easy access
//     const rawChannelData = channelsData.map(data => data.raw);
//     const formattedChannelData = channelsData.map(data => `${data.formatted.channel}: URL=${data.formatted.url}, ${data.formatted.formattedTrim}`);

//     // Handling sequences for display
//     const formattedSequences = {};
//     Object.keys(json.projectSequences).forEach(sequenceKey => {
//         formattedSequences[sequenceKey] = Object.keys(json.projectSequences[sequenceKey]).map(channelKey => {
//             const channel = json.projectSequences[sequenceKey][channelKey];
//             const activeSteps = channel.steps.length > 0 ? channel.steps.join(', ') : 'No active steps';
//             return `${channelKey}: [${activeSteps}]`;
//         });
//     });

//     // Compile the final object to return
//     return {
//         projectName: json.projectName,
//         bpm: json.projectBPM,
//         channels: json.channelURLs.length,
//         channelURLs: formattedChannelData, // For display
//         rawChannelData, // For processing
//         stats: {
//             channelsWithUrls: stats.channelsWithUrls,
//             sequencesCount: stats.sequencesCount,
//             activeStepsPerSequence: stats.activeStepsPerSequence,
//             activeChannelsPerSequence: stats.activeChannelsPerSequence,
//         },
//         sequences: formattedSequences, // For display
//     };
// }

async function prepareForPlayback(json, stats) {
    const channelPromises = json.channelURLs.map(async (url, index) => {
        const trim = json.trimSettings[index];
        let audioData;

        try {
            audioData = await fetchAndDecodeAudioData(url);
        } catch (error) {
            console.error(`Error fetching audio for channel ${index + 1}:`, error.message);
            audioData = null; // Handle the error as appropriate for your use case
        }

        return {
            raw: {
                url,
                startTrim: parseFloat(trim.startSliderValue),
                endTrim: parseFloat(trim.endSliderValue)
            },
            formatted: {
                channel: `Channel ${index + 1}`,
                url,
                formattedTrim: `StartTrim=${trim.startSliderValue.toFixed(3)}s, EndTrim=${trim.endSliderValue.toFixed(3)}s`
            },
            audioData // This is now the actual data or null in case of an error
        };
    });

    const channelsData = await Promise.all(channelPromises);

    // Continue as before, but remember channelsData now includes fetched audio data
    // ...
}


async function fetchAndDecodeAudioData(url) {
    const response = await fetch(url);
    const contentType = response.headers.get("Content-Type");

    if (contentType.includes('application/json')) {
        const json = await response.json();
        if (!json.audioData) throw new Error('JSON does not contain audioData');
        return base64ToArrayBuffer(json.audioData.split(",")[1]);
    } else if (contentType.includes('text/html')) {
        const htmlContent = await response.text();
        const match = htmlContent.match(/data:audio\/[^;]+;base64,([^"]+)/);
        if (!match) throw new Error('HTML does not contain base64 audio data');
        return base64ToArrayBuffer(match[1]);
    } else {
        throw new Error('Unsupported content type');
    }
    
}




function displayOutput(playbackData) {
    // Custom replacer function for JSON.stringify
    function replacer(key, value) {
        // If the value is an array of numbers, convert it to a string representation
        if (Array.isArray(value) && value.every(item => typeof item === 'number')) {
            return `[${value.join(', ')}]`;
        }
        // If the value is an array of strings and looks like it's listing channels, join them horizontally
        if (Array.isArray(value) && value.every(item => typeof item === 'string' && item.startsWith('ch'))) {
            return `[${value.join(', ')}]`;
        }
        return value; // Return the value unchanged if none of the above conditions are met
    }

    // Using the custom replacer function during stringification
    const formattedOutput = JSON.stringify(playbackData, replacer, 2);
    document.getElementById('output').textContent = formattedOutput;
}

function checkAllDataProcessed(stats) {
    // Assuming all data is considered processed if there's at least one URL and one sequence
    return stats.channelsWithUrls > 0 && stats.sequencesCount > 0;
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUDIO BUFFERING FUNCTIONS

// Prepare Audio for bufferring. 
// Each Channel URL is matched to a set of trim settings that need to be applied to each buffer using a start and end time.
// Utility Functions
const audioContext = new AudioContext(); // Use a single AudioContext for efficiency

function base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

async function decodeAudioData(arrayBuffer) {
    return audioContext.decodeAudioData(arrayBuffer);
}

function convertTrimSettings(trimSettings, duration) {
    return trimSettings.map(({ start, end }) => ({
        start: (start / 100) * duration,
        end: (end / 100) * duration
    }));
}

async function bufferAudioData(url, trimSettings) {
    const arrayBuffer = await fetchAndDecodeAudioData(url);
    const audioBuffer = await decodeAudioData(arrayBuffer);
    const duration = audioBuffer.duration;

    const trims = convertTrimSettings(trimSettings, duration);
    // Process trimming here. This is an oversimplified view, real trimming involves creating a new AudioBuffer
    return audioBuffer; // Placeholder, replace with actual trimmed buffer
}

// Main Function
async function processAudioChannels(json) {
    const { channelURLs, trimSettings } = json;
    const buffers = [];

    for (let i = 0; i < channelURLs.length; i++) {
        try {
            const buffer = await bufferAudioData(channelURLs[i], trimSettings[i]);
            buffers.push(buffer);
        } catch (error) {
            console.error(`Error processing channel ${i + 1}:`, error);
            return;
        }
    }

    if (buffers.every(buffer => buffer !== null)) {
        console.log('All channels buffered successfully.');
    } else {
        console.log('One or more channels failed to buffer.');
    }
}

// // Example Usage
// processAudioChannels(json).then(() => console.log("Audio processing complete."));


  
 

// async function bufferAudioData(base64Data, trimSettings) {
//     const audioBuffer = await decodeBase64Audio(base64Data);
//     // Calculate start and end times in seconds based on audioBuffer.duration and trimSettings
//     // Extract the trimmed audioBuffer portion here
//     // This step is complex and requires manipulating the raw audio buffer data
//     return trimmedAudioBuffer;
// }



// // Usage
// async function main() {
//     const channelURLs = getChannelURLs(json); // Assume json is available
//     const trimSettings = getTrimSettings(json); // Adjust this based on actual data structure
//     const buffers = await bufferAllChannels(channelURLs, trimSettings);
//     if (checkBuffers(buffers)) {
//         console.log('All channels buffered successfully');
//     } else {
//         console.log('Error buffering channels');
//     }
// }
// main();



// async function importHTMLAudioData(htmlContent, index) {
//     console.log("[importHTMLAudioData] Entered function with index: ", index);
    
//     try {
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(htmlContent, "text/html");
//         const audioSource = doc.querySelector("audio[data-audionalSampleName] source");
        
//         if (audioSource) {
//             const src = audioSource.getAttribute("src");
            
//             if (src.toLowerCase().startsWith("data:audio/wav;base64,") || src.toLowerCase().startsWith("data:audio/mp3;base64,")) {
//                 console.log("[importHTMLAudioData] Extracted base64 audio data.");
//                 return src;
//             } else {
//                 console.error("[importHTMLAudioData] Audio data does not start with expected base64 prefix.");
//             }
//         } else {
//             console.error("[importHTMLAudioData] Could not find the audio source element in the HTML content.");
//         }
//     } catch (error) {
//         console.error("[importHTMLAudioData] Error parsing HTML content: ", error);
//     }
    
//     return null;
// }



// async function importHTMLAudioData(htmlContent, index) {
//     console.log("[importHTMLAudioData] Entered function with index: ", index);
    
//     try {
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(htmlContent, "text/html");
//         const audioSource = doc.querySelector("audio[data-audionalSampleName] source");
        
//         if (audioSource) {
//             const src = audioSource.getAttribute("src");
            
//             if (src.toLowerCase().startsWith("data:audio/wav;base64,") || src.toLowerCase().startsWith("data:audio/mp3;base64,")) {
//                 console.log("[importHTMLAudioData] Extracted base64 audio data.");
//                 return src;
//             } else {
//                 console.error("[importHTMLAudioData] Audio data does not start with expected base64 prefix.");
//             }
//         } else {
//             console.error("[importHTMLAudioData] Could not find the audio source element in the HTML content.");
//         }
//     } catch (error) {
//         console.error("[importHTMLAudioData] Error parsing HTML content: ", error);
//     }
    
//     return null;
// }

// A function to extract base64 audio data from a JSON file
