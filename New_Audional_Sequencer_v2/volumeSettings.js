// volumeSettings.js

let volumeModalTimeout; // To track the inactivity timeout

document.addEventListener("DOMContentLoaded", function() {
    const volumeButtons = document.querySelectorAll('.volume-button');
    volumeButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            console.log('Volume button clicked, opening volume slider modal for channel:', index);
            event.stopPropagation(); // Stop propagation to prevent the document-level click handler from closing the modal immediately
            openVolumeModal(event.currentTarget, index);
        });
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.volume-modal')) {
            closeVolumeModal();
        }
    });
});

function openVolumeModal(button, channelIndex) {
    closeVolumeModal(); // Close any existing modals first

    // Create the modal container
    const modal = document.createElement('div');
    modal.classList.add('volume-modal');
    modal.style.position = 'absolute';
    modal.style.left = `${button.offsetLeft + button.offsetWidth + 10}px`;
    modal.style.top = `${button.offsetTop}px`;
    modal.style.zIndex = 1000;

    // Create the slider inside the modal
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 2;
    slider.step = 0.01;
    slider.value = getChannelVolume(channelIndex).toString(); // Set initial value based on current volume
    modal.appendChild(slider);

    slider.addEventListener('input', (event) => {
        setChannelVolume(channelIndex, parseFloat(event.target.value));
        resetVolumeModalTimeout();
    });

    modal.addEventListener('click', (event) => {
        event.stopPropagation();
        resetVolumeModalTimeout();
    });

    document.body.appendChild(modal);
    resetVolumeModalTimeout();
}

function setChannelVolume(channelIndex, volume) {
    console.log(`Setting volume for channel ${channelIndex} to ${volume}`);
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
    volumeModalTimeout = setTimeout(closeVolumeModal, 3000); // Adjust modal close timeout as needed
}
