// IframeSelectManager.js
document.addEventListener('DOMContentLoaded', () => {
  const selectButtons = document.querySelectorAll('.select-button');
  selectButtons.forEach(button => {
    button.addEventListener('click', function() {
      const iframeId = this.getAttribute('data-iframe-id');
      const targetIframe = document.getElementById(iframeId);
      if (targetIframe) {
        // Example command structure
        const command = { action: 'someAction', value: 'someValue' };
        targetIframe.contentWindow.postMessage(command, '*');
      }
    });
  });
});