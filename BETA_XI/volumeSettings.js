// volumeSettings.js

let volumeModalTimeout; // To track the inactivity timeout

document.addEventListener("DOMContentLoaded", function() {
    const volumeButtons = document.querySelectorAll('.volume-button');
    volumeButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            console.log('Volume button clicked, toggling volume slider modal for channel:', index);
            event.stopPropagation(); // Stop propagation to prevent the document-level click handler from closing the modal immediately
            toggleVolumeModal(event.currentTarget, index);
        });
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.volume-modal')) {
            closeVolumeModal();
        }
    });
});

function toggleVolumeModal(button, channelIndex) {
    const existingModal = document.querySelector(`.volume-modal[data-channel="${channelIndex}"]`);
    if (existingModal) {
        closeVolumeModal(); // Close if already open
    } else {
        openVolumeModal(button, channelIndex);
    }
}
function openVolumeModal(button, channelIndex) {
    closeVolumeModal(); // Close any existing modals first

    const modal = document.createElement('div');
    modal.classList.add('volume-modal');
    modal.dataset.channel = channelIndex;
    modal.style.position = 'absolute';
    modal.style.left = `${button.offsetLeft + button.offsetWidth + 10}px`;
    modal.style.top = `${button.offsetTop}px`;
    modal.style.zIndex = 1000;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        closeVolumeModal();
    });
    modal.appendChild(closeButton);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 2;
    slider.step = 0.01;
    slider.value = getChannelVolume(channelIndex).toString();
    modal.appendChild(slider);

    const textInput = document.createElement('input');
    textInput.type = 'number';
    textInput.min = 0;
    textInput.max = 2;
    textInput.step = 0.01;
    textInput.value = slider.value;
    modal.appendChild(textInput);

    slider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        textInput.value = value.toString();
        setChannelVolume(channelIndex, value);
        resetVolumeModalTimeout();
    });

    textInput.addEventListener('input', (event) => {
        let value = parseFloat(event.target.value);
        if (isNaN(value) || value < 0) value = 0;
        if (value > 2) value = 2;
        slider.value = value.toString();
        setChannelVolume(channelIndex, value);
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

    if (!gainNode) {
        console.error(`No gain node found for channel ${channelIndex}`);
        return;
    }

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    
    if (!window.unifiedSequencerSettings.settings.masterSettings.channelVolume) {
        window.unifiedSequencerSettings.settings.masterSettings.channelVolume = new Array(16).fill(1);
    }
    
    window.unifiedSequencerSettings.settings.masterSettings.channelVolume[channelIndex] = volume;

    localStorage.setItem(`channelVolume_${channelIndex}`, volume.toString());
}

function getChannelVolume(channelIndex) {
    const gainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
    return gainNode ? gainNode.gain.value : 1.0;
}

function closeVolumeModal() {
    clearTimeout(volumeModalTimeout);
    document.querySelectorAll('.volume-modal').forEach(modal => modal.remove());
}

function resetVolumeModalTimeout() {
    clearTimeout(volumeModalTimeout);
    volumeModalTimeout = setTimeout(closeVolumeModal, 3000);
}

// Playback Speed Modal Code
const speedButtons = document.querySelectorAll('.playback-speed-button');
speedButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => {
        console.log('Playback speed button clicked, toggling speed slider modal for channel:', index);
        event.stopPropagation();
        toggleSpeedModal(event.currentTarget, index);
    });
});

function toggleSpeedModal(button, channelIndex) {
    const existingModal = document.querySelector(`.speed-modal[data-channel="${channelIndex}"]`);
    if (existingModal) {
        closeSpeedModal();
    } else {
        openSpeedModal(button, channelIndex);
    }
}

function openSpeedModal(button, channelIndex) {
    closeSpeedModal();

    const modal = document.createElement('div');
    modal.classList.add('speed-modal');
    modal.dataset.channel = channelIndex;
    modal.style.position = 'absolute';
    modal.style.left = `${button.offsetLeft + button.offsetWidth + 10}px`;
    modal.style.top = `${button.offsetTop}px`;
    modal.style.zIndex = 1000;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.backgroundColor = 'transparent';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        closeSpeedModal();
    });
    modal.appendChild(closeButton);

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0.1;
    slider.max = 10;
    slider.step = 0.01;
    slider.value = getChannelSpeed(channelIndex).toString();
    modal.appendChild(slider);

    const textInput = document.createElement('input');
    textInput.type = 'number';
    textInput.min = 0.1;
    textInput.max = 10;
    textInput.step = 0.01;
    textInput.value = slider.value;
    modal.appendChild(textInput);

    slider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        textInput.value = value.toString();
        setChannelSpeed(channelIndex, value);
        resetVolumeModalTimeout();
    });

    textInput.addEventListener('input', (event) => {
        let value = parseFloat(event.target.value);
        if (isNaN(value) || value < 0.1) value = 0.1;
        if (value > 10) value = 10;
        slider.value = value.toString();
        setChannelSpeed(channelIndex, value);
        resetVolumeModalTimeout();
    });

    modal.addEventListener('click', (event) => {
        event.stopPropagation();
        resetVolumeModalTimeout();
    });

    document.body.appendChild(modal);
    resetVolumeModalTimeout();
}

function closeSpeedModal() {
    clearTimeout(volumeModalTimeout);
    document.querySelectorAll('.speed-modal').forEach(modal => modal.remove());
}

function getChannelSpeed(channelIndex) {
    if (channelIndex >= 0 && channelIndex < window.unifiedSequencerSettings.channelPlaybackSpeed.length) {
        return window.unifiedSequencerSettings.channelPlaybackSpeed[channelIndex];
    } else {
        console.error("Channel index out of bounds");
        return 1.0;
    }
}

function setChannelSpeed(channelIndex, speed) {
    console.log(`Setting playback speed for channel ${channelIndex} to ${speed}`);
    window.unifiedSequencerSettings.setChannelPlaybackSpeed(channelIndex, speed);
}




// function closeSpeedModal() {
// clearTimeout(volumeModalTimeout); // Use the same timeout variable for simplicity
// document.querySelectorAll('.speed-modal').forEach(modal => modal.remove());
// }


// function applySavedVolume() {
//     console.log('Applying saved volume settings from global settings');
//     // Iterate over the gain nodes and set their volume based on the masterSettings
//     for (let i = 0; i < window.unifiedSequencerSettings.gainNodes.length; i++) {
//         const savedVolume = window.unifiedSequencerSettings.settings.masterSettings.channelVolume[i];
//         window.unifiedSequencerSettings.setChannelVolume(i, savedVolume);
//     }
//     console.log('Volume settings applied successfully');
// }

