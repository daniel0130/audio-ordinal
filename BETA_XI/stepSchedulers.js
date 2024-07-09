// stepSchedulers.js

function startScheduler() {
    clearTimeout(timeoutId);
    window.unifiedSequencerSettings.audioContext.resume();
    startTime = window.unifiedSequencerSettings.audioContext.currentTime;
    nextStepTime = startTime;

    const currentBPM = window.unifiedSequencerSettings.getBPM();
    console.log(`[startScheduler] Current BPM from global settings: ${currentBPM}`);

    scheduleNextStep();
    // Send start time to the slave
    if (slaveWindow) {
        slaveWindow.postMessage({
            type: 'PLAY',
            startTime: startTime  // Include the start time in the play message
        }, '*');
    }
}

function pauseScheduler() {
    clearTimeout(timeoutId); // Clear the current timeout without closing the audio context
    window.unifiedSequencerSettings.audioContext.suspend();
    pauseTime = window.unifiedSequencerSettings.audioContext.currentTime;  // record the time at which the sequencer was paused
    isPaused = true;
}

function resumeScheduler() {
  if(isPaused) {
      // Replace the startTime adjustment with a nextStepTime reset
      window.unifiedSequencerSettings.audioContext.resume().then(() => {
        nextStepTime = window.unifiedSequencerSettings.audioContext.currentTime;
        isPaused = false;
        scheduleNextStep();  // Begin scheduling steps again
    });
}
}

function scheduleNextStep() {
    // console.log('[SequenceChangeDebug] Scheduling next step.');
    // console.log("[SequenceChangeDebug] Attempting to play sound for Channel:", "Step:", currentStep);

    const bpm = window.unifiedSequencerSettings.getBPM() || 120; // Fallback to 105 BPM
    // console.log(`[scheduleNextStep] Current BPM: ${bpm}`);

    stepDuration = 60 / bpm / 4;
    // console.log(`[scheduleNextStep] Step Duration: ${stepDuration}`);

    timeoutId = setTimeout(() => {
        playStep();
        scheduleNextStep();
    }, (nextStepTime - window.unifiedSequencerSettings.audioContext.currentTime) * 1000);
}


function stopScheduler() {
    console.log('[SequenceChangeDebug] Stopping scheduler.');
    clearTimeout(timeoutId);

    // Iterate over all source nodes and stop them if they have been started
    window.unifiedSequencerSettings.sourceNodes.forEach((source, index) => {
        if (source && source.started) {
            source.stop();  // Stop only if started
            source.disconnect();  // Disconnect from the audio graph
            window.unifiedSequencerSettings.sourceNodes[index] = null;  // Clear the reference
        }
    });

    // Reset counters and state
    currentStep = 0;
    beatCount = 1;
    barCount = 1;
    sequenceCount = 0;
    isPaused = false;
    pauseTime = 0;
}




function resetStepLights() {
  const buttons = document.querySelectorAll('.step-button');
  buttons.forEach(button => {
      button.classList.remove('playing');
  });
  }
