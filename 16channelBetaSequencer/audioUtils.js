// audioUtils.js


// Function to get the ID from a URL
function getIDFromURL(url) {
  const parts = url.split('/');
  return parts[parts.length - 1];
}

// Function to convert base64 to an array buffer
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Function to decode audio data
const decodeAudioData = (audioData) => {
  return new Promise((resolve, reject) => {
    audioContext.decodeAudioData(audioData, resolve, reject);
  });
};

// Function to fetch audio data
const fetchAudio = async (url, channelIndex, loadSampleButtonElement = null) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const audioData = base64ToArrayBuffer(data.audioData.split(',')[1]);

    const audioBuffer = await decodeAudioData(audioData);
    audioBuffers.set(url, audioBuffer);

    const channel = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"]`);
    channel.dataset.originalUrl = url;
    channel.dataset.audioDataLoaded = 'true';

    if (loadSampleButtonElement) {
      const filename = data.filename || data.fileName;
      loadSampleButtonElement.classList.add('button-fixed-width');
      loadSampleButtonElement.style.width = '200px';
      loadSampleButtonElement.textContent = filename ? filename.substring(0, 20) : 'Load New Audional';
      loadSampleButtonElement.title = filename ? filename : 'Load New Audional';
      // After successfully loading a sample:
      activeChannels.add(channelIndex); // use 'channelIndex' instead of 'index'
    } else {
      console.log("Button element not found.");
    }
  } catch (error) {
    console.error('Error fetching audio:', error);
  }
};

function playSound(channel, currentStep) {
  if (channel.querySelectorAll('.step-button')[currentStep].classList.contains('selected')) {
    const url = channel.dataset.originalUrl;
    const audioBuffer = audioBuffers.get(url);
    if (audioBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Get the channel's index
      const channelIndex = parseInt(channel.dataset.id.split('-')[1]) - 1;

      // Connect the source to its corresponding gain node
      source.connect(gainNodes[channelIndex]);

      // Then connect the gain node to the destination (speakers)
      gainNodes[channelIndex].connect(audioContext.destination);


      source.start();
    }
  }
}

async function playAuditionedSample(url) {
  try {
      const response = await fetch(url);
      const data = await response.json();
      const audioData = base64ToArrayBuffer(data.audioData.split(',')[1]);

      if (!audioContext) {
          try {
              window.AudioContext = window.AudioContext || window.webkitAudioContext;
              audioContext = new AudioContext();
          } catch (e) {
              console.warn('Web Audio API is not supported in this browser');
          }
      }

      const audioBuffer = await decodeAudioData(audioData);

      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
  } catch (error) {
      console.error('Error playing auditioned sample:', error);
  }
}




// Function to toggle the play state
function togglePlayState(isPlaying, startStopFunction, firstButton, secondButton) {
  if (!isPlaying) {
    isPlaying = true;
    startStopFunction();
    firstButton.classList.add('selected');
    secondButton.classList.remove('selected');
  }
}

// Function to update the mute state in a single function
function updateMuteState(channel, shouldMute) {
    const channelIndex = parseInt(channel.dataset.id.split('-')[1]) - 1;
    channel.dataset.muted = shouldMute ? 'true' : 'false';
    const muteButton = channel.querySelector('.mute-button');
  
    muteButton.classList.toggle('selected', shouldMute);
    channelMutes[channelIndex] = shouldMute;
  
    // Mute or unmute using gain node
    if (shouldMute) {
        gainNodes[channelIndex].gain.value = 0; // Mute the channel
    } else {
        gainNodes[channelIndex].gain.value = 1; // Unmute the channel (set to original volume)
    }
  
    console.log(`Channel-${channel.dataset.id.replace("Channel-", "")} Muted: ${shouldMute}`);
}

  

// Function to handle manual toggle of the mute button
function toggleMute(channelElement) {
  const channelIndex = parseInt(channelElement.dataset.id.split('-')[1]) - 1;
  const isMuted = channelMutes[channelIndex];
  updateMuteState(channelElement, !isMuted, channelIndex);
  console.log('Mute has been toggled by the toggleMute function');
}
