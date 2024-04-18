// audioUtils.js

const audioBuffers = new Map();
// Using sample URLs as keys in the audioBuffers map instead of channel numbers 
// for greater flexibility, scalability, and reusability of audio data. 


// Function to get the ID from a URL
function getIDFromURL(url) {
  // console.log('[HTML Debugging] getIDFromURL entered');
  const parts = url.split('/');
  return parts[parts.length - 1];
}

// Logging function to reduce redundancy
function logConversion(conversionType, details, length) {
  // console.log(`[HTML Debugging] [${conversionType}] Entered function. ${details} length: ${length}`);
}

// Function to convert base64 to an array buffer
function base64ToArrayBuffer(base64) {
  logConversion('base64ToArrayBuffer', 'Base64 sample', base64.substring(0, 100).length);
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  logConversion('base64ToArrayBuffer', 'Generated Uint8Array', bytes.length);
  return bytes.buffer;
}

// Helper function to convert an ArrayBuffer to a Base64 string
function bufferToBase64(buffer) {
  logConversion('bufferToBase64', 'Buffer', buffer.byteLength);
  const bytes = new Uint8Array(buffer);
  let binary = String.fromCharCode.apply(null, bytes);
  const base64 = window.btoa(binary);
  logConversion('bufferToBase64', 'Converted to base64', base64.length);
  return base64;
}



async function processJSONResponse(response) {
  console.log("[processJSONResponse] Processing JSON response");
  const jsonResponse = await response.json();
  console.log("[processJSONResponse] JSON response parsed");

  const sampleName = jsonResponse.filename || '';
  console.log(`[processJSONResponse] sampleName determined from JSON: ${sampleName}`);

  const audioData = jsonResponse.audioData ? base64ToArrayBuffer(jsonResponse.audioData.split(',')[1]) : null;
  console.log("[processJSONResponse] audioData set from JSON");

  return { audioData, sampleName };
}

async function processHTMLResponse(htmlText) {
  console.log("[processHTMLResponse] Processing HTML content");
  const doc = new DOMParser().parseFromString(htmlText, 'text/html');
  const audioSourceElement = doc.querySelector('audio[data-audionalSampleName] source');
  const sampleNameElement = doc.getElementById('sampleName');

  let sampleName = sampleNameElement ? sampleNameElement.textContent.trim() : null;
  console.log(`[processHTMLResponse] Sample name determined from HTML: ${sampleName}`);

  let audioData = null;
  if (audioSourceElement) {
      const base64AudioData = audioSourceElement.getAttribute('src');
      console.log("[processHTMLResponse] Audio source element found");

      if (/^data:audio\/(wav|mp3);base64,/.test(base64AudioData.toLowerCase())) {
          audioData = base64ToArrayBuffer(base64AudioData.split(',')[1]);
          console.log("[processHTMLResponse] Audio data set from HTML");
      } else {
          console.error("[processHTMLResponse] Audio data does not have expected base64 prefix.");
      }
  } else {
      console.error("[processHTMLResponse] No audio source element found.");
  }

  return { audioData, sampleName };
}

async function decodeAndStoreAudio(audioData, sampleName, fullUrl, channelIndex) {
  console.log("[decodeAndStoreAudio] Attempting to decode audio data");
  try {
      const audioBuffer = await decodeAudioData(audioData);
      console.log("[decodeAndStoreAudio] Audio data decoded");

      // Create a reverse buffer by copying and reversing the audioBuffer
      const reverseBuffer = await createReverseBuffer(audioBuffer);

      // Store both buffers using distinct keys
      audioBuffers.set(fullUrl, audioBuffer);
      audioBuffers.set(fullUrl + "_reverse", reverseBuffer);

      console.log(`[decodeAndStoreAudio] Forward and reverse audio buffers stored for ${sampleName}`);

      // Update project channel name in global settings
      window.unifiedSequencerSettings.setProjectChannelName(channelIndex, sampleName);
      console.log(`[decodeAndStoreAudio] Project channel name updated for channel index: ${channelIndex}, sampleName: ${sampleName}`);
  } catch (error) {
      console.error('[decodeAndStoreAudio] Error decoding and storing audio:', error);
  }
}


// Function to create a reverse buffer from an existing AudioBuffer

// Accessibility: Both buffers can be accessed using their keys. 
// For example, if you need the reverse buffer for https://example.com/audio.mp3, 
// you would look for https://example.com/audio.mp3_reverse in the audioBuffers map.
async function createReverseBuffer(audioBuffer) {
  const audioContext = window.unifiedSequencerSettings.audioContext;
  const numberOfChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const sampleRate = audioBuffer.sampleRate;

  const reverseBuffer = audioContext.createBuffer(numberOfChannels, length, sampleRate);
  for (let channel = 0; channel < numberOfChannels; channel++) {
      const forwardData = audioBuffer.getChannelData(channel);
      const reverseData = reverseBuffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
          reverseData[i] = forwardData[length - 1 - i];
      }
  }
  return reverseBuffer;
}



// Function to decode audio data
const decodeAudioData = (audioData) => {
  const audioContext = window.unifiedSequencerSettings.audioContext;
  return new Promise((resolve, reject) => {
      audioContext.decodeAudioData(audioData, decodedData => {
          console.log('[HTML Debugging] [decodeAudioData] Audio data decoded successfully.');
          resolve(decodedData);
      }, error => {
          console.error('[HTML Debugging] [decodeAudioData] Detailed Error:', { message: error.message, code: error.code });
          reject(error);
      });
  });
};


async function fetchAudio(url, channelIndex) {
  // console.log(`[fetchAndProcessAudio] Entered function. URL: ${url}, Channel Index: ${channelIndex}`);
  try {
      const fullUrl = formatURL(url);
      // console.log(`[fetchAndProcessAudio] Formatted URL: ${fullUrl}`);

      const response = await fetch(fullUrl);
      // console.log(`[fetchAndProcessAudio] Fetch response received for URL: ${fullUrl}`);

      if (!response.ok) {
          console.error(`[fetchAndProcessAudio] Fetch request failed for URL: ${fullUrl}, Status: ${response.status}`);
          return;
      }

      const contentType = response.headers.get('Content-Type');
      // console.log(`[fetchAndProcessAudio] Content-Type of response: ${contentType}`);

      let audioData;
      let sampleName = fullUrl.split('/').pop(); // Fallback sample name from URL
      // console.log(`[fetchAndProcessAudio] Initial sampleName set to: ${sampleName}`);

      if (contentType.includes('application/json')) {
          // console.log("[fetchAndProcessAudio] Processing as JSON");
          const { audioData: processedAudioData, sampleName: processedSampleName } = await processJSONResponse(response);
          audioData = processedAudioData;
          sampleName = processedSampleName || sampleName;
          // console.log(`[fetchAndProcessAudio] Processed sampleName from JSON: ${sampleName}`);
      } else if (contentType.includes('text/html')) {
          // console.log("[fetchAndProcessAudio] Processing as HTML");
          const htmlText = await response.text();
          const { audioData: processedAudioData, sampleName: processedSampleName } = await processHTMLResponse(htmlText);
          audioData = processedAudioData;
          sampleName = processedSampleName || sampleName;
          // console.log(`[fetchAndProcessAudio] Processed sampleName from HTML: ${sampleName}`);
      } else {
          // console.log("[fetchAndProcessAudio] Processing as direct audio file");
          audioData = await response.arrayBuffer();
          // console.log("[fetchAndProcessAudio] Audio data set from direct audio file");
      }

      // Now, use decodeAndStoreAudio to handle decoding and storage
      if (audioData) {
          await decodeAndStoreAudio(audioData, sampleName, fullUrl, channelIndex);
      } else {
          console.error("[fetchAndProcessAudio] No audio data to process.");
      }
  } catch (error) {
      console.error('[fetchAndProcessAudio] Error:', error);
  }
}



function playSound(currentSequence, channel, currentStep) {
  // const playbackSpeed = window.unifiedSequencerSettings.getStepPlaybackSpeed(currentSequence, channelIndex, currentStep);
  // console.log('playSound entered');
  const channelIndex = getChannelIndex(channel);
  // console.log(`[playSound Debugging] [playSound] Processing channel index: ${channelIndex}`);

  const stepState = window.unifiedSequencerSettings.getStepState(currentSequence, channelIndex, currentStep);
  // console.log(`[playSound Debugging] [playSound] setting stepState using direct call to: ${stepState}`);
  
  const { isActive, isReverse } = window.unifiedSequencerSettings.getStepStateAndReverse(currentSequence, channelIndex, currentStep);
  // console.log(`[playSound Debugging] Step ${currentStep} isActive: ${isActive}, isReverse: ${isReverse}`);

 // Check if the step is either active or marked for reverse playback.
  if (!isActive && !isReverse) {
    // console.log("[playSound Debugging] [playSound] Current step is neither active nor reverse. Skipping playback.");
    return;
  }
  const isReversePlayback = isReverse;
  // Check if the current step is marked for reverse playback
  const stepButtonId = `Sequence${currentSequence}-ch${channelIndex}-step-${currentStep}`;
  const stepButton = document.getElementById(stepButtonId);

  const url = getAudioUrl(channelIndex) + (isReversePlayback ? "_reverse" : "");
  // console.log("[playSound Debugging] [playSound] Audio URL:", url);

  const audioBuffer = audioBuffers.get(url);
  if (!audioBuffer) {
      // console.log("[playSound Debugging] [playSound] No audio buffer found for URL:", url);
      return;
  }
  
  // console.log("[playSound Debugging] [playSound] Audio buffer:", audioBuffer);

  playTrimmedAudio(channelIndex, audioBuffer, url, currentStep, isReversePlayback); // Include isReversePlayback as an argument
}


// Example modification in playTrimmedAudio function
function playTrimmedAudio(channelIndex, audioBuffer, url, currentStep, isReversePlayback) {
  const audioContext = window.unifiedSequencerSettings.audioContext;
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  // Use the GainNode assigned to the channel from the unified settings
  const gainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
  if (!gainNode) {
    console.error("No gain node found for channel", channelIndex);
    return;
  }

  const { volume, pitch } = window.unifiedSequencerSettings.getStepSettings(currentSequence, channelIndex, currentStep);
  
  // No need to set volume here as it should be managed via user input directly affecting the GainNode
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const { trimStart, duration } = calculateTrimValues(channelIndex, audioBuffer, isReversePlayback);
  source.playbackRate.value = isFinite(pitch) ? pitch : 1;
  source.start(0, trimStart, duration);
}





function calculateTrimValues(channelIndex, audioBuffer, isReversePlayback) {
  // console.log(`[calculateTrimValues] Called for channelIndex: ${channelIndex}, isReversePlayback: ${isReversePlayback}`);

  const trimSettings = window.unifiedSequencerSettings.getTrimSettings(channelIndex);
  let trimStartPercentage = trimSettings.startSliderValue !== undefined ? trimSettings.startSliderValue : 0;
  let trimEndPercentage = trimSettings.endSliderValue !== undefined ? trimSettings.endSliderValue : 100;

  // console.log(`[calculateTrimValues] Trim Settings: Start = ${trimStartPercentage}%, End = ${trimEndPercentage}%`);

  let trimStart = (trimStartPercentage / 100) * audioBuffer.duration;
  let trimEnd = (trimEndPercentage / 100) * audioBuffer.duration;

  // console.log(`[calculateTrimValues] Calculated Times (before mirroring): Start = ${trimStart}s, End = ${trimEnd}s, Buffer Duration = ${audioBuffer.duration}s`);

  if (isReversePlayback) {
    // Reverse the calculation for mirrored start and end times
    let totalDuration = audioBuffer.duration;
    trimStart = totalDuration - ((trimEndPercentage / 100) * totalDuration);
    trimEnd = totalDuration - ((trimStartPercentage / 100) * totalDuration);
  }

  // Ensure the calculated values are within the bounds of the audio buffer's duration
  trimStart = Math.max(0, Math.min(trimStart, audioBuffer.duration));
  trimEnd = Math.max(trimStart, Math.min(trimEnd, audioBuffer.duration));

  // console.log(`[calculateTrimValues] Final Calculated Values: Trim Start = ${trimStart}s, Trim End = ${trimEnd}s, Duration = ${trimEnd - trimStart}s`);

  return {
    trimStart: trimStart,
    duration: trimEnd - trimStart
  };
}





function getChannelIndex(channel) {
  return parseInt(channel.dataset.id.split('-')[1]);
}

function getAudioUrl(channelIndex) {
  // Example check to ensure URL exists for the given channel index
  if (typeof window.unifiedSequencerSettings.getprojectUrlforChannel(channelIndex) === 'undefined') {
    // console.error(`[getAudioUrl] [ playSound ] URL not found for channel index: ${channelIndex}`);
    return 'defaultURL'; // Provide a default URL or handle the error appropriately
  }
  return window.unifiedSequencerSettings.getprojectUrlforChannel(channelIndex);
}

function getAudioBuffer(url) {
  return audioBuffers.get(url);
}


// Function to toggle the play state
function togglePlayState(isPlaying, startStopFunction, firstButton, secondButton) {
  // console.log('togglePlayState entered');
  if (!isPlaying) {
    isPlaying = true;
    startStopFunction();
    firstButton.classList.add('selected');
    secondButton.classList.remove('selected');
  }
}

// Function to update the mute state in a single function
function updateMuteState(channel, isMuted) {
  const channelIndex = parseInt(channel.dataset.id.split('-')[1]);
  channel.dataset.muted = isMuted ? 'true' : 'false';
  const muteButton = channel.querySelector('.mute-button');

  muteButton.classList.toggle('selected', isMuted);

  // Access gainNodes from global settings
  const gainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
  if (gainNode) {
    // Mute or unmute using gain node
    gainNode.gain.value = isMuted ? 0 : 1; // Mute the channel if isMuted is true, otherwise set volume to 1
  } else {
    console.error("GainNode not found for channel:", channelIndex);
  }

  // Update the dim state of the channel
  updateDimState(channel, channelIndex);
}

// Function to handle manual toggle of the mute button
function toggleMute(channelElement) {
  const channelIndex = parseInt(channelElement.dataset.id.split('-')[1]);
  const isMuted = channelElement.dataset.muted === 'true';
  updateMuteState(channelElement, !isMuted);
}

// // Example usage in an event listener for the mute button
// const muteButton = channel.querySelector('.mute-button');
// muteButton.addEventListener('click', () => {
//   const isMuted = muteButton.classList.contains('selected');
//   toggleMute(channel); // Pass the channel element to the toggle function
// });

// ...rest of your code...


