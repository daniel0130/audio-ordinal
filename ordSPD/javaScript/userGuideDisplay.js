// userGuideDisplay.js


import { makeGuideInteractive } from "./keySimulation.js";

export function toggleUserGuide() {
    const guideContent = document.getElementById('guideContent');
    const toggleGuideBtn = document.getElementById('toggleGuide');
    const isVisible = guideContent.style.display !== 'none';

    guideContent.style.display = isVisible ? 'none' : 'block';
    toggleGuideBtn.textContent = isVisible ? 'Show User Guide' : 'Hide User Guide';

    console.log(`Guide content is now ${isVisible ? 'hidden' : 'visible'}.`);
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
