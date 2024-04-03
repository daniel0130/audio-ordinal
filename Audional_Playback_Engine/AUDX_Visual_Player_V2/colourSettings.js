function getColors(angle, tm, v) {
  return [
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? '#00001E' : 'black', // #1 Red Scorpion
((Math.floor(v[0].x / 120) + Math.floor(v[0].y / 15)) % 73 === 0) ? '#43111E' : 'black', // #2 Bright Red Runner
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 98)) % 7 === 0) ? 'red' : 'black',        // #3 Blue Scorpion
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 95)) % 16 === 0) ? 'blue' : 'black', // #4 Green Sliders

((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? 'turquoise' : 'black', // #20 - CRAZY FROG (Flash warning)
`hsl(${tm % 1 * 360}, 100%, 50%)`,                // #21 - The Rainbow
`hsl(${(tm + 1) % 1 * 360}, 100%, 50%)`,  // #22
`hsl(${tm % 72 * 5}, 100%, 50%)`, // #23
`hsl(${(tm + 18) % 72 * 5}, 100%, 50%)`,  // #24
`hsl(${(tm * 180) % 360}, 100%, 50%)`,  // #25 SLIGHTLY DIFF FLASH
`hsl(${((tm + 1) % 0.125) * 180}, 100%, 50%)`,  // #38 CRAZY FLASH WARNING
`hsl(${(tm % 18) * 20}, 100%, 50%)`,  // #39 CRAZY FLASH WARNING
`hsl(${((tm + 18) % 18) * 20}, 100%, 50%)`, // #40 - Plain Lime
Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 85) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 170) % 255})` : 'alternative-color',
Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255) + 50})` : 'alternative-color',
Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? (Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? 'blue' : 'red') : 'alternative-color',
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60) + 180}, 70%, 50%)` : `hsl(${Math.floor(Math.random() * 40) + 10}, 90%, 60%)`, // #59 Bright yellow circus
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 50) + 70}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 50) + 20}, 100%, 50%)`,
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60)}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 60) + 180}, 100%, 50%)`, // #61 Dark Blue Water Effect
      
    // #61 Using ES6 arrow functions and template literals for a cleaner look - dark water
`rgb(${Array.from({length: 3}, () => Math.random() * ((v[0].z + R) / (2 * R) * 255)).join(',')})`,
// #69 Incorporating CSS variables for dynamic theming -  NOTHING HERE 
`var(--dynamic-color, rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}))`,
// #70 Utilizing Math.sin for a cyclic color variation -  LOVE THIS ONE - CRAZY FROG EYES II 
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 1000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #71 Experimenting with a ternary operator inside the template literal for an alternative approach SPINNING RED BLACK EYES
`rgb(${Math.random() * 255 > 128 ? Math.floor((v[0].z + R) / (2 * R) * 255) : 100}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)})`,

// #72
(() => {
  const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (2 * R) * 255));
  return colorValue > 64 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
})(),

// #73
(() => {
  const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (2 * R) * 255));
  return colorValue > 32 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
})(),

`rgb(${Math.floor(Math.sin(Date.now()) * 506 + 750)}, ${Math.floor(Math.sin(Date.now() / -17) / -750 * 127)}, ${Math.floor(Math.sin(Date.now() / 2000) * 2000 + 10002)})`,
// #92
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 4)}, ${Math.floor(Math.sin(Date.now() / 10) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 5000) * 127 + 32)})`,
// #93  - RED PINK CRAZY GOGGLE EYES
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 512)}, ${Math.floor(Math.sin(Date.now() / 1) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 1000) * 127 + 8)})`,

//#94
// Assuming an animation loop is calling this function repeatedly
() => {
  // Define base colors
  let baseRed = 200;
  let baseGreen = 100;
  let baseBlue = 150;

  // Oscillate colors within a narrow range to ensure visibility
  let oscillationFactor = Math.floor(Math.random() * 10); // Small random change

  // Apply oscillated colors
  cx.fillStyle = `rgb(${(baseRed + oscillationFactor) % 255}, ${(baseGreen + oscillationFactor) % 255}, ${(baseBlue + oscillationFactor) % 255})`;
  cx.fillRect(0, 0, S, S);
},

// #95 - FLASHING RED EYE
`rgb(${Math.floor(Math.sin(Date.now()) * 111 + 200000)}, ${Math.floor(Math.sin(Date.now() / 1) * 127 + 12)}, ${Math.floor(Math.sin(Date.now() / 100) * 127 + 4)})`,

// #95 - Oscillating gradient from purple to orange
() => {
  const oscGradient = cx.createLinearGradient(0, 0, S, S);
  oscGradient.addColorStop(Math.abs(Math.sin(tm / 1500)), 'purple');
  oscGradient.addColorStop(1 - Math.abs(Math.sin(tm / 1500)), 'orange');
  cx.fillStyle = oscGradient;
  cx.fillRect(0, 0, S, S); // Ensure to fill the correct area

  console.log('Oscillation value:', Math.abs(Math.sin(tm / 1500)));
  console.log('Gradient colors:', 'purple', 'orange');
},


// Luminous neon colors from lime to magenta for a bold effect
() => {
  cx.fillStyle = `hsl(${Math.abs(Math.sin(tm / 2200)) * 300}, 100%, 50%)`; // Lime to magenta
  cx.fillRect(0, 0, S, S);
}

];
}

