// channelsForeach.js

import { setupLoadSampleButton } from './loadSampleModalButton_v2.js';

console.log("channelsForeach.js entered");
    channels.forEach((channel, index) => {
        channel.dataset.id = `Channel-${index}`;
        setupLoadSampleButton(channel, index);


        // Directly use the gainNode from UnifiedSequencerSettings
        const gainNode = window.unifiedSequencerSettings.gainNodes[index];
        if (!gainNode) {
            console.error("GainNode not found for channel:", index);
            return;
        }

        // const volumeButton = channel.querySelector('.volume-button');
        // if (volumeButton) {
        //     volumeButton.addEventListener('click', () => {
        //         openVolumeModal(volumeButton, index);
        //     });
        // }




        const muteButton = channel.querySelector('.mute-button');
        muteButton.addEventListener('click', () => {
            console.log(`Mute button clicked for Channel-${index}`);
            const isMuted = muteButton.classList.toggle('selected');
            updateMuteState(channel, isMuted);
            updateDimState(channel, index);
        });
    
        const soloButton = channel.querySelector('.solo-button');
            soloButton.addEventListener('click', () => {
                soloedChannels[index] = !soloedChannels[index];
                soloButton.classList.toggle('selected', soloedChannels[index]);

                // Update mute state for all channels based on solo state
                channels.forEach((otherChannel, otherIndex) => {
                    if (index === otherIndex) {
                        // If this is the soloed channel, ensure it's not muted
                        updateMuteState(otherChannel, false);
                    } else {
                        // Mute all other channels if this channel is soloed
                        updateMuteState(otherChannel, soloedChannels[index]);
                    }
                    updateDimState(otherChannel, otherIndex);
                });
            });


        const clearButton = channel.querySelector('.clear-button');
        const clearConfirm = channel.querySelector('.clear-confirm');
        let clearConfirmTimeout;
        
        clearButton.addEventListener('click', (e) => {
            e.stopPropagation();
        
            if (!clearButton.classList.contains('flashing')) {
                // Start the flashing effect
                clearButton.classList.add('flashing');
        
                // Set a timer to reset the button after 2 seconds
                clearConfirmTimeout = setTimeout(() => {
                    clearButton.classList.remove('flashing');
                }, 2000);
            } else {
                // Clear the steps if the button is clicked again while flashing
                const stepButtons = channel.querySelectorAll('.step-button');
                stepButtons.forEach(button => {
                    button.classList.remove('selected');
                });
        
                // Update the step settings in the sequence data
                let stepSettings = Array(64).fill(false); // Reset all steps to false
                for (let stepIndex = 0; stepIndex < stepSettings.length; stepIndex++) {
                    window.unifiedSequencerSettings.updateStepState(currentSequence, index, stepIndex, stepSettings[stepIndex]);
                }
        
                // Immediately stop the flashing effect and reset the button
                clearTimeout(clearConfirmTimeout);
                clearButton.classList.remove('flashing');
            }
        });
        
        // Handle clicks outside the clear button
        document.addEventListener('click', (e) => {
            if (!clearButton.contains(e.target) && clearButton.classList.contains('flashing')) {
                // Reset the button if clicked outside while flashing
                clearTimeout(clearConfirmTimeout);
                clearButton.classList.remove('flashing');
            }
        });
        


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

        
    const loadSampleButton = channel.querySelector('.load-sample-button');

    

//    // Assuming 'loadSampleButton' is defined in a broader context
//     // and this code is part of a loop or function where 'channel' and 'index' are defined

//      // Left-click event listener
//      loadSampleButton.addEventListener('click', () => {
//         setupLoadSampleModalButton(channel, index);
//         // Additional logic for closing the modal can be added within setupLoadSampleModalButton if needed
//     });

//    // Right-click event listener for the loadSampleButton
//     loadSampleButton.addEventListener('contextmenu', (event) => {
//         console.log('Right-click on loadSampleButton');

//         event.preventDefault();
//         showCustomContextMenu(event, event.pageX, event.pageY, index, loadSampleButton);
//     });

    // // Function to create and show the custom context menu
    // function showCustomContextMenu(contextEvent, x, y, channelIndex, button) {
    //     console.log('Creating custom context menu');

    //     closeCustomContextMenu();

    //     const menu = createContextMenu(x, y);
    //     const addChannelNameOption = createMenuOption('Add User Channel Name', () => {
    //         showChannelNamingModal(channelIndex);
    //         closeCustomContextMenu();
    //     });
    //     const copyOrdinalIdOption = createMenuOption('Copy Ordinal ID', () => {
    //         copyOrdinalId(channelIndex);
    //         console.log('Copy Ordinal ID clicked');
    //         closeCustomContextMenu();
    //     });

    //       // Modify the event listener for the 'Copy Ordinal ID' option
    //     const copyChannelSettingsOption = createMenuOption('Copy Channel Settings (coming soon)', () => {
    //         console.log('Copy Channel Settings clicked');
    //         closeCustomContextMenu();
    //     });

    //     // Modify the event listener for the 'Set Channel Colour' option
    //     const setChannelColour = createMenuOption('Set Channel Colour', () => {
    //         console.log('Set Channel Colour option selected');

    //         showColorPicker(contextEvent, button); // Call showColorPicker with the captured right-click event and the button
    //         closeCustomContextMenu();
    //     });
    
    //     // Add new menu options for pasting
    //     const pasteOrdinalIdOption = createMenuOption('Paste Ordinal ID', () => {
    //         pasteOrdinalId(channelIndex);
    //         closeCustomContextMenu();
    //     });

    //     const pasteChannelSettingsOption = createMenuOption('Paste Channel Settings (coming soon)', () => {
    //         pasteChannelSettings(channelIndex);
    //         closeCustomContextMenu();
    //     });

    //     menu.appendChild(addChannelNameOption);
    //     menu.appendChild(setChannelColour);
    //     menu.appendChild(copyOrdinalIdOption);
    //     menu.appendChild(pasteOrdinalIdOption);
    //     menu.appendChild(copyChannelSettingsOption);
    //     menu.appendChild(pasteChannelSettingsOption);  

       
           

    //     document.body.appendChild(menu);

    //     // Global click listener to close the menu when clicking outside
    //     setTimeout(() => { // Timeout to avoid immediate closing due to the current click event
    //         document.addEventListener('click', handleClickOutsideMenu, { capture: true, once: true });
    //     }, 0);
    // }

    // function showColorPicker(event, button) {
    //     console.log('showColorPicker function called inside channelsForEach.js');
    
    //     // Define colors for the grid
    //     const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#808080', '#FFFFFF',
    //                     '#FFA500', '#800080', '#008080', '#000080', '#800000', '#008000', '#FFC0CB', '#D2691E'];
    
    //     // Create color picker container
    //     const colorPicker = document.createElement('div');
    //     colorPicker.style.position = 'absolute';
    //     colorPicker.style.display = 'grid';
    //     colorPicker.style.gridTemplateColumns = 'repeat(4, 1fr)';
    //     colorPicker.style.gap = '1px';
    
    //     // Calculate the position
    //     const gridHeight = (colors.length / 4) * 20; // 20px height for each color div
    //     const topPosition = event.clientY - gridHeight;
    //     const leftPosition = event.clientX;
    
    //     // Log calculated position
    //     console.log(`Color picker position - Top: ${topPosition}px, Left: ${leftPosition}px`);
    
    //     colorPicker.style.top = topPosition + 'px';
    //     colorPicker.style.left = leftPosition + 'px';
    
    //     // Add color options to the picker
    //     colors.forEach(color => {
    //         const colorDiv = document.createElement('div');
    //         colorDiv.style.width = '20px';
    //         colorDiv.style.height = '20px';
    //         colorDiv.style.backgroundColor = color;
    //         colorDiv.addEventListener('click', function() {
    //             console.log(`Color selected: ${color}`);
    //             button.style.backgroundColor = color;
    
    //             // Remove previous color class and add the new one
    //             button.className = button.className.replace(/\bcolor-[^ ]+/g, '');
    //             button.classList.add(`color-${color.replace('#', '')}`);
    
    //             colorPicker.remove();
    //         });
    //         colorPicker.appendChild(colorDiv);
    //     });
    
    //     // Append the color picker to the body
    //     document.body.appendChild(colorPicker);
    //     console.log('Color picker appended to the body. Check if it is visible in the DOM.');
    
    //     // Add event listener to stop propagation of click events inside the color picker
    //     colorPicker.addEventListener('click', function(e) {
    //         e.stopPropagation();
    //     });
    
    //     // Delay the addition of the global click listener
    //     setTimeout(() => {
    //         document.addEventListener('click', function removePicker() {
    //             console.log('Global click detected. Removing color picker.');
    //             colorPicker.remove();
    //             document.removeEventListener('click', removePicker);
    //         });
    //     }, 0); // Small delay like 0 or 10 milliseconds
    
    //     // Set a timeout to remove the color picker after 2 seconds
    //     setTimeout(() => {
    //         console.log('Removing color picker after 2 seconds.');
    //         colorPicker.remove();
    //     }, 5000);
    // }
    

    // // Helper function to handle click outside the custom context menu
    // function handleClickOutsideMenu(event) {
    //     const existingMenu = document.querySelector('.custom-context-menu');
    //     if (existingMenu && !existingMenu.contains(event.target)) {
    //         closeCustomContextMenu();
    //     }
    // }


    // function createContextMenu(x, y) {
    //     const menu = document.createElement('div');
    //     menu.className = 'custom-context-menu';
    //     Object.assign(menu.style, {
    //         position: 'absolute',
    //         top: `${y}px`,
    //         left: `${x}px`,
    //         backgroundColor: 'lightgray',
    //         color: 'black',
    //         padding: '10px',
    //         border: '1px solid #ddd',
    //         borderRadius: '5px',
    //         boxShadow: '0px 2px 5px rgba(0,0,0,0.2)'
    //     });
    //     return menu;
    // }

    // function createMenuOption(text, onClick) {
    //     const option = document.createElement('div');
    //     option.textContent = text;
    //     Object.assign(option.style, {
    //         padding: '5px 10px',
    //         cursor: 'pointer'
    //     });
    //     option.addEventListener('mouseenter', () => option.style.backgroundColor = '#f0f0f0');
    //     option.addEventListener('mouseleave', () => option.style.backgroundColor = 'lightgray');
    //     option.addEventListener('click', onClick);
    //     return option;
    // }

    // function closeCustomContextMenu() {
    //     const existingMenu = document.querySelector('.custom-context-menu');
    //     if (existingMenu) {
    //         existingMenu.remove();
    //     }
    // }

    // function showChannelNamingModal(channelIndex) {
    //     closeModal(); // Close any existing modal first

    //     const modal = document.createElement('div');
    //     modal.className = 'channel-naming-modal';
    //     // Add styles as needed

    //     const input = document.createElement('input');
    //     input.type = 'text';
    //     input.placeholder = 'Give this channel a name';
    //     input.className = 'channel-name-input';

    //     const submitButton = document.createElement('button');
    //     submitButton.textContent = 'Submit';
    //     submitButton.onclick = () => {
    //         if (input.value) {
    //             window.unifiedSequencerSettings.setProjectChannelName(channelIndex, input.value);
    //         }
    //         closeModal();
    //     };

    //     const cancelButton = document.createElement('button');
    //     cancelButton.textContent = 'Cancel';
    //     cancelButton.onclick = closeModal;

    //     modal.appendChild(input);
    //     modal.appendChild(submitButton);
    //     modal.appendChild(cancelButton);
    //     document.body.appendChild(modal);

    //     // Event listener to close the modal when clicking outside
    //     document.addEventListener('click', (event) => {
    //         if (!modal.contains(event.target) && !event.target.matches('.load-sample-button')) {
    //             closeModal();
    //         }
    //     }, { capture: true, once: true });
    //     input.focus(); // Automatically focus the input field for immediate typing
    // }

    // function closeModal() {
    //     const existingModal = document.querySelector('.channel-naming-modal');
    //     if (existingModal) {
    //         document.body.removeChild(existingModal);
    //     }
    // }

    // Function to copy the full URL instead of just the Ordinal ID
    function copyOrdinalId(channelIndex) {
        const url = window.unifiedSequencerSettings.channelURLs(channelIndex);
        if (!url) {
            console.log('No URL found for channel:', channelIndex);
            return;
        }

        // Copying the full URL to the clipboard
        navigator.clipboard.writeText(url)
            .then(() => console.log('Full URL copied:', url))
            .catch(err => console.error('Error copying URL:', err));
    }


    // Function to extract the Ordinal ID from a URL
    function extractOrdinalIdFromUrl(url) {
        const match = url.match(/([^\/]+)$/);
        return match ? match[1] : null;
    }

    // Function to paste the full URL
    function pasteOrdinalId(channelIndex) {
        navigator.clipboard.readText()
            .then(fullUrl => {
                // Ensure only one URL is added and updated by the user
                if (isValidURL(fullUrl)) {
                    // Retrieve the current URLs
                    let currentURLs = [...window.unifiedSequencerSettings.settings.masterSettings.channelURLs];

                    // Update the URL for the specific channel
                    currentURLs[channelIndex] = fullUrl;

                    // Set the updated URLs using the new method
                    window.unifiedSequencerSettings.setChannelURLs(currentURLs);
                    console.log('Pasted full URL:', fullUrl);
                } else {
                    console.error('Invalid URL format.');
                }
            })
            .catch(err => console.error('Error pasting URL:', err));
    }



    // Function to paste the Channel Settings
    function pasteChannelSettings(channelIndex) {
        navigator.clipboard.readText()
            .then(text => {
                // Assuming the text is JSON-formatted settings
                let settings = JSON.parse(text);

                // Set the channel settings
                // Replace 'setChannelSettings' with your actual method
                window.unifiedSequencerSettings.setChannelSettings(channelIndex, settings);
                console.log('Pasted Channel Settings:', settings);
            })
            .catch(err => console.error('Error pasting Channel Settings:', err));
        }
    });