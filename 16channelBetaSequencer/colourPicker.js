// colourpicker.js

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