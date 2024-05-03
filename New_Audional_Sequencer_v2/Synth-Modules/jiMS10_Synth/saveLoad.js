
// saveLoad.js - save and load synth settings

function saveSettings() {
    console.log('MIDI Recording at save:', JSON.stringify(midiRecording));
    const settings = {
        note: document.getElementById("note").value,
        waveform: document.getElementById("waveform").value,
        attack: document.getElementById("attack").value,
        release: document.getElementById("release").value,
        cutoff: document.getElementById("cutoff").value,
        resonance: document.getElementById("resonance").value,
        volume: document.getElementById("volume").value,
    };

    // Directly use the midiRecording array
    const fullData = {
        settings: settings,
        midiRecording: midiRecording  // No need to stringify and parse again
    };

    const fullDataStr = JSON.stringify(fullData);
    const blob = new Blob([fullDataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "synth_full_data.json";
    a.click();
}


function loadSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';

    input.onchange = event => {
        const file = event.target.files[0];
        if (!file) {
            console.error("No file selected.");
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const fullData = JSON.parse(e.target.result);
                if (!fullData.settings || !fullData.midiRecording) {
                    console.error("Invalid file format: Missing required data.");
                    return;
                }

                // Load settings
                const settings = fullData.settings;
                const ids = ["note", "waveform", "attack", "release", "cutoff", "resonance", "volume"];
                ids.forEach(id => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.value = settings[id];
                    } else {
                        console.warn(`Element with ID ${id} not found.`);
                    }
                });

                // Load MIDI data
                if (Array.isArray(fullData.midiRecording)) {
                    midiRecording = fullData.midiRecording; // Assuming midiRecording is used for playback
                    console.log('MIDI data successfully loaded and set for playback.', midiRecording);
                } else {
                    console.error("Invalid MIDI data in file.");
                }
            } catch (error) {
                console.error("Error parsing file:", error);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

        
