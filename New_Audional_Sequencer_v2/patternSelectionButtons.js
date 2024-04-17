// patternSelectionButtons.js

document.addEventListener('DOMContentLoaded', function () {
    const patternButtons = document.querySelectorAll('.fwd-pattern-selection');
    const shiftButtons = document.querySelectorAll('.pattern-shift-right');

    if (patternButtons.length === 0) {
        console.error('Pattern selection buttons not found!');
        return;
    }

    const shiftCounts = new Array(patternButtons.length).fill(0); // Shift count state for each channel

    patternButtons.forEach((patternButton, channelIndex) => {
        let clickCount = 0;

        patternButton.addEventListener('click', function () {
            const currentSequence = window.unifiedSequencerSettings.getCurrentSequence(); // Current sequence
            clickCount = (clickCount + 1) % 7; // Cycle through 0 to 6
            const numSteps = window.unifiedSequencerSettings.settings.masterSettings.projectSequences[`Sequence${currentSequence}`][`ch${channelIndex}`].steps.length;

            // Reset shift on 'all active' selection
            if (clickCount === 1) { 
                shiftCounts[channelIndex] = 0;
            }

            const newStepStates = Array(numSteps).fill(false); // Prepare an array to hold new states

            for (let i = 0; i < numSteps; i++) {
                let isActive = false;
                switch (clickCount) {
                    case 1: isActive = true; break;                        // All steps active
                    case 2: isActive = i % 2 === 0; break;                 // Every second step active
                    case 3: isActive = i % 4 === 0; break;                 // Every fourth step active
                    case 4: isActive = i % 8 === 0; break;                 // Every eighth step active
                    case 5: isActive = i % 16 === 0; break;                // Every sixteenth step active
                    case 6: isActive = false; break;                       // Clear all steps
                    default: break;
                }
                // Apply the shift when assigning to the new array
                let targetIndex = (i + shiftCounts[channelIndex]) % numSteps;
                newStepStates[targetIndex] = isActive;
            }

            // Update steps with the new states, ensuring wrapping without affecting other sequences
            for (let i = 0; i < numSteps; i++) {
                window.unifiedSequencerSettings.updateStepStateAndReverse(currentSequence, channelIndex, i, newStepStates[i], false);
                const buttonId = `Sequence${currentSequence}-ch${channelIndex}-step-${i}`;
                const button = document.getElementById(buttonId);
                if (button) {
                    updateButtonState(button, currentSequence, channelIndex, i);
                }
            }

            console.log(`Pattern applied for channel ${channelIndex} with click count: ${clickCount}`);
        });
    });

    shiftButtons.forEach((shiftButton, channelIndex) => {
        shiftButton.addEventListener('click', () => {
            const currentSequence = window.unifiedSequencerSettings.getCurrentSequence();
            const numSteps = window.unifiedSequencerSettings.settings.masterSettings.projectSequences[`Sequence${currentSequence}`][`ch${channelIndex}`].steps.length;

            // Retrieve current states and prepare to shift
            const currentStates = [];
            for (let i = 0; i < numSteps; i++) {
                const isActive = window.unifiedSequencerSettings.getStepState(currentSequence, channelIndex, i);
                currentStates.push(isActive);
            }

            // Shift states to the right
            const newStates = new Array(numSteps).fill(false);
            for (let i = 0; i < numSteps; i++) {
                newStates[(i + 1) % numSteps] = currentStates[i]; // Shift right logic
            }

            // Apply the new shifted states to both the backend and UI
            for (let i = 0; i < numSteps; i++) {
                window.unifiedSequencerSettings.updateStepStateAndReverse(currentSequence, channelIndex, i, newStates[i], false);
                const buttonId = `Sequence${currentSequence}-ch${channelIndex}-step-${i}`;
                const button = document.getElementById(buttonId);
                if (button) {
                    updateButtonState(button, currentSequence, channelIndex, i);
                }
            }

            console.log(`Pattern shifted right for channel ${channelIndex}.`);
        });
    });
});
