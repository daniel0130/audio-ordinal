// stepHandling.js

function handleStep(channel, channelData, totalStepCount) {
    let isMuted = channel.dataset.muted === 'true';
    const isToggleMuteStep = channelData.toggleMuteSteps.includes(totalStepCount);

    if (isToggleMuteStep) {
      isMuted = !isMuted;
      channel.dataset.muted = isMuted ? 'true' : 'false';
      // Update the mute state in the DOM
      updateMuteState(channel, isMuted);
      console.log('Mute toggled by the handleStep function');
    }

    return isMuted;
}

function renderPlayhead(buttons, currentStep, isMuted) {
    buttons.forEach((button, buttonIndex) => {
        button.classList.remove('playing');
        button.classList.remove('triggered');

        if (buttonIndex === currentStep && !isMuted) {
            button.classList.add('playing');
        }

        if (button.classList.contains('selected')) {
            button.classList.add('triggered');
        }
    });
}

function playStep() {
    const presetData = presets.preset1;

    // Only iterate over active channels
    activeChannels.forEach((channelIndex) => {
        const channel = channels[channelIndex];
        const buttons = channel.querySelectorAll('.step-button');
        let channelData = presetData.channels[channelIndex];
        const defaultTriggerArray = Array(4096).fill(false);

        // If no channelData is found for the current channel, use a default set of values
        if (!channelData) {
            console.warn(`No preset data for channel index: ${channelIndex + 1}`);
            channelData = {
                triggers: defaultTriggerArray.slice(), // Clone the defaultTriggerArray
                toggleMuteSteps: [],
                mute: false,
                url: null
            };
        }

        renderPlayhead(buttons, currentStep, channel.dataset.muted === 'true');
        const isMuted = handleStep(channel, channelData, totalStepCount);
        playSound(channel, currentStep, isMuted);
    });

    currentStep = (currentStep + 1) % 64;
    totalStepCount = (totalStepCount + 1);

    if (currentStep % 4 === 0) {
        beatCount++;  
    }

    if (currentStep % 16 === 0) {
        barCount = (barCount + 1);
    }

    if (currentStep % 64 === 0) {
        sequenceCount++;

        // Check if we need to switch to the next sequence (continuous play logic)
        const continuousPlayCheckbox = document.getElementById('continuous-play');
        if (continuousPlayCheckbox && continuousPlayCheckbox.checked) {
            // Reset counters for the next sequence
            beatCount = 0;
            barCount = 0;
            currentStep = 0;
            totalStepCount = 0;

            // Use the next-sequence button logic to move to the next sequence
            document.getElementById('next-sequence').click();
        }
    }

    nextStepTime += stepDuration;
    displayUpdatedValues();
}

function updateStepButtonsUI() {
    const currentSequence = sequences[sequenceCount - 1]; // Get the current sequence based on sequenceCount
    const stepButtons = document.querySelectorAll('.step-button');
    
    stepButtons.forEach((button, index) => {
        // Update each button's state based on the currentSequence
        if (currentSequence[index]) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}
