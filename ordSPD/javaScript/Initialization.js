// Initialization.js
import { IframeManager } from './IframeManager.js';
import { setupUIControls } from './UIController.js';

document.addEventListener('DOMContentLoaded', function() {
    const iframeManager = new IframeManager(36, /* preloadUrls Array */);
    iframeManager.createIframes('.grid-container');
    
    setupUIControls();
});
