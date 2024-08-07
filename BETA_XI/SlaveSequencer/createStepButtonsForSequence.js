function createStepButtonsForSequence() {
    console.log("[createStepButtonsForSequence] [SeqDebug] Entered");
    let currentSequence = window.unifiedSequencerSettings.getCurrentSequence();
    console.log(`[createStepButtonsForSequence] [SeqDebug] Creating buttons for currentSequence ${currentSequence}`);

    channels.forEach((channel, channelIndex) => {
        const stepsContainer = channel.querySelector('.steps-container');
        stepsContainer.innerHTML = '';

        for (let i = 0; i < 64; i++) {
            const button = document.createElement('button');
            button.classList.add('step-button');
            button.id = `Sequence${currentSequence}-ch${channelIndex}-step-${i}`;

            // Initialize button state based on current settings
            updateButtonState(button, currentSequence, channelIndex, i);

            // Left-click Listener: Toggle activation (selected state)
            button.addEventListener('click', (e) => {
                if (e.shiftKey) {
                    // Shift + Click: Open settings menu
                    openStepSettingsMenu(button, currentSequence, channelIndex, i);
                } else {
                    // Regular Click: Toggle activation
                    toggleStepActivation(button, currentSequence, channelIndex, i);
                }
            });

            // Right-click Listener: Toggle reverse state
            button.addEventListener('contextmenu', (e) => {
                e.preventDefault(); // Prevent the context menu
                toggleStepReverse(button, currentSequence, channelIndex, i);
            });

            stepsContainer.appendChild(button);
        }
    });
}


function toggleStepActivation(button, sequence, channelIndex, stepIndex) {
    const { isActive, isReverse } = window.unifiedSequencerSettings.getStepStateAndReverse(sequence, channelIndex, stepIndex);
    // Toggle active state, deactivate reverse if activating
    window.unifiedSequencerSettings.updateStepStateAndReverse(sequence, channelIndex, stepIndex, !isActive, isActive ? isReverse : false);
    console.log(`[SeqDebug] toggleStepActivation: Sequence ${sequence}, Channel ${channelIndex}, Step ${stepIndex} toggled to ${!isActive}`);
    updateButtonState(button, sequence, channelIndex, stepIndex);
}

function toggleStepReverse(button, sequence, channelIndex, stepIndex) {
    const { isActive, isReverse } = window.unifiedSequencerSettings.getStepStateAndReverse(sequence, channelIndex, stepIndex);
    // Toggle reverse state, deactivate active if reversing
    window.unifiedSequencerSettings.updateStepStateAndReverse(sequence, channelIndex, stepIndex, isReverse ? isActive : false, !isReverse);
    console.log(`[SeqDebug] toggleStepReverse: Sequence ${sequence}, Channel ${channelIndex}, Step ${stepIndex} reversed to ${!isReverse}`);
    updateButtonState(button, sequence, channelIndex, stepIndex);
}

function updateButtonState(button, sequence, channelIndex, stepIndex) {
    const { isActive, isReverse } = window.unifiedSequencerSettings.getStepStateAndReverse(sequence, channelIndex, stepIndex);
    button.classList.toggle('selected', isActive);
    button.classList.toggle('reverse-playback', isReverse);
    button.style.backgroundColor = ''; // Reset
    if (isActive) button.style.backgroundColor = 'red';
    if (isReverse) button.style.backgroundColor = 'green';
    console.log(`[SeqDebug] updateButtonState: Sequence ${sequence}, Channel ${channelIndex}, Step ${stepIndex} - Active: ${isActive}, Reverse: ${isReverse}`);
}

document.addEventListener('DOMContentLoaded', createStepButtonsForSequence);