// volumeSettings.js

let volumeModalTimeout; // To track the inactivity timeout


document.addEventListener("DOMContentLoaded", function() {
    const volumeButtons = document.querySelectorAll('.volume-button');
    volumeButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            console.log('volumeButton clicked, opening volume slider modal:', volumeButtons);

            // // Stop propagation to prevent the document-level click handler from closing the modal immediately
            event.stopPropagation(); 
            openVolumeModal(event.currentTarget, index);
        });
    });

    // Close the modal if the click is outside of it
    document.addEventListener('click', function(event) {
        console.log('VolumeButton clicked to close:', event.target);
        if (!event.target.closest('.volume-modal')) {
            closeVolumeModal();
        }
    });
});


function openVolumeModal(button, channelIndex) {
    // Close any existing modals first
    closeVolumeModal();

    // Create the modal container
    const modal = document.createElement('div');
    modal.classList.add('volume-modal');

    // Style the modal to position it correctly (this is just an example)
    modal.style.position = 'absolute';
    modal.style.left = `${button.offsetLeft + button.offsetWidth + 10}px`; // To the right of the button
    modal.style.top = `${button.offsetTop}px`; // Aligned with the button vertically
    modal.style.zIndex = 1000; // Make sure it's on top of other elements

    // Create the slider inside the modal
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0.01;
    slider.max = 2;
    slider.step = 0.01;
    // slider.value = getChannelVolume(channelIndex) || 1.0; // Default to 1.0
    slider.value = getChannelVolume(channelIndex).toString();
    modal.appendChild(slider);

    slider.addEventListener('input', (event) => {
        setChannelVolume(channelIndex, parseFloat(event.target.value));
        resetVolumeModalTimeout(); // Reset the timeout on slider interaction
    });

    resetVolumeModalTimeout(); // Start the close timer

    // Prevent clicks inside the modal from closing it
    modal.addEventListener('click', (event) => {
        event.stopPropagation();
        resetVolumeModalTimeout(); // Reset the timeout on click inside the modal
    });
    document.body.appendChild(modal);

}

function setChannelVolume(channelIndex, volume) {
    console.log(`Setting volume for channel ${channelIndex}: ${volume}`);
    const audioContext = window.unifiedSequencerSettings.audioContext;
    const gainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
}

function getChannelVolume(channelIndex) {
    const gainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
    return gainNode ? gainNode.gain.value : 1.0; // Default to mid-range if undefined
}

function closeVolumeModal() {
    clearTimeout(volumeModalTimeout);
    document.querySelectorAll('.volume-modal').forEach(modal => modal.remove());
}

function resetVolumeModalTimeout() {
    clearTimeout(volumeModalTimeout);
    volumeModalTimeout = setTimeout(closeVolumeModal, 3000);
}

// Call this function when you need to close the modal, such as when a new button is clicked
// or potentially when the user clicks outside the modal.
