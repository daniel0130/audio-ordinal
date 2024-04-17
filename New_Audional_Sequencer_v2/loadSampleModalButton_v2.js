    // loadSampleModalButton_v2.js

    function setupLoadSampleModalButton(channel, index) {
        const loadSampleButton = channel.querySelector('.load-sample-button');
        // Update the button text with the corresponding URL from channelURLs array
        loadSampleButton.textContent = window.unifiedSequencerSettings.settings.masterSettings.channelURLs[index];
        // updateModalButtonText(loadSampleButton, index); // Update modal button text

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

          // New section: Choose local audio file
        idModalContent.appendChild(createTextParagraph('Or, select a local audio file (MP3, WAV, FLAC, Base64):'));
        const fileInput = createFileInput();
        idModalContent.appendChild(fileInput);

    
        addInputListeners(audionalInput, ipfsInput, fileInput);
    
        // Add Load and Cancel buttons with unique class names for styling
        idModalContent.appendChild(createButton('Load Sample ID', () => handleLoad(index, audionalInput, ipfsInput, fileInput, idModal, loadSampleButton), 'loadButton', 'Load Audio from ID'));
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

    function updateModalButtonText(button, index) {
        const channelName = window.unifiedSequencerSettings.settings.masterSettings.projectChannelNames[index];
        if (channelName) {
            button.textContent = channelName;
        } else {
            button.textContent = `Load new audience (${index})`;
        }
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

    function createFileInput() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.mp3, .wav, .flac, text/plain';  // Accept MP3, WAV, FLAC, and text files for Base64
        fileInput.className = 'loadSampleModalButton-input';
        return fileInput;
    }
    
    function addInputListeners(audionalInput, ipfsInput, fileInput) {
        audionalInput.addEventListener('input', () => {
            ipfsInput.disabled = fileInput.disabled = !!audionalInput.value;
        });
    
        ipfsInput.addEventListener('input', () => {
            audionalInput.disabled = fileInput.disabled = !!ipfsInput.value;
        });
    
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                audionalInput.disabled = ipfsInput.disabled = true;
            } else {
                audionalInput.disabled = ipfsInput.disabled = false;
            }
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
    
    function handleLoad(index, audionalInput, ipfsInput, fileInput, idModal, loadSampleButton) {
        console.log(`[HTML Debugging] [handleLoad] Called with index: ${index}`);
        console.log(`[HTML Debugging] [handleLoad] Audional Input Value: ${audionalInput.value}`);
        console.log(`[HTML Debugging] [handleLoad] IPFS Input Value: ${ipfsInput.value}`);
        console.log(`[HTML Debugging] [handleLoad] File Input:`, fileInput.files);
    
        if (audionalInput.value) {
            const url = 'https://ordinals.com/content/' + audionalInput.value;
            console.log(`[HTML Debugging] [handleLoad] Loading from Ordinals with URL: ${url}`);
            fetchAndProcessURL(url, index, idModal, loadSampleButton);
        } else if (ipfsInput.value) {
            const url = 'https://ipfs.io/ipfs/' + ipfsInput.value;
            console.log(`[HTML Debugging] [handleLoad] Loading from IPFS with URL: ${url}`);
            fetchAndProcessURL(url, index, idModal, loadSampleButton);
        } else if (fileInput.files.length > 0) {
            console.log(`[HTML Debugging] [handleLoad] Local file selected: ${fileInput.files[0].name}`);
            processLocalFile(fileInput.files[0], index, idModal, loadSampleButton);
        } else {
            console.error("[HTML Debugging] [handleLoad] No input value or file selected.");
            alert("Please enter an ID or select a file.");
            return;  // Exit early if no input value or file is provided
        }
    
        // Only remove the modal if an action has been initiated
        if (audionalInput.value || ipfsInput.value || fileInput.files.length > 0) {
            console.log('Preparing to remove modal', idModal);
            if (document.body.contains(idModal)) {
                document.body.removeChild(idModal);
                console.log('Modal removed successfully');
            } else {
                console.error('Failed to remove modal: it is not a child of document.body', idModal);
            }
          
            console.log(`[HTML Debugging] [handleLoad] Modal removed for channel ${index}`);
        }
    }
    
    function fetchAndProcessURL(url, index, idModal, loadSampleButton) {
        console.log(`[HTML Debugging] [fetchAndProcessURL] Fetching URL: ${url}`);
        url = formatURL(url);  // Ensure URL formatting is consistent with application expectations
    
        fetchAudio(url, index).then(() => {
            console.log(`[HTML Debugging] [fetchAndProcessURL] Audio loaded for channel ${index}: ${url}`);
            window.unifiedSequencerSettings.addChannelURL(index, url);
            updateSettingsAfterLoad(index, loadSampleButton);
        }).catch(error => {
            console.error(`[HTML Debugging] [fetchAndProcessURL] Error loading audio for URL ${url}:`, error);
        });
    }
    
    function processLocalFile(file, index, idModal, loadSampleButton) {
        const url = URL.createObjectURL(file); // This creates a blob URL that acts as a temporary URL
        console.log(`[HTML Debugging] [processLocalFile] Temporary URL created for local file: ${url}`);
    
        // Directly call fetchAudio as if it was loaded from a URL
        fetchAudio(url, index).then(() => {
            console.log(`[HTML Debugging] [processLocalFile] Audio loaded for channel ${index} using temporary URL: ${url}`);
            window.unifiedSequencerSettings.addChannelURL(index, url);
            window.unifiedSequencerSettings.updateLoadSampleButtonText(index, loadSampleButton);
            window.unifiedSequencerSettings.notifyObservers(); // Notify all observers of the update
        }).catch(error => {
            console.error(`[HTML Debugging] [processLocalFile] Error loading audio for temporary URL ${url}:`, error);
        });
    
        // Clean up the modal
        document.body.removeChild(idModal);
    }
    
    
    async function loadAudioData(audioData, index, fileName, loadSampleButton) {
        console.log(`[HTML Debugging] [loadAudioData] Decoding audio data for file: ${fileName}`);
        const audioBuffer = await decodeAudioData(audioData);
        audioBuffers.set(fileName, audioBuffer);
        console.log(`[HTML Debugging] [loadAudioData] Audio loaded and buffered for channel ${index}: ${fileName}`);
        window.unifiedSequencerSettings.setProjectChannelName(index, fileName);
        updateSettingsAfterLoad(index, loadSampleButton);
    }
    
    function updateSettingsAfterLoad(index, loadSampleButton) {
        console.log(`[HTML Debugging] [updateSettingsAfterLoad] Updating settings post-load for channel ${index}`);
        window.unifiedSequencerSettings.updateLoadSampleButtonText(index, loadSampleButton);
        window.unifiedSequencerSettings.notifyObservers();  // Notify all observers of the update
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
    
    

    // function updateChannelButtonUI(settings) {
    //     settings.masterSettings.channelURLs.forEach((url, index) => {
    //         const button = document.querySelector(`#channelButton-${index}`);
    //         if (button) {
    //             button.textContent = settings.masterSettings.projectChannelNames[index] || url;
    //         }
    //     });
    // }
    
//     function handleLoad(index, audionalInput, ipfsInput, idModal, loadSampleButton) {
//         console.log(`[HTML Debugging] [handleLoad] Called with index: ${index}`);
//         let url;
    
//         if (audionalInput.value) {
//             url = formatURL('https://ordinals.com/content/' + audionalInput.value);
//         } else if (ipfsInput.value) {
//             url = formatURL('https://ipfs.io/ipfs/' + ipfsInput.value);
//         } else {
//             console.log("[HTML Debugging] [handleLoad] No input value found.");
//         }
    
//         if (url) {
//             processURL(url, index, loadSampleButton);
//         }
    
//         document.body.removeChild(idModal);
//         console.log(`[HTML Debugging] [handleLoad] Modal removed for channel ${index}`);
//     }
    
//    // Helper function to process URL
// // In loadSampleModalButton_v2.js

// // Helper function to process URL
// async function processURL(url, index, loadSampleButton) {
//     console.log("[HTML Debugging] [processURL] URL: ", url);

//     try {
//         const response = await fetch(url);
//         const contentType = response.headers.get("Content-Type");
//         console.log("[HTML Debugging] [processURL] Content-Type: ", contentType);

//         if (contentType && !contentType.includes("text/html")) {
//             console.log("[HTML Debugging] [processURL] Non-HTML content. Processing as direct audio URL...");
//             fetchAudio(url, index);
//             // Log and add the URL to the global settings
//             window.unifiedSequencerSettings.addChannelURL(index, url); // This is the new part
//         }
//     } catch (error) {
//         console.error(`[HTML Debugging] [processURL] Error fetching URL content: `, error);
//     }
// }


// // Helper function to process URL
// async function processURL(url, index, loadSampleButton) {
//     console.log("[HTML Debugging] [processURL] URL: ", url);

//     try {
//         const response = await fetch(url);
//         const contentType = response.headers.get("Content-Type");
//         console.log("[HTML Debugging] [processURL] Content-Type: ", contentType);

//         if (contentType && contentType.includes("text/html")) {
//             console.log("[HTML Debugging] [processURL] HTML content detected. Extracting audio data...");
//             const htmlText = await response.text();
//             // Wait for the importHTMLSampleData to process and return the direct audio URL (base64 data)
//             const audioURL = await importHTMLSampleData(htmlText, index);
//             // Process the extracted audio URL as if it was direct audio content
//             if (audioURL) {
//                 fetchAudio(audioURL, index);
//                 // Log and add the URL to the global settings
//                 window.unifiedSequencerSettings.addChannelURL(index, url); // This is the new part
//             }
//         } else {
//             console.log("[HTML Debugging] [processURL] Non-HTML content. Processing as direct audio URL...");
//             fetchAudio(url, index);
//             // Log and add the URL to the global settings
//             window.unifiedSequencerSettings.addChannelURL(index, url); // This is the new part
//         }
//     } catch (error) {
//         console.error(`[HTML Debugging] [processURL] Error fetching URL content: `, error);
//     }
// }


// async function importHTMLSampleData(htmlContent, index) {
//     console.log("[html debugging] [importHTMLSampleData] Entered function with index: ", index);
//     try {
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(htmlContent, 'text/html');
//         const sourceElement = doc.querySelector('audio[data-audionalSampleName] source');

//         if (sourceElement) {
//             const base64AudioData = sourceElement.getAttribute('src');
//             // Convert the prefix to lowercase before checking
//             if (base64AudioData.toLowerCase().startsWith('data:audio/wav;base64,') || base64AudioData.toLowerCase().startsWith('data:audio/mp3;base64,')) {
//                 console.log("[html debugging] [importHTMLSampleData] Extracted base64 audio data.");
//                 // Directly return the base64 audio data URL
//                 return base64AudioData;
//             } else {
//                 console.error("[html debugging][importHTMLSampleData] Audio data does not start with expected base64 prefix.");
//             }
//         } else {
//             console.error("[html debugging][importHTMLSampleData] Could not find the audio source element in the HTML content.");
//         }
//     } catch (error) {
//         console.error("[html debugging][importHTMLSampleData] Error parsing HTML content: ", error);
//     }
//     // Return null in case of errors or if audio data is not found
//     return null;
// }


    

    // // Extracted UI update functionalities to keep the code organized
    // function updateUIAfterLoading(index, loadSampleButton) {
    //     const channelContainer = document.querySelector(`.channel:nth-child(${index + 1}) .channel-container`);
    //     if (channelContainer) {
    //         channelContainer.classList.toggle('ordinal-loaded', true);
    //         console.log(`[HTML Debugging] [handleLoad] Channel container class toggled for channel ${index}`);
    //     }

    //     updateButtonAfterLoading(index, loadSampleButton);
    //     console.log(`[HTML Debugging] [handleLoad] Button text updated for channel ${index}`);
    // }

    // // Helper function to update button text after loading a sample
    // function updateButtonAfterLoading(channelIndex, button) {
    //     if (window.unifiedSequencerSettings && typeof window.unifiedSequencerSettings.updateLoadSampleButtonText === 'function') {
    //         window.unifiedSequencerSettings.updateLoadSampleButtonText(channelIndex, button);
    //     }
    //     console.log(`[HTML Debugging] Updated button text for channel ${channelIndex}`); // Debug log
    // }


