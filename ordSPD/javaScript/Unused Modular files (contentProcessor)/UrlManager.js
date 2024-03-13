// UrlManager.js

// This file will contain the URLs to preload and the basic logic for managing content loading, including fetching and applying content to iframes. This separation keeps the URL list and basic loading logic independent of the specific content processing or advanced loading strategies.
// 
// Contains preloadUrls array.
// Includes manageContentLoading function.


// Array of URLs to preload
export const preloadUrls = [
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

// Function to manage content loading with visibility control for the load button
export function manageContentLoading(iframe, url, loadButton) {
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
                // Hide the load button once content is successfully loaded
                if (loadButton) {
                    loadButton.classList.add('hidden');
                }
            };
        })
        .catch(error => {
            console.error('Error:', error);
            alert("There was an issue loading the content.");
            // Show the load button again if content loading fails
            if (loadButton) {
                loadButton.classList.remove('hidden');
            }
        });
}
