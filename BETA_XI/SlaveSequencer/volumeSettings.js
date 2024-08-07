// volumeSettings.js

let modalTimeout; // To track the inactivity timeout
let mouseOutTimeout;

document.addEventListener("DOMContentLoaded", function() {
    const volumeButtons = document.querySelectorAll('.volume-button');
    const speedButtons = document.querySelectorAll('.playback-speed-button');

    volumeButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            handleButtonClick(event, 'volume', index);
        });
    });

    speedButtons.forEach((button, index) => {
        button.addEventListener('click', (event) => {
            handleButtonClick(event, 'speed', index);
        });
    });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('.volume-modal')) closeModal('volume');
        if (!event.target.closest('.speed-modal')) closeModal('speed');
    });
});

function handleButtonClick(event, type, index) {
    console.log(`${capitalize(type)} button clicked, toggling ${type} slider modal for channel:`, index);
    event.stopPropagation();
    toggleModal(event.currentTarget, type, index);
}

function toggleModal(button, type, channelIndex) {
    const existingModal = document.querySelector(`.${type}-modal[data-channel="${channelIndex}"]`);
    if (existingModal) {
        closeModal(type);
    } else {
        openModal(button, type, channelIndex);
    }
}

function openModal(button, type, channelIndex) {
    closeModal(type);

    const modal = document.createElement('div');
    modal.classList.add(`${type}-modal`);
    modal.dataset.channel = channelIndex;
    modal.style.position = 'absolute';
    modal.style.left = `${button.offsetLeft + button.offsetWidth + 10}px`;
    modal.style.top = `${button.offsetTop}px`;
    modal.style.zIndex = 1000;

    const closeButton = createCloseButton(() => closeModal(type));
    modal.appendChild(closeButton);

    const slider = createSlider(type, channelIndex);
    const textInput = createTextInput(type, channelIndex, slider);
    modal.appendChild(slider);
    modal.appendChild(textInput);

    addModalEventListeners(modal, type);

    document.body.appendChild(modal);
    resetModalTimeout(type);
}

function createCloseButton(closeFunc) {
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
        closeFunc();
    });
    return closeButton;
}

function createSlider(type, channelIndex) {
    const slider = document.createElement('input');
    slider.type = 'range';
    if (type === 'volume') {
        slider.min = 0;
        slider.max = 2;
        slider.step = 0.01;
        slider.value = getChannelValue(type, channelIndex).toString();
    } else if (type === 'speed') {
        slider.min = 0.1;
        slider.max = 10;
        slider.step = 0.01;
        slider.value = getChannelValue(type, channelIndex).toString();
    }
    slider.addEventListener('input', (event) => {
        const value = parseFloat(event.target.value);
        const textInput = slider.nextElementSibling;
        textInput.value = value.toString();
        setChannelValue(type, channelIndex, value);
        resetModalTimeout(type);
    });
    return slider;
}

function createTextInput(type, channelIndex, slider) {
    const textInput = document.createElement('input');
    textInput.type = 'number';
    if (type === 'volume') {
        textInput.min = 0;
        textInput.max = 2;
        textInput.step = 0.01;
    } else if (type === 'speed') {
        textInput.min = 0.1;
        textInput.max = 10;
        textInput.step = 0.01;
    }
    textInput.value = slider.value;
    textInput.addEventListener('input', (event) => {
        let value = parseFloat(event.target.value);
        if (isNaN(value)) value = type === 'volume' ? 0 : 0.1;
        if (type === 'volume' && value > 2) value = 2;
        if (type === 'speed' && value > 10) value = 10;
        slider.value = value.toString();
        setChannelValue(type, channelIndex, value);
        resetModalTimeout(type);
    });
    return textInput;
}

function addModalEventListeners(modal, type) {
    // Adding event listener for click event on the modal
    modal.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click from bubbling up
        resetModalTimeout(type); // Reset the longer timeout on click
    });

    // Adding event listener for mouseover event on the modal
    modal.addEventListener('mouseover', () => resetModalTimeout(type)); // Reset the longer timeout on mouseover

    // Adding event listener for mouseout event on the modal
    modal.addEventListener('mouseout', () => setMouseOutTimeout(type)); // Set the shorter timeout on mouseout
}

function closeModal(type) {
    clearTimeout(modalTimeout); // Clear any existing timeout for interaction
    clearTimeout(mouseOutTimeout); // Clear any existing timeout for mouseout
    document.querySelectorAll(`.${type}-modal`).forEach(modal => modal.remove()); // Remove all modals of the given type
}

function resetModalTimeout(type) {
    clearTimeout(modalTimeout); // Clear any existing interaction timeout
    modalTimeout = setTimeout(() => closeModal(type), 20000); // Set a new 20-second timeout for interaction
}

function setMouseOutTimeout(type) {
    clearTimeout(mouseOutTimeout); // Clear any existing mouseout timeout
    mouseOutTimeout = setTimeout(() => closeModal(type), 10000); // Set a new 10-second timeout for mouseout
}


function getChannelValue(type, channelIndex) {
    if (type === 'volume') {
        const gainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
        return gainNode ? gainNode.gain.value : 1.0;
    } else if (type === 'speed') {
        return window.unifiedSequencerSettings.channelPlaybackSpeed[channelIndex] || 1.0;
    }
}

function setChannelValue(type, channelIndex, value) {
    if (type === 'volume') {
        setChannelVolume(channelIndex, value);
    } else if (type === 'speed') {
        setChannelSpeed(channelIndex, value);
    }
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


function setChannelSpeed(channelIndex, speed) {
    console.log(`Setting playback speed for channel ${channelIndex} to ${speed}`);
    window.unifiedSequencerSettings.setChannelPlaybackSpeed(channelIndex, speed);
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
