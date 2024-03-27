// channelSettings.js


function setChannelVolume(channelIndex, volume) {
  console.log("{channelSettings.js} setChannelVolume: channelIndex:", channelIndex, "volume:", volume);
  const channel = document.querySelector(`.channel[data-id="Channel-${channelIndex}"]`);
  channel.dataset.volume = volume;
  updateChannelVolume(channel);
}

  function updateChannelVolume(channel) {
    console.log("{channelSettings.js} updateChannelVolume: channel:", channel);
    const volume = parseFloat(channel.dataset.volume);
    const gainNode = gainNodes[parseInt(channel.dataset.id.split('-')[1])];
    gainNode.gain.value = volume;
    }

