// IframeManager.js
import { preloadContent } from './ContentLoader.js';

const numberOfIframes = 36; // Define the total number of iframes


  export function createIframes() {
    const container = document.querySelector('.grid-container');
    for (let i = 0; i < numberOfIframes; i++) {
        const wrapper = document.createElement('div');
        wrapper.className = 'iframe-wrapper';
        wrapper.style.position = 'relative'; // Ensure this is set to position the borders absolutely

        // Create an iframe element
        const iframe = document.createElement('iframe');
        iframe.id = `iframe-${i}`;
        iframe.style.zIndex = '1'; // Ensure the iframe content is above the overlay

        // Function to create a border div
        function createBorder(className) {
            const border = document.createElement('div');
            border.className = className;
            return border;
        }

        // Create and append the border divs
        const borderTop = createBorder('border-top');
        const borderRight = createBorder('border-right');
        const borderBottom = createBorder('border-bottom');
        const borderLeft = createBorder('border-left');

        wrapper.appendChild(borderTop);
        wrapper.appendChild(borderRight);
        wrapper.appendChild(borderBottom);
        wrapper.appendChild(borderLeft);
        wrapper.appendChild(iframe);

        // Create and append the load button
        const loadButton = document.createElement('button');
        loadButton.textContent = 'Load';
        loadButton.className = 'load-button';
        loadButton.style.zIndex = '2'; // Ensure the button is above the overlay
        loadButton.onclick = () => loadContentFromURL(iframe, loadButton);
        wrapper.appendChild(loadButton);

        container.appendChild(wrapper);
    }
    preloadContent(); // Preload content after creating iframes
    
    // Highlight the first iframe as selected
    const firstIframe = document.getElementById('iframe-0');
    if (firstIframe) {
        firstIframe.classList.add('selected-iframe');
    }
}


// Clears the content of a single iframe
  export function clearIframe(iframe, loadButton) {
    iframe.src = 'about:blank';
    loadButton.style.display = 'block';
    loadButton.textContent = 'Load';
  }

  // Clears all iframes
  export function clearAllIframes() {
    document.querySelectorAll('.iframe-wrapper').forEach(wrapper => {
      const iframe = wrapper.querySelector('iframe');
      const loadButton = wrapper.querySelector('.load-button');
      clearIframe(iframe, loadButton);
    });
  }
    