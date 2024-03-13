// simulatedKeyPresses.js

document.addEventListener('DOMContentLoaded', function () {
    // Function to post a message to the child iframes
    function postMessageToIframes(type, data) {
        console.log(`[postMessageToIframes] Posting message to iframes: type=${type}, data=`, data);
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            iframe.contentWindow.postMessage({ type, data }, '*'); // Replace '*' with the actual origin for security in production
        });
    }

    // Event handler to post the appropriate message based on the clicked <kbd>
    function handleKbdClick(kbdElement) {
        console.log(`[handleKbdClick] Clicked on key: ${kbdElement.textContent.trim()}`);
        const key = kbdElement.textContent.trim();
        switch (key) {
            case '-':
                postMessageToIframes('decreaseScheduleMultiplier', null);
                break;
            case '+':
                postMessageToIframes('increaseScheduleMultiplier', null);
                break;
            case '0':
                // Assume '0' resets the BPM to a default value, for example, 120
                postMessageToIframes('updateBPM', { bpm: 120 });
                break;
            case 'm':
                // Assume 'm' toggles mute/unmute; you'll need a way to track the current state
                postMessageToIframes('muteControl', { mute: true }); // or { mute: false } based on current state
                break;
            // Add cases for other keys based on your application's needs
        }
    }

    // Add click event listeners to each <kbd> element in the user guide
    const kbdElements = document.querySelectorAll('#guideContent kbd');
    kbdElements.forEach(kbd => {
        kbd.addEventListener('click', () => handleKbdClick(kbd));
    });
});

