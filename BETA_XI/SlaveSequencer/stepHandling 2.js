let totalNumberOfSequences = window.unifiedSequencerSettings.numSequences;

function handleStep(channel, channelData, totalStepCount) {
    let isMuted = channel.dataset.muted === 'true';
    const isToggleMuteStep = channelData.toggleMuteSteps.includes(totalStepCount);

    if (isToggleMuteStep) {
        isMuted = !isMuted;
        channel.dataset.muted = isMuted ? 'true' : 'false';
        updateMuteState(channel, isMuted);
    }

    return isMuted;
}

function renderPlayhead(buttons, currentStep) {
    buttons.forEach((button, buttonIndex) => {
        button.classList.remove('playing');
        button.classList.remove('triggered');

        if (buttonIndex === currentStep) {
            button.classList.add('playing');
        }

        if (button.classList.contains('selected')) {
            button.classList.add('triggered');
        }
    });
}

function playStep(currentStep, currentSequence) {
    const presetData = presets.preset1;

    for (let channelIndex = 0; channelIndex < 16; channelIndex++) {
        const channel = channels[channelIndex];
        const buttons = channel.querySelectorAll('.step-button');
        let channelData = presetData.channels[channelIndex] || {
            steps: Array(4096).fill(false),
            mute: false,
            url: null
        };

        renderPlayhead(buttons, currentStep);
        const isMuted = handleStep(channel, channelData, totalStepCount);
        playSound(currentSequence, channel, currentStep);
    }

    const isLastStep = currentStep === 63;
    incrementStepCounters();

    const continuousPlayCheckbox = document.getElementById('continuous-play');
    let isContinuousPlay = continuousPlayCheckbox.checked;

    if (isContinuousPlay && isLastStep) {
        let nextSequence = (currentSequence + 1) % totalNumberOfSequences;
        handleSequenceTransition(nextSequence, 0);
    }
}

function incrementStepCounters() {
    currentStep = (currentStep + 1) % 64;
    totalStepCount = (totalStepCount + 1);
    nextStepTime += stepDuration;

    if (currentStep % 4 === 0) {
        beatCount++;
        emitBeat(beatCount);
    }

    if (currentStep % 16 === 0) {
        barCount++;
        emitBar(barCount);
    }

    if (currentStep === 0) {
        sequenceCount++;
    }
}

function handleSequenceTransition(targetSequence, startStep) {
    window.unifiedSequencerSettings.setCurrentSequence(targetSequence);
    console.log(`Sequence set to ${targetSequence}`);

    const currentSequenceDisplay = document.getElementById('current-sequence-display');
    if (currentSequenceDisplay) {
        currentSequenceDisplay.innerHTML = `Sequence: ${targetSequence}`;
    }

    if (startStep === undefined) {
        startStep = currentStep;
    }

    resetCountersForNewSequence(startStep);
    createStepButtonsForSequence();

    setTimeout(() => {
        window.unifiedSequencerSettings.updateUIForSequence(targetSequence);
    }, 100);
}

function resetCountersForNewSequence(startStep = 0) {
    currentStep = startStep;
    beatCount = Math.floor(startStep / 4);
    barCount = Math.floor(startStep / 16);
    totalStepCount = startStep;
    console.log(`Counters reset for new sequence starting at step ${startStep}`);
}

function resetStepLights() {
    const buttons = document.querySelectorAll('.step-button');
    buttons.forEach(button => {
        button.classList.remove('playing');
    });
}
