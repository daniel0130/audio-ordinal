// stepHandling.js

let totalNumberOfSequences = 16;

function handleStep(channel, channelData, totalStepCount) {
    console.log('handleStep entered');
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

function renderPlayhead(buttons, currentStep) {
    console.log('renderPlayhead entered');
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
function playStep() {
    console.log("[stepHandling][playStep] Function entered");

    const currentSequence = window.unifiedSequencerSettings.getCurrentSequence();
    const presetData = presets.preset1;

    for (let channelIndex = 0; channelIndex < 16; channelIndex++) {
        console.log(`[playStep] Processing channel index: ${channelIndex}`);

        const channel = channels[channelIndex];
        const buttons = channel.querySelectorAll('.step-button');
        let channelData = presetData.channels[channelIndex] || {
            steps: Array(4096).fill(false),
            mute: false,
            url: null
        };

        renderPlayhead(buttons, currentStep);
        const isMuted = handleStep(channel, channelData, totalStepCount);
        console.log(`[playStep] Mute state for channel index ${channelIndex}: ${isMuted}`);

        playSound(currentSequence, channel, currentStep);
        console.log(`[playStep] Playing sound for current sequence: ${currentSequence}, channel index: ${channelIndex}, current step: ${currentStep}`);
    }

    incrementStepCounters();

    const continuousPlayCheckbox = document.getElementById('continuous-play');
    let isContinuousPlay = continuousPlayCheckbox.checked;

    if (isContinuousPlay && currentStep === 63) {
        let nextSequence = (currentSequence + 1) % totalNumberOfSequences;
        handleSequenceTransition(nextSequence, 0); // Always start from step 0 on automatic transition
    }
}

function handleSequenceTransition(targetSequence, startStep = 0) {
    console.log("[SeqDebug][stepHandling] handleSequenceTransition entered");

    window.unifiedSequencerSettings.setCurrentSequence(targetSequence);
    console.log(`[SeqDebug][stepHandling] Sequence set to ${targetSequence}`);

    const currentSequenceDisplay = document.getElementById('current-sequence-display');
    if (currentSequenceDisplay) {
        currentSequenceDisplay.innerHTML = `Sequence: ${targetSequence}`;
    }

    resetCountersForNewSequence(startStep);
    createStepButtonsForSequence();

    setTimeout(() => {
        window.unifiedSequencerSettings.updateUIForSequence(targetSequence);
        console.log(`[SeqDebug][handleSequenceTransition][stepHandling] UI updated for sequence ${targetSequence}`);
    }, 100);
}

function resetCountersForNewSequence(startStep = 0) {
    currentStep = startStep;
    beatCount = Math.floor(startStep / 4);
    barCount = Math.floor(startStep / 16);
    totalStepCount = startStep;
    console.log(`[resetCountersForNewSequence] Counters reset for new sequence starting at step ${startStep}`);
}


// displayUpdatedValues();



function incrementStepCounters() {
    currentStep = (currentStep + 1) % 64;
    totalStepCount = (totalStepCount + 1);
    nextStepTime += stepDuration;


    if (currentStep % 4 === 0) {
        beatCount++;
        emitBeat(beatCount);
    }

    if (currentStep % 16 === 0) {
        barCount = (barCount + 1);
        emitBar(barCount);
    }

    if (currentStep % 64 === 0) {
        sequenceCount++;
        console.log(`[playStep-count] Sequence count: ${sequenceCount}`);
    }
    console.log(`[SeqDebug][playStep-count] Next step time: ${nextStepTime}`);
}