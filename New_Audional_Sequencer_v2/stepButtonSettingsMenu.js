// stepButtonSettingsMenu.js

function openStepSettingsMenu(button, sequence, channelIndex, stepIndex) {
    const modalBg = document.createElement('div');
    modalBg.className = 'modal-background';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const closeButton = document.createElement('span');
    closeButton.innerText = 'X';
    closeButton.className = 'modal-close-button';
    closeButton.onclick = function() {
        document.body.removeChild(modalBg);
    };

    const title = document.createElement('h2');
    title.textContent = `Settings for Sequence: ${sequence}, Channel: ${channelIndex}, Step: ${stepIndex}`;

    // Function to calculate logarithmic pitch value
    function calculateLogValue(value, minPos, maxPos, minVal, maxVal) {
        // Convert linear range into logarithmic
        var scale = (maxVal-minVal) / (maxPos-minPos);
        return Math.exp(minVal + scale*(value-minPos));
    }

    // Volume control setup
    const volumeControl = document.createElement('input');
    volumeControl.type = 'range';
    volumeControl.min = "0";
    volumeControl.max = "100";
    volumeControl.step = "0.01";
    volumeControl.value = "50"; // Middle of the slider
    const volumeValueDisplay = document.createElement('div');
    volumeValueDisplay.textContent = `Volume: 1`; // Default volume display
    volumeControl.oninput = function() {
        let volumeValue = parseFloat(volumeControl.value) / 50; // Convert 0-100 scale to 0-2 scale
        volumeValueDisplay.textContent = `Volume: ${volumeValue.toFixed(2)}`;
    };

    // Pitch control setup
    const pitchControl = document.createElement('input');
    pitchControl.type = 'range';
    pitchControl.min = "0";
    pitchControl.max = "100";
    pitchControl.step = "0.01";
    pitchControl.value = "50"; // Middle of the slider
    const pitchValueDisplay = document.createElement('div');
    pitchValueDisplay.textContent = `Pitch: 1`; // Default pitch display
    pitchControl.oninput = function() {
        // This scales logarithmically from 0.1 to 10
        let pitchValue = calculateLogValue(parseFloat(pitchControl.value), 0, 100, Math.log(0.1), Math.log(10));
        pitchValueDisplay.textContent = `Pitch: ${pitchValue.toFixed(2)}`;
    };

    // Append elements to the modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(volumeControl);
    modalContent.appendChild(volumeValueDisplay);
    modalContent.appendChild(pitchControl);
    modalContent.appendChild(pitchValueDisplay);

    modalBg.appendChild(modalContent);

    document.body.appendChild(modalBg);
}
