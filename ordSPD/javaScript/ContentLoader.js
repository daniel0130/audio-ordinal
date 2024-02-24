// ContentLoader.js
// Function to fetch and load content from a URL into an iframe
function fetchAndLoadContent(iframe, url) {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        return response.text();
      })
      .then(html => {
        const blob = new Blob([html], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        iframe.src = blobUrl;
        // The 'load' event will be used to clean up after the content is loaded
        iframe.onload = () => URL.revokeObjectURL(blobUrl);
      })
      .catch(error => {
        console.error('Error:', error);
        alert("There was an issue loading the content.");
      });
  }





 // Array of URLs to preload
 const preloadUrls = [
    "https://ordinals.com/content/e7d344ef3098d0889856978c4d2e81ccf2358f7f8b66feecc71e03036c59ad48i0",
    "https://ordinals.com/content/ef5707e6ecf4d5b6edb4c3a371ca1c57b5d1057c6505ccb5f8bdc8918b0c4d94i0",
    "https://ordinals.com/content/d030eb3d8bcd68b0ed02b0c67fdb981342eea40b0383814f179a48e76927db93i0",
    "https://ordinals.com/content/3b7482a832c4f27c32fc1da7cc4249bbbac1cbdfbdb8673079cad0c33486d233i0",
    "https://ordinals.com/content/5a42d7b2e2fe01e4f31cbad5dd671997f87339d970faaab37f6355c4a2f3be5ai0",
    "https://ordinals.com/content/ddc1838c1a6a3c45b2c6e19ff278c3b51b0797c3f1339c533370442d23687a68i0",
    "https://ordinals.com/content/1e3c2571e96729153e4b63e2b561d85aec7bc5ba372d293af469a525dfa3ed59i0",
    "https://ordinals.com/content/91f52a4ca00bb27383ae149f24b605d75ea99df033a6cbb6de2389455233bf51i0",
    "https://ordinals.com/content/437868aecce108d49f9b29c2f477987cb5834ffdf639a650335af7f0fdd5e55bi0",
    "https://ordinals.com/content/3be1f8e37b718f5b9874aecad792504c5822dc8dfc727ad4928594f7725db987i0"
  ];

  export function preloadContent() {
    const iframes = document.querySelectorAll('iframe');

    // Load the first 5 URLs into the first 10 iframes, twice each
    for (let i = 0; i < 10; i += 2) {
        manageContentLoading(iframes[i], preloadUrls[i / 2]);
        manageContentLoading(iframes[i + 1], preloadUrls[i / 2]);
    }

    // Load four instances of the 6th, 7th, and 8th URLs into the next 12 iframes
    for (let i = 10, urlIndex = 5; i < 22; i += 4) {
        for (let j = 0; j < 4; j++) {
            manageContentLoading(iframes[i + j], preloadUrls[urlIndex]);
        }
        urlIndex++;
    }

    // Load the last two URLs into the final four iframes, twice each
    for (let i = 22, urlIndex = 8; i < iframes.length && i < 26; i += 2) {
        manageContentLoading(iframes[i], preloadUrls[urlIndex]);
        manageContentLoading(iframes[i + 1], preloadUrls[urlIndex]);
        urlIndex++;
    }
}




function manageContentLoading(iframe, url, onSuccess, onError) {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        return response.text();
      })
      .then(html => {
        const blob = new Blob([html], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        iframe.src = blobUrl;
        iframe.onload = () => {
          URL.revokeObjectURL(blobUrl);
          if (onSuccess) onSuccess();
        };
      })
      .catch(error => {
        console.error('Error:', error);
        if (onError) onError();
        alert("There was an issue loading the content.");
      });
  }


  function loadContentFromURL(iframe, loadButton) {
    const url = prompt("Please enter the URL:");
    if (!url) return;
    const urlPattern = /^https:\/\/ordinals\.com\/content\/[a-zA-Z0-9]{64}i0$/;
    if (!urlPattern.test(url)) {
      alert("Invalid URL. Please ensure it matches the expected format.");
      return;
    }
    loadButton.style.display = 'none';
    manageContentLoading(iframe, url, null, () => {
      loadButton.style.display = 'block';
      loadButton.textContent = 'Load';
    });
  }

 