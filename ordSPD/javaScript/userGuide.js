// userGuide.js

import { IframeSelectionManager } from './IframeSelectionManager.js';

const iframeSelectionManager = new IframeSelectionManager();

function toggleUserGuide() {
    const guideContent = document.getElementById('guideContent');
    const toggleGuideBtn = document.getElementById('toggleGuide');
    const isGuideVisible = guideContent.style.display !== 'none';

    console.log(`Guide content is currently ${isGuideVisible ? 'visible' : 'hidden'}. ${isGuideVisible ? 'Hiding' : 'Showing'} it now.`);
    guideContent.style.display = isGuideVisible ? 'none' : 'block';
    toggleGuideBtn.textContent = isGuideVisible ? 'Show User Guide' : 'Hide User Guide';
}

// Helper functions to simulate key events
function simulateKeyEvent(keyCode, eventType, iframeDocument) {
    const evt = new KeyboardEvent(eventType, {
        bubbles: true,
        cancelable: true,
        keyCode: keyCode
    });
    iframeDocument.dispatchEvent(evt);
}

function getKeyCode(keyChar) {
    const keyMap = {
        '=': { keyCode: 187, shiftKey: false, ctrlKey: false }, // or 61 if 187 does not work
        '+': { keyCode: 187, shiftKey: true, ctrlKey: false },
        '-': { keyCode: 189, shiftKey: false, ctrlKey: false },
        '_': { keyCode: 189, shiftKey: true, ctrlKey: false },
        '0': { keyCode: 48, shiftKey: false, ctrlKey: false },
        ',': { keyCode: 188, shiftKey: false, ctrlKey: false },
        '.': { keyCode: 190, shiftKey: false, ctrlKey: false },
        '}': { keyCode: 221, shiftKey: true, ctrlKey: false },
        '{': { keyCode: 219, shiftKey: true, ctrlKey: false },
        'Ctrl+Shift+=': { keyCode: 187, shiftKey: true, ctrlKey: true },
        'Ctrl+Shift+-': { keyCode: 189, shiftKey: true, ctrlKey: true },
        'Ctrl+Shift+}': { keyCode: 221, shiftKey: true, ctrlKey: true },
        'Ctrl+Shift+{': { keyCode: 219, shiftKey: true, ctrlKey: true }
    };
    return keyMap[keyChar] || null;
}


function simulateKeyPressForGuide(kbdElement) {
    const keyChar = kbdElement.textContent.trim();
    const keyCode = getKeyCode(keyChar);
    simulateKeyEvent(keyCode, 'keydown', iframeSelectionManager.getIframeDocument()); // Using the IframeSelectionManager to get the correct document
    simulateKeyEvent(keyCode, 'keyup', iframeSelectionManager.getIframeDocument());
}

function makeGuideInteractive() {
    const kbdElements = document.querySelectorAll('.instructions-container kbd');
    kbdElements.forEach(kbd => {
        kbd.style.cursor = 'pointer';
        kbd.addEventListener('click', () => {
            console.log(`Simulating key press for: ${kbd.textContent.trim()}`);
            simulateKeyPressForGuide(kbd);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const rightColumn = document.querySelector('.right-column');
    const toggleGuideBtn = document.createElement('button');
    toggleGuideBtn.id = 'toggleGuide';
    toggleGuideBtn.textContent = 'Hide User Guide';
    toggleGuideBtn.addEventListener('click', toggleUserGuide);
    rightColumn.insertBefore(toggleGuideBtn, rightColumn.firstChild);

    // Assuming guideContent is defined and populated elsewhere
    const guideContent = document.getElementById('guideContent') || createGuideContent(); // Placeholder for guide content creation
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

