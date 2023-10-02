let isPlaying = false;
let currentStep = 0;
let totalStepCount = 0
let beatCount = 1; // individual steps
let barCount = 1; // bars

let sequenceCount = 1;
const sequenceLength = 64;
const maxSequenceCount = 64; // sequences
const allSequencesLength = 4096;
const collectedURLs = Array(16).fill(''); 

let timeoutId;
let isPaused = false; // a flag to indicate if the sequencer is paused
let pauseTime = 0;  // tracks the total paused time
let stopClickCount = 0;
let playButton = document.getElementById('play');
let stopButton = document.getElementById('stop');
let saveButton = document.getElementById('save-button');
let loadButton = document.getElementById('load-button');
let bpm = 105;
let audioContext;
let currentStepTime;
let startTime;
let nextStepTime;
let stepDuration;
let gainNodes = Array(16).fill(null);
let isMuted = false;
let channelMutes = []; // Declare the channelMutes array as a global variable
let muteState = false
let volumeStates = Array(16).fill(1); // Start with full volume for all channels
let soloedChannels = Array(16).fill(false); // Assuming you have 16 channels
const audioBuffers = new Map();
let channels = document.querySelectorAll('.channel[id^="channel-"]');
let activeChannels = new Set();
let clearClickedOnce = Array(channels.length).fill(false);
let clearConfirmTimeout = Array(channels.length).fill(null);

let isContinuousPlay = false;

const continuousPlayButton = document.getElementById('continuous-play');
continuousPlayButton.addEventListener('click', () => {
    isContinuousPlay = !isContinuousPlay;  // Toggle the continuous play mode
    continuousPlayButton.classList.toggle('selected', isContinuousPlay);
});


    if (!audioContext) {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API is not supported in this browser');
        }
    }

    // Function to update the actual volume
    function updateVolume(channel, index) {
      if (soloedChannels.some(state => state)) {
          // If any channel is soloed, reduce volume to 0 for non-soloed channels
          gainNodes[index].gain.value = soloedChannels[index] ? 1 : 0;
      } else {
          // Otherwise, use the volume state
          gainNodes[index].gain.value = volumeStates[index];
      }
    }
    // Function to update the dim state based on gain value
    function updateDimState(channel, index) {
        const stepButtons = channel.querySelectorAll('.step-button');
        if (gainNodes[index].gain.value === 0) {
            stepButtons.forEach(button => button.classList.add('dimmed'));
        } else {
            stepButtons.forEach(button => button.classList.remove('dimmed'));
        }
    }
    

// Global document click listener for clear buttons
document.addEventListener('click', () => {
    channels.forEach((channel, channelIndex) => {
        if (clearClickedOnce[channelIndex]) {
            const clearConfirm = channel.querySelector('.clear-confirm');
            clearConfirm.style.display = "none";
            clearTimeout(clearConfirmTimeout[channelIndex]);
            clearClickedOnce[channelIndex] = false;
        }
    });
});

channels.forEach((channel, index) => {
    channel.dataset.id = `Channel-${index + 1}`;
    
    // Create a gain node for the channel
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1; // Initial volume set to 1 (full volume)
    gainNode.connect(audioContext.destination);
    gainNodes[index] = gainNode;
    
      // Logging to confirm gain node creation and attachment
      console.log(`Gain node created for Channel-${index + 1}. Current gain value: ${gainNode.gain.value}`);
    
      
      const muteButton = channel.querySelector('.mute-button');
        muteButton.addEventListener('click', () => {
            if (muteButton.classList.contains('selected')) {
                muteButton.classList.remove('selected');
                
                // Check if any channel is soloed
                if (!soloedChannels.some(state => state) || soloedChannels[index]) {
                    gainNodes[index].gain.value = 1;
                }
            } else {
                muteButton.classList.add('selected');
                gainNodes[index].gain.value = 0;

                // If the current channel is soloed and being muted, remove its solo status
                if (soloedChannels[index]) {
                    soloedChannels[index] = false;
                    const soloButton = channel.querySelector('.solo-button');
                    soloButton.classList.remove('selected');
                }
            }
            updateDimState(channel, index);
        });

      

        const soloButton = channel.querySelector('.solo-button');
        soloButton.addEventListener('click', () => {
            // Toggle solo state for the current channel
            soloedChannels[index] = !soloedChannels[index];
            soloButton.classList.toggle('selected', soloedChannels[index]);

            // If this channel is now soloed
            if (soloedChannels[index]) {
                gainNodes[index].gain.value = 1; // Ensure its gain is set to 1
                muteButton.classList.remove('selected'); // Ensure it's not muted
                updateDimState(channel, index);

                // Mute and dim all other non-soloed channels
                channels.forEach((otherChannel, otherIndex) => {
                    if (!soloedChannels[otherIndex] && otherIndex !== index) {
                        gainNodes[otherIndex].gain.value = 0;
                        updateDimState(otherChannel, otherIndex);
                    }
                });
            } else {
                // If this channel is now unsoloed and no other channels are soloed
                if (!soloedChannels.some(state => state)) {
                    channels.forEach((otherChannel, otherIndex) => {
                        gainNodes[otherIndex].gain.value = otherChannel.querySelector('.mute-button').classList.contains('selected') ? 0 : 1;
                        updateDimState(otherChannel, otherIndex);
                    });
                } else {
                    // If other channels are still soloed, mute the current channel regardless of its mute button state
                    gainNodes[index].gain.value = 0;
                    updateDimState(channel, index);
                }
            }
        });




    
    const clearButton = channel.querySelector('.clear-button');
    const clearConfirm = channel.querySelector('.clear-confirm');

    clearButton.addEventListener('click', (e) => {
        e.stopPropagation();
    
        if (!clearClickedOnce[index]) {
            // Start the flashing effect
            clearButton.classList.add('flashing');
            clearButton.classList.remove('dimmed');

    
            // Show the visual indication
            clearClickedOnce[index] = true;
    
            // Set a timer to hide the confirmation after 2 seconds
            clearConfirmTimeout[index] = setTimeout(() => {
                clearConfirm.style.display = "none";
                clearClickedOnce[index] = false;
                // Stop the flashing effect
                clearButton.classList.remove('flashing');  // <-- This line was corrected
                clearButton.classList.add('dimmed');
            }, 2000);
        } else {
            // Clear the steps
            const stepButtons = channel.querySelectorAll('.step-button');
            stepButtons.forEach(button => {
                button.classList.remove('selected');
            });
    
            // Hide the visual indication
            clearConfirm.style.display = "none";
            clearTimeout(clearConfirmTimeout[index]);
            clearClickedOnce[index] = false;
            // Stop the flashing effect
            clearButton.classList.remove('flashing');  // <-- This line was corrected
            clearButton.classList.add('dimmed');

        }
    });
    

    // Handle clicks outside the clear button
    document.addEventListener('click', (e) => {
        if (!clearButton.contains(e.target) && clearClickedOnce[index]) {
            clearConfirm.style.display = "none";
            clearTimeout(clearConfirmTimeout[index]); // Clear the timer for the specific channel
            clearClickedOnce[index] = false;  // Reset the variable for the specific channel when clicked outside
            clearButton.classList.remove('flashing');
        }
    });





    const stepsContainer = channel.querySelector('.steps-container');
    stepsContainer.innerHTML = '';

    // Check if the current channel is 'channel-1'
    let isChannelOne = channel.id === 'channel-1';

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 64; i++) {
      const button = document.createElement('button');
      button.classList.add('step-button');
      
      // Retrieve the channel index from the channel's id attribute
      let channelIndex = parseInt(channel.id.split('-')[1]) - 1; // Convert 'channel-x' format to an index (0-15)
      
      button.addEventListener('click', () => {
        button.classList.toggle('selected');
        
        // Update the step's state in the channelSettings
        let stepState = button.classList.contains('selected');
        updateStep(channelIndex, i, stepState);
      });

      fragment.appendChild(button);
    }

    stepsContainer.appendChild(fragment);


            const loadSampleButton = channel.querySelector('.load-sample-button');
                loadSampleButton.addEventListener('click', () => {
                    // Create a basic modal for audional ID input
                    const idModal = document.createElement('div');
                    idModal.style.position = 'fixed';
                    idModal.style.left = '0';
                    idModal.style.top = '0';
                    idModal.style.width = '100%';
                    idModal.style.height = '100%';
                    idModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
                    idModal.style.display = 'flex';
                    idModal.style.justifyContent = 'center';
                    idModal.style.alignItems = 'center';
                    idModal.style.zIndex = '9999';

                    const idModalContent = document.createElement('div');
                    idModalContent.style.backgroundColor = 'white';
                    idModalContent.style.padding = '20px';
                    idModalContent.style.borderRadius = '10px';
                    idModalContent.style.width = '80%';
                    idModalContent.style.maxHeight = '500px';  // Adjust this value as per your needs
                    idModalContent.style.overflowY = 'auto';

                    const instructionText = document.createElement('p');
                    instructionText.textContent = 'Enter an Ordinal ID to load a Bitcoin Audional:';
                    instructionText.style.color = 'black';  // Setting the color to black
                    idModalContent.appendChild(instructionText);

                    // Add input field for Ordinal ID
                    const audionalInput = document.createElement('input');
                    audionalInput.type = 'text';
                    audionalInput.placeholder = 'Enter ORD ID:';
                    audionalInput.style.marginBottom = '10px';
                    audionalInput.style.width = '100%';
                    audionalInput.style.boxSizing = 'border-box';
                    idModalContent.appendChild(audionalInput);

                    const ipfsInstructionText = document.createElement('p');
                    ipfsInstructionText.textContent = 'Or, enter an IPFS ID for an off-chain Audional:';
                    ipfsInstructionText.style.color = 'black';  // Setting the color to black
                    idModalContent.appendChild(ipfsInstructionText);

                    // Add input field for IPFS address
                    const ipfsInput = document.createElement('input');
                    ipfsInput.type = 'text';
                    ipfsInput.placeholder = 'Enter IPFS ID:';
                    ipfsInput.style.marginBottom = '10px';
                    ipfsInput.style.width = '100%';
                    ipfsInput.style.boxSizing = 'border-box';
                    idModalContent.appendChild(ipfsInput);

                    // Event listeners to disable one input when the other is being used
                    audionalInput.addEventListener('input', () => {
                      console.log("Ordinal ID entered:", audionalInput.value);
                        if (audionalInput.value) {
                            ipfsInput.disabled = true;
                        } else {
                            ipfsInput.disabled = false;
                        }
                    });

                    ipfsInput.addEventListener('input', () => {
                        if (ipfsInput.value) {
                          console.log("IPFS CID entered:", ipfsInput.value);
                            audionalInput.disabled = true;
                        } else {
                            audionalInput.disabled = false;
                        }
                    });

                    const loadButton = document.createElement('button');
                    loadButton.textContent = 'Load';
                    loadButton.addEventListener('click', () => {
                      if (audionalInput.value) {
                        const audionalUrl = 'https://ordinals.com/content/' + getIDFromURL(audionalInput.value);
                        console.log(audionalUrl); // or ipfsUrl
                        collectedURLs[index] = audionalUrl; // Instead of using .push
                        fetchAudio(audionalUrl, index, loadSampleButton);
                        
                        // Add the orange margin to the channel container
                        const channelContainer = channel.querySelector('.channel-container');
                        channelContainer.classList.add('ordinal-loaded');
                        } else if (ipfsInput.value) {
                        // Handle IPFS address logic here
                        const ipfsUrl = 'https://ipfs.io/ipfs/' + ipfsInput.value;
                        console.log(ipfsUrl); // or ipfsUrl
                        collectedURLs[index] = ipfsUrl; // Instead of using .push
                        fetchAudio(ipfsUrl, index, loadSampleButton);

                        // Remove the orange margin from the channel container
                        const channelContainer = channel.querySelector('.channel-container');
                        channelContainer.classList.remove('ordinal-loaded');
}
                        document.body.removeChild(idModal);
                    });
                    idModalContent.appendChild(loadButton);

                    // Cancel button implementation
                    const cancelButton = document.createElement('button');
                    cancelButton.textContent = 'Cancel';
                    cancelButton.addEventListener('click', () => {
                        document.body.removeChild(idModal);
                    });
                    idModalContent.appendChild(cancelButton);

                    // Create an audio element for previewing the audionals
                    const audioPreview = new Audio();

                    // Function to play a preview
                    const playPreview = (url) => {
                      audioPreview.src = url;
                      audioPreview.play();
                    };

                    audionalIDs.forEach((audionalObj) => {
                      const idLinkContainer = document.createElement('div');
                      idLinkContainer.style.display = 'flex';
                      idLinkContainer.style.alignItems = 'center';
                      idLinkContainer.style.marginBottom = '10px';
                      idLinkContainer.style.flexDirection = 'row';
                    
                      // Create an audition play button for previewing
                      const auditionPlayButton = document.createElement('button');
                      auditionPlayButton.textContent = '▶️';
                      auditionPlayButton.style.marginRight = '10px';
                    
                      auditionPlayButton.addEventListener('click', async (e) => {
                          e.preventDefault();
                          // Construct the audionalUrl using the same logic as idLink's click event
                          const audionalUrl = 'https://ordinals.com/content/' + getIDFromURL(audionalObj.id);
                          // Use the sequencer's function to buffer and play the audio
                          playAuditionedSample(audionalUrl);
                      });
                  
                      idLinkContainer.appendChild(auditionPlayButton);
                    
                      const idLink = document.createElement('a');
                      idLink.href = '#';
                      idLink.textContent = audionalObj.label;
                      idLink.addEventListener('click', (e) => {
                          e.preventDefault();
                          const audionalUrl = 'https://ordinals.com/content/' + getIDFromURL(audionalObj.id);
                          console.log(audionalUrl); // or ipfsUrl
                          collectedURLs[index] = audionalUrl; // Instead of using .push
                          fetchAudio(audionalUrl, index, loadSampleButton);
                          document.body.removeChild(idModal);
                      });
                  
                      idLinkContainer.appendChild(idLink);
                      idModalContent.appendChild(idLinkContainer);
              
         

                    
                  
           
            

                        idLink.href = '#';
                        idLink.textContent = audionalObj.label;
                        idLink.style.display = 'block';
                        idLink.style.marginBottom = '10px';
                        idLink.addEventListener('click', (e) => {
                            e.preventDefault();
                            const audionalUrl = 'https://ordinals.com/content/' + getIDFromURL(audionalObj.id);
                            console.log(audionalUrl); // or ipfsUrl
                            collectedURLs[index] = audionalUrl; // Instead of using .push
                            fetchAudio(audionalUrl, index, loadSampleButton);
                        });
                        idModalContent.appendChild(idLink);
                    });

                    idModal.appendChild(idModalContent);
                    document.body.appendChild(idModal);
                });
                console.log("Collected URLs before adding to sequence arrays:", collectedURLs);
                addURLsToSequenceArrays(collectedURLs);
                

        });

        if (playButton && stopButton) {
          const channel1 = document.querySelector('#channel-0 .step-button:nth-child(4n+1)');
          if (channel1) channel1.classList.add('selected');

          const channel2Beat1 = document.querySelector('#channel-1 .step-button:nth-child(1)');
          if (channel2Beat1) channel2Beat1.classList.add('selected');

          const channel2Beat6 = document.querySelector('#channel-1 .step-button:nth-child(6)');
          if (channel2Beat6) channel2Beat6.classList.add('selected');

          let isPaused = false;  // Add this line to declare the isPaused flag

          function checkContinuousPlay() {
            const continuousPlayCheckbox = document.getElementById('continuous-play');
            let isContinuousPlay = continuousPlayCheckbox.checked;
        
            if (isContinuousPlay && totalStepCount >= allSequencesLength) {
                // Reset counters for the next sequence
                beatCount = 0;
                barCount = 0;
                currentStep = 0;
                totalStepCount = 0;
        
                // Simulate a click on the "Next Sequence" button
                document.getElementById('next-sequence').click();
            }
        }
        
        
        
        function updateSequenceDisplay(sequenceNum) {
            const sequenceDisplay = document.getElementById('current-sequence-display');
            if (sequenceDisplay) {
                sequenceDisplay.textContent = `Sequence ${sequenceNum}`;
            }
        }
        
        // Inside your playButton event listener, after the play logic
        playButton.addEventListener('click', () => {            const continuousPlayCheckbox = document.getElementById('continuous-play');
            let isContinuousPlay = continuousPlayCheckbox.checked;

            if (!isPlaying) {
                startScheduler();
                playButton.classList.add('selected');
                stopButton.classList.remove('selected');
                isPlaying = true;
                isPaused = false;  // Ensure that the isPaused flag is set to false when starting playback
            } else if (!isPaused) {  // If the sequencer is playing and is not paused, pause the sequencer
                pauseScheduler();
                isPaused = true;
            } else {  // If the sequencer is paused, resume the sequencer
                resumeScheduler();
                isPaused = false;
            }
        
            if (isContinuousPlay && totalStepCount >= allSequencesLength) {
                // Reset counters for the next sequence
                beatCount = 0;
                barCount = 0;
                sequenceCount = 0;
                currentStep = 0;
                totalStepCount = 0;
        
                // Load the next sequence here (assuming you have a function or method to do so)
                // For example, you can increment the sequenceCount and use it to load the next preset.
                sequenceCount++;
                if (sequenceCount > maxSequenceCount) {  // Assuming maxSequenceCount is the total number of sequences you have
                    sequenceCount = 1;  // Reset to the first sequence if we're at the end
                }
                loadPreset(`preset${sequenceCount}`);  // Load the next sequence
            }
            // After the sequencer starts, checks for continuous play
            checkContinuousPlay();
        });
        

          stopButton.addEventListener('click', () => {
            
              if (isPlaying) {
                  stopScheduler();
                  stopButton.classList.add('selected');
                  playButton.classList.remove('selected');
                  isPlaying = false;
                  isPaused = false;  // Reset the isPaused flag when stopping the sequencer
                  beatCount = 0;  // reset the beat count
                  barCount = 0; // reset the bar count
                  sequenceCount = 0; // reset the sequence count
                  currentStep = 0;  // reset the step count
                  totalStepCount = 0;
                  resetStepLights();  // reset the step lights
              }
          });

        } else {
          console.error("Play or Stop button is not defined");
        }


// The loadPreset function is updated to use updateMuteState function
const loadPreset = (preset) => {
  const presetData = presets[preset];

  if (!presetData) {
    console.error('Preset not found:', preset);
    return;
  }

  channels.forEach((channel, index) => {
    const channelData = presetData.channels[index];
    if (!channelData) {
      console.warn(`No preset data for channel index: ${index + 1}`);
      return; // Skip this channel since there's no data for it in the preset
    }

    const { url, triggers, toggleMuteSteps, mute } = channelData;

    if (url) { // Only fetch audio if a URL is provided
      const loadSampleButton = document.querySelector(`.channel[data-id="Channel-${index + 1}"] .load-sample-button`);
      fetchAudio(url, index, loadSampleButton);
    }

    triggers.forEach(pos => {
      const btn = document.querySelector(`.channel[data-id="Channel-${index + 1}"] .step-button:nth-child(${pos})`);
      if (btn) btn.classList.add('selected');
    });

    toggleMuteSteps.forEach(pos => {
      const btn = document.querySelector(`.channel[data-id="Channel-${index + 1}"] .step-button:nth-child(${pos})`);
      if (btn) btn.classList.add('toggle-mute');
      console.log(`Channel-${index + 1} loadPreset classList.add`);
    });

    const channelElement = document.querySelector(`.channel[data-id="Channel-${index + 1}"]`);
    if (channelElement) {
      updateMuteState(channelElement, mute); 
      console.log(`Channel-${index + 1} updateMuteState toggled by the loadPreset function - Muted: ${mute}`);
      
      // Add the 'ordinal-loaded' class to the channel element
      channelElement.classList.add('ordinal-loaded');
    }
  });
  console.log(preset);
  // Load settings into the internal array
  loadChannelSettingsFromPreset(presets[preset]);
};

// Load a preset when the page loads
const presetToLoadOnPageLoad = 'preset1';
if (presets[presetToLoadOnPageLoad]) {
    loadPreset(presetToLoadOnPageLoad);
    loadSequence(sequenceCount);  // Ensure the current sequence is loaded
} else {
    console.error('Preset not found:', presetToLoadOnPageLoad);
}


