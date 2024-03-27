// drawObjects.js

// Update the drawObject function to use arrayIndex and colorSettingIndex
cp.drawObject = function(obj, tm, arrayIndex, colorSettingIndex) {
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
        let colors = getColorsByCCI(angle, tm, v, arrayIndex, colorSettingIndex); // Now uses arrayIndex and colorSettingIndex
        cx.fillStyle = colors; // Directly uses the selected color
        cx.fill();
        cx.strokeStyle = 'black';
        cx.stroke();
    }
};


// drawObject16.1.js


function d(tm) {
    cx.clearRect(0, 0, S, S);
    let a;
    if (typeof t === 'undefined') {
        a = 0;
    } else {
        let d = tm - t;
        a = RS * d * 100;
    }
    t = tm;
    cp.rP(cp.c, a); // Adjust color patterns based on rotation

    // Now pass arrayIndex and colorSettingIndex to drawObject
    cp.drawObject(cp.cy, tm, arrayIndex, colorIndex);
    cp.drawObject(cp.sp1, tm, arrayIndex, colorIndex);
    cp.drawObject(cp.sp2, tm, arrayIndex, colorIndex);
    requestAnimationFrame(d);
}

requestAnimationFrame(d);