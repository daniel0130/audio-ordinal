// displayUpdatedValues.js

function displayUpdatedValues() {
    console.log("isPlaying:", isPlaying);
    console.log("currentStep:", currentStep);
    console.log("totalStepCount:", totalStepCount);
    console.log("beatCount:", beatCount);
    console.log("barCount:", barCount);
    console.log("sequenceCount:", sequenceCount);
    console.log("stopClickCount:", stopClickCount);
    console.log("channels:", channels);
    console.log("bpm:", bpm);
    console.log("audioContext:", audioContext);
    console.log("currentStepTime:", currentStepTime);
    console.log("startTime:", startTime);
    console.log("nextStepTime:", nextStepTime);
    console.log("stepDuration:", stepDuration);
    console.log("gainNodes:", gainNodes)

     // Log the mute state of each channel
    channels.forEach((channel, index) => {
      const isMuted = channel.dataset.muted === 'true';
      console.log(`Channel-${index + 1} - Muted: ${isMuted}`);
    });
  }