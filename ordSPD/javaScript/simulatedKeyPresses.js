// simulatedKeyPresses.js

document.addEventListener('DOMContentLoaded', function () {
    // Function to simulate a key press event
    function simulateKeyPress(character) {
        const evt = new KeyboardEvent('keydown', {
            key: character,
            keyCode: character.charCodeAt(0), // Deprecated but included for compatibility
            which: character.charCodeAt(0), // Deprecated but included for compatibility
            bubbles: true,
        });
        document.dispatchEvent(evt);
    }

    // Add click event listeners to each <kbd> element in the user guide
    const kbdElements = document.querySelectorAll('#guideContent kbd');
    kbdElements.forEach(kbd => {
        kbd.addEventListener('click', function() {
            const character = this.textContent.trim();
            simulateKeyPress(character);
            console.log(`Simulated key press: ${character}`); // For debugging purposes
        });
    });
});
