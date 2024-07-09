// quickplayButtons.js

const mainContainer = document.getElementById('app');
const channelTemplateContainer = document.querySelector('.channel-template');
const channelTemplate = channelTemplateContainer.querySelector('.channel');
const quickPlayButtons = [];

let currentActiveIndex = null; // To track which button is currently active

// Create a new container for the quickplay buttons
const quickPlayContainer = document.createElement('div');
quickPlayContainer.id = 'quickplay-container';
quickPlayContainer.style.display = 'flex';
quickPlayContainer.style.justifyContent = 'center';
quickPlayContainer.style.marginBottom = '20px';  // Add some margin for spacing


function setActiveSequence(index) {
    // console.log(`Setting active sequence for index: ${index}`);

    // If there's a previously active sequence that's different from the current one, set it to inactive
    if (currentActiveIndex !== null && currentActiveIndex !== index) {
        console.log(`Deactivating previously active sequence ${currentActiveIndex}`);
        quickPlayButtons[currentActiveIndex].classList.add('inactive');
    }

    // Light up the button for this index
    quickPlayButtons[index].classList.remove('inactive');
    // console.log(`Sequence ${index} activated.`);

    // Darken other buttons  
    quickPlayButtons.forEach(button => {
        if(button !== quickPlayButtons[index]) {
            button.classList.add('inactive'); 
        }
    });
   //  console.log(`${quickPlayButtons.length} quickplay buttons made inactive.`);
   //  console.log("All quickplay button indexes: ", quickPlayButtons.map(btn => btn.dataset.sequenceIndex));

    currentActiveIndex = index;
}

function updateActiveQuickPlayButton() {
    // Remove 'active' class from all buttons
    quickPlayButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Add 'active' class to current sequence button
    const activeBtn = quickPlayButtons[currentSequence];
    activeBtn.classList.add('active');
}

function insertQuickPlayButtons() {
   // console.log("insertQuickPlayButtons called!");

    const checkBox = document.getElementById('continuous-play');
    const quickPlayButton = document.getElementById('quick-play-button');

    if (checkBox && quickPlayButton) {
        for (let j = 0; j < 16; j++) {
            const quickBtn = createQuickPlayButton(j);
           // console.log(`Created Quick Play Button for Sequence_${j+1}`);
            checkBox.parentNode.insertBefore(quickBtn, quickPlayButton);
           // console.log(`Added Quick Play Button for Sequence_${j+1} to DOM`);
        }
       // console.log(`${quickPlayButtons.length} quickplay buttons inserted.`);

    } else {
        console.log("QUICKPLAY BUTTONS TEMPORARILY REMOVED UNTIL THEY CAN BE FIXED");
    }
}

insertQuickPlayButtons();

// Now that the quickplay buttons have been inserted, we can set up their event listeners.
quickPlayButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const sequenceIndex = parseInt(button.dataset.sequenceIndex, 10);
        loadAndDisplaySequence(sequenceIndex);
    });
});


function loadAndDisplaySequence(sequenceIndex) {
    currentSequence = sequenceIndex;
    console.log(`[loadAndDisplaySequence] currentSequence updated to:  ${sequenceIndex}`);
    loadSequence(sequenceIndex);

    // Update the display and highlight the active button
    document.getElementById('current-sequence-display').textContent = `Sequence ${currentSequence}`;
    updateActiveQuickPlayButton();
}


// Function to create the quick-play-button
function createQuickPlayButton(index) {
    const button = document.createElement('div');
    button.classList.add('quick-play-button', 'tooltip'); // Added 'quickplay-button' class
    button.dataset.sequenceIndex = index; // Store the sequence index as a data attribute

    // Removed inline styles that are now handled by CSS
    button.innerHTML = index; // Add the number inside the button

    const tooltipText = document.createElement('span'); // Create the tooltip text element
    tooltipText.classList.add('tooltiptext');
    tooltipText.innerHTML = `Quick Load Sequence ${index}<br><br>Right click to change button colour.`;
    button.appendChild(tooltipText); // Append the tooltip to the button

    quickPlayButtons.push(button); // Add the button to the array

    // Add a click event to set the sequence as active when clicked
    button.addEventListener('click', function() {
        setActiveSequence(index);
    });

    // Add right-click event listener
    button.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Prevent default context menu
        showColorPicker(event, button); // Show custom color picker
    });

    return button;
}




quickPlayButtons.forEach(button => button.classList.add('inactive'));

for (let i = 0; i <= 15; i++) {
    let clonedChannel = channelTemplate.cloneNode(true);
    clonedChannel.id = `channel-${i}`;
    mainContainer.appendChild(clonedChannel);
    // console.log(`Created Channel Name: ${clonedChannel.id}, Index: ${i}`);
}

channelTemplateContainer.remove();

// Dispatch a custom event indicating that the setup is complete
const setupCompleteEvent = new Event('setupComplete');
window.dispatchEvent(setupCompleteEvent);

