// loadAndAnalyseAUDXFile2.js

var globalPlaybackData = null;
var globalAudioBuffers = [];


document.getElementById('jsonInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var json = JSON.parse(e.target.result);

            // Initialize stats here
            var stats = {
                channelsWithUrls: 0,
                sequencesCount: 0,
                activeStepsPerSequence: {},
                activeChannelsPerSequence: {},
                types: {}
            };

            analyzeJsonStructure(json, '', stats);

            var playbackData = prepareForPlayback(json, stats);
            displayOutput(playbackData);
            fetchAndProcessAudioData(playbackData.channelURLs); // Add this line to fetch and process audio data
        };
        reader.readAsText(file);
    }
});

function analyzeJsonStructure(json, parentKey, stats, path) {
    path = path || '';
    if (json.projectSequences && typeof json.projectSequences === 'object') {
        for (var seqKey in json.projectSequences) {
            if (json.projectSequences.hasOwnProperty(seqKey)) {
                var sequence = json.projectSequences[seqKey];
                stats.activeStepsPerSequence[seqKey] = 0;
                stats.activeChannelsPerSequence[seqKey] = [];

                for (var chKey in sequence) {
                    if (sequence.hasOwnProperty(chKey)) {
                        var channel = sequence[chKey];
                        if (channel.steps && Array.isArray(channel.steps) && channel.steps.length > 0) {
                            stats.activeStepsPerSequence[seqKey] += channel.steps.length;
                            stats.activeChannelsPerSequence[seqKey].push(chKey);
                        }
                    }
                }
            }
        }
    }

    for (var key in json) {
        if (json.hasOwnProperty(key) && key !== 'projectSequences') {
            var value = json[key];
            var type = Array.isArray(value) ? 'array' : typeof value;
            incrementTypeCount(stats.types, type);

            if (type === 'object' || type === 'array') {
                analyzeJsonStructure(value, key, stats, path ? path + '.' + key : key);
            }
        }
    }
}

function incrementTypeCount(types, type) {
    types[type] = (types[type] || 0) + 1;
}

function prepareForPlayback(json, stats) {
    var urls = json.channelURLs;
    var trimTimes = json.trimSettings.map(function(trim, index) {
        return {
            channel: 'Channel ' + (index + 1),
            startTrim: parseFloat(trim.startSliderValue),
            endTrim: parseFloat(trim.endSliderValue)
        };
    });

    var formattedTrimTimes = trimTimes.map(function(trim) {
        return trim.channel + ': StartTrim=' + trim.startTrim + ', EndTrim=' + trim.endTrim;
    });

    var formattedSequences = {};
    for (var sequenceKey in json.projectSequences) {
        if (json.projectSequences.hasOwnProperty(sequenceKey)) {
            formattedSequences[sequenceKey] = Object.keys(json.projectSequences[sequenceKey]).map(function(channelKey) {
                var channel = json.projectSequences[sequenceKey][channelKey];
                var activeSteps = channel.steps.length > 0 ? channel.steps.join(', ') : 'No active steps';
                return channelKey + ': [' + activeSteps + ']';
            });
        }
    }

    return {
        projectName: json.projectName,
        bpm: json.projectBPM,
        channels: urls.length,
        channelURLs: urls,
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
    function replacer(key, value) {
        if (Array.isArray(value) && value.every(function(item) { return typeof item === 'number'; })) {
            return '[' + value.join(', ') + ']';
        }
        if (Array.isArray(value) && value.every(function(item) { return typeof item === 'string' && item.startsWith('ch'); })) {
            return '[' + value.join(', ') + ']';
        }
        return value;
    }

    var formattedOutput = JSON.stringify(playbackData, replacer, 2);
    document.getElementById('output').textContent = formattedOutput;
}



// Assuming the existence of the globalAudioBuffers and audioCtx variables as previously defined
function fetchAndProcessAudioData(urls) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    urls.forEach(function(url, index) {
        const channelNumber = index + 1; // Assuming channel numbering starts at 1
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                var contentType = xhr.getResponseHeader('Content-Type');
                
                // Handling direct audio formats (wav, mp3)
                if (/audio\/wav/.test(contentType) || /audio\/mpeg/.test(contentType)) {
                    var reader = new FileReader();
                    reader.onload = function() {
                        const audioData = reader.result;
                        audioCtx.decodeAudioData(audioData, function(buffer) {
                            globalAudioBuffers.push({ buffer: buffer, channel: `Channel ${channelNumber}` });
                            console.log(`AudioBuffer stored for direct audio content at index: ${index}, Channel: ${channelNumber}`);
                        }, function(e) {
                            console.error(`Error decoding direct audio data for Channel ${channelNumber}:`, e);
                        });
                    };
                    reader.readAsArrayBuffer(xhr.response);
                } else {
                    var reader = new FileReader();

                    reader.onload = function() {
                        let base64AudioData;
                        if (/application\/json/.test(contentType)) {
                            // Process JSON content
                            const json = JSON.parse(reader.result);
                            base64AudioData = json.audioData; // Directly from JSON
                        } else if (/text\/html/.test(contentType)) {
                            // Process HTML content and log channel information upon successful extraction
                            base64AudioData = extractBase64FromHTML(reader.result, channelNumber); // Pass channelNumber if needed
                            console.log(`[Channel ${channelNumber}] Extracted base64 audio data from HTML.`);
                        }

                        if (base64AudioData) {
                            // Decode and process the base64 audio data
                            const audioData = base64ToArrayBuffer(base64AudioData.split(',')[1]);
                            audioCtx.decodeAudioData(audioData, function(buffer) {
                                globalAudioBuffers.push({ buffer: buffer, channel: `Channel ${channelNumber}` });
                                console.log(`AudioBuffer stored for URL at index: ${index}, Channel: ${channelNumber}`);
                            }, function(e) {
                                console.error(`Error decoding audio data for Channel ${channelNumber}:`, e);
                            });
                        }
                    };

                    if (/text\/html/.test(contentType) || /application\/json/.test(contentType)) {
                        reader.readAsText(xhr.response);
                    } else if (/audio/.test(contentType)) {
                        reader.readAsArrayBuffer(xhr.response); // Handling direct audio content
                    }
                }
            } else {
                console.error(`Failed to fetch from URL: ${url}, Status: ${xhr.status}`);
            }
        };

        xhr.send();
    });
}


// Helper function to convert a base64 string to an ArrayBuffer
function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}


function extractBase64FromHTML(htmlText) {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, "text/html");
        const audioSource = doc.querySelector("audio[data-audionalSampleName] source");
        
        if (audioSource) {
            const src = audioSource.getAttribute("src");
            
            if (src.toLowerCase().startsWith("data:audio/wav;base64,") || src.toLowerCase().startsWith("data:audio/mp3;base64,")) {
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// AUDIO BUFFERS HAVE BEEN FETCHED AND PROCESSED //

function schedulePlayback(playbackData, audioBuffers) {
    if (!window.AudioContext) return; // Ensure the AudioContext is supported
    const audioCtx = new AudioContext();
    const bpm = playbackData.bpm;
    const beatDuration = 60 / bpm; // Duration of a beat in seconds

    // Assuming playbackData.sequences is structured correctly based on the description
    playbackData.sequences.forEach((sequence, sequenceIndex) => {
        sequence.forEach((step, stepIndex) => {
            step.forEach(channelKey => {
                const bufferIndex = playbackData.channelURLs.findIndex(url => url.includes(channelKey));
                if (bufferIndex !== -1) {
                    const audioBuffer = audioBuffers[bufferIndex];
                    if (audioBuffer) {
                        const source = audioCtx.createBufferSource();
                        source.buffer = audioBuffer;
                        source.connect(audioCtx.destination);
                        const stepStartTime = stepIndex * beatDuration;
                        source.start(audioCtx.currentTime + stepStartTime);
                        // Assuming `trimTimes` has been applied during buffer preparation
                    }
                }
            });
        });
    });
}
