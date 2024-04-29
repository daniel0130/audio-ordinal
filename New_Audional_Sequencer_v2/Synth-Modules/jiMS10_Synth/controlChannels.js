// controlChannels.js


document.addEventListener('DOMContentLoaded', () => {
    const controlChannelDropdown = document.getElementById('controlChannel');

    // Create an "All Channels" option
    let allChannelsOption = document.createElement('option');
    allChannelsOption.value = 'all';
    allChannelsOption.text = 'All Channels';
    controlChannelDropdown.appendChild(allChannelsOption);

    // Create options for the 16 channels
    for (let i = 1; i <= 16; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.text = 'Channel ' + i;
        controlChannelDropdown.appendChild(option);
    }
});
