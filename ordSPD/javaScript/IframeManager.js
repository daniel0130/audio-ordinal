// IframeManager.js
import { preloadContent } from './ContentLoader.js';

const numberOfIframes = 36; // Define the total number of iframes

// Array to keep track of selected iframes
export const selectedIframeWrappers = [];


// Toggles the selected class on a single iframe wrapper
function toggleWrapperSelection(wrapper) {
  // Check if the iframe is already selected
  const isSelected = wrapper.classList.contains('selected-iframe');
  // Toggle the 'selected-iframe' class for the clicked wrapper
  wrapper.classList.toggle('selected-iframe');
  // Update the array of selected iframes
  if (isSelected) {
    // Remove from the array
    const index = selectedIframeWrappers.indexOf(wrapper);
    if (index > -1) {
      selectedIframeWrappers.splice(index, 1);
    }
  } else {
    // Add to the array
    selectedIframeWrappers.push(wrapper);
  }
}


function createWrapper(i) {
  const wrapper = document.createElement('div');
  wrapper.className = 'iframe-wrapper';
  wrapper.style.position = 'relative';

  // Add event listener to the wrapper to toggle the selected class
  wrapper.addEventListener('click', () => {
      toggleWrapperSelection(wrapper); // Toggle selection for this wrapper
  });

  return wrapper;
}

function createIframe(i) {
    const iframe = document.createElement('iframe');
    iframe.id = `iframe-${i}`;
    iframe.style.zIndex = '1'; // Ensure the iframe content is above the overlay
    return iframe;
}

function createLoadButton(iframe) {
    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load';
    loadButton.className = 'load-button';
    loadButton.style.zIndex = '2'; // Ensure the button is above the overlay
    loadButton.onclick = () => loadContentFromURL(iframe, loadButton);
    loadButton.classList.add('hidden');

    return loadButton;
}

function deselectAllIframes() {
    document.querySelectorAll('.iframe-wrapper').forEach(wrapper => {
        wrapper.classList.remove('selected-iframe');
    });
}

export function createIframes() {
    const container = document.querySelector('.grid-container');

    for (let i = 0; i < numberOfIframes; i++) {
        const wrapper = createWrapper(i);
        const iframe = createIframe(i);
        const loadButton = createLoadButton(iframe);

        wrapper.appendChild(iframe);
        wrapper.appendChild(loadButton);
        container.appendChild(wrapper);
    }
    preloadContent(); // Preload content after creating iframes
}


// Clears the content of a single iframe
  export function clearIframe(iframe, loadButton) {
    iframe.src = 'about:blank';
    loadButton.style.display = 'block';
    loadButton.textContent = 'Load';
  }

 // Clears all iframes and deselects them
  export function clearAllIframes() {
    document.querySelectorAll('.iframe-wrapper').forEach(wrapper => {
        const iframe = wrapper.querySelector('iframe');
        const loadButton = wrapper.querySelector('.load-button');
        clearIframe(iframe, loadButton);
        wrapper.classList.remove('selected-iframe'); // Deselect the iframe
    });
  } 



// Function to get the IDs of the selected iframe wrappers
function getSelectedIframes() {
  return selectedIframeWrappers.map(wrapper => wrapper.querySelector('iframe').id);
}


// Function to post a message to selected iframes based on the message type and data
export function postMessageToSelectedIframes(type, data) {
  console.log(`[postMessageToSelectedIframes] Posting message to selected iframes: type=${type}, data=`, data);
  const selectedIframesIds = getSelectedIframes(); // Get the IDs of the selected iframes

  // Post message only to selected iframes
  selectedIframesIds.forEach(id => {
      const iframe = document.getElementById(id);
      if (iframe) {
          const origin = new URL(iframe.src).origin; // Get the origin of the iframe
          iframe.contentWindow.postMessage({ type, data }, origin); // Replace '*' with the actual origin
      }
  });
}

