// audioTrimmerModuleHelperFunctions.js
let currentTrimmerInstance = null;
let currentTrimmerChannelIndex = null; // Define at a higher scope




// Helper function to update the audio trimmer with the buffer
function updateAudioTrimmerWithBufferHelper(url, channelIndex) {
    console.log("updateAudioTrimmerWithBufferHelper entered");
    if (audioBuffers.has(url)) {
        const audioBuffer = audioBuffers.get(url);
        updateAudioTrimmerWithBuffer(audioBuffer, channelIndex);
    } else {
        console.error(`Audio buffer not found for URL: ${url}`);
    }
}

function updateAudioTrimmerWithBuffer(audioBuffer) {
    console.log("updateAudioTrimmerWithBuffer entered");
    if (currentTrimmerInstance) {
        currentTrimmerInstance.setAudioBuffer(audioBuffer);
        currentTrimmerInstance.drawWaveform();
        console.log(" updateDimmedAreas method called from updateaudioTrimmerWithBuffer");
        currentTrimmerInstance.updateSliderValues();
        currentTrimmerInstance.updateDimmedAreas();
    }
}

function playTrimmedAudioForChannel(channelIndex) {
    console.log("playTrimmedAudioForChannel entered");
    if (currentTrimmerInstance && currentTrimmerChannelIndex === channelIndex) {
        currentTrimmerInstance.playTrimmedAudio();
    } else {
        console.error('No active trimmer instance for the channel or channel index mismatch');
    }
}

function stopAudioForChannel(channelIndex) {
    if (currentTrimmerInstance && currentTrimmerInstance.channelIndex === channelIndex) {
        currentTrimmerInstance.stopAudio();
    } else {
        console.error('No active trimmer instance for the channel or channel index mismatch');
    }
}


document.addEventListener('DOMContentLoaded', function() {
    function openAudioTrimmerModal(channelIndex) {
        console.log('openAudioTrimmerModal entered');
        console.log('channelIndex:', channelIndex); // Log the channel index
        currentTrimmerChannelIndex = channelIndex; // Store the channel index
    
        fetch('AudioTrimModule/audioTrimModule.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load audio trim module: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                const container = document.getElementById('audio-trimmer-container');
                if (!container) {
                    throw new Error('Audio trimmer container not found in the DOM.');
                }
                container.innerHTML = html;
                console.log("[HTML Injection] Content injected into audio-trimmer-container:", container.innerHTML);
    
                // Wait for the browser to render the injected HTML
                requestAnimationFrame(() => {
                    try {
                        currentTrimmerInstance = new AudioTrimmer(channelIndex);
                        currentTrimmerInstance.initialize(); // Call initialize which should call addEventListeners
                    
                        const waveformCanvas = document.getElementById('waveformCanvas');
                        if (waveformCanvas) {
                            // Retrieve trim settings for the channel from the global object
                            const trimSettings = getTrimSettings(channelIndex);
                            if (trimSettings) {
                                // Apply the trim settings to the current trimmer instance
                                currentTrimmerInstance.startSlider.value = trimSettings.startSliderValue;
                                currentTrimmerInstance.endSlider.value = trimSettings.endSliderValue;
                                currentTrimmerInstance.setIsLooping(trimSettings.isLooping); // Set looping state
    
                                // Update the trimmer instance with the new slider values
                                currentTrimmerInstance.updateSliderValues();
                            }
                        } else {
                            console.error('Waveform canvas not found in the DOM.');
                        }
    
                        // Retrieve the URL from the global settings
                        const url = window.unifiedSequencerSettings.settings.masterSettings.channelURLs[channelIndex];
                        if (url) {
                            updateAudioTrimmerWithBufferHelper(url, channelIndex);
                        } else {
                            console.error(`No URL found for channel index: ${channelIndex}`);
                        }
                    } catch (error) {
                        console.error('Error during audio trimmer initialization:', error);
                    }
                });
    
                document.getElementById('audio-trimmer-modal').style.display = 'block';
            })
            .catch(error => {
                console.error('Error loading audio trimmer module:', error);
            });
    }
    

    document.querySelectorAll('.open-audio-trimmer').forEach((button, channelIndex) => {
        button.addEventListener('click', () => {
            console.log('Clicked button with channelIndex:', channelIndex); // Log the channel index

            // Get the URL for the audio sample from the global settings
            const url = window.unifiedSequencerSettings.settings.masterSettings.channelURLs[channelIndex];

            if (!url) {
                console.error(`No URL found for channel index: ${channelIndex}`);
                return; // Exit if no URL is found
            }

            // Call the helper function to update the audio trimmer with the buffer
            updateAudioTrimmerWithBufferHelper(url, channelIndex);

            openAudioTrimmerModal(channelIndex);
        });
    });


// Close modal functionality
document.querySelector('.close-button').addEventListener('click', function() {
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


function createAudioTrimmer(channelIndex) {
    console.log('createAudioTrimmer method entered');
    const trimmer = new AudioTrimmer(channelIndex);
    trimmer.initialize();
    console.log('createAudioTrimmer method called');
    return trimmer;
}
});