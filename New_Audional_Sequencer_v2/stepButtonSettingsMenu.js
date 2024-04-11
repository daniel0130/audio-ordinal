// stepButtonSettingsMenu.js

// Helper function to create volume control
function createVolumeControl(labelText, channelIndex, onChangeCallback, stepIndex) {
    const label = document.createElement('label');
    label.textContent = labelText;
  
    const control = document.createElement('input');
    control.type = 'range';
    control.min = "0";
    control.max = "100";
    control.step = "1"; // Assuming you want whole numbers for volume
    control.value = "100"; // Assuming the default channel volume is maximum
  
    // Fetch initial channel or step volume if available and set the slider value
    const initialVolume = onChangeCallback === setChannelVolume ?
    window.unifiedSequencerSettings.getChannelVolume(channelIndex) : window.unifiedSequencerSettings.getStepVolume(channelIndex, stepIndex);
    control.value = initialVolume * 50; // Adjust based on how volume is represented in your application
  
    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = initialVolume.toFixed(2); // Display the value with 2 decimal places
  
    control.oninput = function() {
      let volumeValue = parseFloat(control.value) / 50; // Convert 0-100 scale to 0-2 scale
      valueDisplay.textContent = volumeValue.toFixed(2);
      onChangeCallback(channelIndex, volumeValue, stepIndex); // Update volume
    };
  
    label.appendChild(control);
    label.appendChild(valueDisplay);
  
    return { container: label, control, valueDisplay };
  }

  // Helper function to create pitch control
function createPitchControl(labelText, channelIndex, onChangeCallback, stepIndex) {
    const label = document.createElement('label');
    label.textContent = labelText;
  
    const control = document.createElement('input');
    control.type = 'range';
    control.min = "0";
    control.max = "100";
    control.step = "1"; // Assuming you want whole numbers for pitch
    control.value = "100"; // Assuming the default channel pitch is maximum (normal speed)

    // Fetch initial channel or step pitch if available and set the slider value
    const initialPitch = onChangeCallback === window.unifiedSequencerSettings.setChannelPitch ?
    window.unifiedSequencerSettings.getChannelPitch(channelIndex) : window.unifiedSequencerSettings.getStepPitch(channelIndex, stepIndex);
    control.value = (Math.log(initialPitch) / Math.log(2) + 1) * 50; // Convert logarithmic pitch to linear scale for slider
  
    const valueDisplay = document.createElement('span');
    valueDisplay.textContent = `Pitch: ${initialPitch.toFixed(2)}`; // Display the value with 2 decimal places
  
    control.oninput = function() {
      // Assuming the pitch control is logarithmic, centered at 1 (normal speed)
      let pitchValue = Math.pow(2, (parseFloat(control.value) / 50) - 1);
      valueDisplay.textContent = `Pitch: ${pitchValue.toFixed(2)}`;
      onChangeCallback(channelIndex, pitchValue, stepIndex); // Update pitch
    };
  
    label.appendChild(control);
    label.appendChild(valueDisplay);
  
    return { container: label, control, valueDisplay };
}


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
        window.unifiedSequencerSettings.setChannelVolume(channelIndex, volumeValue); // Update the channel's volume
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
        let pitchValue = calculateLogValue(parseFloat(pitchControl.value), 0, 100, Math.log(0.1), Math.log(10));
        pitchValueDisplay.textContent = `Pitch: ${pitchValue.toFixed(2)}`;
        window.unifiedSequencerSettings.setChannelPlaybackSpeed(channelIndex, pitchValue); // Adjust the playback speed
    };

    // Add a separator or label to distinguish channel and step controls
    const channelControlsTitle = document.createElement('h3');
    channelControlsTitle.textContent = 'Channel Controls';
    modalContent.appendChild(channelControlsTitle);
// Fetch channel settings for volume and pitch
const channelVolume = window.unifiedSequencerSettings.getChannelVolume(channelIndex); // Ensure this function is implemented
const channelPitch = window.unifiedSequencerSettings.getChannelPitch(channelIndex); // Ensure this function is implemented

// Fetch step settings for volume and pitch
const stepSettings = window.unifiedSequencerSettings.getStepSettings(sequence, channelIndex, stepIndex); // Ensure this function is implemented

// Channel controls
const channelVolumeControl = createVolumeControl('Channel Volume', channelIndex, window.unifiedSequencerSettings.setChannelVolume);
channelVolumeControl.control.value = channelVolume * 50;
channelVolumeControl.valueDisplay.textContent = `Volume: ${channelVolume.toFixed(2)}`;

const channelPitchControl = createPitchControl('Channel Pitch', channelIndex, window.unifiedSequencerSettings.setChannelPitch);
channelPitchControl.control.value = channelPitch * 50;
channelPitchControl.valueDisplay.textContent = `Pitch: ${channelPitch.toFixed(2)}`;

// Step controls
const stepVolumeControl = createVolumeControl('Step Volume', channelIndex, window.unifiedSequencerSettings.setStepVolume, stepIndex);
stepVolumeControl.control.value = stepSettings.volume * 50;
stepVolumeControl.valueDisplay.textContent = `Volume: ${stepSettings.volume.toFixed(2)}`;

const stepPitchControl = createPitchControl('Step Pitch', channelIndex, window.unifiedSequencerSettings.setStepPitch, stepIndex);
stepPitchControl.control.value = stepSettings.pitch * 50;
stepPitchControl.valueDisplay.textContent = `Pitch: ${stepSettings.pitch.toFixed(2)}`;


    // Append elements to the modal
    modalContent.appendChild(closeButton);
    modalContent.appendChild(title);
    modalContent.appendChild(volumeControl);
    modalContent.appendChild(volumeValueDisplay);
    modalContent.appendChild(pitchControl);
    modalContent.appendChild(pitchValueDisplay);
    modalContent.appendChild(channelVolumeControl.container);
    modalContent.appendChild(channelPitchControl.container);
    modalContent.appendChild(stepVolumeControl.container);
    modalContent.appendChild(stepPitchControl.container);

    modalBg.appendChild(modalContent);

    document.body.appendChild(modalBg);
}


