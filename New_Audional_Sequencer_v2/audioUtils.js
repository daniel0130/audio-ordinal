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



async function processJSONResponse(response, channelIndex) {
  console.log("[processJSONResponse] Processing JSON response");
  const jsonResponse = await response.json();
  console.log("[processJSONResponse] JSON response parsed");

  const sampleName = jsonResponse.filename || '';
  console.log(`[processJSONResponse] sampleName determined from JSON: ${sampleName}`);

  const audioData = jsonResponse.audioData ? base64ToArrayBuffer(jsonResponse.audioData.split(',')[1]) : null;
  console.log("[processJSONResponse] audioData set from JSON");

  // // Attempt to set the channel name using the provided method
  // if (sampleName && window.unifiedSequencerSettings.setChannelName) {
  //     window.unifiedSequencerSettings.setChannelName(channelIndex, sampleName);
  // } else {
  //     console.error("[processJSONResponse] Unable to update channel name, setChannelName method not found or sampleName is empty.");
  // }

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
      // Decode the audio data into a buffer
      const audioBuffer = await decodeAudioData(audioData);
      console.log("[decodeAndStoreAudio] Audio data decoded");

      // Create a reverse buffer by copying and reversing the audioBuffer
      const reverseBuffer = await createReverseBuffer(audioBuffer);

      // Store buffers using both channel-specific keys and URL-based keys
      const forwardKey = `channel_${channelIndex}_forward`;
      const reverseKey = `channel_${channelIndex}_reverse`;
      const forwardUrlKey = `${fullUrl}`;
      const reverseUrlKey = `${fullUrl}_reverse`;

      // Use a global buffer storage (adjust according to your actual storage method)
      audioBuffers.set(forwardKey, audioBuffer);
      audioBuffers.set(reverseKey, reverseBuffer);
      audioBuffers.set(forwardUrlKey, audioBuffer);
      audioBuffers.set(reverseUrlKey, reverseBuffer);

      console.log(`[decodeAndStoreAudio] Forward and reverse audio buffers stored for channel ${channelIndex} and URL ${fullUrl}: ${sampleName}`);

      // Assign the decoded audio buffer to the source node for immediate use
      if (window.unifiedSequencerSettings.sourceNodes[channelIndex]) {
          window.unifiedSequencerSettings.sourceNodes[channelIndex].buffer = audioBuffer;
          console.log("[decodeAndStoreAudio] Source node buffer set.");
      } else {
          console.error("[decodeAndStoreAudio] Source node not available for channel", channelIndex);
      }

      // Update UI or other components that depend on these buffers
      window.unifiedSequencerSettings.updateProjectChannelNamesUI(channelIndex, sampleName);

      // Optionally, trigger any UI updates or callbacks that need these buffers
      if (typeof updateWaveformDisplay === "function") {
          updateWaveformDisplay(channelIndex, audioBuffer);
      }

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


async function fetchAudio(url, channelIndex, sampleNameGiven = null, callback = null) {
  try {
      const fullUrl = formatURL(url);
      const response = await fetch(fullUrl);

      if (!response.ok) {
          console.error(`[fetchAndProcessAudio] Fetch request failed for URL: ${fullUrl}, Status: ${response.status}`);
          return;
      }

      const contentType = response.headers.get('Content-Type');
      let audioData;
      // Initially, do not change the sample name if it already exists.
      let sampleName = window.unifiedSequencerSettings.settings.masterSettings.projectChannelNames[channelIndex];

      // Determine the content type and process accordingly
      if (contentType.includes('application/json')) {
          const { audioData: processedAudioData, sampleName: processedSampleName } = await processJSONResponse(response, channelIndex);
          audioData = processedAudioData;
          // Only update the sampleName if it hasn't been set by the user.
          if (!sampleName) {
              sampleName = processedSampleName || sampleNameGiven || fullUrl.split('/').pop();
          }
      } else if (contentType.includes('text/html')) {
          const htmlText = await response.text();
          const { audioData: processedAudioData, sampleName: processedSampleName } = await processHTMLResponse(htmlText);
          audioData = processedAudioData;
          // Only update the sampleName if it hasn't been set by the user.
          if (!sampleName) {
              sampleName = processedSampleName || sampleNameGiven || fullUrl.split('/').pop();
          }
        } else {
          audioData = await response.arrayBuffer();
          // Only update the sampleName if it hasn't been set by the user.
          if (!sampleName) {
              // Use the filename from the URL as a fallback if the sampleName is empty or undefined
              sampleName = sampleNameGiven || fullUrl.split('/').pop().split('#')[0].split('?')[0] || 'Unnamed Sample';
          }
      }

      if (audioData) {
          await decodeAndStoreAudio(audioData, sampleName, fullUrl, channelIndex);

          // The name will only be updated in the UI and settings if it wasn't previously set by the user
          if (!window.unifiedSequencerSettings.settings.masterSettings.projectChannelNames[channelIndex]) {
              window.unifiedSequencerSettings.updateProjectChannelNamesUI(channelIndex, sampleName);
              window.unifiedSequencerSettings.settings.masterSettings.projectChannelNames[channelIndex] = sampleName;
          }
          window.unifiedSequencerSettings.settings.masterSettings.channelURLs[channelIndex] = fullUrl;

          if (callback) callback(channelIndex, sampleName);
      } else {
          console.error("[fetchAndProcessAudio] No audio data to process.");
      }
  } catch (error) {
      console.error(`[fetchAndProcessAudio] Error fetching audio from URL: ${url}`, error);
  }
}



function playSound(currentSequence, channel, currentStep) {
  const channelIndex = getChannelIndex(channel);
  const { isActive, isReverse } = window.unifiedSequencerSettings.getStepStateAndReverse(currentSequence, channelIndex, currentStep);

  if (!isActive && !isReverse) {
    // Skip playback if the current step is not active and not marked for reverse playback.
    return;
  }

  const bufferKey = `channel_${channelIndex}_${isReverse ? 'reverse' : 'forward'}`;
  const audioBuffer = audioBuffers.get(bufferKey);

  if (!audioBuffer) {
    console.error(`[playSound] No audio buffer found for ${bufferKey}`);
    return;
  }

  // Instead of calling another function, handle playback directly here for efficiency.
  const audioContext = window.unifiedSequencerSettings.audioContext;
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  const gainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
  if (!gainNode) {
    console.error("No gain node found for channel", channelIndex);
    return;
  }

  // Assign playback rate and connect source to gain node immediately before starting playback.
  const channelSpecificSpeed = window.unifiedSequencerSettings.channelPlaybackSpeed[channelIndex];
  source.playbackRate.setValueAtTime(channelSpecificSpeed, audioContext.currentTime);
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Calculate trim values directly here and start playback.
  const { trimStart, duration } = calculateTrimValues(channelIndex, audioBuffer, isReverse);
  source.start(0, trimStart, duration);

  // Dispose of the source node after playback finishes.
  source.onended = () => {
    source.disconnect();
  };

  console.log(`Played audio at channel ${channelIndex} with playback speed of ${channelSpecificSpeed}x`);
}



// // Example modification in playTrimmedAudio function
// function playTrimmedAudio(channelIndex, audioBuffer, url, currentStep, isReversePlayback) {
//   const audioContext = window.unifiedSequencerSettings.audioContext;
//   const source = audioContext.createBufferSource();
//   source.buffer = audioBuffer;

//   const gainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
//   if (!gainNode) {
//     console.error("No gain node found for channel", channelIndex);
//     return;
//   }

//   // Retrieve the specific playback speed for this channel
//   const channelSpecificSpeed = window.unifiedSequencerSettings.channelPlaybackSpeed[channelIndex];

//   // Apply the specific channel playback speed to the current source node
//   source.playbackRate.setValueAtTime(channelSpecificSpeed, audioContext.currentTime);

//   source.connect(gainNode);
//   gainNode.connect(audioContext.destination);

//   const { trimStart, duration } = calculateTrimValues(channelIndex, audioBuffer, isReversePlayback);
//   source.start(0, trimStart, duration);
//   console.log(`Played audio at channel ${channelIndex} with playback speed of ${channelSpecificSpeed}x`);
// }





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

  // // Update the dim state of the channel
  // updateDimState(channel, channelIndex);
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




// async function decodeAndStoreAudio(audioData, sampleName, fullUrl, channelIndex) {
//   console.log("[decodeAndStoreAudio] Attempting to decode audio data");
//   try {
//       const audioBuffer = await decodeAudioData(audioData);
//       console.log("[decodeAndStoreAudio] Audio data decoded");

//       // Create a reverse buffer by copying and reversing the audioBuffer
//       const reverseBuffer = await createReverseBuffer(audioBuffer);

//       // Use channel-specific keys for storing buffers
//       const forwardKey = `channel_${channelIndex}_forward`;
//       const reverseKey = `channel_${channelIndex}_reverse`;

//       // Store both buffers using the new keys
//       audioBuffers.set(forwardKey, audioBuffer);
//       audioBuffers.set(reverseKey, reverseBuffer);
//       console.log(`[decodeAndStoreAudio] Forward and reverse audio buffers stored for channel ${channelIndex}: ${sampleName}`);

//       // Update the channel name in the UI
//       window.unifiedSequencerSettings.updateProjectChannelNamesUI(channelIndex, sampleName);

//   } catch (error) {
//       console.error('[decodeAndStoreAudio] Error decoding and storing audio:', error);
//   }
// }

// async function decodeAndStoreAudio(audioData, sampleName, fullUrl, channelIndex) {
//   console.log("[decodeAndStoreAudio] Attempting to decode audio data");
//   try {
//       const audioBuffer = await decodeAudioData(audioData);
//       console.log("[decodeAndStoreAudio] Audio data decoded");

//       // Create a reverse buffer by copying and reversing the audioBuffer
//       const reverseBuffer = await createReverseBuffer(audioBuffer);

//       // Store both buffers using distinct keys
//       audioBuffers.set(fullUrl, audioBuffer);
//       audioBuffers.set(fullUrl + "_reverse", reverseBuffer);
//       console.log(`[decodeAndStoreAudio] Forward and reverse audio buffers stored for ${sampleName}`);

//   } catch (error) {
//       console.error('[decodeAndStoreAudio] Error decoding and storing audio:', error);
//   }
// }
