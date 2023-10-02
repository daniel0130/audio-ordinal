// channelSettings.js


function setChannelVolume(channelIndex, volume) {
    const channel = document.querySelector(`.channel[data-id="Channel-${channelIndex + 1}"]`);
    channel.dataset.volume = volume;
    updateChannelVolume(channel);
    }

  function updateChannelVolume(channel) {
    const volume = parseFloat(channel.dataset.volume);
    const gainNode = gainNodes[parseInt(channel.dataset.id.split('-')[1]) - 1];
    gainNode.gain.value = volume;
    }

