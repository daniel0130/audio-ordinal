// songDataProcessing.js

// Maps and utility functions for deserialization
const keyMap = {
    0: "projectName", 1: "artistName", 2: "projectBPM", 3: "currentSequence",
    4: "channelURLs", 5: "channelVolume", 6: "channelPlaybackSpeed",
    7: "trimSettings", 8: "projectChannelNames", 9: "startSliderValue",
    10: "endSliderValue", 11: "totalSampleDuration", 12: "start", 13: "end",
    14: "projectSequences", 15: "steps"
};
const reverseKeyMap = Object.fromEntries(Object.entries(keyMap).map(([e, r]) => [r, +e]));
const channelMap = Array.from({ length: 26 }, (e, r) => String.fromCharCode(65 + r));
const reverseChannelMap = Object.fromEntries(channelMap.map((e, r) => [e, r]));

function decompressSteps(e) {
    return e.flatMap(e => {
        if (typeof e === "number") return e;
        if (typeof e === "object" && "r" in e) {
            const [r, t] = e.r;
            return Array.from({ length: t - r + 1 }, (e, t) => r + t);
        }
        return typeof e === "string" && e.endsWith("r") ? { index: parseInt(e.slice(0, -1), 10), reverse: !0 } : void 0;
    });
}

function deserialize(e) {
    const r = e => Array.isArray(e) ? e.map(e => typeof e === "object" ? r(e) : e) : typeof e === "object" && e !== null ? Object.entries(e).reduce((e, [t, n]) => {
        const a = keyMap[t] ?? t;
        return e[a] = a === "projectSequences" ? Object.entries(n).reduce((e, [r, t]) => (e[r.replace("s", "Sequence")] = Object.entries(t).reduce((e, [r, t]) => {
            var n;
            return e[`ch${reverseChannelMap[r]}`] = { steps: (n = t[reverseKeyMap.steps] || [], n.flatMap(e => {
                if (typeof e === "number") return e;
                if (typeof e === "object" && "r" in e) {
                    const [r, t] = e.r;
                    return Array.from({ length: t - r + 1 }, (e, t) => r + t);
                }
                return typeof e === "string" && e.endsWith("r") ? { index: parseInt(e.slice(0, -1), 10), reverse: !0 } : void 0;
            })) }, e;
        }, {}), e), {}) : r(n), e;
    }, {}) : e;
    return r(e);
}

async function processSerializedData(url) {
    try {
        await loadPako();
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");

        const arrayBuffer = await response.arrayBuffer();
        const inflated = pako.inflate(new Uint8Array(arrayBuffer));
        const text = new TextDecoder("utf-8").decode(inflated);
        const jsonData = JSON.parse(text);
        const deserializedData = deserialize(jsonData);

        console.log("Deserialized Data:", deserializedData);

        const blob = new Blob([JSON.stringify(deserializedData)], { type: "application/json" });
        window.jsonDataUrl = URL.createObjectURL(blob);

        const scriptElement = document.createElement("script");
        scriptElement.src = "/content/6e226872d6612da632fcf29824b6f52c3672a745e194032e4f91c351e47d75c9i0";
        document.head.appendChild(scriptElement);

    } catch (error) {
        console.error("Error processing data:", error);
    }
}

// Expose the function to global scope
window.processSerializedData = processSerializedData;
