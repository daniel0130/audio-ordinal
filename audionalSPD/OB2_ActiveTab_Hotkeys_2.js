// OB1_ActiveTab_Hotkeys_2.js

// Global scope variables
let isMuted = false;
let previousVolume = 1; // Default volume level before any muting
let multiplierCount = 0; // Move the multiplier count to the global scope

// Event listener for keydown event
document.addEventListener('keydown', handleKeyDownEvent);

// Function to handle keydown event
function handleKeyDownEvent(event) {
    const currentTime = audioContext.currentTime;
    const fadeDuration = 0.03; // Fast fade duration in seconds

    // Adjust scheduling multiplier, BPM Adjustment, and reset scheduling multiplier with '0'
    adjustControls(event);

    // Gain adjustment with smooth fade and Toggle mute/unmute
    adjustVolumeAndToggleMute(event, currentTime, fadeDuration);
}

// Function to adjust scheduling multiplier, BPM, and reset multiplier
function adjustControls(event) {
    const multiplierEvent = new CustomEvent('multiplierChange', { detail: { multiplier: 1 } });
    const bpmEvent = new CustomEvent('bpmChange', { detail: { adjustment: 0 } });

    if (event.key === '+' && event.shiftKey && !event.ctrlKey) {
        bpmEvent.detail.adjustment = 1;
    } else if (event.key === '_' && event.shiftKey && !event.ctrlKey) {
        bpmEvent.detail.adjustment = -1;
    } else if (event.key === '=' && event.shiftKey && event.ctrlKey) {
        bpmEvent.detail.adjustment = 10;
    } else if (event.key === '_' && event.shiftKey && event.ctrlKey) {
        bpmEvent.detail.adjustment = -10;
    } else if ((event.key === '=' || event.key === '-') && !event.shiftKey && !event.ctrlKey) {
        multiplierCount++;
        multiplierEvent.detail.multiplier = (event.key === '=') ? 2 : 0.5;
        console.log(`Dispatching multiplierChange event, multiplier: ${multiplierEvent.detail.multiplier}`);
    } else if (event.key === '0' && !event.shiftKey && !event.ctrlKey) {
        // Always dispatch the event when '0' is pressed to reset the multiplier
        multiplierEvent.detail.multiplier = 1; // Reset action
        console.log(`Resetting multiplier to initial value: 1`);
        document.dispatchEvent(multiplierEvent); // Dispatch without condition
    }

    if (multiplierEvent.detail.multiplier !== 1) {
        document.dispatchEvent(multiplierEvent);
    }

    if (bpmEvent.detail.adjustment !== 0) {
        console.log(`Dispatching bpmChange event, adjustment: ${bpmEvent.detail.adjustment}`);
        document.dispatchEvent(bpmEvent);
    }
}

// Function to adjust volume with smooth fade and Toggle mute/unmute
function adjustVolumeAndToggleMute(event, currentTime, fadeDuration) {
    if ((event.key === ',' || event.key === '.') && !event.shiftKey && !event.ctrlKey) {
        const direction = (event.key === ',') ? -0.1 : 0.1;
        const newGainValue = Math.min(2, Math.max(0, gainNode.gain.value + direction));
        previousVolume = newGainValue;
        applyVolumeFade(newGainValue, currentTime, fadeDuration);
    } else if (event.key === 'm' && !event.shiftKey && !event.ctrlKey) {
        if (isMuted) {
            applyVolumeFade(previousVolume, currentTime, fadeDuration);
            isMuted = false;
            console.log("Unmuted");
        } else {
            previousVolume = gainNode.gain.value;
            applyVolumeFade(0, currentTime, fadeDuration);
            isMuted = true;
            console.log("Muted");
        }
    }
}

// Function to apply volume fade
function applyVolumeFade(targetGainValue, currentTime, fadeDuration) {
    gainNode.gain.setValueAtTime(gainNode.gain.value, currentTime);
    gainNode.gain.linearRampToValueAtTime(targetGainValue, currentTime + fadeDuration);
    console.log(`Volume adjusted, target gain: ${targetGainValue}`);
}

