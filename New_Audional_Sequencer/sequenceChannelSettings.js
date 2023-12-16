// sequenceChannelSettings.js


// A function to be called whenever the sequence changes or JSON data is loaded
// function onSequenceOrDataChange() {
//     // Assuming 'currentSequence' is the currently selected sequence number
//     const currentSequenceData = window.unifiedSequencerSettings.getSettings('projectSequences')[`Sequence${currentSequence}`];
// 
//     if (currentSequenceData) {
//         // Update the global object with the settings for the current sequence
//         window.unifiedSequencerSettings.setProjectSequences(currentSequenceData);
// 
//         // Update the UI based on the current sequence data
//         updateUIFromLoadedSettings(); // Assuming this function updates the UI based on the global settings
//     }
// 
//     console.log(`URLs and Settings for Current Sequence (${currentSequence}) after data change:`, currentSequenceData);
// }

// // Function to update the global object with the settings for a specific channel
// function setChannelSettings(channelIndex, settings) {
//     // Update the global object
//     window.unifiedSequencerSettings.updateStepState(currentSequence, channelIndex, settings);
// 
//     // Log the settings for the specific channel after they are set
//     console.log(`Settings set for Channel-${channelIndex + 1}:`, settings);
// }
// 
// // Function to get the current settings for a specific channel from the global object
// function getChannelSettings(channelIndex) {
//     return window.unifiedSequencerSettings.getStepState(currentSequence, channelIndex);
// }

// Assuming your load button calls a function that updates the global object, make sure to also call onSequenceOrDataChange after loading new JSON data

// Log initial channel settings
