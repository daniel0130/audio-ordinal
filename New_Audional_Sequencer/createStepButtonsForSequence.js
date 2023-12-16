// createStepButtonsforSequence.js

// Function to create step buttons for a given sequence
function createStepButtonsForSequence() {
    console.log("[createStepButtonsForSequence] [SeqDebug] entered");
    channels.forEach((channel, channelIndex) => {
        const stepsContainer = channel.querySelector('.steps-container');
        stepsContainer.innerHTML = '';
    
        let currentSequence = window.unifiedSequencerSettings.settings.masterSettings.currentSequence;
        let firstButtonId, lastButtonId;
    
        for (let i = 0; i < 64; i++) {
            const button = document.createElement('button');
            button.classList.add('step-button');
            button.id = `Sequence${currentSequence}-ch${channelIndex}-step-${i}`;

            // Store the IDs of the first and last buttons
            if (i === 0) firstButtonId = button.id;
            if (i === 63) lastButtonId = button.id;
            
            button.addEventListener('click', () => {
                let currentSequence = window.unifiedSequencerSettings.settings.masterSettings.currentSequence;
               
                // Toggle the step state in the global object
                let currentStepState = window.unifiedSequencerSettings.getStepState(currentSequence, channelIndex, i);
                console.log(`[SeqDebug] [setting currentStepState using getStepState to: ${currentSequence}, Channel ${channelIndex}, Step ${i}, New State: ${!currentStepState}`);
                window.unifiedSequencerSettings.updateStepState(currentSequence, channelIndex, i, !currentStepState);
                    
                console.log(`[SeqDebug] [calling - updateSpecificStepUI] Step button clicked: Sequence ${currentSequence}, Channel ${channelIndex}, Step ${i}, New State: ${!currentStepState}`);
                    
                // Update the UI for the specific step
                updateSpecificStepUI(currentSequence, channelIndex, i);
            });
            stepsContainer.appendChild(button);
        }

        // Debugging statement to summarize the loop completion
        console.log(`[createStepButtonsForSequence] Completed creating step buttons for Channel ${channelIndex} in Sequence ${currentSequence}. First Button ID: ${firstButtonId}, Last Button ID: ${lastButtonId}`);
    });
}

// Call the function initially on DOMContentLoaded
document.addEventListener('DOMContentLoaded', createStepButtonsForSequence);
