// gzipProcessing.js

// Load the Pako library dynamically
const loadPako = async () => {
    if (typeof pako === 'undefined') {
        try {
            const response = await fetch("https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.4/pako.min.js");
            const script = document.createElement("script");
            script.textContent = await response.text();
            document.head.appendChild(script);
            console.log("Pako library loaded:", pako);
        } catch (error) {
            console.error("Error loading Pako:", error);
        }
    }
};

// Compress the JSON data to Gzip format
export const createGzipFile = async (jsonData) => {
    await loadPako();

    if (!jsonData) {
        throw new Error("No JSON data provided for compression.");
    }

    try {
        const compressed = pako.gzip(jsonData); // Compress the raw serialized JSON data
        const blob = new Blob([compressed], { type: 'application/gzip' });
        return blob;
    } catch (error) {
        console.error("Error during compression:", error);
        throw error;
    }
};

// Decompress the Gzip file back to JSON
export const decompressGzipFile = async (gzipData) => {
    await loadPako();

    if (!gzipData) {
        throw new Error("No Gzip data provided for decompression.");
    }

    try {
        const decompressed = pako.ungzip(new Uint8Array(gzipData), { to: 'string' });
        return decompressed;
    } catch (error) {
        console.error("Error during decompression:", error);
        throw error;
    }
};