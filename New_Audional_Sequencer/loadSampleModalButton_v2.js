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
        idModalContent.appendChild(createButton('Load Sample ID', () => handleLoad(index, audionalInput, ipfsInput, idModal, loadSampleButton), 'loadButton', 'Load Audio from ID'));
        idModalContent.appendChild(createButton('Cancel', () => document.body.removeChild(idModal), 'cancelButton', 'Close this window'));
    
        // Add the 'Search Ordinal Audio Files' button with a unique class name and tooltip
        const searchOrdinalButton = createExternalLinkButton('Search Ordinal Audio Files', 'https://ordinals.hiro.so/inscriptions?f=audio&s=genesis_block_height&o=asc', 'searchButton', 'Search for audio files (Copy and paste the Ordinal ID to load a sample');
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

    function createButton(text, onClick, className, tooltipText) {
        const container = document.createElement('div');
        container.className = 'tooltip';
    
        const button = document.createElement('button');
        button.textContent = text;
        button.addEventListener('click', onClick);
        button.className = className; // Apply the class name passed as a parameter
        container.appendChild(button);
    
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltiptext';
        tooltip.textContent = tooltipText;
        container.appendChild(tooltip);
    
        return container;
    }
    
    

    function handleLoad(index, audionalInput, ipfsInput, idModal, loadSampleButton) {
        console.log(`[HTML Debugging] [handleLoad] Called with index: ${index}`);
        let url;
    
        if (audionalInput.value) {
            // Assume the value is an ordinal ID and construct the URL
            url = 'https://ordinals.com/content/' + audionalInput.value;
            console.log(`[handleLoad] Ordinal ID URL determined: ${url}`);
        } else if (ipfsInput.value) {
            url = 'https://ipfs.io/ipfs/' + ipfsInput.value;
            console.log(`[handleLoad] IPFS URL determined: ${url}`);
        } else {
            console.log("[HTML Debugging] [handleLoad] No input value found.");
        }
    
        if (url) {
            processURL(url, index, loadSampleButton);
        }
    
        document.body.removeChild(idModal);
        console.log(`[HTML Debugging] [handleLoad] Modal removed for channel ${index}`);
    }
    
    // Helper function to process URL
    async function processURL(url, index, loadSampleButton) {
        console.log("[HTML Debugging] [processURL] URL: ", url);
    
        // Fetch the URL content to check if it's HTML containing audio data
        try {
            const response = await fetch(url);
            const contentType = response.headers.get("Content-Type");
            console.log("[HTML Debugging] [processURL] Content-Type: ", contentType);
    
            if (contentType && contentType.includes("text/html")) {
                console.log("[HTML Debugging] [processURL] HTML content detected. Extracting audio data...");
                const htmlText = await response.text();
                importHTMLSampleData(htmlText, index); // Now calling the updated importHTMLSampleData
            } else {
                console.log("[HTML Debugging] [processURL] Non-HTML content. Processing as direct audio URL...");
                fetchAudio(url, index).catch((error) => {
                    console.error(`[HTML Debugging] [processURL] fetchAudio encountered an error for channel ${index}:`, error);
                
            });

        }
            
        } catch (error) {
            console.error(`[HTML Debugging] [processURL] Error fetching URL content: `, error);
        }
    
        updateUIAfterLoading(index, loadSampleButton);
    }

    function importHTMLSampleData(htmlContent, index) {
        console.log("[importHTMLSampleData] Entered function with index: ", index);
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            // Assuming "Audional_Base64_Sample_Text" is a placeholder for a direct container like <div>
            // and that actual HTML structure may vary. Directly target the <audio> element for robustness.
            const audioElement = doc.querySelector('audio[data-audionalSampleName]');
            
            if (audioElement) {
                const sourceElement = audioElement.querySelector('source');
                if (sourceElement) {
                    const base64AudioData = sourceElement.getAttribute('src');
                    if (base64AudioData.startsWith('data:audio/wav;base64,')) {
                        console.log("[importHTMLSampleData] Extracted base64 audio data.");
                        
                        // Decode and process the base64 audio data
                        const audioData = base64ToArrayBuffer(base64AudioData.split(",")[1]); // Ensure to split correctly
                        decodeAudioData(audioData, index);
                    } else {
                        console.error("[importHTMLSampleData] Audio data does not start with expected base64 prefix.");
                    }
                } else {
                    console.error("[importHTMLSampleData] Could not find the source element in the audio content.");
                }
            } else {
                console.error("[importHTMLSampleData] Could not find the audio element in the HTML content.");
            }
        } catch (error) {
            console.error("[importHTMLSampleData] Error parsing HTML content: ", error);
        }
    }
    

    

    // Extracted UI update functionalities to keep the code organized
    function updateUIAfterLoading(index, loadSampleButton) {
        const channelContainer = document.querySelector(`.channel:nth-child(${index + 1}) .channel-container`);
        if (channelContainer) {
            channelContainer.classList.toggle('ordinal-loaded', true);
            console.log(`[HTML Debugging] [handleLoad] Channel container class toggled for channel ${index}`);
        }

        updateButtonAfterLoading(index, loadSampleButton);
        console.log(`[HTML Debugging] [handleLoad] Button text updated for channel ${index}`);
    }

    // Helper function to update button text after loading a sample
    function updateButtonAfterLoading(channelIndex, button) {
        if (window.unifiedSequencerSettings && typeof window.unifiedSequencerSettings.updateLoadSampleButtonText === 'function') {
            window.unifiedSequencerSettings.updateLoadSampleButtonText(channelIndex, button);
        }
        console.log(`[HTML Debugging] Updated button text for channel ${channelIndex}`); // Debug log
    }


    function createExternalLinkButton(text, url, className, tooltipText) {
        const container = document.createElement('div');
        container.className = 'tooltip';
    
        const button = document.createElement('button');
        button.textContent = text;
        button.className = className; // Apply the class name passed as a parameter
        button.addEventListener('click', () => window.open(url, '_blank'));
        container.appendChild(button);
    
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltiptext';
        tooltip.textContent = tooltipText; // Set the tooltip text
        container.appendChild(tooltip);
    
        return container;
    }
    
    
    
    export { setupLoadSampleModalButton };
    
