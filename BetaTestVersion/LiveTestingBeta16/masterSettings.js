const bpmSlider = document.getElementById('bpm-slider');
const bpmDisplay = document.getElementById('bpm-display');

let externalSyncBPM; // Initialize the cloned BPM variable

bpmSlider.addEventListener('input', () => {
  bpm = bpmSlider.value;
  bpmDisplay.textContent = bpm;
  // console.log(`BPM changed to ${bpm}`);

  // Update the cloned BPM variable and send to the external synth module
  externalSyncBPM = bpm;
  window.externalSyncBPM = externalSyncBPM;
  // console.log(`External Sync BPM updated to ${externalSyncBPM}`);

  // Send BPM to external modules
  emitMessage('BPMUpdate', externalSyncBPM);
});
