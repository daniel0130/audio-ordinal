// right-click-menu.js

let copiedIframeSrc = null; // Store the src of the copied iframe

// Function to show the custom context menu
function showContextMenu(x, y, iframe) {
  // Use an existing menu if it's already in the DOM
  let contextMenu = document.getElementById('custom-context-menu');
  if (!contextMenu) {
    contextMenu = document.createElement('div');
    contextMenu.id = 'custom-context-menu';
    contextMenu.style.position = 'absolute';
    contextMenu.style.zIndex = '1000';
    contextMenu.style.padding = '10px';
    contextMenu.style.backgroundColor = '#f9f9f9';
    contextMenu.style.border = '1px solid #ccc';
    contextMenu.style.boxShadow = '2px 2px 5px #999';

    document.body.appendChild(contextMenu);
  }

  // Clear previous content
  contextMenu.innerHTML = '';

  // Set position
  contextMenu.style.top = `${y}px`;
  contextMenu.style.left = `${x}px`;
  
  // Add Copy option
  const copyBtn = document.createElement('button');
  copyBtn.textContent = 'Copy URL';
  copyBtn.onclick = function() {
    copiedIframeSrc = iframe.src; // Copy the src attribute of the iframe
    contextMenu.style.display = 'none'; // Hide context menu
  };
  contextMenu.appendChild(copyBtn);

  // Add Paste option
  const pasteBtn = document.createElement('button');
  pasteBtn.textContent = 'Paste URL';
  pasteBtn.onclick = function() {
    if (copiedIframeSrc) {
      iframe.src = copiedIframeSrc; // Paste the copied src into the clicked iframe's src
    }
    contextMenu.style.display = 'none'; // Hide context menu
  };
  contextMenu.appendChild(pasteBtn);

  // Show the menu
  contextMenu.style.display = 'block';
}

// Function to handle the right-click event on iframes
function handleRightClick(event) {
  event.preventDefault(); // Prevent the default context menu
  const iframe = event.currentTarget; // The iframe that was right-clicked

  // Show the custom context menu at the mouse position
  showContextMenu(event.pageX, event.pageY, iframe);
}

document.addEventListener('DOMContentLoaded', () => {
  // Attach right-click event listener to all iframes
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    iframe.addEventListener('contextmenu', handleRightClick);
  });

  // Hide the custom context menu when clicking anywhere else on the page
  document.addEventListener('click', (event) => {
    const contextMenu = document.getElementById('custom-context-menu');
    if (contextMenu && !contextMenu.contains(event.target)) {
      contextMenu.style.display = 'none'; // Hide context menu
    }
  });
});
