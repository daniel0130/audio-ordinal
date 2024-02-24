// userGuide.js

// Function to generate the user guide content
function generateUserGuide() {
    const guideContent = document.createElement('div');
    guideContent.classList.add('instructions-container');
    guideContent.id = 'guideContent';

    const h2 = document.createElement('h2');
    h2.textContent = 'User Guide';
    guideContent.appendChild(h2);

    const h3 = document.createElement('h3');
    h3.innerHTML = 'Audionals 2.0 <br> User Guide';
    guideContent.appendChild(h3);

    const p = document.createElement('p');
    p.innerHTML = '<strong>Hotkeys and Shortcuts:</strong>';
    guideContent.appendChild(p);

    const ul = document.createElement('ul');
    // Updated hotkeys array with <kbd> tags and disabled text
    const hotkeys = [
        "<kbd>-</kbd> / <kbd>+</kbd>: 1/2 or x2 Loop Length",
        "<kbd>0</kbd>: Return to Default Loop Length",
        "<kbd>&lt;</kbd> / <kbd>&gt;</kbd>: Adjust volume by 1",
        "<kbd>m</kbd>: Mute",
        "<kbd>Shift</kbd> + <kbd>{</kbd> / <kbd>}</kbd>: Adjust playback speed and pitch by 10 cents (using sample playback speed)",
        "<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>{</kbd> / <kbd>}</kbd>: Adjust playback speed and pitch by semi-tone/100 cents (using sample playback speed)"
    ];
    hotkeys.forEach(hotkey => {
        const li = document.createElement('li');
        li.innerHTML = hotkey;
        ul.appendChild(li);
    });
    guideContent.appendChild(ul);

    const subUl = document.createElement('ul');
    // Update the sub-list with <kbd> tags and disabled text
    const bpmHotkeys = [
        "<kbd>Shift</kbd> + <kbd>-</kbd> / <kbd>+</kbd>: Adjust BPM by 1 <span class='disabled-text'>(Disabled in SPD - Use Global Setting)</span>",
        "<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>+</kbd> / <kbd>-</kbd>: Adjust BPM by 10 <span class='disabled-text'>(Disabled in SPD - Use Global Setting)</span>"
    ];
    bpmHotkeys.forEach(hotkey => {
        const li = document.createElement('li');
        li.innerHTML = hotkey;
        subUl.appendChild(li);
    });
    ul.appendChild(subUl);

    return guideContent;
}

// Function to toggle the visibility of the user guide
function toggleUserGuide() {
    const guideContent = document.getElementById('guideContent');
    if (guideContent.style.display === 'none') {
        guideContent.style.display = 'block';
        document.getElementById('toggleGuide').textContent = 'Hide User Guide';
    } else {
        guideContent.style.display = 'none';
        document.getElementById('toggleGuide').textContent = 'Show User Guide';
    }
}

// Append the user guide content to the DOM
document.addEventListener('DOMContentLoaded', function () {
    const rightColumn = document.querySelector('.right-column');
    const toggleGuideBtn = document.createElement('button');
    toggleGuideBtn.id = 'toggleGuide';
    toggleGuideBtn.classList.add('toggle-guide');
    toggleGuideBtn.textContent = 'Hide User Guide';
    toggleGuideBtn.addEventListener('click', toggleUserGuide);
    rightColumn.insertBefore(toggleGuideBtn, rightColumn.firstChild);
    rightColumn.appendChild(generateUserGuide());
});
