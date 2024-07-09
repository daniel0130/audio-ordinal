// audioContext.js

export const context = new (window.AudioContext || window.webkitAudioContext)();
export let currentOscillator = null;
let isMuted = true;  // Initialize isMuted as true
const mainGainNode = context.createGain();
mainGainNode.connect(context.destination);

// Initialize the main gain node to a muted volume
mainGainNode.gain.setValueAtTime(0, context.currentTime);

// Function to resume audio context on any click
const resumeAudioContext = async () => {
  if (context.state === 'suspended') {
    await context.resume();
    console.log('AudioContext resumed.');
  }
};

document.addEventListener('click', resumeAudioContext);

export function playMS10TriangleBass(frequency = null) {
  playOscillatorWithEnvelope(frequency, false);
}

export function stopMS10TriangleBass() {
  console.log('stopMS10TriangleBass entered');
  if (currentOscillator) {
    console.log('currentOscillator exists');
    currentOscillator.stop(context.currentTime + 0.01);
    console.log('currentOscillator stopped');
    currentOscillator.disconnect();
    currentOscillator = null;
    console.log('currentOscillator set to null');
  }
}

function createOscillator(type, frequency) {
  const oscillator = context.createOscillator();
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);

  if (type === 'pulse') {
    // Custom pulse wave using periodic wave
    const real = new Float32Array([0, 1, 0, 1, 0.75]); // Adjusted for more harmonics
    const imag = new Float32Array(real.length);
    const wave = context.createPeriodicWave(real, imag);
    oscillator.setPeriodicWave(wave);
  } else {
    oscillator.type = type;
  }

  return oscillator;
}

function setupGainNode(attack, release, volume) {
  const gainNode = context.createGain();
  // Always start with a near-zero volume to avoid clicks
  gainNode.gain.setValueAtTime(0.0001, context.currentTime);

  if (attack > 0) {
    // Apply attack ramping if there's an attack value
    gainNode.gain.exponentialRampToValueAtTime(volume, context.currentTime + attack);
  } else {
    // Instantly set to full volume if no attack
    gainNode.gain.setValueAtTime(volume, context.currentTime);
  }

  // Always apply release ramping
  gainNode.gain.setValueAtTime(volume, context.currentTime + attack); // Ensure volume is set after attack
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + attack + release);
  return gainNode;
}

function setupFilterNode(cutoff, resonance) {
  const filterNode = context.createBiquadFilter();
  filterNode.type = 'lowpass';
  filterNode.frequency.value = cutoff;
  filterNode.Q.value = resonance;

  return filterNode;
}

export function playOscillator(frequency = null) {
  playOscillatorWithEnvelope(frequency, false);
}

export function playRampedOscillator(frequency = null) {
  playOscillatorWithEnvelope(frequency, true);
}

function playOscillatorWithEnvelope(frequency = null, ramped = false) {
  // Check if muted and return if true
  if (isMuted) {
    console.log('Synth is muted, not playing oscillator.');
    return;
  }

  if (currentOscillator) {
    currentOscillator.stop();
    currentOscillator = null;
  }

  const waveform = document.getElementById('waveform').value;
  const noteFrequency = frequency !== null ? frequency : parseFloat(document.getElementById('note').value);

  if (!isFinite(noteFrequency)) {
    console.error('Invalid frequency value:', noteFrequency);
    return;
  }

  const attack = document.getElementById('attack').value / 1000;
  const release = document.getElementById('release').value / 1000;
  const cutoff = document.getElementById('cutoff').value;
  const resonance = document.getElementById('resonance').value;
  const volume = document.getElementById('volume').value / 100;

  const isRampedWaveform = waveform.startsWith('ramped');
  const oscillatorType = isRampedWaveform ? waveform.replace('ramped', '').toLowerCase() : waveform;

  const oscillator = createOscillator(oscillatorType, noteFrequency);
  const gainNode = setupGainNode(attack, release, volume, ramped);
  const filterNode = setupFilterNode(cutoff, resonance);

  oscillator.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(mainGainNode); // Connect to main gain node

  // Start the oscillator slightly later to avoid initial clicks
  oscillator.start(context.currentTime + 0.01);
  oscillator.stop(context.currentTime + attack + release + 0.02);

  currentOscillator = oscillator;
}

export function stopOscillator() {
  if (currentOscillator) {
    currentOscillator.stop(context.currentTime + 0.01); // Stop a tiny bit later to avoid clicks
    currentOscillator = null;
  }
}

export function toggleMute() {
  isMuted = !isMuted;
  mainGainNode.gain.setValueAtTime(isMuted ? 0 : 1, context.currentTime);
  console.log(`Mute ${isMuted ? 'enabled' : 'disabled'}`);

  const muteButton = document.getElementById('mute');
  muteButton.textContent = isMuted ? 'UNMUTE' : 'MUTE';  // Reverse these to match logical mute state
  console.log(`Setting button text to: ${muteButton.textContent}`);

  if (isMuted) {
      muteButton.classList.remove('on');  // Muted should mean not lit
      console.log('Removing class "on" from mute button');
  } else {
      muteButton.classList.add('on');     // Unmuted should mean lit
      console.log('Adding class "on" to mute button');
  }
}


document.getElementById('mute').addEventListener('click', toggleMute);

// Initialize mute button state
window.addEventListener('DOMContentLoaded', () => {
  const muteButton = document.getElementById('mute');
  if (muteButton) {
    muteButton.classList.add('on');
    muteButton.setAttribute('aria-pressed', 'true');
    muteButton.textContent = 'UNMUTE'; // Ensure the text says "UNMUTE"
    isMuted = true;
    mainGainNode.gain.setValueAtTime(0, context.currentTime);
  }
});
