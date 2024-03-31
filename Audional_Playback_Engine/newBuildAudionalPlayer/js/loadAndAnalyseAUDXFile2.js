// loadAndAnalyseAUDXFile2.js

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
            startTrim: parseFloat(trim.startSliderValue).toFixed(3),
            endTrim: parseFloat(trim.endSliderValue).toFixed(3)
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

function fetchAndProcessAudioData(urls) {
    urls.forEach(function(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    var contentType = xhr.getResponseHeader('Content-Type');
                    if (/application\/json/.test(contentType)) {
                        var json = JSON.parse(xhr.responseText);
                        var base64AudioData = json.audioData; 
                        console.log('Base64 Audio from JSON:', base64AudioData);
                    } else if (/text\/html/.test(contentType)) {
                        var base64AudioData = extractBase64FromHTML(xhr.responseText);
                        console.log('Base64 Audio from HTML:', base64AudioData);
                    } else {
                        console.log('Unsupported content type:', contentType);
                    }
                } else {
                    console.error('Failed to fetch from URL:', url, 'Status:', xhr.status);
                }
            }
        };
        xhr.send();
    });
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
