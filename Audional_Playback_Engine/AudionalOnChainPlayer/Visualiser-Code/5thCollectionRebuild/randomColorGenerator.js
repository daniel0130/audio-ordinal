// // randomColorGenerator.js - random cci value generator for effect testing

let currentColorIndex = 0; // Global variable to hold the current color index
const colorArrayLength = 400; // Assuming the length of the color array is 20

// function updateRandomColorIndex() {
//   currentColorIndex = Math.floor(Math.random() * colorArrayLength);
//   cci = currentColorIndex; // Directly update the global cci variable
//   console.log("Current Color Index: ", currentColorIndex); // Optional: for debugging
// }

// // Setting the interval to 2000ms (2 seconds). Change this value to adjust the rate.
// setInterval(updateRandomColorIndex, 2000);


// Remove the automated interval-based color index update
// and replace it with a manual update process

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('updateColorButton').addEventListener('click', function() {
    let inputElement = document.getElementById('colorIndexInput');
    let colorIndex = parseInt(inputElement.value, 10);
    if (!isNaN(colorIndex)) {
      cci = colorIndex; // Directly update the global cci variable
      console.log("Manual Color Index Set To: ", colorIndex);
      // Trigger a redraw/update if necessary
      // For example, you might need to call a function that refreshes the visualization
    } else {
      alert("Please enter a valid number.");
    }
  });
});

