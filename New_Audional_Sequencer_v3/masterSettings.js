const bpmSlider = document.getElementById('bpm-slider');
const bpmDisplay = document.getElementById('bpm-display');

// Initialize BPM from global settings
const initialBPM = window.unifiedSequencerSettings.getBPM();
console.log(`Initial BPM from global settings: ${initialBPM}`);
bpmSlider.value = initialBPM;
bpmDisplay.textContent = initialBPM;

bpmSlider.addEventListener('input', () => {
    const newBPM = bpmSlider.value;
    bpmDisplay.textContent = newBPM;

    // Update the global settings object
    updateGlobalBPM(parseInt(newBPM));

    // Log the new BPM value
    console.log(`Updated BPM: ${newBPM}`);

    // Send BPM to external modules if necessary
    emitMessage('BPMUpdate', newBPM);

    // Additional logging to verify the updated value in global settings
    const updatedBPM = window.unifiedSequencerSettings.getBPM();
    console.log(`BPM in global settings after update: ${updatedBPM}`);
});

function updateGlobalBPM(bpm) {
    // Assuming there's a method in your global settings object to update BPM
    window.unifiedSequencerSettings.setBPM(bpm);
    console.log(`Global BPM updated to: ${bpm}`);
}
