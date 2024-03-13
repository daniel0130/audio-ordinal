// userGuide.js

// Import necessary functions
import { postMessageToSelectedIframes } from './IframeManager.js';

let isMuted = false;


// Toggle visibility of the user guide
function toggleUserGuide() {
    const guideContent = document.getElementById('guideContent');
    const toggleGuideBtn = document.getElementById('toggleGuide');
    const isVisible = guideContent.style.display !== 'none';

    guideContent.style.display = isVisible ? 'none' : 'block';
    toggleGuideBtn.textContent = isVisible ? 'Show User Guide' : 'Hide User Guide';

    console.log(`Guide content is now ${isVisible ? 'hidden' : 'visible'}.`);
}

// Simulate a key event and dispatch it
function simulateKeyEvent(keyDetails, eventType, target) {
    const evt = new KeyboardEvent(eventType, {
        bubbles: true,
        cancelable: true,
        keyCode: keyDetails.keyCode,
        shiftKey: keyDetails.shiftKey,
        ctrlKey: keyDetails.ctrlKey
    });
    target.dispatchEvent(evt);
}

// Map key characters to their event details, correcting and extending mappings
const keyMap = {
    '=': { keyCode: 187, shiftKey: false, ctrlKey: false },
    '+': { keyCode: 187, shiftKey: true, ctrlKey: false },
    '-': { keyCode: 189, shiftKey: false, ctrlKey: false },
    '_': { keyCode: 189, shiftKey: true, ctrlKey: false },
    '0': { keyCode: 48, shiftKey: false, ctrlKey: false },
    ',': { keyCode: 188, shiftKey: false, ctrlKey: false }, // for "<"
    '.': { keyCode: 190, shiftKey: false, ctrlKey: false }, // for ">"
    '{': { keyCode: 219, shiftKey: true, ctrlKey: false },
    '}': { keyCode: 221, shiftKey: true, ctrlKey: false },
    'Ctrl+Shift+{': { keyCode: 219, shiftKey: true, ctrlKey: true },
    'Ctrl+Shift+}': { keyCode: 221, shiftKey: true, ctrlKey: true },
    'Shift+-': { keyCode: 189, shiftKey: true, ctrlKey: false },
    'Shift++': { keyCode: 187, shiftKey: true, ctrlKey: false },
    'Ctrl+Shift+-': { keyCode: 189, shiftKey: true, ctrlKey: true },
    'Ctrl+Shift++': { keyCode: 187, shiftKey: true, ctrlKey: true },
    'm': { keyCode: 77, shiftKey: false, ctrlKey: false }
};

// Handle interactive guide elements, updated to support corrected mappings
function makeGuideInteractive() {
    document.querySelectorAll('.instructions-container kbd').forEach(kbd => {
        kbd.style.cursor = 'pointer';
        kbd.addEventListener('click', () => {
            const keyChar = kbd.textContent.trim().replace('<', ',').replace('>', '.'); // Adjust for HTML entities
            const actionKey = keyChar.includes('Ctrl') || keyChar.includes('Shift') ? keyChar : keyMap[keyChar] ? keyChar : null;
            console.log(`Simulating key press for: ${actionKey}`);
            if (actionKey && keyMap[actionKey]) {
                const target = document.activeElement.contentDocument || document;
                simulateKeyEvent(keyMap[actionKey], 'keydown', target);
                simulateKeyEvent(keyMap[actionKey], 'keyup', target);

                postKeyEventToIframes(actionKey);
            }
        });
    });
}

// Determine the message type based on the key pressed and post it, updated to reflect correct actions
function postKeyEventToIframes(keyChar) {
    console.log(`postKeyEventToIframes called: keyChar=${keyChar}`);
    const actionMap = {
        '-': 'decreaseScheduleMultiplier',
        '+': 'increaseScheduleMultiplier',
        ',': 'decreaseVolume', // Corrected for "<"
        '.': 'increaseVolume', // Corrected for ">"
        '0': 'resetSchedulerValue', // Added for "0" to reset scheduler value
        'm': 'muteControl', // Added for "m" to mute all selected iframes
        '{': 'playAtSpeed', // Decrease speed by 10 cents
        '}': 'playAtSpeed', // Increase speed by 10 cents
        'Ctrl+Shift+{': 'playAtSpeed', // Decrease speed by 100 cents (1 semitone)
        'Ctrl+Shift+}': 'playAtSpeed' // Increase speed by 100 cents (1 semitone)
    };

   // Determine the message type and prepare data accordingly
   const messageType = actionMap[keyChar];
   let messageData = {};

   if (keyChar === 'm') {
        // Toggle the mute state
        isMuted = !isMuted;
        // Adjust messageData to include the mute flag based on the isMuted state
        messageData = { mute: isMuted };
    }

   switch (keyChar) {
       case '{':
           messageData = { speed: -0.1 }; // Decrease by 10 cents
           break;
       case '}':
           messageData = { speed: 0.1 }; // Increase by 10 cents
           break;
       case 'Ctrl+Shift+{':
           messageData = { speed: -1 }; // Decrease by 100 cents (1 semitone)
           break;
       case 'Ctrl+Shift+}':
           messageData = { speed: 1 }; // Increase by 100 cents (1 semitone)
           break;
          
    }


   if (messageType) {
       postMessageToSelectedIframes(messageType, messageData);
   } else {
       console.log(`No action defined for keyChar: ${keyChar}`);
   }
}

// Initialize the user guide on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const rightColumn = document.querySelector('.right-column');
    const toggleGuideBtn = document.createElement('button');
    toggleGuideBtn.id = 'toggleGuide';
    toggleGuideBtn.textContent = 'Show User Guide';
    toggleGuideBtn.addEventListener('click', toggleUserGuide);
    rightColumn.prepend(toggleGuideBtn);

    const guideContent = document.getElementById('guideContent') || document.createElement('div'); // Adjust based on actual content creation
    guideContent.id = 'guideContent'; // Ensure guideContent has an ID
    rightColumn.appendChild(guideContent);

    makeGuideInteractive();
});


// // simulatedKeyPresses.js

// document.addEventListener('DOMContentLoaded', function () {
// // Function to post a message to the child iframes
// function postMessageToIframes(type, data) {
//     const iframes = document.querySelectorAll('iframe');
//     iframes.forEach(iframe => {
//         iframe.contentWindow.postMessage({ type, data }, '*'); // Replace '*' with the actual origin for security in production
//     });
// }
// })





// // Function to handle key press simulation
// function simulateKeyPressForGuide(kbdElement) {
//     const key = kbdElement.textContent.trim();
//     const type = keyToMessageType(key);
//     const selectedIframes = getSelectedIframes(); // Get the selected iframe IDs

//     if (type && selectedIframes.length > 0) {
//         selectedIframes.forEach(iframeId => {
//             const iframe = document.getElementById(iframeId);
//             if (iframe) {
//                 iframe.contentWindow.postMessage({ type }, '*'); // Use the actual origin in production
//             }
//         });
//     }
// }

// // Temporary modification for testing
// function simulateKeyPressForGuide(kbdElement) {
//     const key = kbdElement.textContent.trim();
//     const type = keyToMessageType(key);
//     const selectedIframes = getSelectedIframes(); // Ensure this gets IDs correctly

//     if (type) {
//         const data = {}; // Initialize an empty data object
//         // Populate data based on the type, e.g., for BPM adjustment
//         if (type === 'updateBPM') {
//             data.bpm = 120; // Or some logic to determine the correct BPM
//         }

//         selectedIframes.forEach(iframeId => {
//             const iframe = document.getElementById(iframeId);
//             if (iframe) {
//                 iframe.contentWindow.postMessage({ type, data }, '*');
//             }
//         });
//     }
// }



// Function to generate the user guide content
// function generateUserGuide() {
    // const guideContent = document.createElement('div');
    // guideContent.classList.add('instructions-container');
    // guideContent.id = 'guideContent';

    // const h2 = document.createElement('h2');
    // h2.textContent = 'User Guide';
    // guideContent.appendChild(h2);

    // const h3 = document.createElement('h3');
    // h3.innerHTML = 'Audionals 2.0 <br> User Guide';
    // guideContent.appendChild(h3);

    // const p = document.createElement('p');
    // p.innerHTML = '<strong>Hotkeys and Shortcuts:</strong>';
    // guideContent.appendChild(p);

    // const ul = document.createElement('ul');
    // // Updated hotkeys array with <kbd> tags and disabled text
    // const hotkeys = [
    //     "<kbd>-</kbd> / <kbd>+</kbd>: 1/2 or x2 Loop Length",
    //     "<kbd>0</kbd>: Return to Default Loop Length",
    //     "<kbd>&lt;</kbd> / <kbd>&gt;</kbd>: Adjust volume by 1",
    //     "<kbd>m</kbd>: Mute",
    //     "<kbd>Shift</kbd> + <kbd>{</kbd> / <kbd>}</kbd>: Adjust playback speed and pitch by 10 cents (using sample playback speed)",
    //     "<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>{</kbd> / <kbd>}</kbd>: Adjust playback speed and pitch by semi-tone/100 cents (using sample playback speed)"
    // ];
    // hotkeys.forEach(hotkey => {
    //     const li = document.createElement('li');
    //     li.innerHTML = hotkey;
    //     ul.appendChild(li);
    // });
    // guideContent.appendChild(ul);

    // const subUl = document.createElement('ul');
    // // Update the sub-list with <kbd> tags and disabled text
    // const bpmHotkeys = [
    //     "<kbd>Shift</kbd> + <kbd>-</kbd> / <kbd>+</kbd>: Adjust BPM by 1 <span class='disabled-text'>(Disabled in SPD - Use Global Setting)</span>",
    //     "<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>+</kbd> / <kbd>-</kbd>: Adjust BPM by 10 <span class='disabled-text'>(Disabled in SPD - Use Global Setting)</span>"
    // ];
    // bpmHotkeys.forEach(hotkey => {
    //     const li = document.createElement('li');
    //     li.innerHTML = hotkey;
    //     subUl.appendChild(li);
    // });
    // ul.appendChild(subUl);

    // console.log('Generating user guide content...');
    // return guideContent;
// }




// // Helper function to map key text to message type
// function keyToMessageType(key) {
//     console.log(`Mapping key to message type: key=${key}`);
//     switch (key) {
//         case '-':
//             return 'decreaseScheduleMultiplier';
//         case '+':
//             return 'increaseScheduleMultiplier';
//         case '0':
//             return 'updateBPM';
//         case 'm':
//             return 'muteControl';
//         // ... add other cases as necessary
//         default:
//             return null;
//     }
// }

// // Function to get the IDs of the currently selected iframes
// function getSelectedIframes() {
//     console.log('Getting selected iframes...');

//     // Use the instance of IframeSelectionManager to get the selected pads
//     const selectedIframes = Array.from(iframeSelectionManager.selectedPads);
//     console.log('Selected iframes:', selectedIframes);
//     return selectedIframes;
// }





// function postMessageToIframes(type, data) {
//     console.log(`Posting message to iframes: type=${type}, data=`, data);
//     const iframes = document.querySelectorAll('iframe');
//     iframes.forEach(iframe => {
//         iframe.contentWindow.postMessage({ type, data }, '*'); // Replace '*' with the actual origin for security in production
//     });
// }

