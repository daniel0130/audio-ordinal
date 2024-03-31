// loadAndAnalyseAUDXFile.js

document.getElementById('jsonInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function(e) {
            const json = JSON.parse(e.target.result);
            // Presume stats initialization and analysis code here remains the same
            const playbackData = prepareForPlayback(json, /* stats or any other necessary parameters */);
            displayOutput(playbackData); // Adjusted to display the prepared data for playback
            
            // Ensure AudioLoader is initialized and called here
            const audioLoader = new AudioLoader(new (window.AudioContext || window.webkitAudioContext)());
            await audioLoader.processChannelURLs(playbackData.channelURLs);
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

function prepareForPlayback(json, stats) {
    // Separate URLs and trim settings into distinct arrays
    const urls = json.channelURLs; // Directly use the URL array
    const trimTimes = json.trimSettings.map((trim, index) => ({
        channel: `Channel ${index + 1}`, // Display channel number starting from 1 for readability
        startTrim: parseFloat(trim.startSliderValue).toFixed(3), // Reduce to three decimal places
        endTrim: parseFloat(trim.endSliderValue).toFixed(3) // Reduce to three decimal places
    }));

    // Format trim times for display, each channel on a single line
    const formattedTrimTimes = trimTimes.map(trim => `${trim.channel}: StartTrim=${trim.startTrim}, EndTrim=${trim.endTrim}`);

    // Format sequences for display, focusing only on active steps
    const formattedSequences = {};
    Object.keys(json.projectSequences).forEach(sequenceKey => {
        formattedSequences[sequenceKey] = Object.keys(json.projectSequences[sequenceKey]).map(channelKey => {
            const channel = json.projectSequences[sequenceKey][channelKey];
            // Ensure active steps are represented as a joined string
            const activeSteps = channel.steps.length > 0 ? channel.steps.join(', ') : 'No active steps';
            return `${channelKey}: [${activeSteps}]`; // Channel identifier with active steps
        });
    });

    return {
        projectName: json.projectName,
        bpm: json.projectBPM,
        channels: urls.length,
        channelURLs: urls, // Separated URLs array
        trimTimes: formattedTrimTimes, // Formatted trim times with channel numbers on single lines
        stats: { // Including stats for potential debug or display purposes
            channelsWithUrls: stats.channelsWithUrls,
            sequencesCount: stats.sequencesCount,
            activeStepsPerSequence: stats.activeStepsPerSequence,
            activeChannelsPerSequence: stats.activeChannelsPerSequence,
        },
        sequences: formattedSequences, // Formatted sequences with active steps on single lines
    };
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


