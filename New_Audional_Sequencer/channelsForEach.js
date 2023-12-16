// channelsForeach.js

    import { setupLoadSampleModalButton } from './loadSampleModalButton_v2.js';
console.log("channelsForeach.js entered");
    channels.forEach((channel, index) => {
        channel.dataset.id = `Channel-${index}`;
    
        // Create a gain node for the channel
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 1; // Initial volume set to 1 (full volume)
        gainNode.connect(audioContext.destination);
        gainNodes[index] = gainNode;
    
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
        


        
    const loadSampleButton = channel.querySelector('.load-sample-button');

    

        // Left-click event listener
        loadSampleButton.addEventListener('click', () => {
            setupLoadSampleModalButton(channel, index);
            // Additional logic for closing the modal can be added within setupLoadSampleModalButton if needed
        });

        // Right-click event listener
        loadSampleButton.addEventListener('contextmenu', (event) => {
            event.preventDefault(); // Prevent the default context menu
            showChannelNamingModal(index); // Show the channel naming modal
       
            // Create and show the custom context menu
            showCustomContextMenu(event.pageX, event.pageY, () => {
                const userChannelName = prompt("Enter a name for this channel:");
                if (userChannelName) {
                    // Update the button or relevant element with the new channel name
                    loadSampleButton.textContent = userChannelName;
                }
        });
    });

        // Function to create and show the custom context menu
        function showCustomContextMenu(x, y, channelIndex) {
            // Remove any existing custom context menus
            closeCustomContextMenu();

            // Create the custom context menu
            const menu = document.createElement('div');
            menu.classList.add('custom-context-menu');
            menu.style.top = `${y}px`;
            menu.style.left = `${x}px`;

            // Add menu options
            const addChannelNameOption = document.createElement('div');
            addChannelNameOption.textContent = 'Add User Channel Name';
            addChannelNameOption.addEventListener('click', () => {
                showChannelNamingModal(channelIndex);
                closeCustomContextMenu(); // Close the menu after opening the naming modal
            });
            menu.appendChild(addChannelNameOption);

            // Append the menu to the body and show it
            document.body.appendChild(menu);
        }

        // Function to create and show the channel naming modal
        function showChannelNamingModal(channelIndex) {
            const modal = document.createElement('div');
            modal.className = 'channel-naming-modal';

            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = 'Give this channel a name';
            input.className = 'channel-name-input';

            const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';
            submitButton.onclick = () => {
                if (input.value) {
                    window.unifiedSequencerSettings.setProjectChannelName(channelIndex, input.value);
                }
                document.body.removeChild(modal);
            };

            modal.appendChild(input);
            modal.appendChild(submitButton);
            document.body.appendChild(modal);
        }

        // Function to close the custom context menu
        function closeCustomContextMenu() {
            const existingMenu = document.querySelector('.custom-context-menu');
            if (existingMenu) {
                existingMenu.remove();
            }
        }

        // Hide the custom context menu or modal when clicking elsewhere
        document.addEventListener('click', (event) => {
            // Close the custom context menu if the click is outside
            const existingMenu = document.querySelector('.custom-context-menu');
            if (existingMenu && !existingMenu.contains(event.target)) {
                closeCustomContextMenu();
            }

            // Logic to close the left-click modal if the click is outside
            const modal = document.querySelector('.load-sample-buttor'); // Replace with your actual modal selector
            if (modal && !modal.contains(event.target) && !loadSampleButton.contains(event.target)) {
                closeModal(modal, channelIndex); // Replace with your function to close the modal
            }
        });

        // Function to close the modal
        function closeModal(modal, channelIndex) {
            // Add logic to close the modal, e.g., hide it or remove it from the DOM
            modal.style.display = 'none'; // Example: hide the modal
            stopAudioForChannel(channelIndex);

        }

    

});