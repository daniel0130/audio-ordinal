function getColors(angle, tm, v) {
  return [
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? '#00001E' : 'black', // #1 Red Scorpion
((Math.floor(v[0].x / 120) + Math.floor(v[0].y / 15)) % 73 === 0) ? '#43111E' : 'black', // #2 Bright Red Runner
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 98)) % 7 === 0) ? 'red' : 'black',        // #3 Blue Scorpion
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 95)) % 16 === 0) ? 'blue' : 'black', // #4 Green Sliders
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? 'green' : 'black', // #5 Yellow slider
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? 'yellow' : 'black', // #6 Orange slider
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? 'purple' : 'black', // #7 Light Pink SLiders
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? 'orange' : 'black', // #8 Light Blue Slider
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? 'pink' : 'black', // #9 Pink SLiders
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? 'cyan' : 'black', // #10 Green Slider
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? 'magenta' : 'black', // #11 pastel blue sliders
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? 'lime' : 'black', // #12 Deep red slider
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? 'teal' : 'black', // #13 dark pink slider
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? 'maroon' : 'black', // #14
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? 'navy' : 'black', // #15 yellow slider
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? 'olive' : 'black', // #16 white sliders
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? 'silver' : 'black', // #17
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? 'gold' : 'black', // #18
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? 'indigo' : 'black', // #19
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? 'turquoise' : 'black', // #20 - CRAZY FROG (Flash warning)
`hsl(${tm % 1 * 360}, 100%, 50%)`,                // #21 - The Rainbow
`hsl(${(tm + 1) % 1 * 360}, 100%, 50%)`,  // #22
`hsl(${tm % 72 * 5}, 100%, 50%)`, // #23
`hsl(${(tm + 18) % 72 * 5}, 100%, 50%)`,  // #24
`hsl(${(tm * 180) % 360}, 100%, 50%)`,  // #25 SLIGHTLY DIFF FLASH
`hsl(${((tm + 1) * 180) % 360}, 100%, 50%)`,  // #26
`hsl(${(tm * 5) % 360}, 100%, 50%)`,  // #27 CRAZY WHITE FLASH
`hsl(${((tm + 18) * 5) % 360}, 100%, 50%)`, // #28
`hsl(${(tm % 0.25) * 360}, 100%, 50%)`, // #29 CRAZY ORANGE FLASH
`hsl(${((tm + 1) % 0.25) * 360}, 100%, 50%)`, // #30
`hsl(${(tm % 6) * 60}, 100%, 50%)`, // #31
`hsl(${((tm + 18) % 6) * 60}, 100%, 50%)`,  // #32
`hsl(${(tm % 0.5) * 720}, 100%, 50%)`,  // #33 CRAZY FLASHING
`hsl(${((tm + 1) % 0.5) * 720}, 100%, 50%)`,  // #34  CRAZY FLASHING
`hsl(${(tm % 9) * 40}, 100%, 50%)`, // #35 - CRAZY FLASHING
`hsl(${((tm + 18) % 9) * 40}, 100%, 50%)`,  // #36  RED ORANGE FLASHING FRAMES
`hsl(${(tm % 0.125) * 180}, 100%, 50%)`,  // #37 RED ORANGE FLASHING FRAMES
`hsl(${((tm + 1) % 0.125) * 180}, 100%, 50%)`,  // #38 CRAZY FLASH WARNING
`hsl(${(tm % 18) * 20}, 100%, 50%)`,  // #39 CRAZY FLASH WARNING
`hsl(${((tm + 18) % 18) * 20}, 100%, 50%)`, // #40 - Plain Lime
Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 85) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 170) % 255})` : 'alternative-color',
Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255) + 50})` : 'alternative-color',
Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? (Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? 'blue' : 'red') : 'alternative-color',
Math.floor((v[0].z + R) / (2 * R) * 360) < 180 ? `hsl(${Math.floor((v[0].z + R) / (2 * R) * 360)}, 100%, 50%)` : 'alternative-color',
Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', //  #44 - The Crazy One
Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, 0, ${255 - Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #46 Plain Pink
Math.floor((v[0].z + R) / (2 * R) * 360) < 180 ? `hsl(${Math.floor((v[0].z + R) / (2 * R) * 360)}, 100%, 50%)` : 'alternative-color', // #47 Goggle Eyes
Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgba(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, 0.5)` : 'alternative-color', // #48 Plain pastel pink
Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, 100, 150)` : 'alternative-color', // #49 Crazy Circus
Math.random() < 0.5 ? '#' + Math.floor(Math.random() * 16777215).toString(16) : 'alternative-color',  // #50 Crazy Circus (slightly less crazy)
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 360)}, 30%, 50%)`, // #51 Purple Crazy Circus
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60) + 40}, 50%, 50%)` : `hsl(${Math.floor(Math.random() * 60) + 250}, 70%, 50%)`, // #52 blue/brown Crazy Circus
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 40) + 30}, 70%, 30%)` : `hsl(${Math.floor(Math.random() * 60) + 180}, 70%, 60%)`, // #53 Purple Orange Crazy Circus
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 40) + 30}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 30) + 270}, 80%, 50%)`,// #54 red white blue Crazy Circus
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 360)}, 60%, 80%)` : `hsl(${Math.floor(Math.random() * 360)}, 100%, 40%)`, // #55 Blue Orange Crazy Circus
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 30) + 240}, 70%, 40%)` : `hsl(${Math.floor(Math.random() * 30) + 10}, 80%, 60%)`, // #56 Green Blue Crazy Circus
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60) + 220}, 80%, 50%)` : `hsl(${Math.floor(Math.random() * 60) + 30}, 90%, 50%)`, // #57 Yellow green Crazy Circus
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 50) + 90}, 40%, 40%)` : `hsl(${Math.floor(Math.random() * 30) + 40}, 60%, 50%)`,
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60) + 180}, 70%, 50%)` : `hsl(${Math.floor(Math.random() * 40) + 10}, 90%, 60%)`, // #59 Bright yellow circus
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 50) + 70}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 50) + 20}, 100%, 50%)`,
Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60)}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 60) + 180}, 100%, 50%)`, // #61 Dark Blue Water Effect
      
    // #61 Using ES6 arrow functions and template literals for a cleaner look - dark water
`rgb(${Array.from({length: 3}, () => Math.random() * ((v[0].z + R) / (2 * R) * 255)).join(',')})`,
// #62 Introducing HSL color space for a more vibrant outcome - SAME AS #66
`hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(50 + Math.random() * 50)}%, ${Math.floor(40 + Math.random() * 60)}%)`,
// #63 Adding a function to compute the color or return 'alternative-color' 
(() => {
  const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (2 * R) * 255));
  return colorValue > 128 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
})(),
// #65 Generating a random alpha for RGBA for semi-transparency effects - - GLASS DISCO BALLS 
`rgba(${[...Array(3)].map(() => Math.floor(Math.random() * ((v[0].z + R) / (2 * R) * 255))).join(', ')}, ${Math.random().toFixed(2)})`,
// #66 Using bitwise operators for a more compact approach - XRAY SPECS 
`rgb(${((v[0].z + R) / (2 * R) * 255) & 255}, ${((v[0].z + R) / (2 * R) * 255) & 255}, ${((v[0].z + R) / (2 * R) * 255) & 255})`,
// #67 Dynamic alternative-color based on lightness - GREY SCALE CRAZY ONE 
((lightness) => lightness > 128 ? `rgb(${lightness}, ${lightness}, ${lightness})` : 'dark-mode-color')(Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)),
// #68 Conditional spread for RGB values, spreading more red under certain conditions - RED BLACK DISCO BALLS 
`rgb(${Math.random() < 0.5 ? Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) : 255}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})`,
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

// #74
(() => {
  const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (2 * R) * 255));
  return colorValue > 16 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
})(),

// #75
(() => {
  const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (2 * R) * 255));
  return colorValue > 8 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
})(),

// #76
(() => {
  const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (3 * R) * 255));
  return colorValue > 64 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
})(),

// #77
(() => {
  const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (4 * R) * 255));
  return colorValue > 32 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
})(),

// #78
(() => {
  const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (5 * R) * 255));
  return colorValue > 16 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
})(),

// #79
(() => {
  const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (6 * R) * 255));
  return colorValue > 8 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
})(),

// #79
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 64)}, ${Math.floor(Math.sin(Date.now() / 1000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #80
`rgb(${Math.floor(Math.sin(Date.now()) * 12 + 32)}, ${Math.floor(Math.sin(Date.now() / 1000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #81
`rgb(${Math.floor(Math.sin(Date.now()) * 1 + 16)}, ${Math.floor(Math.sin(Date.now() / 1000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #82
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 8)}, ${Math.floor(Math.sin(Date.now() / 100) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #83
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 4)}, ${Math.floor(Math.sin(Date.now() / 10) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #84
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 2)}, ${Math.floor(Math.sin(Date.now() / 1) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #85
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 2)}, ${Math.floor(Math.sin(Date.now() / 10) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #86
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 2)}, ${Math.floor(Math.sin(Date.now() / 100) * 127 + 64)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #87
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 2)}, ${Math.floor(Math.sin(Date.now() / 1000) * 127 + 32)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #88
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 2)}, ${Math.floor(Math.sin(Date.now() / 100000) * 127 + 16)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #89
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 2)}, ${Math.floor(Math.sin(Date.now() / 1000000) * 127 + 8)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #90
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 2)}, ${Math.floor(Math.sin(Date.now() / 10000000) * 1 + 1)}, ${Math.floor(Math.sin(Date.now() / 20000) * 127 + 128)})`,
// #91
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

// #96
// Example for green to cyan gradient with a slower oscillation
() => {
  const oscGradient = cx.createLinearGradient(0, 0, S, S);
  oscGradient.addColorStop(Math.abs(Math.sin(tm / 4000)), 'green');
  oscGradient.addColorStop(1 - Math.abs(Math.sin(tm / 4000)), 'cyan');
  cx.fillStyle = oscGradient;
  cx.fillRect(0, 0, S, S); // Adjusted to fill the canvas

  console.log('Oscillation value:', Math.abs(Math.sin(tm / 4000)));
  console.log('Gradient colors:', 'green', 'cyan');
},

// #97
// A gradient that oscillates from pink to yellow with medium timing
() => {
  cx.fillStyle = `hsl(${Math.abs(Math.sin(tm / 2500)) * 60}, 100%, 50%)`;
  cx.fillRect(0, 0, S, S);
},

// Creating a sharp contrast with black and white, and very fast oscillation
() => {
  cx.fillStyle = Math.sin(tm / 1000) > 0 ? 'black' : 'white';
  cx.fillRect(0, 0, S, S);
},

// A serene blue to light blue gradient with gentle timing
() => {
  let percent = Math.abs(Math.sin(tm / 5000));
  cx.fillStyle = `rgb(${0 + percent * (173 - 0)}, ${0 + percent * (216 - 0)}, ${255})`; // Darkblue to light blue
  cx.fillRect(0, 0, S, S);
},

// Vibrant red to violet transition with moderate speed
() => {
  cx.fillStyle = `hsl(${Math.abs(Math.sin(tm / 3000)) * 300}, 100%, 50%)`; // Red to violet
  cx.fillRect(0, 0, S, S);
},

// A dynamic shift from teal to mint, showcasing a refreshing palette
() => {
  let percent = Math.abs(Math.sin(tm / 3500));
  cx.fillStyle = `rgb(${0 + percent * (64 - 0)}, ${128 + percent * (188 - 128)}, ${128 + percent * (128 - 128)})`; // Teal to mint
  cx.fillRect(0, 0, S, S);
},

// Earthy tones with olive and sienna, for a natural oscillation effect
() => {
  let percent = Math.abs(Math.sin(tm / 4500));
  cx.fillStyle = `rgb(${128 + percent * (160 - 128)}, ${128 + percent * (82 - 128)}, ${0 + percent * (45 - 0)})`; // Olive to sienna
  cx.fillRect(0, 0, S, S);
},

// A dazzling combination of gold to silver, with a quick transition
() => {
  let percent = Math.abs(Math.sin(tm / 2000));
  cx.fillStyle = `rgb(${255}, ${215 + percent * (192 - 215)}, ${0 + percent * (192 - 0)})`; // Gold to silver
  cx.fillRect(0, 0, S, S);
},

// Luminous neon colors from lime to magenta for a bold effect
() => {
  cx.fillStyle = `hsl(${Math.abs(Math.sin(tm / 2200)) * 300}, 100%, 50%)`; // Lime to magenta
  cx.fillRect(0, 0, S, S);
}

];
}

