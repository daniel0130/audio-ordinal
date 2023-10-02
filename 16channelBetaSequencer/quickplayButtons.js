// quickplayButtons.js

const mainContainer = document.getElementById('app');
const channelTemplateContainer = document.querySelector('.channel-template');
const channelTemplate = channelTemplateContainer.querySelector('.channel');
const quickPlayButtons = [];

let currentActiveIndex = null; // To track which button is currently active

function setActiveSequence(index) {
    // If there's a previously active sequence, set it to inactive
    if (currentActiveIndex !== null) {
        quickPlayButtons[currentActiveIndex - 1].classList.add('inactive');
    }

    // Set the new sequence as active
    quickPlayButtons[index - 1].classList.remove('inactive');

    // Update the current active index
    currentActiveIndex = index;
}

// Function to create the quick-play-button
function createQuickPlayButton(index) {
    const button = document.createElement('div');
    // Add a click event to set the sequence as active when clicked
    button.addEventListener('click', function() {
        setActiveSequence(index);
    });

    return button;
}

// Function to create the quick-play-button
function createQuickPlayButton(index) {
    const button = document.createElement('div');
    button.classList.add('quick-play-button');
    button.dataset.sequenceIndex = index; // Store the sequence index as a data attribute
    button.style.textAlign = "center"; // Center the text
    button.style.fontWeight = "bold"; // Bold the text
    button.innerHTML = index; // Add the number inside the button
    quickPlayButtons.push(button); // Add the button to the array

    // Add right-click event listener
    button.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Prevent default context menu
        showColorPicker(event, button); // Show custom color picker
    });

    return button;
}

function showColorPicker(event, button) {
    // Define colors for the grid
    const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#808080', '#FFFFFF',
                    '#FFA500', '#800080', '#008080', '#000080', '#800000', '#008000', '#FFC0CB', '#D2691E'];

    // Create color picker container
    const colorPicker = document.createElement('div');
    colorPicker.style.position = 'absolute';
    colorPicker.style.display = 'grid';
    colorPicker.style.gridTemplateColumns = 'repeat(4, 1fr)';
    colorPicker.style.gap = '1px';

    // Determine the height of the color grid in pixels (assuming each color div is 20px in height and there's a 4px gap)
    const gridHeight = (colors.length / 4) * 20; // 24 = 20px (height) + 4px (gap)

    colorPicker.style.top = (event.clientY - gridHeight) + 'px'; // Position it above the button
    colorPicker.style.left = event.clientX + 'px';

    colors.forEach(color => {
        const colorDiv = document.createElement('div');
        colorDiv.style.width = '20px';
        colorDiv.style.height = '20px';
        colorDiv.style.backgroundColor = color;
        colorDiv.addEventListener('click', function() {
            button.style.backgroundColor = color; // Set the button's background color
            colorPicker.remove(); // Remove the color picker
        });
        colorPicker.appendChild(colorDiv);
    });

    // Add the color picker to the body
    document.body.appendChild(colorPicker);

    // Set a timeout to remove the color picker after 2 seconds
    setTimeout(() => {
        colorPicker.remove();
    }, 2000);

    // Add a global click listener to remove the color picker when clicked outside
    document.addEventListener('click', function removePicker() {
        colorPicker.remove();
        document.removeEventListener('click', removePicker);
    });
}
quickPlayButtons.forEach(button => button.classList.add('inactive'));


for (let i = 1; i <= 16; i++) {
    let clonedChannel = channelTemplate.cloneNode(true);
    clonedChannel.id = `channel-${i}`;
    mainContainer.appendChild(clonedChannel);
    console.log(`Created Channel Name: ${clonedChannel.id}, Index: ${i}`);
}

channelTemplateContainer.remove();

