    // loadSampleModalButton_v2.js

    function setupLoadSampleModalButton(channel, index) {
        const loadSampleButton = channel.querySelector('.load-sample-button');
         // Ensure the button has an ID that matches the expected format
         loadSampleButton.id = `load-sample-button-${index}`; // Assign ID based on channel index
        
        // Update the button text with the corresponding URL from channelURLs array
        loadSampleButton.textContent = window.unifiedSequencerSettings.settings.masterSettings.channelURLs[index];
        
        // Add event listener to open the modal
        loadSampleButton.addEventListener('click', () => openModal(index, loadSampleButton));
    }

    function createDropdown(label, options) {
        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        labelElement.className = 'loadSampleModalButton-label'; // Apply a class for styling
    
        const select = document.createElement('select');
        select.className = 'loadSampleModalButton-select'; // Apply a class for styling
    
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option; // Set the display text as the URL, modify if needed
            select.appendChild(optionElement);
        });
    
        const container = document.createElement('div');
        container.appendChild(labelElement);
        container.appendChild(select);
        return container;
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

        // New Dropdown for Og audience samples
        const ogSampleUrls = [
            'https://ordinals.com/content/752bd66406185690c6f14311060785170df91a887b42740e1dde27e5fbf351cbi0#',
            'https://ordinals.com/content/6d962189218b836cf33e2dc1adbc981e90242aa395f0868178773065f76f144ei0',
            'https://ordinals.com/content/0b8eff3f39f4095d0f129bb8dd75f29159f8725c7e66046bf41f70ebb9f60d93i0',
            'https://ordinals.com/content/6d8be8186e63b4557e51edd66184a567bc6f5f9f5ba4bb34ba8c67e652c1934ei0',
            'https://ordinals.com/content/6c01b1214fc4d4016d683380d066849e6bc645276b102604c098bd35fd77f791i0',
            'https://ordinals.com/content/43efcebb84113c6df56bf5b8a455685c043492de9f5635d4108c4211c1f6841fi0',
            'https://ordinals.com/content/3364803cb3032ce95f4138a214c15a9b36dcb70f574a477f27615d448e1cdeb8i0',
            'https://ordinals.com/content/fef956676f3cbd6019a03d75c1a4a295c25b33653644b8f6ebde387971f9a677i0',
            'https://ordinals.com/content/8fa54ad2d9e297c79b225eff67a481ebc8682dacf4fe9dbf5b692a60b237c163i0',
            'https://ordinals.com/content/695368ae1092c0633ef959dc795ddb90691648e43f560240d96da0e2753a0a08i0',
            'https://ordinals.com/content/d4ce1d1e80e90378d8fc49fd7e0e24e7f2310b2f5eb95d0c2318c47b6c9cd645i0',
            'https://ordinals.com/content/e4cb3caff3b4a5192adf0f2ab5cd9da378bacfbafce56c3d4fb678a313607970i0',
            'https://ordinals.com/content/898cba6dc32faab5be09f13092b7500b13eb22f1e7b3d604c8e6e47b0becd139i0',
            'https://ordinals.com/content/ed13d5389ae6273839342698b6d5bd3342c51eb472f32b8306e60f8e1e903ce8i0',
            'https://ordinals.com/content/c41587924f9d93d01cb71ca925fd664d6e50f1ac8e3c975d5e1e1f1bb0ff11b3i0',
            'https://ordinals.com/content/b0fb7f9eb0fe6c368a8d140b1117234431da0cd8725e9f78e6573bb7f0f61dadi0',
            'https://ordinals.com/content/0e38f29c76b29e471f5f0022a5e98f9ae64b5b1d8f25673f85e02851daf22526i0',
            'https://ordinals.com/content/244c785d6df173f8425d654cfc6d2b006c7bb47a605c7de576ed87022e42c7dfi0',
            'https://ordinals.com/content/a72adee5a07200a623c40831ae5979bc7562b542788c3ded35d9e81e39c6014fi0',
            'https://ordinals.com/content/6a84401579707b76d9b9a77cc461e767f7ea8f08cc0e46dee0d21e5023cdde33i0',
            'https://ordinals.com/content/c6decce29948ea64df9a24e689340c5907b6da207d74d13973fc5ca4dd3bd80ai0',
            'https://ordinals.com/content/83174080310b0ab71c7a725461f3bd9e486bb62727b73134ee2c67f191d9d586i0',
            'https://ordinals.com/content/4f9bed6449d99ef3cbb0fabefac6890c20ef17db2bfe7c07f1386cb43277f220i0',
            'https://ordinals.com/content/e9885c35376ae95dd291bb02075b0763fb3e655d51dc981984130b8366a6d3c8i0',
            'https://ordinals.com/content/34e73ef718034a3c0fdeba53899a2af8ee7771f252c419ab63cd13b0a39f6b10i0',
            'https://ordinals.com/content/435c5c22eaf0c1791e09cb46d56ce942eb312372376abf5b5420200b1424ff7fi0',
            'https://ordinals.com/content/ccf99852fb85d63b5f65124fe506b08c11eb400a7b1da75cd3e0c9538fc49977i0',
            'https://ordinals.com/content/ef8fdd599beee731e06aba4a9ed02d9c7bfe62147b27f6b6deaf22c8c067ab11i0',
            'https://ordinals.com/content/187a8c18ebfe07c18aea0e86cd99b3100474c1c53f56f02ee096723f1a35ce70i0',
            'https://ordinals.com/content/2b6b23199eae0760ee26650a0cc02c49b94fc8fd1f519a95417f0f8478246610i0',
            'https://ordinals.com/content/474f2b0aab9020757826b168ce58725871fd2abb26c6ca805de4b07e314416d1i0',
            'https://ordinals.com/content/1aa69c9d3b451ab3b584dba57ba6d6fedc6e9cb3df6830b9da270e84e51ea72di0',
            'https://ordinals.com/content/81f9e6afc38b8c647d4ea258c29f13b81f6c1a2d40afd9c0a385d03126b4d11di0',
            'https://ordinals.com/content/4c40da69e783cfa96d2900bd15622c1ea60ad31e8ce9459cec13d155f39c463fi0'
        ];
        const ogAudienceDropdown = createDropdown('Og audience samples:', ogSampleUrls);
        idModalContent.appendChild(ogAudienceDropdown);
    
        // Event listener for the dropdown
        ogAudienceDropdown.querySelector('select').addEventListener('change', (event) => {
            const selectedUrl = event.target.value;
            fetchAudio(selectedUrl, index); // Pass the selected URL and channel index to fetch and process the audio
        });
    
        // Add Load and Cancel buttons with unique class names for styling
       // Inside the openModal function
        idModalContent.appendChild(createButton('Load Sample ID', () => {
            handleLoad(index, audionalInput, ipfsInput, fileInput, idModal, loadSampleButton, ogAudienceDropdown);
            const selectedUrl = ogAudienceDropdown.querySelector('select').value;
            const channelIndex = index; // Assuming index represents the channel index
            window.unifiedSequencerSettings.updateProjectChannelNamesUI(channelIndex, selectedUrl); // Update project channel names UI after loading the sample
        }, 'loadButton', 'Load Audio from ID'));
        idModalContent.appendChild(createButton('Cancel', () => document.body.removeChild(idModal), 'cancelButton', 'Close this window'));
    
        // Add the 'Search Ordinal Audio Files' button with a unique class name and tooltip
        const searchOrdinalButton = createExternalLinkButton('Search Ordinal Audio Files', 'https://ordinals.hiro.so/inscriptions?f=audio&s=genesis_block_height&o=asc', 'searchButton', 'Search for audio files (Copy and paste the Ordinal ID to load a sample');
        idModalContent.appendChild(searchOrdinalButton);
    
        document.body.appendChild(idModal);
    }

    function updateChannelURL(index, newURL) {
        window.unifiedSequencerSettings.settings.masterSettings.channelURLs[index] = newURL;
        console.log(`[UpdateChannelURL] Updated channel ${index} URL to ${newURL}`);
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
    
    function handleLoad(index, audionalInput, ipfsInput, fileInput, idModal, loadSampleButton, ogAudienceDropdown) {
        console.log(`[HTML Debugging] [handleLoad] Called with index: ${index}`);
        let url = '';
    
        // Determine the URL from the highest priority input that has a value
        if (audionalInput.value) {
            url = 'https://ordinals.com/content/' + audionalInput.value;
        } else if (ipfsInput.value) {
            url = 'https://ipfs.io/ipfs/' + ipfsInput.value;
        } else if (fileInput.files.length > 0) {
            url = URL.createObjectURL(fileInput.files[0]);
        } else if (ogAudienceDropdown.querySelector('select').value) {
            url = ogAudienceDropdown.querySelector('select').value;
        }
    
        if (url) {
            fetchAudio(url, index).then(() => {
                console.log(`[HTML Debugging] [handleLoad] Audio loaded for channel ${index}: ${url}`);
                closeAndCleanupModal(idModal);
            }).catch(error => {
                console.error(`[HTML Debugging] [handleLoad] Error loading audio for URL ${url}:`, error);
                alert("Failed to load audio data. Please check the console for more details.");
            });
        } else {
            console.error("[HTML Debugging] [handleLoad] No input value or file selected.");
            alert("Please enter an ID or select a file.");
        }
    }
    
    
    
    function extractNameFromURL(url) {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1] || 'New Sample';
    }
    
    
    
    // Function to remove the modal from the DOM
    function closeAndCleanupModal(idModal) {
        if (document.body.contains(idModal)) {
            document.body.removeChild(idModal);
            console.log('Modal removed successfully');
        } else {
            console.error('Failed to remove modal: it is not a child of document.body', idModal);
        }
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
    
    


    function updateModalButtonText(button, index) {
        const channelName = window.unifiedSequencerSettings.settings.masterSettings.projectChannelNames[index];
        if (channelName) {
            button.textContent = channelName;
        } else {
            button.textContent = `Load new audience (${index})`;
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


