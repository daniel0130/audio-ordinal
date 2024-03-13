// iframeCommunication.js

import { postMessageToSelectedIframes } from './IframeManager.js';

let isMuted = false;

// Added: Update global settings function
function updateGlobalSettings(iframeId, setting, adjustmentFactor, isIncremental) {
    // Ensure the iframe settings object exists
    window.iframeSettings = window.iframeSettings || {};
    window.iframeSettings[iframeId] = window.iframeSettings[iframeId] || {};

    // Retrieve current setting value or initialize to a default
    let currentValue = window.iframeSettings[iframeId][setting] || 0;
    if (setting === 'mute') {
        currentValue = isMuted ? 1 : 0; // Handle mute specifically since it's a boolean
    }

    // Adjust or set the value based on the action
    const newValue = isIncremental ? currentValue + adjustmentFactor : adjustmentFactor;

    // Update the global settings object
    window.iframeSettings[iframeId][setting] = newValue;

    // Log the update for debugging
    console.log(`Updated ${setting} for ${iframeId} to ${newValue}`);
}

export function postKeyEventToIframes(keyChar, iframeId) {
    console.log("postKeyEventToIframes called", keyChar, iframeId);

    const actionMap = {
        '-': { setting: 'scheduleMultiplier', adjustmentFactor: -0.1, isIncremental: true },
        '+': { setting: 'scheduleMultiplier', adjustmentFactor: 0.1, isIncremental: true },
        ',': { setting: 'volume', adjustmentFactor: -10, isIncremental: true },
        '.': { setting: 'volume', adjustmentFactor: 10, isIncremental: true },
        '0': { setting: 'scheduleMultiplier', adjustmentFactor: 1, isIncremental: false }, // Reset value
        'm': { setting: 'mute', adjustmentFactor: isMuted ? 0 : 1, isIncremental: false }, // Toggle mute
        '{': { setting: 'playbackSpeed', adjustmentFactor: -0.1, isIncremental: true },
        '}': { setting: 'playbackSpeed', adjustmentFactor: 0.1, isIncremental: true },
        'Ctrl+Shift+{': { setting: 'playbackSpeed', adjustmentFactor: -1, isIncremental: true },
        'Ctrl+Shift+}': { setting: 'playbackSpeed', adjustmentFactor: 1, isIncremental: true }
    };

    let messageData = {};

    if (keyChar in actionMap) {
        const { setting, adjustmentFactor, isIncremental } = actionMap[keyChar];
        updateGlobalSettings(iframeId, setting, adjustmentFactor, isIncremental);

        // Handle mute toggle separately
        if (setting === 'mute') {
            isMuted = !isMuted;
        }

        // Fetch the updated value from global settings for the message
        const updatedValue = window.iframeSettings[iframeId][setting];
        messageData[setting] = updatedValue;

    } else if (keyChar === '0' && actionMap[keyChar].setting === 'scheduleMultiplier') {
        // Specific logic for resetting the scheduleMultiplier
        updateGlobalSettings(iframeId, 'scheduleMultiplier', 1, false);
        messageData['scheduleMultiplier'] = 1;
    } else {
        console.log(`No action defined for keyChar: ${keyChar}`);
        return; // Early exit if keyChar does not match any action
    }

    // Now directly handle the message sending based on the key press, without referring to iframeValueTracker
    if (Object.keys(messageData).length > 0) {
        postMessageToSelectedIframes(iframeId, messageData);
    }

    // Additional log to show the current state of window.iframeSettings
    console.log("[iframeCommunication] Final state of window.iframeSettings:", JSON.stringify(window.iframeSettings, null, 2));

}


