const bpmSlider = document.getElementById('bpm-slider');
const bpmDisplay = document.getElementById('bpm-display');
bpmSlider.addEventListener('input', () => {
  bpm = bpmSlider.value;
  bpmDisplay.textContent = bpm;
});
