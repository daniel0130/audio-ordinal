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

// Function to fetch and parse the HTML to find the content type
async function fetchAndParseContentType(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const contentTypeElement = doc.querySelector('dt:contains("content type") + dd');
    if (contentTypeElement) {
      return contentTypeElement.textContent; // This will be 'audio/mpeg' for the given example
    } else {
      throw new Error('Content type not found');
    }
  } catch (error) {
    console.error('Error fetching or parsing HTML:', error);
  }
}


// Function to fetch audio data
const fetchAudio = async (url, channelIndex, loadSampleButtonElement = null) => {
  try {
    const response = await fetch(url);
    let data;
    let audioData;
    let isBinaryData = false;
    let filename;

    // Clone the response for a second read attempt if the first one fails
    const clonedResponse = response.clone();

    try {
      // Try to read the response as JSON
      data = await response.json();
      // If this succeeds, extract the audio data from the JSON
      audioData = base64ToArrayBuffer(data.audioData.split(',')[1]);
      filename = data.filename || data.fileName; // Get filename from JSON if available
    } catch (e) {
      // If JSON parsing fails, try reading as binary data
      console.log("Response is not JSON, trying to read as arrayBuffer");
      try {
        audioData = await clonedResponse.arrayBuffer();
        isBinaryData = true;
        filename = url.split('/').pop(); // Use the URL to get the filename for binary data
      } catch (e) {
        console.error("Response could not be processed as JSON or as an ArrayBuffer.", e);
        return; // Exit the function if we cannot process the response
      }
    }

    // Proceed with audio data processing
    const audioBuffer = await decodeAudioData(audioData);
    audioBuffers.set(url, audioBuffer);

    const channel = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"]`);
    channel.dataset.originalUrl = url;
    channel.dataset.audioDataLoaded = 'true';
    channelSettings[channelIndex][0] = url;
    saveCurrentSequence(currentSequence);

    if (loadSampleButtonElement) {
      loadSampleButtonElement.classList.add('button-fixed-width');
      loadSampleButtonElement.style.width = '200px';
      loadSampleButtonElement.textContent = filename ? filename.substring(0, 20) : 'Loaded Sample';
      loadSampleButtonElement.title = filename ? filename : 'Loaded Sample';
      activeChannels.add(channelIndex);
    }
  } catch (error) {
    console.error('Error fetching audio:', error);
  }
};
// Helper function to convert an ArrayBuffer to a Base64 string
function bufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function playSound(channel, currentStep) {
  console.log("playSound: initial preset settings - gainNodes values:", gainNodes.map(gn => gn.gain.value));

  if (channel.querySelectorAll('.step-button')[currentStep].classList.contains('selected')) {
    const url = channel.dataset.originalUrl;
    const audioBuffer = audioBuffers.get(url);
    if (audioBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      const channelIndex = parseInt(channel.dataset.id.split('-')[1]) - 1;
      source.connect(gainNodes[channelIndex]);
      gainNodes[channelIndex].connect(audioContext.destination);
      source.start();
    }
  }
}

async function playAuditionedSample(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Check if the expected audioData field is present
    if (data.audioData) {
      const audioData = base64ToArrayBuffer(data.audioData.split(',')[1]);

      if (!audioContext) {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
      }

      const audioBuffer = await decodeAudioData(audioData);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } else {
      console.log("Audional data not found in response, attempting to fetch and parse content type.");
      const contentType = await fetchAndParseContentType(url);
      console.log(`Content type found: ${contentType}`);
      // Additional logic to handle the content type will be added here
    }
  } catch (error) {
    console.error('Error playing auditioned sample:', error);
  }
};



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
      console.log("updateMuteState - Channel-" + channel.dataset.id.replace("Channel-", "") + " Muted");
  } else {
      gainNodes[channelIndex].gain.value = 1; // Unmute the channel (set to original volume)
      console.log("updateMuteState - Channel-" + channel.dataset.id.replace("Channel-", "") + " Unmuted");
  }

  // Update the dim state of the channel
  updateDimState(channel, channelIndex);

  saveCurrentSequence(currentSequence);
  console.log(`Channel-${channel.dataset.id.replace("Channel-", "")} Muted: ${shouldMute}`);
}


  

// Function to handle manual toggle of the mute button
function toggleMute(channelElement) {
  const channelIndex = parseInt(channelElement.dataset.id.split('-')[1]) - 1;
  const isMuted = channelMutes[channelIndex];
  updateMuteState(channelElement, !isMuted, channelIndex);
  console.log('Mute has been toggled by the toggleMute function');
}
