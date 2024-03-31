function preparePlaybackSettings(jsonSettings) {
    const { projectName, bpm, channelURLs, projectSequences } = jsonSettings;
    let playbackSettings = {
        projectName,
        bpm,
        channelURLs: channelURLs, // Direct mapping since it's already an array of URLs
        sequences: [],
    };

    // Process each sequence to organize active steps and channels
    Object.keys(projectSequences).forEach(sequenceKey => {
        const sequenceData = projectSequences[sequenceKey];
        let sequence = {
            name: sequenceKey,
            channels: []
        };

        // Process each channel within the sequence
        Object.keys(sequenceData).forEach(channelKey => {
            const { steps, mute, url } = sequenceData[channelKey];
            // Assuming all channels should be included, even if not active
            sequence.channels.push({
                name: channelKey,
                mute,
                url,
                steps: steps, // Direct mapping, steps array is ready for playback
            });
        });

        playbackSettings.sequences.push(sequence);
    });

    console.log('Playback settings loaded successfully:', playbackSettings);
    return playbackSettings;
}

// Example Usage:
const jsonSettings = {/* JSON data here */};
const playbackSettings = preparePlaybackSettings(jsonSettings);

// To display the structured settings, consider stringifying the result for readability
console.log(JSON.stringify(playbackSettings, null, 2));
