// AudioPlayback.js
import { audioContext, customLog, loadAudioFile, audioBuffersCache } from './audioContextUtil.js';

let BPM, isLooping = true, isStoppedManually = false, cumulativeOffset = 0, sequenceData;
const activeSources = new Set();
const activeTimeouts = new Set();
let isInitialPlay = true; // Flag to check if it's the initial play
let loopTimeoutId = null; // Global reference for the loop scheduling timeout

const calculateTrimTimes = (trimSettings, totalDuration) => {
    const startTime = Math.max(0, (trimSettings.startSliderValue / 100) * totalDuration),
        endTime = (trimSettings.endSliderValue / 100) * totalDuration;
    return { startTime, duration: Math.max(0, endTime - startTime) };
};

const calculateStepTime = () => 60 / BPM / 4;

const createAndStartAudioSource = (audioBuffer, trimSettings, playbackTime, channelIndex) => {
    if (!audioBuffer) return;

    const { startTime, duration } = calculateTrimTimes(trimSettings, audioBuffer.duration);
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    
    // Adjust playbackTime to ensure seamless looping
    const scheduledStartTime = audioContext.currentTime + playbackTime + cumulativeOffset;
    source.start(scheduledStartTime, startTime, duration);

    // Store reference for potential future adjustments
    activeSources.add({ source, scheduledEndTime: scheduledStartTime + duration });
};

const playAudio = async () => {
    if (!sequenceData || !sequenceData.projectURLs || !sequenceData.projectSequences) {
        customLog("No valid sequence data available. Cannot play audio.", true);
        return;
    }
    isStoppedManually = false; // Ensure this flag is correctly managed in your logic
    isLooping = true;
    BPM = sequenceData.projectBPM;

    // This time, we won't stop audio but rather allow sequences to overlap slightly during the loop transition
    // stopAudio(); // Consider removing or reworking this call to fit the new seamless logic

    // Initial buffer loading logic remains unchanged
    if (isInitialPlay) {
        audioBuffersCache = await Promise.all(sequenceData.projectURLs.map(loadAudioFile));
        isInitialPlay = false;
    }

    if (!audioBuffersCache.some(buffer => buffer)) {
        customLog("No valid audio data available for any channel. Cannot play audio.", true);
        return;
    }

    let lastSequenceEndTime = audioContext.currentTime; // Continuously increment, never reset

    Object.entries(sequenceData.projectSequences).forEach(([sequenceName, channels], sequenceIndex) => {
        const sequenceDuration = 64 * calculateStepTime();

        Object.entries(channels).forEach(([channelName, channelData], channelIndex) => {
            const { steps } = channelData, audioBuffer = audioBuffersCache[channelIndex], trimSetting = sequenceData.trimSettings ? sequenceData.trimSettings[channelIndex] : undefined;
            if (audioBuffer && steps) steps.forEach((active, stepIndex) => {
                if (active) {
                    const playbackTime = lastSequenceEndTime + stepIndex * calculateStepTime() - audioContext.currentTime;
                    schedulePlaybackForStep(audioBuffer, trimSetting, playbackTime, channelIndex, stepIndex, sequenceIndex);
                }
            });
        });

        lastSequenceEndTime += sequenceDuration;
    });

    // Seamlessly continue playback by scheduling the next play without resetting times
    // Use `lastSequenceEndTime - audioContext.currentTime` to delay the next loop just right
    if (isLooping && !isStoppedManually) {
        const delayForNextLoop = Math.max(0, lastSequenceEndTime - audioContext.currentTime);
        loopTimeoutId = setTimeout(playAudio, delayForNextLoop * 1000); // Update to use global reference
    }
};

const schedulePlaybackForStep = (audioBuffer, trimSettings, playbackTime, channelIndex, stepIndex, sequenceIndex) => {
    createAndStartAudioSource(audioBuffer, trimSettings, playbackTime, channelIndex);
    const delayUntilPlayback = playbackTime * 1000;

    const timeoutId = setTimeout(() => {
        console.log(`Playing sequence ${sequenceIndex} channel ${channelIndex} step ${stepIndex}`);
        document.dispatchEvent(new CustomEvent('channelPlaybackStarted', { detail: { sequenceIndex, channelIndex, stepIndex } }));
        channelPlaybackBroadcast.postMessage({ sequenceIndex, channelIndex, stepIndex });
    }, delayUntilPlayback);

    activeTimeouts.add(timeoutId);
};

// Adjust or remove stopAudio as needed, considering that activeSources are now managed differently
const stopAudio = () => {
    activeSources.forEach(entry => {
        const { source } = entry;
        source.stop();
        source.disconnect();
    });
    activeSources.clear();

    activeTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    activeTimeouts.clear();

    if (loopTimeoutId !== null) {
        clearTimeout(loopTimeoutId); // Clear the loop scheduling timeout
        loopTimeoutId = null; // Reset the reference
    }

    channelPlaybackBroadcast.postMessage({ action: "stop" });

    isStoppedManually = true; // Ensure this flag is correctly managed in your logic
    isLooping = false;
    // Consider toggling isLooping as necessary based on your app's needs
};

export { playAudio, stopAudio };
