// loadPlayerScripts.js

// Function to dynamically load a script by URL
function loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  }
  
  // URLs of the scripts to load
  const scriptsToLoad = [
    "loadAUDXFiles.js",
    "https://ordinals.com/content/d3e9c74e8b9e358c37b50ef363ab77efe29370ccfb4cd9c4e32a5c4a5b0fabdbi0",
    "https://ordinals.com/content/1db7c640e5d08a1bc069125ad52c7b82933ffd2ffad1276f98707071c1ea15efi0"
  ];
  
  // Load each script
  scriptsToLoad.forEach(loadScript);
  