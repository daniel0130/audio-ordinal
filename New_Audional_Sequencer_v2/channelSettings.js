// channelSettings.js


// function setChannelVolume(channelIndex, volume) {
//   console.log("{channelSettings.js} setChannelVolume: channelIndex:", channelIndex, "volume:", volume);
//   const channel = document.querySelector(`.channel[data-id="Channel-${channelIndex}"]`);
//   if (channel) {
//       channel.dataset.volume = volume;
//       updateChannelVolume(channel);
//   } else {
//       console.error("Channel element not found for index:", channelIndex);
//   }
// }

// function updateChannelVolume(channel) {
//   console.log("{channelSettings.js} updateChannelVolume: channel:", channel);
//   const volume = parseFloat(channel.dataset.volume);
//   const channelIndex = parseInt(channel.dataset.id.split('-')[1]);

//   const gainNodes = window.unifiedSequencerSettings.gainNodes;  // Access gainNodes from global settings
//   const gainNode = gainNodes[channelIndex];
//   if (gainNode) {
//       gainNode.gain.value = volume;
//   } else {
//       console.error("GainNode not found for channel:", channelIndex);
//   }
// }
