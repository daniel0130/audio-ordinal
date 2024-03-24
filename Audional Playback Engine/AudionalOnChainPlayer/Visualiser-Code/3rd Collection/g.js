// Set up the canvas and its dimensions
const scaleFactor = 3; // Scale factor to adjust the size of the shapes drawn on the canvas
const S = window.innerWidth; // S: Canvas width, set to the width of the window
const R = 100 * scaleFactor; // R: Base radius for shapes, scaled by the scaleFactor
const H = 2 * R; // H: Height of shapes, calculated as twice the base radius
const RS = (2 * Math.PI) / 2000 / 1000; // RS: Rotation speed for animating the shapes, defined in radians per millisecond
const SR = 100 * scaleFactor; // SR: Segment radius, used for the detailed parts of shapes, equivalent to R
const OR = 100 * scaleFactor; // OR: Orbit radius, defines the radius for satellite shapes' orbits, equivalent to R
const cv = document.getElementById('cv'); // cv: The canvas element selected by its ID
const cx = cv.getContext('2d'); // cx: The 2D rendering context for the canvas, used for drawing

// Constants related to the shapes, mirroring the above with more descriptive names
const size = window.innerWidth; // Window's inner width, used to set the canvas size
const canvas = document.getElementById('cv'); // The canvas element, identified by ID
const context = canvas.getContext('2d'); // The 2D context of the canvas, for drawing operations

// Set the canvas size to fill the width of the window
canvas.width = size;
canvas.height = size;

// Redefining constants with clearer names
const baseRadius = 100 * scaleFactor; // Base radius for shapes, adjusted by the scale factor
const baseHeight = 2 * baseRadius; // Height of shapes, calculated as twice the base radius
const rotationSpeed = (2 * Math.PI) / 2000 / 1000; // Rotation speed in radians per millisecond
const segmentRadius = 100 * scaleFactor; // Radius for segments of the shapes, adjusted by scale factor
const orbitRadius = 100 * scaleFactor; // Radius for the orbit of satellite shapes, adjusted by scale factor

class Shape {
  constructor(center, radius, segments) {
    this.center = center;
    this.radius = radius;
    this.segments = segments;
    this.vertices = [];
    this.faces = [];
  }

  // Rotates shape around a pivot point
  rotatePivot(pivot, angle) {
    this.vertices = this.vertices.map(({ x, y, z }) => {
      const dx = x - pivot.x;
      const dy = y - pivot.y;
      const rotatedX = dx * Math.cos(angle) - dy * Math.sin(angle);
      const rotatedY = dx * Math.sin(angle) + dy * Math.cos(angle);
      return { x: rotatedX + pivot.x, y: rotatedY + pivot.y, z };
    });
  }
}

class Cylinder extends Shape {
  constructor(center, radius, height, segments) {
    super(center, radius, segments);
    this.height = height;
    this.generateVertices();
    this.generateFaces();
  }

  generateVertices() {
    for (let i = 0; i <= this.segments; i++) {
      const y = this.center.y - this.height / 2 + (i / this.segments) * this.height;
      for (let j = 0; j <= this.segments; j++) {
        const angle = (j / this.segments) * 2 * Math.PI;
        const x = this.center.x + this.radius * Math.cos(angle);
        const z = this.center.z + this.radius * Math.sin(angle);
        this.vertices.push({ x, y, z });
      }
    }
  }

  generateFaces() {
    for (let i = 0; i < this.segments; i++) {
      for (let j = 0; j < this.segments; j++) {
        const index1 = i * (this.segments + 1) + j;
        const index2 = index1 + 1;
        const index3 = index1 + this.segments + 1;
        const index4 = index3 + 1;
        this.faces.push([index1, index2, index3], [index2, index4, index3]);
      }
    }
  }
}

class Sphere extends Shape {
  constructor(center, radius, segments) {
    super(center, radius, segments);
    this.generateVertices();
    this.generateFaces();
  }

  generateVertices() {
    for (let i = 0; i <= this.segments; i++) {
      const phi = (i / this.segments) * Math.PI;
      for (let j = 0; j <= this.segments; j++) {
        const theta = (j / this.segments) * 2 * Math.PI;
        const x = this.center.x + this.radius * Math.sin(phi) * Math.cos(theta);
        const y = this.center.y + this.radius * Math.sin(phi) * Math.sin(theta);
        const z = this.center.z + this.radius * Math.cos(phi);
        this.vertices.push({ x, y, z });
      }
    }
  }

  generateFaces() {
    for (let i = 0; i < this.segments; i++) {
      for (let j = 0; j < this.segments; j++) {
        const index1 = i * (this.segments + 1) + j;
        const index2 = index1 + 1;
        const index3 = index1 + this.segments + 1;
        const index4 = index3 + 1;
        this.faces.push([index1, index2, index3], [index2, index4, index3]);
      }
    }
  }
}

class CompositeShape {
  constructor(center, radius, height, segments) {
    this.center = center;
    this.radius = radius;
    this.height = height;
    this.segments = segments;
    this.cylinder = new Cylinder(center, radius, height, segments);
    this.sphere1 = new Sphere({ x: center.x - radius, y: center.y, z: center.z}, radius, segments);
    this.sphere2 = new Sphere({ x: center.x + radius, y: center.y, z: center.z }, radius, segments);
  }
    
  // Rotates the composite shape
  rotatePivot(pivot, angle) {
    this.cylinder.rotatePivot(pivot, angle);
    this.sphere1.rotatePivot(pivot, angle);
    this.sphere2.rotatePivot(pivot, angle);
  }
}

// Initialize the main composite shape and satellite spheres
let compositeShape = new CompositeShape({ x: size / 2, y: size / 2, z: 0 }, baseRadius, baseHeight, 30);
let satelliteSphere1 = new Sphere({ x: size / 2 - orbitRadius, y: size / 2, z: 0 }, segmentRadius, 30);
let satelliteSphere2 = new Sphere({ x: size / 2 + orbitRadius, y: size / 2, z: 0 }, segmentRadius, 30);

// General-purpose logging function
function logSelection(index, color, fromFunction = 'getColors') {
  console.log(`[${fromFunction}] Selected Index: ${index}, Color: ${color}`);
}
