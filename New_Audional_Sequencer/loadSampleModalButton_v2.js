    // loadSampleModalButton_v2.js

    function setupLoadSampleModalButton(channel, index) {
        const loadSampleButton = channel.querySelector('.load-sample-button');
        // Update the button text with the corresponding URL from projectURLs array
        loadSampleButton.textContent = window.unifiedSequencerSettings.settings.masterSettings.projectURLs[index];
        // Add event listener to open the modal
        // loadSampleButton.addEventListener('click', () => 
        openModal(index, loadSampleButton);
    }

    function openModal(index, loadSampleButton) {
        const idModal = createModal();
        const idModalContent = createModalContent();
        idModal.appendChild(idModalContent);

        // Add instruction texts, inputs, and buttons
        idModalContent.appendChild(createTextParagraph('Enter an Ordinal ID to load a Bitcoin Audional:'));
        const audionalInput = createInputField('Enter ORD ID:');
        idModalContent.appendChild(audionalInput);

        idModalContent.appendChild(createTextParagraph('Or, enter an IPFS ID for an off-chain Audional:'));
        const ipfsInput = createInputField('Enter IPFS ID:');
        idModalContent.appendChild(ipfsInput);

        addInputListeners(audionalInput, ipfsInput);

        // Add Load and Cancel buttons with unique class names for styling
        idModalContent.appendChild(createButton('Load', () => handleLoad(index, audionalInput, ipfsInput, idModal, loadSampleButton), 'loadButton'));
        idModalContent.appendChild(createButton('Cancel', () => document.body.removeChild(idModal), 'cancelButton'));

        // Add the new 'Search Ordinal Audio Files' button with a unique class name
        const searchOrdinalButton = createExternalLinkButton('Search Ordinal Audio Files', 'https://ordinals.hiro.so/inscriptions?f=audio&s=genesis_block_height&o=asc', 'searchButton');
        idModalContent.appendChild(searchOrdinalButton);


        document.body.appendChild(idModal);
    }

    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'loadSampleModalButton'; // Updated class name
        return modal;
    }

    function createModalContent() {
        const content = document.createElement('div');
        content.className = 'loadSampleModalButton-content'; // Updated class name
        return content;
    }

    function createTextParagraph(text) {
        const paragraph = document.createElement('p');
        paragraph.textContent = text;
        paragraph.className = 'loadSampleModalButton-text'; // Updated class name
        return paragraph;
    }

    function createInputField(placeholder) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholder;
        input.className = 'loadSampleModalButton-input'; // Updated class name
        return input;
    }

    function addInputListeners(audionalInput, ipfsInput) {
        audionalInput.addEventListener('input', () => {
            ipfsInput.disabled = !!audionalInput.value;
        });

        ipfsInput.addEventListener('input', () => {
            audionalInput.disabled = !!ipfsInput.value;
        });
    }

    function createButton(text, onClick, className) {
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        button.className = className; // Apply the class name passed as a parameter
        return button;
    }
    

    function handleLoad(index, audionalInput, ipfsInput, idModal, loadSampleButton) {

        let url;
        console.log(`handleLoad called with index: ${index}, url: ${url}`);

        if (audionalInput.value) {
            url = 'https://ordinals.com/content/' + getIDFromURL(audionalInput.value);
        } else if (ipfsInput.value) {
            url = 'https://ipfs.io/ipfs/' + ipfsInput.value;
        }
    
        if (url) {
            // Update the URL in the global settings object at the specific channel index
            console.log("Before updateSetting:", window.unifiedSequencerSettings.settings.masterSettings.projectURLs);
            window.unifiedSequencerSettings.updateSetting('projectURLs', url, index);
            console.log("After updateSetting:", window.unifiedSequencerSettings.settings.masterSettings.projectURLs);
            // Fetch and load the audio
            fetchAudio(url, index, loadSampleButton);
            console.log(`Fetched audio for channel ${index}`); // Debug log
            // Update the class of the channel container
            const channelContainer = document.querySelector(`.channel:nth-child(${index}) .channel-container`);
            if (channelContainer) {
                channelContainer.classList.toggle('ordinal-loaded', audionalInput.value !== undefined);
                console.log(`Updated channelContainer class for channel ${index}`); // Debug log
    
                updateButtonAfterLoading(index, loadSampleButton); // Call the helper function
                console.log(`Updated button text for channel ${index}`); // Debug log
            }
        }
        document.body.removeChild(idModal);
        console.log(`Removed modal for channel ${index}`); // Debug log
    }
    
    // Helper function to update button text after loading a sample
    function updateButtonAfterLoading(channelIndex, button) {
        if (window.unifiedSequencerSettings && typeof window.unifiedSequencerSettings.updateLoadSampleButtonText === 'function') {
            window.unifiedSequencerSettings.updateLoadSampleButtonText(channelIndex, button);
        }
        console.log(`Updated button text for channel ${channelIndex}`); // Debug log
    }


    function createExternalLinkButton(text, url, className) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = className; // Updated class name to accept parameter
        button.addEventListener('click', () => window.open(url, '_blank'));
        return button;
    }
    
    
    
    export { setupLoadSampleModalButton };
    
