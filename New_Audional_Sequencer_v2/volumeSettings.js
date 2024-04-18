// volumeSettings.js

document.addEventListener("DOMContentLoaded", function() {
    const volumeButtons = document.querySelectorAll('.volume-button');
    volumeButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            showVolumeSlider(event.currentTarget, index);
        });
    });
});

function showVolumeSlider(button, channelIndex) {
    const parentElement = button.closest('.channel');
    let slider = parentElement.querySelector('.volume-slider');
    
    if (!slider) {
        // Only create a new slider if it does not exist
        slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 0;
        slider.max = 1;
        slider.step = 0.01;
        slider.classList.add('volume-slider');
        parentElement.appendChild(slider);

        slider.addEventListener('input', () => {
            setChannelVolume(channelIndex, parseFloat(slider.value));
        });

        slider.addEventListener('blur', () => {
            slider.remove(); // Ensure the slider is removed when it loses focus
        });
    }

    // Update the slider value regardless of whether it was just created or already existed
    slider.value = getChannelVolume(channelIndex);
    slider.focus(); // Focus the slider immediately to show it
}

function setChannelVolume(channelIndex, volume) {
    console.log(`Setting volume for channel ${channelIndex}: ${volume}`);
    const audioContext = window.unifiedSequencerSettings.audioContext;
    const gainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
}

function getChannelVolume(channelIndex) {
    const gainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
    return gainNode.gain.value;
}
