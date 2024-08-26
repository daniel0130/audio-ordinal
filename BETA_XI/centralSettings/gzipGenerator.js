// gzipGenerator.js

(async function() {
    // Ensure the Pako library is loaded
    await loadPako();

    // Key mappings and helper functions from the provided code
    const keyMap = {0: "projectName", 1: "artistName", 2: "projectBPM", 3: "currentSequence", 4: "channelURLs", 5: "channelVolume", 6: "channelPlaybackSpeed", 7: "trimSettings", 8: "projectChannelNames", 9: "startSliderValue", 10: "endSliderValue", 11: "totalSampleDuration", 12: "start", 13: "end", 14: "projectSequences", 15: "steps"};
    const reverseKeyMap = Object.fromEntries(Object.entries(keyMap).map(([e, r]) => [r, +e]));
    const channelMap = Array.from({ length: 26 }, (e, r) => String.fromCharCode(65 + r));
    const reverseChannelMap = Object.fromEntries(channelMap.map((e, r) => [e, r]));

    // Function to serialize the steps
    const serializeSteps = steps => {
        if (!steps.length) return [];
        const compressed = [];
        let start = null, end = null, inRange = false;
        steps.forEach(step => {
            if (typeof step === 'number') {
                if (start === null) {
                    start = end = step;
                } else if (step === end + 1) {
                    end = step;
                    inRange = true;
                } else {
                    compressed.push(inRange ? { r: [start, end] } : start);
                    start = end = step;
                    inRange = false;
                }
            } else if (step.index !== undefined && step.reverse) {
                if (start !== null) {
                    compressed.push(inRange ? { r: [start, end] } : start);
                    start = end = null;
                    inRange = false;
                }
                compressed.push(`${step.index}r`);
            }
        });
        if (start !== null) compressed.push(inRange ? { r: [start, end] } : start);
        return compressed;
    };

    // Function to serialize the JSON data
    const serialize = data => {
        return Object.entries(data).reduce((acc, [key, value]) => {
            const shortKey = reverseKeyMap[key] ?? key;
            if (key === 'projectSequences') {
                acc[shortKey] = Object.entries(value).reduce((seqAcc, [seqKey, channels]) => {
                    const shortSeqKey = seqKey.replace('Sequence', 's');
                    seqAcc[shortSeqKey] = Object.entries(channels).reduce((chAcc, [chKey, chValue]) => {
                        const letter = reverseChannelMap[chKey.replace('ch', '')];
                        if (chValue.steps && chValue.steps.length) {
                            chAcc[letter] = { [reverseKeyMap['steps']]: serializeSteps(chValue.steps) };
                        }
                        return chAcc;
                    }, {});
                    return seqAcc;
                }, {});
            } else if (Array.isArray(value)) {
                acc[shortKey] = value.map(item => typeof item === 'object' ? serialize(item) : item);
            } else if (typeof value === 'object' && value !== null) {
                acc[shortKey] = serialize(value);
            } else {
                acc[shortKey] = value;
            }
            return acc;
        }, {});
    };

    // Function to create and download the Gzip file
    const createGzipFile = async (jsonData) => {
        const serializedData = serialize(jsonData);
        const jsonString = JSON.stringify(serializedData);
        
        // Use pako to compress the JSON string into Gzip format
        const compressed = pako.gzip(jsonString);
        
        // Create a Blob from the compressed data
        const blob = new Blob([compressed], { type: 'application/gzip' });
        
        // Create a download link for the Gzip file
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'songData.gz'; // Set the desired file name here
        downloadLink.click();
    };

    // Example usage with sample JSON data (replace this with actual data)
    const exampleJsonData = {
        projectName: "Sample Project",
        artistName: "Artist Name",
        projectBPM: 120,
        currentSequence: 0,
        channelURLs: ["url1", "url2"],
        channelVolume: [1, 0.8],
        channelPlaybackSpeed: [1, 1.2],
        trimSettings: {},
        projectChannelNames: ["Channel 1", "Channel 2"],
        startSliderValue: 0,
        endSliderValue: 100,
        totalSampleDuration: 300,
        start: 0,
        end: 300,
        projectSequences: {
            "Sequence 1": {
                "ch0": { steps: [1, 2, 3] },
                "ch1": { steps: [2, 3, 4] }
            }
        }
    };

    // Trigger Gzip creation and download
    createGzipFile(exampleJsonData);

})();
