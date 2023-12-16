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
    let loadButton = document.getElementById('load-button');
    let loadOptions = document.getElementById('loadOptions');
    let loadJson = document.getElementById('loadJson');
    let loadInternalPreset = document.getElementById('loadInternalPreset');
    let loadInternalPreset2 = document.getElementById('loadInternalPreset2');
    let loadInternalPreset3 = document.getElementById('loadInternalPreset3');
    let loadInternalPreset4 = document.getElementById('loadInternalPreset4');
    let loadInternalPreset5 = document.getElementById('loadInternalPreset5');

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
        loadOptions.style.display = loadOptions.style.display === "none" || loadOptions.style.display === "" ? "block" : "none";
    });

    loadJson.addEventListener('click', () => {
        loadFileInput.click();
        loadOptions.style.display = "none";
    });

    loadFileInput.addEventListener('change', () => {
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
        console.log(`Loading preset from: ${filePath}`);
        fetch(filePath)
            .then(response => response.json())
            .then(jsonSettings => window.unifiedSequencerSettings.loadSettings(jsonSettings))
            .catch(error => console.error(`Error loading preset from ${filePath}:`, error));
        loadOptions.style.display = "none";
    }
    
    loadInternalPreset.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/internalPreset1.json'));
    loadInternalPreset2.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/randomOrdinalSounds2.json'));
    loadInternalPreset3.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/Japanese_Koto_Samples.json'));
    loadInternalPreset4.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/internalPreset4.json'));
    loadInternalPreset5.addEventListener('click', () => loadPresetFromFile('Preset_Json_Files/Koto2.json'));
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
