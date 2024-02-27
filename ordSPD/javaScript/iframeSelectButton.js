// iframeSelectButton.js

document.addEventListener('DOMContentLoaded', (event) => {
    // Get all .iframe-wrapper elements
    const wrappers = document.querySelectorAll('.iframe-wrapper');

    // Loop through each wrapper and add a click event listener
    wrappers.forEach(wrapper => {
        wrapper.addEventListener('click', function() {
            // Toggle the --border-color variable between black and green
            const newColor = getComputedStyle(this, '::before').getPropertyValue('background-color') === 'rgb(0, 0, 0)' ? 'green' : 'black';
            this.style.setProperty('--border-color', newColor);
        });
    });
});
