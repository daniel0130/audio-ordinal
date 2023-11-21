// updateSequenceData.js

/**
 * Centralized function to update sequence data.
 * @param {Object} params - Parameters for updating sequence data.
 * @param {number} [params.sequenceIndex] - The index of the sequence.
 * @param {string} [params.sequenceName] - The name of the sequence.
 * @param {number} [params.bpm] - Beats per minute for the sequence.
 * @param {number} [params.channelIndex] - The index of the channel.
 * @param {string} [params.url] - URL for the channel's audio sample.
 * @param {boolean} [params.muteState] - Mute state for the channel.
 * @param {Array} [params.stepSettings] - An array of step button states for the channel.
 */


function updateSequenceData(params) {
    
    if (params.sequenceIndex !== undefined) {
        // Assertion to ensure valid indexing
        if (params.sequenceIndex < 0 || params.sequenceIndex >= sequenceBPMs.length) {
            console.error(`Invalid sequenceIndex: ${params.sequenceIndex}`);
            return;
        }
        if (params.bpm) {
            // Apply BPM to all sequences
            sequenceBPMs.fill(params.bpm);
        }
    }

    if (params.channelIndex !== undefined) {
        if (params.url) {
            // Update URL for the channel
            channelURLs[params.sequenceIndex][params.channelIndex] = params.url;
        }
        if (params.muteState !== undefined) {
            // Update mute state for the channel
            channelMutes[params.channelIndex] = params.muteState;
        }
        if (params.stepSettings) {
            // Update step button states for the channel
            channelSettings[params.channelIndex] = params.stepSettings;
        }
    }
}
