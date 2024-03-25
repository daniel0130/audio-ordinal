// eventListeners_v2.js

const appContainer = document.getElementById('drum-machine'); // Adjust the ID as per your HTML
appContainer.addEventListener('click', () => {
    audioContext.resume().then(() => {
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
    let loadInternalPreset4 = document.getElementById('loadInternalPreset4');
    let loadInternalPreset5 = document.getElementById('loadInternalPreset5');

    let loadButtonClicked = false; // Flag to track if the load button is clicked

    

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
        downloadLink.download = `AUDX - Seq Settings - ${projectName}.json`;
    
        // Trigger a click on the download link
        downloadLink.click();
    });

    loadButton.addEventListener('click', () => {
        console.log('[Save/Load debug] Load button clicked');
        if (!loadButtonClicked) {
            // Remove the "smooth-wave" class when the button is clicked for the first time
            loadButton.classList.remove('smooth-wave');
            
            // Remove the animation property to stop the animation
            loadButton.style.animation = 'none';
    
            loadButtonClicked = true; // Set the flag to true
        }
        loadOptions.style.display = loadOptions.style.display === "none" || loadOptions.style.display === "" ? "block" : "none";
    });
    

    loadJson.addEventListener('click', () => {
        console.log('[Save/Load debug] loadJson clicked');

        loadFileInput.click();
        loadOptions.style.display = "none";
    });

    loadFileInput.addEventListener('change', () => {
        console.log('[Save/Load debug] loadFileInput change event');
        let file = loadFileInput.files[0];
        let reader = new FileReader();
        reader.onload = async function(e) {
            console.log("File read start");
            let loadedSettings = JSON.parse(e.target.result);
            console.log("[loadFileInput] File content:", loadedSettings);
        
            // Load new settings and update UI
            window.unifiedSequencerSettings.loadSettings(loadedSettings);

    
            // Fetch audio for each URL in the loaded settings
            if (loadedSettings.projectURLs && Array.isArray(loadedSettings.projectURLs)) {
                for (let i = 0; i < loadedSettings.projectURLs.length; i++) {
                    const url = loadedSettings.projectURLs[i];
                    if (url) {
                        // Call fetchAudio for each URL
                        // Assuming you have a way to get the corresponding loadSampleButtonElement
                        const loadSampleButtonElement = document.getElementById(`load-sample-button-${i}`);
                        await fetchAudio(url, i, loadSampleButtonElement);
                    }
                }
            }
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
                window.unifiedSequencerSettings.loadSettings(jsonSettings);
    
                if (jsonSettings.projectURLs && Array.isArray(jsonSettings.projectURLs)) {
                    console.log("[internalPresetDebug] Found project URLs:", jsonSettings.projectURLs);
                    for (let i = 0; i < jsonSettings.projectURLs.length; i++) {
                        const url = jsonSettings.projectURLs[i];
                        if (url) {
                            console.log(`[internalPresetDebug] Processing URL ${i}: ${url}`);
                            const loadSampleButtonElement = document.getElementById(`load-sample-button-${i}`);
                            await fetchAudio(url, i, loadSampleButtonElement);
                        }
                    }
                }
            })
            .catch(error => console.error(`[internalPresetDebug] Error loading preset from ${filePath}:`, error));
        loadOptions.style.display = "none";
    }
    
    
    
    loadInternalPreset1.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/Vitalik Ordinals Remix.json'));
    loadInternalPreset2.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/Koto Strings.json'));
    loadInternalPreset3.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/Drums and Beats.json'));
    // loadInternalPreset4.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/internalPreset4.json'));
    // loadInternalPreset5.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/Koto2.json'));
});

// Message event listener handling load, play, stop, pause commands
window.addEventListener('message', function(event) {
    // Implementation for handling 'load', 'play', 'stop', and 'pause' commands
});


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
