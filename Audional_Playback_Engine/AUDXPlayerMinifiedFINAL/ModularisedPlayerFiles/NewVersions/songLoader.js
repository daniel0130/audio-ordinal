// Set the HTML title dynamically
document.title = "OB1 Song 1 by melophonic : Visuals by SQYZY";

// Define the AUDX song file being loaded (jsonDataUrl) globally (Random seed is defined in the HTML document)
window.jsonDataUrl = "https://ordinals.com/content/b77bc993907aaae50d0e4d4e7bb001d725141cf71b1b92a6716e4dddc97bb028i0";
window.cci2 = 0; 
window.initialCCI2 = 0;
// Create and append the canvas element to the body
var canvas = document.createElement('canvas');
canvas.id = 'cv';
document.body.appendChild(canvas);

// Adjust the body's style to ensure proper display of the canvas
document.body.style.display = 'flex';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
document.body.style.height = '100vh';
document.body.style.margin = '0'; // Ensures the body takes up the full viewport height without default margins

// Dynamically load the loader.js script after setting up the environment
var script = document.createElement('script');
script.src = 'loader.js';
document.head.appendChild(script);
