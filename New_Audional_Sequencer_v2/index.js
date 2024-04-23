// index.js


let isPlaying = false;
let currentStep = 0;
let totalStepCount = 0
let beatCount = 1; // individual steps
let barCount = 1; // bars

let sequenceCount = 1;
let currentSequence = 0;

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
let channels = document.querySelectorAll('.channel[id^="channel-"]');
let activeChannels = 16;// new Set();
let clearClickedOnce = Array(channels.length).fill(false);
let clearConfirmTimeout = Array(channels.length).fill(null);


if (!audioContext) {
    try {
        audioContext = window.unifiedSequencerSettings.audioContext; // Use global audio context
    } catch (e) {
        console.warn('Web Audio API is not supported in this browser');
    }
}


    

if (playButton && stopButton) {
    const channel0 = document.querySelector('#channel-0 .step-button:nth-child(4n)');
    if (channel0) channel0.classList.add('selected');

    const channel1Beat0 = document.querySelector('#channel-1 .step-button:nth-child(1)');
    if (channel1Beat0) channel1Beat0.classList.add('selected');

    const channel1Beat5 = document.querySelector('#channel-1 .step-button:nth-child(6)');
    if (channel1Beat5) channel1Beat5.classList.add('selected');

    let isPaused = false;  // Add this line to declare the isPaused flag

    function checkContinuousPlay() {
        console.log('[SequenceChangeDebug] Checking for continuous play.');
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

        // Inside your playButton event listener, after the play logic
        playButton.addEventListener('click', () => {            
            const continuousPlayCheckbox = document.getElementById('continuous-play');
            let isContinuousPlay = continuousPlayCheckbox.checked;

            if (!isPlaying) {
                startScheduler();
                emitPlay(); 
                playButton.classList.add('selected');
                stopButton.classList.remove('selected');
                isPlaying = true;
                isPaused = false;  // Ensure that the isPaused flag is set to false when starting playback
            } else if (!isPaused) {  // If the sequencer is playing and is not paused, pause the sequencer
                pauseScheduler();
                emitPause();
                isPaused = true;
            } else {  // If the sequencer is paused, resume the sequencer
                resumeScheduler();
                emitResume();  // Assuming you'd like to inform other parts of your application that the sequencer is resuming
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
                 console.log('[SequenceChangeDebug] Attempting to move to the next sequence.');

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
                  emitStop();
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



    // // Function to update the dim state based on gain value
    // function updateDimState(channel, index) {
    //     console.log('updateDimState entered');
    //     console.log(`updateDimState called for channel ${index}`);

    //     // Retrieve the current sequence number from the global settings
    //     const currentSequence = window.unifiedSequencerSettings.getCurrentSequence();

    //     // Select step buttons for the current sequence and channel
    //     const stepButtons = channel.querySelectorAll(`.step-button[id^="Sequence${currentSequence}-ch${index}"]`);
    //     if (gainNodes[index].gain.value === 0) {
    //         stepButtons.forEach(button => button.classList.add('dimmed'));
    //     } else {
    //         stepButtons.forEach(button => button.classList.remove('dimmed'));
    //     }
    // }



    // // Function to update the actual volume
    // function updateVolume(channel, index) {
    //     console.log('updateVolume entered');
    //     if (soloedChannels.some(state => state)) {
    //         gainNodes[index].gain.value = soloedChannels[index] ? 1 : 0;
    //     } else {
    //         const isMuted = channel.querySelector('.mute-button').classList.contains('selected');
    //         gainNodes[index].gain.value = isMuted ? 0 : 1;
    //     }
    // }
    
          
        // function updateCollectedURLsForSequences() {
        //     // Assuming collectedURLsForSequences is a 2D array where each inner array represents URLs for a sequence.
        //     if (!collectedURLsForSequences[currentSequence]) {
        //         collectedURLsForSequences[currentSequence] = [];
        //     }
        //     collectedURLsForSequences[currentSequence] = [...collectedURLs];
        //     console.log(`index.js loadButton: Updated collectedURLsForSequences for sequence ${currentSequence}:`, collectedURLsForSequences[currentSequence]);
        // }


        // const loadPreset = (preset) => {
        //     console.log('index.js loadPreset entered');
        //     console.log(`index.js loadPreset: Loading preset: ${preset}`);
        //     const presetData = presets[preset];
        //     if (!presetData) {
        //         console.error('Preset not found:', preset);
        //         return;
        //     }
        
        //     channels.forEach((channel, index) => {
        //         const channelData = presetData.channels[index];
        //         if (!channelData) {
        //             console.warn(`No preset data for channel index: ${index}`);
        //             return;
        //         }
        
        //         // Use getChannelURL to retrieve the URL for each channel
        //         const url = window.unifiedSequencerSettings.getChannelURL(index);
        //         const { steps, mute } = channelData;
        
        //         if (url) {
        //             const loadSampleButton = document.querySelector(`.channel[data-id="Channel-${index}"] .load-sample-button`);
        //             fetchAudio(url, index, loadSampleButton).then(() => {
        //                 const audioTrimmer = getAudioTrimmerInstanceForChannel(index);
        //                 if (audioTrimmer) {
        //                     audioTrimmer.loadSampleFromURL(url).then(() => {
        //                         const startSliderValue = channelData.trimSettings?.startSliderValue || 0.01;
        //                         const endSliderValue = channelData.trimSettings?.endSliderValue || audioTrimmer.totalSampleDuration;
        //                         audioTrimmer.setStartSliderValue(startSliderValue);
        //                         audioTrimmer.setEndSliderValue(endSliderValue);
        
        //                         window.unifiedSequencerSettings.setTrimSettings(index, startSliderValue, endSliderValue);
        //                         updateLoadSampleButtonText(index, loadSampleButton);
        //                     });
        //                 }
        //             });
        //         }
        
        //         steps.forEach(pos => {
        //             const btn = document.querySelector(`.channel[data-id="Channel-${index}"] .step-button:nth-child(${pos})`);
        //             if (btn) btn.classList.add('selected');
        //         });
        
        //         const channelElement = document.querySelector(`.channel[data-id="Channel-${index}"]`);
        //         if (channelElement) {
        //             updateMuteState(channelElement, mute);
        //             channelElement.classList.add('ordinal-loaded');
        //         }
        //     });
        
        //     console.log(preset);
        //     loadChannelSettingsFromPreset(presets[preset]);
        //     console.log("loadPreset: After loadPreset, gainNodes values:", gainNodes.map(gn => gn.gain.value));
        // };
        

 
        // function updateLoadSampleButtonText(channelIndex, button) {
        //     console.log('updateLoadSampleButtonText entered');
        //     console.log(`[updateLoadSampleButtonText] Called for channel index: ${channelIndex}`);
        
        //     // Attempt to use the channel name if it's available and not an empty string
        //     const channelName = window.unifiedSequencerSettings.settings.masterSettings.projectChannelNames[channelIndex];
        //     const loadedUrl = window.unifiedSequencerSettings.settings.masterSettings.channelURLs[channelIndex];
        
        //     console.log(`[updateLoadSampleButtonText] Loaded URL for channel ${channelIndex}: ${loadedUrl}`);
        //     console.log(`[updateLoadSampleButtonText] Channel name for channel ${channelIndex}: ${channelName}`);
        
        //     // Determine what text to display on the button
        //     let buttonText;
        //     if (channelName && channelName.trim() !== '') {
        //         buttonText = channelName; // Use the user-defined channel name if available
        //     } else if (loadedUrl) {
        //         // If there's no channel name, fallback to using the ID from the URL
        //         // Extract the ID or the last segment of the URL
        //         const urlSegments = loadedUrl.split('/');
        //         const id = urlSegments[urlSegments.length - 1]; // Get the last segment
        //         buttonText = id; // Use the extracted ID as the button text
        //     } else {
        //         buttonText = 'Load New Audional'; // Default text if no URL is loaded
        //     }
        
        //     // Update the button text based on the determined text
        //     button.textContent = buttonText;
        //     console.log(`[updateLoadSampleButtonText] Button text updated to: ${buttonText}`);
        // }
        
        // console.log("index.js loaded");
        
