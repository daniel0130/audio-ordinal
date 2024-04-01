// d2.js

console.log('d2.js loaded');

// Draw function remains unchanged, as it correctly handles drawing based on passed time.
cp.drawObjectD2 = function(obj, tm) {
    for (let f of obj.f) {
        let v = f.map((i) => obj.v[i]);
        let p = v.map((v) => ({ x: v.x, y: v.y }));
        cx.beginPath();
        cx.moveTo(p[0].x, p[0].y);
        for (let i = 1; i < p.length; i++) {
            cx.lineTo(p[i].x, p[i].y);
        }
        cx.closePath();

        let angle = Math.atan2(p[0].y - S / 2, p[0].x - S / 2) * 180 / Math.PI;
        
        let colors = getColors(angle, tm, v);
        cx.fillStyle = colors[cci2 % colors.length];
        cx.fill();

        cx.strokeStyle = 'black';
        cx.stroke();
    }
};

// Added mechanism to track when playback has stopped
let playbackStopped = true;

function d(tm) {
    let currentTime;
    if (playSignalReceived && audioCtx) {
        currentTime = audioCtx.currentTime;
        playbackStopped = false; // Playback is active
    } else {
        // Transition back to using tm * 0.001 after playback stops
        if (!playbackStopped) {
            playbackStopped = true;
            t = undefined; // Reset t to ensure smooth transition back to pre-playback state
        }
        currentTime = tm * 0.001;
    }
    cx.clearRect(0, 0, S, S);

    let a;
    if (t === undefined) {
        a = 0; // Ensure initial angle is zero if t is not defined
    } else {
        let d = tm - t;
        a = RS * d * 100; // Calculate rotation based on time difference
    }
    t = tm; // Update t to the current timestamp for next frame calculation

    // Drawing objects based on the current time
    cp.rP(cp.c, a); 
    cp.drawObjectD2(cp.cy, currentTime);
    cp.drawObjectD2(cp.sp1, currentTime);
    cp.drawObjectD2(cp.sp2, currentTime);

    requestAnimationFrame(d); // Continue the animation loop
}

requestAnimationFrame(d); // Initial call to start the animation loop


function resetVisualState() {
    // Clear the canvas for a fresh start
    cx.clearRect(0, 0, S, S);

    // Optionally, reinitialize or redraw initial visual elements here
    // For example, drawing a background or initial geometrical shapes

    // Example: Reset initial positions or states of visual elements
    // This is hypothetical and needs to be adapted to your specific needs
    // cp.resetPosition(); // Assuming cp is your central visual object and it has a reset method
}

// Example usage when playback stops
if (!playbackStopped) {
    playbackStopped = true;
    resetVisualState(); // Reset the visual state now
}