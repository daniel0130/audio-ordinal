// loadSynthModule.js

function loadSynth(channelIndex, loadSampleButton) {
    console.log(`Loading synth for channel index: ${channelIndex}`);

    // Find the container where the iframe should be inserted
    const container = document.getElementById('synthContainer');

    // Create an iframe element
    const iframe = document.createElement('iframe');

    // Set the source of the iframe to your HTML file
    iframe.src = 'Synth-Modules/jiMS10_Synth/ms10Merged.html';

    // Set the style of the iframe
    iframe.style.width = '100%';  // Adjust the width as necessary
    iframe.style.height = '500px';  // Adjust the height as necessary
    iframe.style.border = 'none';  // Optional: Remove the border

    // Remove any existing children (i.e., previously loaded iframes)
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Append the new iframe to the container
    container.appendChild(iframe);

    // Listen for the iframe to finish loading
    iframe.onload = () => {
        // Access the document within the iframe
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // Get the title from the loaded HTML file
        const title = iframeDocument.title;

        // Set the loadSampleButton's text content to the new title
        loadSampleButton.textContent = title;
    };
}
