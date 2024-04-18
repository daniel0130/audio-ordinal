// stepSchedulers.js

function startScheduler() {
    channels.forEach(channel => {
        const channelIndex = parseInt(channel.dataset.id.split('-')[1]);
        if (!channelMutes[channelIndex]) {  // If channel is not muted
            setChannelVolume(channelIndex, 1);
        }
    });

    clearTimeout(timeoutId); // Clear the current timeout without closing the audio context
    window.unifiedSequencerSettings.audioContext.resume();
    startTime = window.unifiedSequencerSettings.audioContext.currentTime;
    nextStepTime = startTime;

    const currentBPM = window.unifiedSequencerSettings.getBPM();
    console.log(`[startScheduler] Current BPM from global settings: ${currentBPM}`);

    scheduleNextStep();
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
      window.unifiedSequencerSettings.audioContext.resume();
      nextStepTime = window.unifiedSequencerSettings.audioContext.currentTime;
      isPaused = false;
  }
  scheduleNextStep(); // Begin scheduling steps again
}

function scheduleNextStep() {
    // console.log('[SequenceChangeDebug] Scheduling next step.');
    // console.log("[SequenceChangeDebug] Attempting to play sound for Channel:", "Step:", currentStep);

    const bpm = window.unifiedSequencerSettings.getBPM() || 105; // Fallback to 105 BPM
    // console.log(`[scheduleNextStep] Current BPM: ${bpm}`);

    stepDuration = 60 / bpm / 4;
    // console.log(`[scheduleNextStep] Step Duration: ${stepDuration}`);

    timeoutId = setTimeout(() => {
        playStep();
        scheduleNextStep();
    }, (nextStepTime - audioContext.currentTime) * 1000);
}


function stopScheduler() {
    console.log('[SequenceChangeDebug] Stopping scheduler.');
    channels.forEach(channel => {
        setChannelVolume(parseInt(channel.dataset.id.split('-')[1]), 0);
      });
    clearTimeout(timeoutId);
    // Reset counters
    currentStep = 0;
    beatCount = 1;
    barCount = 1; // Reset barCount to 1
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
