 // formattingHelpers.js

// Define base URL for content outside the fetchAudio function for easy modification
 const BASE_ORDINALS_URL = 'https://ordinals.com/content/';

// Validates if the given URL is a well-formed ordinals content URL
 function isValidOrdinalsUrl(url) {
    const regex = new RegExp(`^${BASE_ORDINALS_URL}[a-f0-9]{64}i\\d+$`);
    return regex.test(url);
}

// Ensures the ID is formatted correctly without any additional URL parts
 function formatId(id) {
    const regex = new RegExp(`^[a-f0-9]{64}i\\d+$`);
    if (!regex.test(id)) {
        console.error("Invalid ID format:", id);
        return null; // or return an empty string, depending on how you want to handle errors
    }
    return id;
}

// Converts a potentially relative URL or ID to an absolute URL, and corrects common mistakes
 function formatURL(url) {
    if (url.startsWith(BASE_ORDINALS_URL)) {
        return url; // URL is already correctly formatted
    }
    // If the URL accidentally starts with the duplicated base URL part, fix it
    const regexPattern = new RegExp(`^${BASE_ORDINALS_URL}${BASE_ORDINALS_URL}(.+)`);
    const match = url.match(regexPattern);
    if (match && match[1]) {
        return BASE_ORDINALS_URL + match[1]; // Correct the URL by removing the duplicated segment
    }
    // If the URL is a valid ordinals content URL but missing the base, prepend it
    if (url.match(/^[a-f0-9]{64}i\d+$/)) {
        return BASE_ORDINALS_URL + url;
    }
    return url; // Return the URL unchanged if none of the above conditions match
}

 function toFullUrl(id) {
    if (!id) return null;
    return BASE_ORDINALS_URL + formatId(id);
}
  
 function extractIdFromUrl(url) {
    if (!isValidOrdinalsUrl(url)) {
        console.error("Invalid Ordinals URL:", url);
        return null; // or return an empty string, depending on how you want to handle errors
    }
    return url.replace(BASE_ORDINALS_URL, '');
}
