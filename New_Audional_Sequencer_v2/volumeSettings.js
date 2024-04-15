// volumeSettings.js

document.addEventListener("DOMContentLoaded", function() {
    // Attach event listeners to all volume buttons
    const volumeButtons = document.querySelectorAll('.volume-button');
    volumeButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            showVolumeSlider(event.target, index);
        });
    });
});

function showVolumeSlider(button, channelIndex) {
    // Remove any existing sliders first
    const existingSlider = document.querySelector('.volume-slider');
    if (existingSlider) {
        existingSlider.parentNode.removeChild(existingSlider);
    }

    // Create a new slider
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 1;
    slider.step = 0.01;
    slider.value = getChannelVolume(channelIndex); // Retrieve the current volume
    slider.classList.add('volume-slider');

    // Position the slider near the button
    button.parentNode.insertBefore(slider, button.nextSibling);

    // Event listener for the slider
    slider.addEventListener('input', () => {
        setChannelVolume(channelIndex, parseFloat(slider.value));
    });

    // Auto-remove slider when it loses focus
    slider.addEventListener('blur', () => {
        slider.parentNode.removeChild(slider);
    });

    // Focus the slider to show it
    slider.focus();
}

// Function to set the volume for a specific channel
function setChannelVolume(channelIndex, volume) {
    console.log(`Setting volume for channel ${channelIndex}: ${volume}`);
    const audioContext = getAudioContext();
    const gainNode = getGainNodeForChannel(channelIndex, audioContext);
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
}

// Function to get the current volume for a specific channel
function getChannelVolume(channelIndex) {
    const audioContext = getAudioContext();
    const gainNode = getGainNodeForChannel(channelIndex, audioContext);
    return gainNode.gain.value;
}

// Placeholder for getting the AudioContext
function getAudioContext() {
    // Assuming audioContext is globally defined or manage it accordingly
    return window.audioContext || new AudioContext();
}

// Placeholder for retrieving the GainNode associated with a channel
function getGainNodeForChannel(channelIndex, audioContext) {
    // This function should return the gain node associated with the channel index.
    // Assume it's stored somewhere globally or manage how gain nodes are associated with channels.
    return window.channelGainNodes[channelIndex];
}


function showVolumeSlider(button, channelIndex) {
    // Create or use existing slider logic
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 2;
    slider.step = 0.01;
    slider.value = gainNodes[channelIndex].gain.value;
    slider.classList.add('volume-slider');
    button.parentNode.insertBefore(slider, button.nextSibling);

    slider.addEventListener('input', () => {
        gainNodes[channelIndex].gain.value = parseFloat(slider.value);
        console.log(`Volume for channel ${channelIndex} set to ${slider.value}`);
    });

    slider.addEventListener('blur', () => {
        button.parentNode.removeChild(slider);
    });

    slider.focus();
}
