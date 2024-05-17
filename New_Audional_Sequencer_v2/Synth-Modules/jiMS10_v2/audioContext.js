// audioContext.js
export const context = new (window.AudioContext || window.webkitAudioContext)();
export let currentOscillator = null;
let isMuted = false;
const mainGainNode = context.createGain();
mainGainNode.connect(context.destination);

// Initialize the main gain node to a normal volume
mainGainNode.gain.setValueAtTime(1, context.currentTime);

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
  if (currentOscillator) {
    currentOscillator.stop();
    currentOscillator = null;
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

function setupGainNode(attack, release, volume, ramped) {
  const gainNode = context.createGain();
  if (ramped) {
    gainNode.gain.setValueAtTime(0.0001, context.currentTime); // Start from a very low value
    gainNode.gain.exponentialRampToValueAtTime(volume, context.currentTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + attack + release); // Ramp down smoothly
  } else {
    gainNode.gain.setValueAtTime(volume, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + attack + release);
  }
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
  document.getElementById('mute').textContent = isMuted ? 'Unmute' : 'Mute';
}

document.getElementById('mute').addEventListener('click', toggleMute);