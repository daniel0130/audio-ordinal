// audioUtils.js

const audioBuffers = new Map();
const activeAudioSources = new Set();

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

      if (/^data:audio\/(wav|mp3|flac);base64,/.test(base64AudioData.toLowerCase())) {
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


////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Import Audio buffers from jiMS10 Synthesizer

// Message handler for receiving ArrayBuffer formatted audio data from synth
window.addEventListener('message', async (event) => {
  if (event.data.type === 'audioData') {
      const channelIndex = event.data.channelIndex;
      console.log(`Received audio data message with channel index: ${channelIndex}`);
      if (event.data.data instanceof ArrayBuffer) {
          console.log(`Processing ArrayBuffer audio data for channel ${channelIndex}`);
          
          // Create a persistent URL for the blob, including the channel index in the URL
          const blob = new Blob([event.data.data], {type: event.data.mimeType});
          const persistentUrl = URL.createObjectURL(blob);
          const uniquePersistentUrl = `${persistentUrl}?channel=${channelIndex}`;
          console.log(`Persistent URL created for logging and use: ${uniquePersistentUrl}`);

          // Pass this unique URL to decodeAndStoreAudio for processing and storage
          try {
              await decodeAndStoreAudio(event.data.data, event.data.filename, uniquePersistentUrl, channelIndex);
              console.log(`Audio data processed and stored for channel ${channelIndex}`);

              // Store the unique URL for later access by other modules such as audio trimming
              window.unifiedSequencerSettings.settings.masterSettings.channelURLs[channelIndex] = uniquePersistentUrl;
          } catch (error) {
              console.error('Error processing audio data:', error);
          }
      } else {
          console.error('Received data is not an ArrayBuffer as expected');
      }
  }
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

async function decodeAndStoreAudio(audioData, sampleName, fullUrl, channelIndex) {
  console.log("[decodeAndStoreAudio] Attempting to decode audio data");
  try {
      const audioBuffer = await decodeAudioData(audioData);
      console.log("[decodeAndStoreAudio] Audio data decoded");

      // Create a reverse buffer by copying and reversing the audioBuffer
      const reverseBuffer = await createReverseBuffer(audioBuffer);

      // Store buffers using both channel-specific keys and URL-based keys
      const forwardKey = `channel_${channelIndex}_forward`;
      const reverseKey = `channel_${channelIndex}_reverse`;

      // Use a global buffer storage
      audioBuffers.set(forwardKey, audioBuffer);
      audioBuffers.set(reverseKey, reverseBuffer);

      // Associate URLs with the buffers
      audioBuffers.set(`${fullUrl}`, audioBuffer);
      audioBuffers.set(`${fullUrl}_reverse`, reverseBuffer);

      console.log(`[decodeAndStoreAudio] Forward and reverse audio buffers stored for channel ${channelIndex} and URL ${fullUrl}: ${sampleName}`);
      
      // Mark this channel as an audio channel
      channelIsSynth[channelIndex] = false;
      console.log(`Channel ${channelIndex} is set as an audio channel`);


      // Disconnect existing connections if the source node is already created
      if (window.unifiedSequencerSettings.sourceNodes[channelIndex]) {
          window.unifiedSequencerSettings.sourceNodes[channelIndex].disconnect();
          window.unifiedSequencerSettings.sourceNodes[channelIndex] = null;  // Clear the existing source node if needed
      }

      // Check if the source node already exists and reassign the buffer
      if (!window.unifiedSequencerSettings.sourceNodes[channelIndex]) {
          window.unifiedSequencerSettings.sourceNodes[channelIndex] = window.unifiedSequencerSettings.audioContext.createBufferSource();
      }

      if (!window.unifiedSequencerSettings.sourceNodes[channelIndex].buffer) {
          window.unifiedSequencerSettings.sourceNodes[channelIndex].buffer = audioBuffer;
          console.log(`[decodeAndStoreAudio] Buffer assigned to source node for channel ${channelIndex}`);
      }

      // Update UI or other components that depend on these buffers
      window.unifiedSequencerSettings.updateProjectChannelNamesUI(channelIndex, sampleName);
      console.log(`[decodeAndStoreAudio] UI updated with new sample name for channel ${channelIndex}`);

      // Optionally, trigger any UI updates or callbacks that need these buffers
      if (typeof updateWaveformDisplay === "function") {
          updateWaveformDisplay(channelIndex, audioBuffer);
          console.log("[decodeAndStoreAudio] Waveform display updated.");
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
      } else if (contentType.includes('audio/flac')) { // Recognize FLAC content type
          audioData = await response.arrayBuffer();
          // Only update the sampleName if it hasn't been set by the user.
          if (!sampleName) {
              sampleName = sampleNameGiven || fullUrl.split('/').pop().split('#')[0].split('?')[0] || 'Unnamed Sample';
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

function getIframeIdByChannelIndex(channelIndex) {
  const mappings = JSON.parse(localStorage.getItem('channelIframeMappings')) || {};
  return mappings[channelIndex];
}

// List of channels where fades should be applied
const fadeChannels = [6, 7, 11, 12, 13, 15];

function playSound(currentSequence, channel, currentStep) {
  const channelIndex = getChannelIndex(channel);
  const { isActive, isReverse } = window.unifiedSequencerSettings.getStepStateAndReverse(currentSequence, channelIndex, currentStep);

  const sequencerChannel = new BroadcastChannel(`synth_channel_${channelIndex}`);
  const iframeId = getIframeIdByChannelIndex(channelIndex);
  let iframeSequencerChannel = null;

  if (iframeId) {
      iframeSequencerChannel = new BroadcastChannel(`synth_channel_${iframeId}`);
  }

  if (isActive) {
      sequencerChannel.postMessage({ type: 'startArpeggiator', channelIndex: channelIndex });
      if (iframeSequencerChannel) {
          iframeSequencerChannel.postMessage({ type: 'startArpeggiator', channelIndex: channelIndex });
      }
  } else if (isReverse) {
      sequencerChannel.postMessage({ type: 'stopArpeggiator', channelIndex: channelIndex });
      if (iframeSequencerChannel) {
          iframeSequencerChannel.postMessage({ type: 'stopArpeggiator', channelIndex: channelIndex });
      }
  }
  sequencerChannel.close();
  if (iframeSequencerChannel) {
      iframeSequencerChannel.close();
  }

  if (!isActive && !isReverse) {
      return;
  }

  const bufferKey = `channel_${channelIndex}_${isReverse ? 'reverse' : 'forward'}`;
  const audioBuffer = audioBuffers.get(bufferKey);
  if (!audioBuffer) {
      console.error(`[playSound] No audio buffer found for ${bufferKey}`);
      return;
  }

  const audioContext = window.unifiedSequencerSettings.audioContext;
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;

  const userGainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
  if (!userGainNode) {
      console.error("No gain node found for channel", channelIndex);
      return;
  }

  const playbackSpeed = window.unifiedSequencerSettings.channelPlaybackSpeed[channelIndex];
  source.playbackRate.setValueAtTime(playbackSpeed, audioContext.currentTime);

  // Create a new gain node for fades to avoid interfering with user volume control
  const fadeGainNode = audioContext.createGain();
  fadeGainNode.connect(userGainNode);
  source.connect(fadeGainNode);

  const { trimStart, duration } = calculateTrimValues(channelIndex, audioBuffer, isReverse);

  const fadeDuration = 0.0025; // 20 milliseconds in seconds
  const actualFadeDuration = fadeDuration / playbackSpeed; // Adjust fade duration based on playback speed
  const adjustedDuration = duration / playbackSpeed; // Adjusted duration for playback speed
  const userVolume = window.unifiedSequencerSettings.settings.masterSettings.channelVolume[channelIndex]; // Get the user-defined volume

  const trimSettings = window.unifiedSequencerSettings.getTrimSettings(channelIndex);
  const isTrimmed = trimSettings.startSliderValue !== 0 || trimSettings.endSliderValue !== 100;

  // Check if fades should be applied for this channel
  const applyFades = fadeChannels.includes(channelIndex) && isTrimmed;

  // Track active source for stopping
  activeAudioSources.add(source);

  if (applyFades) {
      // Apply fade-in
      fadeGainNode.gain.setValueAtTime(0, audioContext.currentTime);
      fadeGainNode.gain.linearRampToValueAtTime(userVolume, audioContext.currentTime + actualFadeDuration);

      // Start playback
      source.start(0, trimStart, duration);

      // Apply fade-out
      fadeGainNode.gain.setValueAtTime(userVolume, audioContext.currentTime + adjustedDuration - actualFadeDuration);
      fadeGainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + adjustedDuration);
  } else {
      // Start playback without fades
      source.start(0, trimStart, duration);
  }

  fadeGainNode.gain.setValueAtTime(userVolume, audioContext.currentTime); // Ensure volume is set



  source.onended = () => {
      fadeGainNode.disconnect();
      source.disconnect();
      activeAudioSources.delete(source); // Remove source from active set when it ends
      window.unifiedSequencerSettings.sourceNodes[channelIndex] = null;
  };

  window.unifiedSequencerSettings.sourceNodes[channelIndex] = source;
}

function createOfflineAudioBuffer(originalBuffer, playbackRate) {
    const offlineContext = new OfflineAudioContext(
        originalBuffer.numberOfChannels,
        originalBuffer.length / playbackRate,
        originalBuffer.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = originalBuffer;
    source.playbackRate.value = playbackRate;
    source.connect(offlineContext.destination);
    source.start();

    return offlineContext.startRendering().then(renderedBuffer => renderedBuffer);
}

function stopAllAudio() {
  console.log("[stopAllAudio] Stopping all audio buffers");
  activeAudioSources.forEach(source => {
      try {
          source.stop(0); // Use 0 as the argument to stop immediately
          source.disconnect();
      } catch (error) {
          console.error('[stopAllAudio] Error stopping audio source:', error);
      }
  });
  activeAudioSources.clear(); // Clear the set after stopping all sources
}


function calculateTrimValues(channelIndex, audioBuffer, isReversePlayback) {
  const trimSettings = window.unifiedSequencerSettings.getTrimSettings(channelIndex);
  let trimStartPercentage = trimSettings.startSliderValue !== undefined ? trimSettings.startSliderValue : 0;
  let trimEndPercentage = trimSettings.endSliderValue !== undefined ? trimSettings.endSliderValue : 100;

  let trimStart = (trimStartPercentage / 100) * audioBuffer.duration;
  let trimEnd = (trimEndPercentage / 100) * audioBuffer.duration;

  if (isReversePlayback) {
      let totalDuration = audioBuffer.duration;
      trimStart = totalDuration - ((trimEndPercentage / 100) * totalDuration);
      trimEnd = totalDuration - ((trimStartPercentage / 100) * totalDuration);
  }

  trimStart = Math.max(0, Math.min(trimStart, audioBuffer.duration));
  trimEnd = Math.max(trimStart, Math.min(trimEnd, audioBuffer.duration));

  const trimDuration = trimEnd - trimStart;
  
  return {
      trimStart: trimStart,
      duration: trimDuration,
      trimEnd: trimEnd
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

// Function to update the mute state with volume memory
function updateMuteState(channel, isMuted) {
  const channelIndex = parseInt(channel.dataset.id.split('-')[1]);
  channel.dataset.muted = isMuted ? 'true' : 'false';
  const muteButton = channel.querySelector('.mute-button');
  muteButton.classList.toggle('selected', isMuted);

  const gainNode = window.unifiedSequencerSettings.gainNodes[channelIndex];
  if (gainNode) {
    if (isMuted) {
      // Store the current volume before muting
      window.unifiedSequencerSettings.settings.masterSettings.channelVolume[channelIndex] = gainNode.gain.value;
      gainNode.gain.value = 0; // Mute the channel
    } else {
      // Restore the volume to the previously stored state
      const previousVolume = window.unifiedSequencerSettings.settings.masterSettings.channelVolume[channelIndex];
      gainNode.gain.value = previousVolume;
    }
  } else {
    console.error("GainNode not found for channel:", channelIndex);
  }
}

// Function to handle manual toggle of the mute button
function toggleMute(channelElement) {
  const isMuted = channelElement.dataset.muted === 'true';
  updateMuteState(channelElement, !isMuted);
}
