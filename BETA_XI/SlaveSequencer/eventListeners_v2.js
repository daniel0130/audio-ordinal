// eventListeners_v2.js

const appContainer = document.getElementById('drum-machine'); // Adjust the ID as per your HTML
appContainer.addEventListener('click', () => {
    window.unifiedSequencerSettings.audioContext.resume().then(() => {
        console.log('Playback resumed successfully');
    });
});


document.addEventListener("DOMContentLoaded", function() {
    let saveButton = document.getElementById('save-button');
    let loadFileInput = document.getElementById('load-file-input');
    let loadButton = document.getElementById('new-load-button');
    let loadOptions = document.getElementById('loadOptions');
    let loadJson = document.getElementById('loadJson');
    let loadInternalPreset1 = document.getElementById('loadInternalPreset1');
    let loadInternalPreset2 = document.getElementById('loadInternalPreset2');
    let loadInternalPreset3 = document.getElementById('loadInternalPreset3');
    // let loadInternalPreset4 = document.getElementById('loadInternalPreset4');
    // let loadInternalPreset5 = document.getElementById('loadInternalPreset5');
    // let loadButtonClicked = false; // Flag to track if the load button is clicked

    // Create and append the Cancel button
    let cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.id = 'cancel-load-button';
    cancelButton.style.display = 'block'; // Display as block element
    loadOptions.appendChild(cancelButton);

    // Cancel button event listener
    cancelButton.addEventListener('click', () => {
        loadOptions.style.display = "none"; // Hide the load options
        console.log('[Save/Load debug] Cancel button clicked');
    });


    // Previous Sequence Button
document.getElementById('prev-sequence').addEventListener('click', function() {
    let currentSequence = window.unifiedSequencerSettings.getCurrentSequence();
    let totalSequences = Object.keys(window.unifiedSequencerSettings.settings.masterSettings.projectSequences).length;
    let prevSequence = (currentSequence - 1 + totalSequences) % totalSequences;

    // Pass currentStep to handle sequence transition
    handleSequenceTransition(prevSequence, currentStep);
});

// Next Sequence Button
document.getElementById('next-sequence').addEventListener('click', function() {
    let currentSequence = window.unifiedSequencerSettings.getCurrentSequence();
    let totalSequences = Object.keys(window.unifiedSequencerSettings.settings.masterSettings.projectSequences).length;
    let nextSequence = (currentSequence + 1) % totalSequences;

    // Pass currentStep to handle sequence transition
    handleSequenceTransition(nextSequence, currentStep);
});


    saveButton.addEventListener('click', () => {
        let settings = window.unifiedSequencerSettings.exportSettings();
    
        // Create a Blob with the settings
        let blob = new Blob([settings], { type: 'application/json' });
    
        // Create a download link for the Blob
        let url = URL.createObjectURL(blob);
        let downloadLink = document.createElement('a');
        downloadLink.href = url;
    
        // Use projectName from the settings for the file name
        let projectName = window.unifiedSequencerSettings.settings.masterSettings.projectName;
        downloadLink.download = `${projectName}_AUDX.json`;
    
        // Trigger a click on the download link
        downloadLink.click();
    });

    loadButton.addEventListener('click', () => {
        console.log('[Save/Load debug] Load button clicked');
        // Toggle the display of the load options menu
        const loadOptionsVisible = loadOptions.style.display === "block";
        loadOptions.style.display = loadOptionsVisible ? "none" : "block";
    
        if (!loadOptionsVisible) {
            // Position the load menu underneath the load button
            const rect = loadButton.getBoundingClientRect();
            loadOptions.style.position = 'absolute';
            loadOptions.style.left = `${rect.left}px`; // Align with the left edge of the button
            loadOptions.style.top = `${rect.bottom + window.scrollY}px`; // Place it directly below the button
        }
    });

    

    loadJson.addEventListener('click', () => {
        console.log('[Save/Load debug] loadJson clicked');

        loadFileInput.click();
        loadOptions.style.display = "none";
    });

    async function loadSettingsAndFetchAudio(jsonSettings) {
        console.log("[UnifiedLoad] Settings Loaded:", jsonSettings);
        window.unifiedSequencerSettings.loadSettings(jsonSettings);
    
        // Determine the correct URLs array to use (handling both cases)
        let urls = jsonSettings.channelURLs || jsonSettings.projectURLs; 
        if (urls && Array.isArray(urls)) {
            console.log("[UnifiedLoad] Found URLs:", urls);
            for (let i = 0; i < urls.length; i++) {
                const url = urls[i];
                if (url) {
                    console.log(`[UnifiedLoad] Processing URL ${i}: ${url}`);
                    const loadSampleButtonElement = document.getElementById(`load-sample-button-${i}`);
                    await fetchAudio(url, i, loadSampleButtonElement);
                }
            }
        }
    }

    loadFileInput.addEventListener('change', () => {
        console.log('[Save/Load debug] loadFileInput change event');
        let file = loadFileInput.files[0];
        let reader = new FileReader();
        reader.onload = async function(e) {
            console.log("File read start");
            let loadedSettings = JSON.parse(e.target.result);
            console.log("[loadFileInput] File content:", loadedSettings);
    
            // Using the unified function
            await loadSettingsAndFetchAudio(loadedSettings);
        };
    
        reader.readAsText(file);
    });
    
    
    

    function loadPresetFromFile(filePath) {
        console.log('[Save/Load Debug] loadPresetFromFile called');
        console.log(`[internalPresetDebug] Loading preset from: ${filePath}`);
        fetch(filePath)
            .then(response => response.json())
            .then(async jsonSettings => {
                console.log("[internalPresetDebug] JSON settings fetched:", jsonSettings);
    
                // Using the unified function
                await loadSettingsAndFetchAudio(jsonSettings);
            })
            .catch(error => console.error(`[internalPresetDebug] Error loading preset from ${filePath}:`, error));
        loadOptions.style.display = "none";
    }
    
    
    
    loadInternalPreset1.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/BeBased_OB1.json'));
    loadInternalPreset2.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/FREEDOM_to_TRANSACT.json'));
    loadInternalPreset3.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/OB1_PresetTemplate.json'));
    // Additional presets can be added in the same manner
    
    // loadInternalPreset4.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/internalPreset4.json'));
    // loadInternalPreset5.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/Koto2.json'));
});

// Message event listener handling load, play, stop, pause commands
// window.addEventListener('message', function(event) {
//     // Implementation for handling 'load', 'play', 'stop', and 'pause' commands
// });


// Close the modal when the user clicks on <span> (x)
document.querySelector('.close-button').addEventListener('click', function() {
    console.log('Close button clicked');
    document.getElementById('audio-trimmer-modal').style.display = 'none';
    console.log('Modal closed');
});

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    const modal = document.getElementById('audio-trimmer-modal');
    if (event.target === modal) {
        console.log('Clicked outside the modal');
        modal.style.display = 'none';
        console.log('Modal closed');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const projectNameInput = document.getElementById('project-name');

    projectNameInput.addEventListener('input', () => {
        const projectName = projectNameInput.value.trim();
        
        // Update the global settings with the new project name
        window.unifiedSequencerSettings.updateSetting('projectName', projectName);

        // Check if the project name is empty and handle accordingly
        if (!projectName) {
            // Handle the case where no project name is provided
            // For example, you might want to set a default name or display a placeholder
            projectNameInput.value = "Default Project Name"; // Example placeholder
        }
    });
});




    // loadFileInput.addEventListener('change', () => {
    //     console.log('[Save/Load debug] loadFileInput change event');
    //     let file = loadFileInput.files[0];
    //     let reader = new FileReader();
    //     reader.onload = async function(e) {
    //         console.log("File read start");
    //         let loadedSettings = JSON.parse(e.target.result);
    //         console.log("[loadFileInput] File content:", loadedSettings);
        
    //         // Load new settings and update UI
    //         window.unifiedSequencerSettings.loadSettings(loadedSettings);

    
    //         // Fetch audio for each URL in the loaded settings
    //         if (loadedSettings.channelURLs && Array.isArray(loadedSettings.channelURLs)) {
    //             for (let i = 0; i < loadedSettings.channelURLs.length; i++) {
    //                 const url = loadedSettings.channelURLs[i];
    //                 if (url) {
    //                     // Continue with the existing logic to call fetchAudio
    //                     const loadSampleButtonElement = document.getElementById(`load-sample-button-${i}`);
    //                     await fetchAudio(url, i, loadSampleButtonElement);
    //                 }
    //             }
    //         }
            
    //     };
    
    //     reader.readAsText(file);
    // });
    