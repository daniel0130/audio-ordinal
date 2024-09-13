// audioTrimmerModuleHelperFunctions.js
let currentTrimmerInstance = null;
let currentTrimmerChannelIndex = null; // Higher scope for global state tracking

// Helper function to fetch audio buffer and update trimmer
function updateAudioTrimmerWithBufferHelper(url, channelIndex) {
    const audioBuffer = audioBuffers.get(url);
    if (audioBuffer) {
        updateAudioTrimmerWithBuffer(audioBuffer, channelIndex);
    } else {
        console.error(`Audio buffer not found for URL: ${url}`);
    }
}

// Function to update the trimmer with audio buffer and refresh UI
function updateAudioTrimmerWithBuffer(audioBuffer) {
    if (currentTrimmerInstance) {
        currentTrimmerInstance.setAudioBuffer(audioBuffer);
        currentTrimmerInstance.drawWaveform();
        currentTrimmerInstance.updateSliderValues();
        currentTrimmerInstance.updateDimmedAreas();
    }
}

// Play trimmed audio for a specific channel
function playTrimmedAudioForChannel(channelIndex) {
    if (currentTrimmerInstance && currentTrimmerChannelIndex === channelIndex) {
        currentTrimmerInstance.playTrimmedAudio();
    } else {
        console.error('No active trimmer instance or channel index mismatch');
    }
}

// Stop audio playback for a specific channel
function stopAudioForChannel(channelIndex) {
    if (currentTrimmerInstance && currentTrimmerInstance.channelIndex === channelIndex) {
        currentTrimmerInstance.stopAudio();
    } else {
        console.error('No active trimmer instance or channel index mismatch');
    }
}

// Initialize audio trimmer modal with channel-specific settings
function initializeAudioTrimmer(channelIndex) {
    currentTrimmerChannelIndex = channelIndex;

    fetch('AudioTrimModule/audioTrimModule.html')
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load audio trim module: ${response.statusText}`);
            return response.text();
        })
        .then(html => {
            const container = document.getElementById('audio-trimmer-container');
            if (!container) throw new Error('Audio trimmer container not found in the DOM.');

            container.innerHTML = html;
            requestAnimationFrame(() => {
                try {
                    currentTrimmerInstance = new AudioTrimmer(channelIndex);
                    currentTrimmerInstance.initialize();

                    applyTrimSettings(channelIndex); // Apply channel-specific settings

                    const url = getChannelUrl(channelIndex);
                    if (url) {
                        updateAudioTrimmerWithBufferHelper(url, channelIndex);
                    } else {
                        console.error(`No URL found for channel index: ${channelIndex}`);
                    }
                } catch (error) {
                    console.error('Error during audio trimmer initialization:', error);
                }
            });
            const modal = document.getElementById('audio-trimmer-modal');
            modal.style.display = 'block';
        })
        .catch(error => console.error('Error loading audio trimmer module:', error));
}


// Apply trim settings for the channel
function applyTrimSettings(channelIndex) {
    const waveformCanvas = document.getElementById('waveformCanvas');
    if (!waveformCanvas) return console.error('Waveform canvas not found in the DOM.');

    const trimSettings = getTrimSettings(channelIndex);
    if (trimSettings) {
        currentTrimmerInstance.startSlider.value = trimSettings.startSliderValue;
        currentTrimmerInstance.endSlider.value = trimSettings.endSliderValue;
        currentTrimmerInstance.setIsLooping(trimSettings.isLooping);
        currentTrimmerInstance.updateSliderValues();
    }
}

// Helper to get the channel URL from global settings
function getChannelUrl(channelIndex) {
    return window.unifiedSequencerSettings.settings.masterSettings.channelURLs[channelIndex];
}

// Open audio trimmer modal on button click
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.open-audio-trimmer').forEach((button, channelIndex) => {
        button.addEventListener('click', () => {
            const url = getChannelUrl(channelIndex);
            if (!url) {
                console.error(`No URL found for channel index: ${channelIndex}`);
                return;
            }
            updateAudioTrimmerWithBufferHelper(url, channelIndex);
            initializeAudioTrimmer(channelIndex);
        });
    });

    // Close modal functionality
    document.querySelector('.close-button').addEventListener('click', () => {
        if (currentTrimmerInstance) {
            const settings = {
                startSliderValue: currentTrimmerInstance.getStartSliderValue(),
                endSliderValue: currentTrimmerInstance.getEndSliderValue(),
                isLooping: currentTrimmerInstance.getIsLooping()
            };
            setTrimSettings(currentTrimmerChannelIndex, settings.startSliderValue, settings.endSliderValue, settings.isLooping);
        }
        document.getElementById('audio-trimmer-modal').style.display = 'none';
        currentTrimmerInstance = null;
        currentTrimmerChannelIndex = null;
    });
});
