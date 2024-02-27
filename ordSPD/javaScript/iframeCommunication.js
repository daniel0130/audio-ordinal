// iframeCommunication.js
import { postMessageToSelectedIframes } from './IframeManager.js';
import { keyMap } from './keySimulation.js';

let isMuted = false;

// Determine the message type based on the key pressed and post it, updated to reflect correct actions
export function postKeyEventToIframes(keyChar) {
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

