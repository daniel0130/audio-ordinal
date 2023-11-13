
// eventListeners.js

document.addEventListener("DOMContentLoaded", function() {
    let saveFileInput = document.getElementById('save-file-input');
    let loadFileInput = document.getElementById('load-file-input');
    let loadButton = document.getElementById('load-button');
    let loadOptions = document.getElementById('loadOptions');
    let loadJson = document.getElementById('loadJson');
    let loadInternalPreset = document.getElementById('loadInternalPreset');

    saveButton.addEventListener('click', () => {
      let { settings, filename } = exportSettings();
  
      // Create a Blob with the settings
      let blob = new Blob([settings], { type: 'application/json' });
  
      // Create a download link for the Blob
      let url = URL.createObjectURL(blob);
      let downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
  
      // Trigger a click on the download link
      downloadLink.click();
    });
    
  
  
    loadButton.addEventListener('click', () => {
        if (loadOptions.style.display === "none" || loadOptions.style.display === "") {
            loadOptions.style.display = "block";
        } else {
            loadOptions.style.display = "none";
        }
    });
  
    loadJson.addEventListener('click', () => {
        loadFileInput.click();
        loadOptions.style.display = "none"; // Hide the menu after selection
    });

    loadInternalPreset.addEventListener('click', () => {
        fetch('16channelBetaSequencer/allSequencesEmbedded.json')
            .then(response => response.json())
            .then(data => {
                // Now, data contains the content of the JSON file.
                // Assuming importSettings is the function that processes this data:
                importSettings(JSON.stringify(data)); 
            })
            .catch(error => {
                console.error("Error loading the internal preset:", error);
            });
    
        loadOptions.style.display = "none"; // Hide the menu after selection
    });
    
  
  loadFileInput.addEventListener('change', () => {
      let file = loadFileInput.files[0];
      let reader = new FileReader();
      reader.onload = function(e) {
          let settings = e.target.result;
          importSettings(settings);
          console.log("Loaded file content:", settings);

      };
      reader.readAsText(file);
  });
});

  // Listen for messages
  window.addEventListener('message', function(event) {
    // If a 'load' command is received, load the song
    if (event.data.command === 'load') {
        fetch(event.data.path)
            .then(response => response.json())
            .then(song => loadSong(song));
    }
    // If a 'play' command is received, start the sequencer
    else if (event.data.command === 'play') {
        startScheduler();
    }
    // If a 'stop' command is received, stop the sequencer
    else if (event.data.command === 'stop') {
        stopScheduler();
    }
    // If a 'pause' command is received, pause the sequencer
    else if (event.data.command === 'pause') {
        pauseScheduler();
    }
});



// Assuming each channel has a button with a class 'open-audio-trimmer'
document.querySelectorAll('.open-audio-trimmer').forEach(button => {
    button.addEventListener('click', function(event) {
        // Get the channel element. This depends on your HTML structure.
        const channelElement = event.target.closest('.channel');
        const ordinalId = channelElement.dataset.id; // Or however you determine the ordinal ID

        // Display the modal
        const modal = document.getElementById('audio-trimmer-modal');
        modal.style.display = 'block';

        // Instantiate the Audio Trimmer
        const audioTrimmer = new AudioTrimmer({
            target: document.getElementById('audio-trimmer-container'),
            props: {
                externalAudioContext: audioContext, // Assuming audioContext is globally accessible
                externalOrdinalId: ordinalId
            }
        });
    });
});


// Close the modal when the user clicks on <span> (x)
document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('audio-trimmer-modal').style.display = 'none';
});

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function(event) {
    const modal = document.getElementById('audio-trimmer-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

