// loader.js

// Dynamically load a list of scripts in order and then initialize the app
function loadScriptsSequentially(scripts, index = 0, callback) {
    if (index < scripts.length) {
        const script = document.createElement('script');
        script.src = scripts[index];
        script.onload = () => loadScriptsSequentially(scripts, index + 1, callback); // Load next script once the current one is done
        document.head.appendChild(script);
    } else if (typeof callback === "function") {
        // All scripts are loaded; call the callback function
        callback();
    }
}

// Define the scripts to be loaded
const scriptsToLoad = [
    'https://ordinals.com/content/733a31b5f2eaf821cb5164f269405c8082edc9c18e15373ed0cbc8409225b783i0',
    'https://ordinals.com/content/d3e9c74e8b9e358c37b50ef363ab77efe29370ccfb4cd9c4e32a5c4a5b0fabdbi0',
    'https://ordinals.com/content/1db7c640e5d08a1bc069125ad52c7b82933ffd2ffad1276f98707071c1ea15efi0',
];

// Function to initialize the application
function initializeApp() {
    loadJsonFromUrl(window.jsonDataUrl); // Call the function defined in one of the loaded scripts
    initializeWorker();
}

// Start loading scripts and set initializeApp as the callback to be called after all scripts are loaded
loadScriptsSequentially(scriptsToLoad, 0, () => {
    if(document.readyState === 'loading') {  
        // The document is still loading, we can add an event listener
        document.addEventListener("DOMContentLoaded", initializeApp);
    } else {  
        // `DOMContentLoaded` has already fired, call the function directly
        initializeApp();
    }
});
