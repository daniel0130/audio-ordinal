// Scale factor for object sizes
let scaleFactor = 3, // scaleFactor: Adjusts the size of geometric objects.
    // Canvas size, matching window width for full-width rendering
    S = window.innerWidth,
    // Radius for certain objects, adjusted by scale factor
    R = 100 * scaleFactor,
    // Height for certain objects, twice the radius
    H = 2 * R,
    // Rotation speed coefficient
    RS = (2 * Math.PI) / 2000 / 1000,
    // Additional radius sizes, identical in this context, potentially for different usage
    SR = 100 * scaleFactor,
    OR = 100 * scaleFactor,
    // Canvas and context setup
    cv = document.getElementById('cv'),
    cx = cv.getContext('2d');

// Adjust canvas dimensions to full width
cv.width = S;
cv.height = S;

// Cylinder class with methods for vertex and face generation, and rotation
// Class Cy (Cylinder)
// Constructor: Initializes a cylinder with a center (c), radius (r), height (h), and segmentation (s).
// gV(): Generates vertices (v) of the cylinder based on its geometry.
// gF(): Generates faces (f) for rendering the cylinder, using the vertices.
// rP(p, a): Rotates the cylinder's vertices around a point (p) by an angle (a).

class Cy {
    constructor(c, r, h, s) {
        this.c = c; // Center point
        this.r = r; // Radius
        this.h = h; // Height
        this.s = s; // Segmentation (detail level)
        this.gV(); // Generate vertices
        this.gF(); // Generate faces
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
    }

    rP(p, a) {
        this.v = this.v.map((v) => {
            let x = v.x - p.x,
                y = v.y - p.y,
                x1 = x * Math.cos(a) - y * Math.sin(a),
                y1 = x * Math.sin(a) + y * Math.cos(a);
            return { x: x1 + p.x, y: y1 + p.y, z: v.z };
        });
    }
}

// Class Sp (Sphere)
// Constructor: Similar to Cy, but for spheres. Initializes a sphere with a center (c), radius (r), and segmentation (s).
// gV(): Generates vertices of the sphere. Unlike the cylinder, it calculates vertices based on spherical coordinates.
// gF(): Generates faces for the sphere in a manner similar to the cylinder, tailored to a sphere's geometry.
// rP(p, a): Rotates the sphere's vertices around a point by an angle, similar to Cy.rP.
class Sp {
    constructor(c, r, s) {
        this.c = c;
        this.r = r;
        this.s = s;
        this.gV();
        this.gF();
    }

    gV() {
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
    }

    rP(p, a) {
        this.v = this.v.map((v) => {
            let x = v.x - p.x,
                y = v.y - p.y,
                x1 = x * Math.cos(a) - y * Math.sin(a),
                y1 = x * Math.sin(a) + y * Math.cos(a);
            return { x: x1 + p.x, y: y1 + p.y, z: v.z };
        });
    }
}

// Class Cp (Composite Object)
// Constructor: Creates a composite object consisting of a central cylinder (cy) and two satellite spheres (sp1, sp2). Each component's position is relative to the composite object's center (c), with radii (r) and heights (h) scaled accordingly.
// rP(p, a): Rotates all components of the composite object (the cylinder and both spheres) around a point by an angle.

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
