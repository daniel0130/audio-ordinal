// songGenerator.js

// Utility to adjust playback speed proportionally based on BPM change
function adjustPlaybackSpeed(originalBPM, newBPM, originalSpeed) {
    return (originalSpeed * newBPM) / originalBPM;
}

// Function to process a single channel without altering trim settings
function processChannel(channel, originalBPM, newBPM) {
    const adjustedSpeed = adjustPlaybackSpeed(originalBPM, newBPM, channel.playbackSpeed || 1);

    return {
        url: channel.url,
        volume: channel.volume || 1,
        playbackSpeed: adjustedSpeed,
        trim: channel.trim // Copy trim settings directly without modification
    };
}

// Function to generate a new song by combining and processing channels from loaded songs
function generateNewSong(dataArray) {
    const bpms = [100, 120, 140, 160, 180, 240];
    const masterBPM = bpms[Math.floor(Math.random() * bpms.length)]; // Randomly select master BPM

    console.log(`Selected Master BPM: ${masterBPM}`);

    let newSong = {
        "0": "Generated Song",   // Name of the new song
        "1": "",                 // Metadata field (empty for now)
        "2": masterBPM,          // Set the master BPM
        "3": 0,                  // State flag
        "4": [],                 // Array to store URLs of channels
        "5": [],                 // Array to store volume settings
        "6": [],                 // Array to store playback speeds
        "7": [],                 // Array to store trim settings
        "8": [],                 // Array for channel identifiers
        "14": {},                // Complex nested object for channel sequences
        "channelSettings": {},   // Object for storing per-channel settings
        "globalPlaybackSpeed": 1 // Default global playback speed
    };

    // Ensure the new song has 16 channels, selecting channels from the source data
    for (let i = 0; i < 16; i++) {
        try {
            const sourceSongIndex = i % dataArray.length; // Cycle through the data if there are fewer than 16 source songs
            const sourceSong = dataArray[sourceSongIndex];

            // Detailed logging for validation
            console.log(`Checking source song at index ${sourceSongIndex}:`, sourceSong);
            if (!sourceSong || !Array.isArray(sourceSong["4"]) || sourceSong["4"].length === 0) {
                console.warn(`Skipping invalid or empty source song at index ${sourceSongIndex}. Reasons: 
                sourceSong: ${!!sourceSong}, 
                channelURLs key present: ${!!sourceSong["4"]}, 
                channelURLs isArray: ${Array.isArray(sourceSong["4"])}, 
                channelURLs length: ${sourceSong["4"] ? sourceSong["4"].length : 'undefined'}`);
                continue;
            }

            const channelIndex = i % sourceSong["4"].length;
            const channelURL = sourceSong["4"][channelIndex];
            const channelVolume = sourceSong["5"]?.[channelIndex] || 1;
            const channelSpeed = sourceSong["6"]?.[channelIndex] || 1;
            const channelTrim = sourceSong["7"]?.[channelIndex] || { "12": 0, "13": 100, "length": 0 };
            const channelName = sourceSong["8"]?.[channelIndex] || `ch${i}`;

            console.log(`Processing channel at index ${channelIndex} in song "${sourceSong["0"]}": ${channelURL}`);

            // Process channel data without modifying trim settings
            const processedChannel = processChannel({
                url: channelURL,
                volume: channelVolume,
                playbackSpeed: channelSpeed,
                trim: channelTrim // Directly copying trim settings
            }, sourceSong["2"], masterBPM);

            newSong["4"].push(processedChannel.url || "");
            newSong["5"].push(processedChannel.volume);
            newSong["6"].push(processedChannel.playbackSpeed);
            newSong["7"].push(processedChannel.trim);
            newSong["8"].push(channelName);

            // Map all steps for this channel
            Object.keys(sourceSong["14"] || {}).forEach(sequenceKey => {
                const originalSteps = sourceSong["14"][sequenceKey]?.[channelName]?.["15"];
                if (originalSteps) {
                    newSong["14"][sequenceKey] = newSong["14"][sequenceKey] || {};
                    newSong["14"][sequenceKey][channelName] = { "15": [...originalSteps] };
                }
            });

            // Populate channel settings
            newSong.channelSettings[channelName] = sourceSong.channelSettings?.[channelName] || {
                volume: processedChannel.volume,
                pitch: 1
            };

        } catch (error) {
            console.error(`Error processing channel at index ${i}:`, error);
        }
    }

    return newSong;
}

// Function to generate and serialize the new song data
function createAndSerializeNewSong(dataArray) {
    console.log("Generating New Song with:", dataArray);
    try {
        const newSong = generateNewSong(dataArray);
        const serializedNewSong = JSON.stringify(newSong, null, 2); // Serialize with indentation for readability
        console.log("Serialized New Song:", serializedNewSong);
        return serializedNewSong;
    } catch (error) {
        console.error('Error creating and serializing new song:', error);
        return null;
    }
}

// Attach functions to the global window object to be accessible in HTML
window.songGenerator = {
    createAndSerializeNewSong
};
