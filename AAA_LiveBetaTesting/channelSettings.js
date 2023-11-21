// channelSettings.js


function setChannelVolume(channelIndex, volume) {
  const channel = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"]`);
  channel.dataset.volume = volume;
  updateChannelVolume(channel);

  // Update sequence data
  updateSequenceData({
      channelIndex: channelIndex,
      volume: volume
  });

  saveCurrentSequence(currentSequence);
}

  function updateChannelVolume(channel) {
    const volume = parseFloat(channel.dataset.volume);
    const gainNode = gainNodes[parseInt(channel.dataset.id.split('-')[1]) - 1];
    gainNode.gain.value = volume;
    }

