// slaveStepScheduler

function startScheduler() {
    clearTimeout(timeoutId);
    window.unifiedSequencerSettings.audioContext.resume();
    startTime = window.unifiedSequencerSettings.audioContext.currentTime;
    nextStepTime = startTime;

    const currentBPM = window.unifiedSequencerSettings.getBPM();
    console.log(`Current BPM from global settings: ${currentBPM}`);

    scheduleNextStep();
}

function pauseScheduler() {
    clearTimeout(timeoutId);
    window.unifiedSequencerSettings.audioContext.suspend();
    pauseTime = window.unifiedSequencerSettings.audioContext.currentTime;
    isPaused = true;
}

function resumeScheduler() {
    if (isPaused) {
        window.unifiedSequencerSettings.audioContext.resume();
        nextStepTime = window.unifiedSequencerSettings.audioContext.currentTime;
        isPaused = false;
    }
    scheduleNextStep();
}

function scheduleNextStep() {
    const bpm = window.unifiedSequencerSettings.getBPM() || 105;
    stepDuration = 60 / bpm / 4;

    timeoutId = setTimeout(() => {
        playStep(currentStep, currentSequence);
        scheduleNextStep();
    }, (nextStepTime - audioContext.currentTime) * 1000);
}

function stopScheduler() {
    console.log('Stopping scheduler.');
    clearTimeout(timeoutId);

    window.unifiedSequencerSettings.sourceNodes.forEach((source, index) => {
        if (source && source.started) {
            source.stop();
            source.disconnect();
            window.unifiedSequencerSettings.sourceNodes[index] = null;
        }
    });

    currentStep = 0;
    beatCount = 1;
    barCount = 1;
    sequenceCount = 0;
    isPaused = false;
    pauseTime = 0;
}
