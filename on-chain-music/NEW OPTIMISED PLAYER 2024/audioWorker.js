// audioWorker.js

// Attempt to load pako via importScripts
let pakoLoaded = false;
try {
    // Replace with your actual PAKO_URL
    importScripts('https://ordinals.com/content/2109694f44c973892fb8152cf5c68607fb19288c045af1abc1716c1c3b4d69e6i0');
    
    if (typeof pako !== 'undefined') {
        pakoLoaded = true;
        console.log("Pako library loaded successfully in worker.");
    } else {
        throw new Error("Pako is not defined after importScripts.");
    }
} catch (e) {
    console.error("Failed to load pako in worker:", e);
    // Notify the main thread about the failure
    self.postMessage({ command: 'error', data: { message: `Failed to load pako library: ${e.message}` } });
    // Terminate the worker since pako is essential
    self.close();
}

// Handle incoming messages from the main thread
self.onmessage = async function(event) {
    const { command, data } = event.data;

    if (command === 'loadAndProcessAudio') {
        const { url, processedData } = data;
        try {
            if (!pakoLoaded) {
                throw new Error("Pako library not loaded.");
            }
            const audioBuffers = await loadAndProcessAudio(url, processedData);
            // Send the processed audio buffers back to the main thread
            self.postMessage({ command: 'audioProcessed', data: { audioBuffers } });
        } catch (error) {
            console.error("Worker Error:", error);
            // Send error details back to the main thread
            self.postMessage({ command: 'error', data: { message: error.message } });
        }
    }
};

// Function to load and process audio data
async function loadAndProcessAudio(url, processedData) {
    // Fetch the gzip-compressed song file
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch song file: ${response.statusText}`);
    
    // Decompress the fetched data using pako
    const compressedArrayBuffer = await response.arrayBuffer();
    const decompressedData = pako.inflate(new Uint8Array(compressedArrayBuffer), { to: 'string' });
    
    // Parse the JSON data
    const jsonData = JSON.parse(decompressedData);
    const dataDeserialized = deserialize(jsonData); // Ensure deserialize is defined within the worker

    // Extract metadata
    const metadata = {
        projectBPM: dataDeserialized.projectBPM,
        currentSequence: dataDeserialized.currentSequence,
        channelURLs: arrayToObject(dataDeserialized.channelURLs),
        channelVolume: arrayToObject(dataDeserialized.channelVolume, 0, true),
        channelPlaybackSpeed: arrayToObject(dataDeserialized.channelPlaybackSpeed, 0, true),
        trimSettings: mapTrimSettings(dataDeserialized.trimSettings),
        projectChannelNames: dataDeserialized.projectChannelNames,
        projectSequences: dataDeserialized.projectSequences,
        globalPlaybackSpeed: dataDeserialized.globalPlaybackSpeed || 1,
    };

    const processedMetadata = {
        ...metadata,
        VOLUME_CONTROLS: metadata.channelVolume,
        SPEED_CONTROLS: metadata.channelPlaybackSpeed,
        songDataUrls: Object.values(metadata.channelURLs),
    };

    // Validate songDataUrls
    if (processedMetadata.songDataUrls.length !== 16) {
        throw new Error("Invalid channel URLs or channel count.");
    }

    // Fetch audio data URLs
    const audioDataUrls = processedMetadata.songDataUrls.map(u => `https://ordinals.com${u}`);
    const audioDataArray = await Promise.all(audioDataUrls.map(async (audioUrl) => {
        const res = await fetch(audioUrl);
        if (!res.ok) throw new Error(`Failed to fetch audio data from ${audioUrl}: ${res.statusText}`);
        return await res.arrayBuffer();
    }));

    return audioDataArray; // Return raw ArrayBuffers to be decoded on the main thread
}

// Helper functions

/**
 * Deserializes the JSON data.
 * Implement your specific deserialization logic here.
 * @param {Object} data - The JSON data to deserialize.
 * @returns {Object} - The deserialized data.
 */
function deserialize(data) {
    // Placeholder implementation
    // Replace with actual deserialization logic as needed
    return data;
}

/**
 * Converts an array to an object with keys like "Channel 0", "Channel 1", etc.
 * @param {Array} arr - The array to convert.
 * @param {number} [start=0] - The starting index for channel numbering.
 * @param {boolean} [parse=false] - Whether to parse the values as floats.
 * @returns {Object} - The resulting object.
 */
function arrayToObject(arr, start = 0, parse = false) {
    return arr.reduce((obj, val, idx) => {
        obj[`Channel ${start + idx}`] = parse ? parseFloat(val) || 1 : val;
        return obj;
    }, {});
}

/**
 * Maps trim settings from an array to an object.
 * @param {Array} arr - The trim settings array.
 * @returns {Object} - The mapped trim settings object.
 */
function mapTrimSettings(arr) {
    return arr.reduce((obj, item, idx) => {
        obj[`Channel ${idx}`] = typeof item === 'object' && item
            ? { start: item[9] || 0, end: item[10] || 100 }
            : { start: 0, end: typeof item === 'number' ? item : 100 };
        if (typeof item !== 'object' && typeof item !== 'number') console.warn(`Invalid trim for Channel ${idx}.`);
        return obj;
    }, {});
}