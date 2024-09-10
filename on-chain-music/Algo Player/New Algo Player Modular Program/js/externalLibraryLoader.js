// externalLibraryLoader.js

async function loadPako() {
    try {
        const response = await fetch("/content/2109694f44c973892fb8152cf5c68607fb19288c045af1abc1716c1c3b4d69e6i0");
        const text = await response.text();
        const div = document.createElement("div");
        div.innerHTML = text;

        const scriptContent = Array.from(div.querySelectorAll("script"))
            .find(script => script.textContent.includes("pako"));

        if (!scriptContent) throw new Error("Pako library not found in the HTML content.");

        const scriptElement = document.createElement("script");
        scriptElement.textContent = scriptContent.textContent;
        document.head.appendChild(scriptElement);

        console.log("Pako library loaded:", pako);

    } catch (error) {
        console.error("Error loading Pako:", error);
    }
}

// Expose the function to global scope
window.loadPako = loadPako;
