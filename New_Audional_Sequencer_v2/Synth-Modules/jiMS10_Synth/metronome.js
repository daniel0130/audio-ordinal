// metronome.js

// Variable to store the interval ID
let metronomeInterval = null;
let isMetronomeActive = false;

// Function to play a click sound
function playClick() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  // Configure oscillator for a simple click sound
  oscillator.type = 'square';
  gainNode.gain.value = 0.5;
  oscillator.frequency.value = 10000;

  oscillator.start();
  // Stop the oscillator after a short time to create a click sound
  oscillator.stop(audioContext.currentTime + 0.01);
}

// Function to start the metronome
function startMetronome(bpm) {
    const intervalTime = 60000 / bpm;  // milliseconds per beat
    if (metronomeInterval === null && isMetronomeActive) {
      playClick();  // Play initial click right when started
      metronomeInterval = setInterval(playClick, intervalTime);
    }
  }

// Function to stop the metronome
function stopMetronome() {
  if (metronomeInterval !== null) {
    clearInterval(metronomeInterval);
    metronomeInterval = null;
  }
}

// Toggle function for the metronome
function toggleMetronomeActivation() {
    // Toggle the active state of the metronome
    isMetronomeActive = !isMetronomeActive;
    // Toggle the 'active' class on the button for visual feedback
    this.classList.toggle('active');

    // Logging for debugging
    console.log('Metronome: ' + (isMetronomeActive ? 'ON' : 'OFF'));
}

// Event listener for the metronome button
document.getElementById('metronomeButton').addEventListener('click', function() {
    toggleMetronomeActivation.call(this);  // Ensure 'this' refers to the button
});