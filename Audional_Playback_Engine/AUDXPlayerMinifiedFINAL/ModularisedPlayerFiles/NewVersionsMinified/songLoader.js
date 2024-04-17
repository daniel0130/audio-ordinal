// Simplify and combine operations for efficiency
document.title = "OB1 Song 1 by melophonic : Visuals by SQYZY";
document.body.style.cssText = "background: #000; margin: 0; overflow: hidden;"; // overflow hidden in case the canvas is larger than the viewport

// Create the canvas element if not already present in the HTML
if (!document.getElementById('cv')) {
    var canvas = document.createElement('canvas');
    canvas.id = 'cv';
    document.body.appendChild(canvas);
}

// Set styles directly to the canvas to ensure it fills the page, or adjust as needed.
canvas = document.getElementById('cv'); // Reference the canvas whether it was just created or already existed
canvas.style.position = 'absolute'; // Position it absolutely to center on the page
canvas.style.top = '50%';
canvas.style.left = '50%';
canvas.style.transform = 'translate(-50%, -50%)'; // This centers the canvas
canvas.style.maxWidth = '100%';
canvas.style.maxHeight = '100vh';

// Setting the global variables once *** UPDATE TO CORRECT NON-DOMAIN SONG URL ***
window.jsonDataUrl = "https://ordinals.com/content/b77bc993907aaae50d0e4d4e7bb001d725141cf71b1b92a6716e4dddc97bb028i0";

window.cci2 = window.initialCCI2 = 0; // Assuming these are necessary and related, initializing them in one line

// Dynamically load the loader.js script
var script = document.createElement('script');
script.src = 'loader.js'; // Assuming this is the correct script to load
document.head.appendChild(script);
