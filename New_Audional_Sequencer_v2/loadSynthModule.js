// loadSynthModule.js

function loadSynth(channelIndex, loadSampleButton, bpmValue) {
    console.log(`Loading synth for channel index: ${channelIndex}`);
    const iframe = document.createElement('iframe');

    // Correct the iframe source set up, include the channelIndex in the query parameters
    iframe.src = `Synth-Modules/jiMS10_Synth/ms10Merged.html?channelIndex=${channelIndex}`;
    iframe.style.width = '100%';  // Adjust the width as necessary
    iframe.style.height = '500px';  // Adjust the height as necessary
    iframe.style.border = 'none';  // Optional: Remove the border

    // Find the container where the iframe should be inserted
    const container = document.getElementById('synthContainer');

    // Remove any existing children (i.e., previously loaded iframes)
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Append the new iframe to the container
    container.appendChild(iframe);

    // Listen for the iframe to finish loading
    iframe.onload = () => {
        console.log("Synth iframe loaded successfully");

        // Send the channel index to the iframe once it is loaded
        iframe.contentWindow.postMessage({ type: 'setChannelIndex', channelIndex: channelIndex }, '*');

        // Fetch the BPM value from the input slider and send it to the iframe
        iframe.contentWindow.postMessage({ type: 'setBPM', bpm: bpmValue }, '*');  // Send BPM value on load


        // Access the document within the iframe
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // Get the title from the loaded HTML file
        const title = iframeDocument.title;

        // Set the loadSampleButton's text content to the new title
        loadSampleButton.textContent = title;
    };
}
