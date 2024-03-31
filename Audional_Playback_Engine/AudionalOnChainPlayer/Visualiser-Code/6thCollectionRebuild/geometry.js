// geometry.js

let scaleFactor = 3,
    S = window.innerWidth,
    R = 100 * scaleFactor,
    H = 2 * R,
    RS = (2 * Math.PI) / 2000 / 1000,
    SR = 100 * scaleFactor,
    OR = 100 * scaleFactor,
    cv = document.getElementById('cv'),
    cx = cv.getContext('2d');

cv.width = S;
cv.height = S;

class Cy {
    constructor(c, r, h, s) {
        console.log("Constructing Cy with c:", c, "r:", r, "h:", h, "s:", s);
        this.c = c;
        this.r = r;
        this.originalHeight = h;
        this.h = h; // Current height
        this.s = s;
        this.gV();
        this.gF();
    }

    gV() {
        this.v = [];
        for (let i = 0; i <= this.s; i++) {
            let y = this.c.y - this.h / 2 + (i / this.s) * this.h;
            for (let j = 0; j <= this.s; j++) {
                let a = (j / this.s) * 2 * Math.PI,
                    x = this.c.x + this.r * Math.cos(a),
                    z = this.c.z + this.r * Math.sin(a);
                this.v.push({ x, y, z });
            }
        }
        console.log("Cy vertices (gV):", this.v);
    }

    gF() {
        this.f = [];
        for (let i = 0; i < this.s; i++) {
            for (let j = 0; j < this.s; j++) {
                let i1 = i * (this.s + 1) + j,
                    i2 = i1 + 1,
                    i3 = i1 + this.s + 1,
                    i4 = i3 + 1;
                this.f.push([i1, i2, i3]);
                this.f.push([i2, i4, i3]);
            }
        }
        console.log("Cy faces (gF):", this.f);
    }

    rP(p, a) {
        this.v = this.v.map((v) => {
            let x = v.x - p.x,
                y = v.y - p.y,
                x1 = x * Math.cos(a) - y * Math.sin(a),
                y1 = x * Math.sin(a) + y * Math.cos(a);
            return { x: x1 + p.x, y: y1 + p.y, z: v.z };
        });
        // console.log("Cy rotated (rP) with angle:", a, "New vertices:", this.v);
    }
}

class Sp {
    constructor(c, r, s) {
        console.log("Constructing Sp with c:", c, "r:", r, "s:", s);
        this.c = c;
        this.r = r; // Current radius
        this.originalRadius = r; // Store original radius for effects
        this.s = s;
        this.gV();
        this.gF();
    }

    gV() {
        console.log('Generating vertices for Cy');
        this.v = [];
        for (let i = 0; i <= this.s; i++) {
            let l = (i / this.s) * Math.PI;
            for (let j = 0; j <= this.s; j++) {
                let o = (j / this.s) * 2 * Math.PI,
                    x = this.c.x + this.r * Math.sin(l) * Math.cos(o),
                    y = this.c.y + this.r * Math.sin(l) * Math.sin(o),
                    z = this.c.z + this.r * Math.cos(l);
                this.v.push({ x, y, z });
            }
        }
        // console.log("Sp vertices (gV):", this.v);
    }

    gF() {
        console.log('Generating faces for Cy');
        this.f = [];
        for (let i = 0; i < this.s; i++) {
            for (let j = 0; j < this.s; j++) {
                let i1 = i * (this.s + 1) + j,
                    i2 = i1 + 1,
                    i3 = i1 + this.s + 1,
                    i4 = i3 + 1;
                this.f.push([i1, i2, i3]);
                this.f.push([i2, i4, i3]);
            }
        }
        // console.log('Faces generated for Cy:', this.f.length);
    }

    rP(p, a) {
        // console.log('Rotating Cy');
        this.v = this.v.map((v, index) => {
            let x = v.x - p.x,
                y = v.y - p.y,
                x1 = x * Math.cos(a) - y * Math.sin(a),
                y1 = x * Math.sin(a) + y * Math.cos(a);
            let updatedVertex = { x: x1 + p.x, y: y1 + p.y, z: v.z };
            // console.log(`Vertex ${index} rotated to`, updatedVertex);
            return updatedVertex;
        });
    }
}

class Cp {
    constructor(c, r, h, s) {
        this.c = c;
        this.r = r;
        this.h = h;
        this.s = s;
        this.cy = new Cy(c, r, h, s);
        this.sp1 = new Sp({ x: c.x - r, y: c.y, z: c.z }, r, s);
        this.sp2 = new Sp({ x: c.x + r, y: c.y, z: c.z }, r, s);
    }

    rP(p, a) {
        this.cy.rP(p, a);
        this.sp1.rP(p, a);
        this.sp2.rP(p, a);
    }
}

let cp = new Cp({ x: S / 2, y: S / 2, z: 0 }, R, H, 30);
let os1 = new Sp({ x: S / 2 - OR, y: S / 2, z: 0 }, SR, 30);
let os2 = new Sp({ x: S / 2 + OR, y: S / 2, z: 0 }, SR, 30);
let t;


