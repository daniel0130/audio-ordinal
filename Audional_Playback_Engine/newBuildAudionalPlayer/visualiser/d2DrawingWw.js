// d2.js

console.log('d2.js loaded');

    let cci2 = 18; // Initial CCI2 value
    const initialCCI2 = 21; // Store the initial value of cci2 to reset later
    let seed = 9429384736768576; // Seed value, can be adjusted for production purposes
    let isChannel11Active = false; // Flag to track if channel 11 effect is active


    // Enhanced randomization function using a seed
    function randomWithSeed(seedValue) {
        const x = Math.sin(seedValue) * 10000;
        return x - Math.floor(x);
    }

    // Function to calculate cci2 based on channelIndex and seed, now with enhanced randomness
    function calculateCCI2(channelIndex) {
        const randomSeed = seed + channelIndex; // Combine seed with channelIndex for unique seed per channel
        const randomMultiplier = randomWithSeed(randomSeed) * 100; // Generate a pseudo-random number [0, 100)
        return Math.floor(randomMultiplier) + 1; // Ensure CCI2 is within 1-100 range
    }

    const AudionalPlayerMessages = new BroadcastChannel('channel_playback');
    AudionalPlayerMessages.onmessage = (event) => {
        if (event.data.action === 'stop') {
            cci2 = initialCCI2; // Reset to initial cci2 value when stop is received
            isChannel11Active = false; // Reset channel 11 active flag
            console.log(`Stop received. CCI2 reset to initial value ${initialCCI2}`);
        } else {
            const { channelIndex } = event.data;
            cci2 = calculateCCI2(channelIndex); // Update the CCI2 with enhanced randomization
            console.log(`Received channel playback: Channel ${channelIndex}. CCI2 updated to ${cci2} based on seed ${seed}.`);
        }
    };



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

        // Assuming angle, tm, and v are calculated correctly here
        let angle = Math.atan2(p[0].y - S / 2, p[0].x - S / 2) * 180 / Math.PI;
        
        // Now, obtain colors dynamically
        let colors = getColors(angle, tm, v); // Make sure to define tm and v appropriately
        cx.fillStyle = colors[cci2 % colors.length];
        cx.fill();

        cx.strokeStyle = 'black';
        cx.stroke();
    }
};




function d(tm) {
    cx.clearRect(0, 0, S, S);
    let a;
    if (t === undefined) {
        a = 0;
    } else {
        let d = tm - t;
        a = RS * d * 100;
    }
    t = tm;
    cp.rP(cp.c, a); // Adjust color patterns based on rotation

    // Pass `tm` to `cp.drawObjectD2` for dynamic color changes
    cp.drawObjectD2(cp.cy, tm);
    cp.drawObjectD2(cp.sp1, tm);
    cp.drawObjectD2(cp.sp2, tm);
    requestAnimationFrame(d);
}

requestAnimationFrame(d);
