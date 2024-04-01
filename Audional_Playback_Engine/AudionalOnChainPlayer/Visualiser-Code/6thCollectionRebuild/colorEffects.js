
let arrayIndex = 0; // Initialize globally
let colorIndex = 0; // Initialize globally

function updateColor() {
    if(arrayIndex >= 0 && arrayIndex < colorEffectArrays.length) {
        const colors = getColorsByCCI(0, 0, [{z: 1}], arrayIndex, colorIndex); // Use the latest indices
        console.log(colors); // Use the selected color
        // Additional logic to apply the color can go here
    } else {
        console.log('default-color'); // Handle out-of-bounds index
    }
}

function getColorsByCCI(angle, tm, v, cci, colorIndex) {
    if (cci >= 0 && cci < colorEffectArrays.length) {
        const colorEffectArray = colorEffectArrays[cci].func;
        const colors = colorEffectArray(angle, tm, v);
        return colors[colorIndex] || colors[0];
    } else {
        return 'default-color';
    }
}

function arrayZero (angle, tm, v) { // #0 - The Crazy One
    return [
        `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 100%, 50%)`,
    ];
}

// Define color effect functions
function frog1(angle, tm, v) { // #1 - The Pulsing Heart
    return [
        Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', //  #0 - The Crazy One
    ];
}

function sirens (angle, tm, v) { // #2 - The Breathing Forest
    return [
        `rgb(${255 - (tm % 255)}, ${tm % 255}, ${(angle + tm) % 255})`, // Color changes with time and angle
        `rgb(${155 - (tm % 155)}, ${tm % 155}, ${(angle + tm) % 155})`, // Color changes with time and angle
        `rgb(${100 - (tm % 100)}, ${tm % 100}, ${(angle + tm) % 100})`,
        `rgb(${200 - (tm % 200)}, ${tm % 200}, ${(angle + tm) % 200})`,
        `rgb(${50 - (tm % 50)}, ${tm % 50}, ${(angle + tm) % 50})`,
        `rgb(${150 - (tm % 150)}, ${tm % 150}, ${(angle + tm) % 150})`,
        `rgb(${210 - (tm % 210)}, ${tm % 210}, ${(angle + tm) % 210})`,,
        `rgb(${180 - (tm % 180)}, ${tm % 180}, ${(angle + tm) % 180})`,,
        `rgb(${230 - (tm % 230)}, ${tm % 230}, ${(angle + tm) % 230})`,,
        `rgb(${120 - (tm % 120)}, ${tm % 120}, ${(angle + tm) % 120})`,,
        `rgb(${190 - (tm % 190)}, ${tm % 190}, ${(angle + tm) % 190})`,,
        `rgb(${80 - (tm % 80)}, ${tm % 80}, ${(angle + tm) % 80})`,
        `rgb(${170 - (tm % 170)}, ${tm % 170}, ${(angle + tm) % 170})`,
        `rgb(${220 - (tm % 220)}, ${tm % 220}, ${(angle + tm) % 220})`,
        `rgb(${70 - (tm % 70)}, ${tm % 70}, ${(angle + tm) % 70})`,
        `rgb(${140 - (tm % 140)}, ${tm % 140}, ${(angle + tm) % 140})`,
        `rgb(${240 - (tm % 240)}, ${tm % 240}, ${(angle + tm) % 240})`,
        `rgb(${30 - (tm % 30)}, ${tm % 30}, ${(angle + tm) % 30})`,
        `rgb(${160 - (tm % 160)}, ${tm % 160}, ${(angle + tm) % 160})`,
        `rgb(${250 - (tm % 250)}, ${tm % 250}, ${(angle + tm) % 250})`,
    ];
}

function multiColourFlashes(angle, tm, v) { // #3 - The Whispering Ocean
    return [
        `rgb(${Math.floor(Math.sin(Date.now() / 550) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 575) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 6000) * 127 + 64)})`, // #108 Muted gold to orange flicker
        `rgb(${Math.floor(Math.sin(Date.now() / 620) * 127 + 64)}, ${Math.floor(Math.sin(Date.now() / 640) * 127 + 255)}, ${Math.floor(Math.sin(Date.now() / 660) * 127 + 128)})`, // #109 Neon green and violet flash
        `rgb(${Math.floor(Math.sin(Date.now() / 780) * 127 + 64)}, ${Math.floor(Math.sin(Date.now() / 800) * 127 + 255)}, ${Math.floor(Math.sin(Date.now() / 820) * 127 + 64)})`, // #112 Cool mint flash
        // #95 Quick flashing red to orange
        `rgb(${Math.floor(Math.sin(Date.now() / 200) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 250) * 127 + 64)}, ${Math.floor(Math.sin(Date.now() / 3000) * 127 + 32)})`,
        // #97 Bright yellow flicker
        `rgb(${Math.floor(Math.sin(Date.now() / 500) * 127 + 255)}, ${Math.floor(Math.sin(Date.now() / 600) * 127 + 255)}, ${Math.floor(Math.sin(Date.now() / 7000) * 127 + 64)})`,
        // #100 Ultra-fast red and green blip
        `rgb(${Math.floor(Math.sin(Date.now() / 100) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 120) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 14000) * 127 + 32)})`,
        // #103 Rapid flash across the spectrum
        `rgb(${Math.floor(Math.sin(Date.now() / 150) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 180) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 210) * 127 + 128)})`,
          
    ];
}

// GOOGLY EYES - Array
function googlyEyes (angle, tm, v) { // #4 - The Dancing Flames
    return [
// #79
`rgb(${Math.floor(Math.sin(Date.now()) * 127 + 64)}, ${Math.floor(Math.sin(Date.now() / 1000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
// #80
`rgb(${Math.floor(Math.sin(Date.now()) * 12 + 32)}, ${Math.floor(Math.sin(Date.now() / 1000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
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
// #95 - FLASHING RED EYE
`rgb(${Math.floor(Math.sin(Date.now()) * 111 + 200000)}, ${Math.floor(Math.sin(Date.now() / 1) * 127 + 12)}, ${Math.floor(Math.sin(Date.now() / 100) * 127 + 4)})`,
];
}

    // Single/Dual colour Disco Combos
    function singleDualColourDisco (angle, tm, v) { // #5 - The Glowing Eyes
    return [
    `rgb(${Math.random() < 0.5 ? Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) : 255}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})`,
    `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() < 0.4 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})`, // Bright Green Influence
    `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() < 0.3 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})`, // Bright Blue Influence
    `rgb(${Math.random() < 0.7 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() < 0.7 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})`, // Bright Yellow Influence
    `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() < 0.5 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() < 0.5 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})`, // Bright Cyan Influence
    `rgb(${Math.random() < 0.8 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() < 0.8 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})`, // Bright Pink Influence
    `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() < 0.9 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() < 0.9 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})`, // Bright Lime Influence
    `rgb(${Math.random() < 0.2 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() < 0.2 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})`, // Bright Red Influence
    `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() < 0.1 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() < 0.1 ? 255 : Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})`, // Bright Orange Influence
    ];
}

      //Disco Balls
    function discoBalls (angle, tm, v) { // #6 - The Glowing Eyes
    return [
  //Disco Ball Deep Colour
  `rgb(${Math.floor(Math.pow(Math.random(), 2) * 255)}, ${Math.floor(Math.pow(Math.random(), 3) * 255)}, ${Math.floor(Math.random() * 255)})`,
  //Disco Ball lighter Colour
  `hsla(${Math.random() * 360}, 100%, 50%, ${Math.random()})`,
  // #76 Implementing complementary colors for a vibrant contrast
  `rgb(${255 - Math.floor(Math.random() * 255)}, ${255 - Math.floor(Math.random() * 255)}, ${255 - Math.floor(Math.random() * 255)})`,
  // #77 Generating a 'glitch' effect with sharp color shifts
  `rgb(${Math.random() < 0.1 ? 255 : Math.floor(Math.random() * 255)}, ${Math.random() < 0.1 ? 0 : Math.floor(Math.random() * 255)}, ${Math.random() < 0.1 ? 255 : Math.floor(Math.random() * 255)})`,
  // #78 Creating a pastel effect using light colors and high saturation
  `hsl(${Math.random() * 360}, ${Math.floor(60 + Math.random() * 40)}%, ${Math.floor(85 + Math.random() * 15)}%)`,
  // #79 Introducing a neon glow with bright colors and stark contrast
  `rgb(${Math.floor(Math.random() * 55 + 200)}, ${Math.floor(Math.random() * 55 + 200)}, ${Math.floor(Math.random() * 55)})`,
  // Vivid Disco Ball
  `rgb(${Math.floor(Math.random() * 2) * 255}, ${Math.floor(Math.random() * 2) * 255}, ${Math.floor(Math.random() * 2) * 255})`,
  // Orange Pastel Disco Ball
  `rgb(${Math.floor(Math.random() * 112 + 144)}, ${Math.floor(Math.random() * 66 + 90)}, ${Math.floor(Math.random() * 35 + 60)})`,
   // #61 Using ES6 arrow functions and template literals for a cleaner look - dark water
   `rgb(${Array.from({length: 3}, () => Math.random() * ((v[0].z + R) / (2 * R) * 255)).join(',')})`,
   // #62 Introducing HSL color space for a more vibrant outcome - SAME AS #66
   `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(50 + Math.random() * 50)}%, ${Math.floor(40 + Math.random() * 60)}%)`,
     // #65 Generating a random alpha for RGBA for semi-transparency effects - - GLASS DISCO BALLS 
   `rgba(${[...Array(3)].map(() => Math.floor(Math.random() * ((v[0].z + R) / (2 * R) * 255))).join(', ')}, ${Math.random().toFixed(2)})`,
   // #69 Incorporating CSS variables for dynamic theming -  NOTHING HERE 
   `var(--dynamic-color, rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}))`,
   // #70 Utilizing Math.sin for a cyclic color variation -  LOVE THIS ONE - CRAZY FROG EYES II 
   `rgb(${Math.floor(Math.sin(Date.now()) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 1000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
   // #71 Experimenting with a ternary operator inside the template literal for an alternative approach SPINNING RED BLACK EYES
   `rgb(${Math.random() * 255 > 128 ? Math.floor((v[0].z + R) / (2 * R) * 255) : 100}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)})`,
    //Spakley DiscoBall
    Math.random() > 0.99 ? `rgb(${Math.random() * 64}, ${Math.random() * 64}, ${Math.random() * 64})` : 'rgb(32, 32, 32)', // #7 - The Whisper of Color
    Math.random() < 0.05 ? `rgb(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 100)})` : 'rgb(25, 25, 25)', // #11 - The Rare Color
    Math.random() < 0.1 ? `rgb(${Math.random() * 55 + 200}, ${Math.random() * 55 + 200}, ${Math.random() * 55 + 200})` : 'rgb(227, 227, 227)', // #19 - The Dawn
    Math.random() > 0.5 ? `rgb(0, 0, 0)` : 'rgb(255, 255, 255)', // #5 - The Black and White
        // white/Disco
  t % 1900 > 950 ? `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})` : 'rgb(128, 128, 128)', // #18 - The Color Shuffle
  t % 2000 < 1000 ? `rgb(${Math.floor((v[0].z + R) / (9 * R) * 255)}, ${Math.floor((v[0].z + R) / (9 * R) * 255)}, ${Math.floor((v[0].z + R) / (9 * R) * 255)})` : 'rgb(112, 112, 112)', // #20 - The Evening Calm
  `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`, // Random colors
  `hsl(${Math.random() * 360}, 100%, ${50 + 25 * Math.cos(tm / 1000)}%)`,
  `hsl(${Math.random() * 360}, 100%, ${50 + 25 * Math.cos(tm / 1000)}%)`,


    ];
}

  // Colour Fade Effects
  function colourFadeEffects (angle, tm, v) { // #7 - The Shifting Shadows
    return [
  Math.random() * Math.sin(t / 100) > 0.5 ? `rgb(${Math.floor(Math.abs(Math.sin(t / 100)) * 255)}, 0, 0)` : 'alternative-color', // #1 - The Pulsing Heart
  Math.random() * Math.cos(t / 150) < 0.4 ? `rgb(0, ${Math.floor(Math.abs(Math.cos(t / 150)) * 255)}, 0)` : 'alternative-color', // #2 - The Breathing Forest
  Math.random() + Math.sin(t / 200) < 0.75 ? `rgb(0, 0, ${Math.floor(Math.abs(Math.sin(t / 200)) * 255)})` : 'alternative-color', // #3 - The Whispering Ocean
  Math.random() - Math.cos(t / 250) > 0.3 ? `rgb(${Math.floor(Math.abs(Math.cos(t / 250)) * 128)}, ${Math.floor(Math.abs(Math.cos(t / 250)) * 128)}, 0)` : 'alternative-color', // #4 - The Golden Twilight
  Math.random() * Math.sin(t / 300) > 0.6 ? `rgb(${Math.floor(Math.abs(Math.sin(t / 300)) * 128)}, 0, ${Math.floor(Math.abs(Math.sin(t / 300)) * 128)})` : 'alternative-color', // #5 - The Mysterious Magenta
  Math.random() * (1 - Math.sin(t / 350)) < 0.5 ? `rgb(0, ${Math.floor(Math.abs(1 - Math.sin(t / 350)) * 255)}, ${Math.floor(Math.abs(1 - Math.sin(t / 350)) * 255)})` : 'alternative-color', // #6 - The Icy Glimmer
  t % 400 < 200 ? `rgb(${Math.floor(Math.random() * (t % 200) + 55)}, ${Math.floor(Math.random() * (t % 200) + 55)}, ${Math.floor(Math.random() * (t % 200) + 55)})` : 'alternative-color', // #7 - The Shifting Shadows
  Math.random() + Math.tan(t / 450) > 1 ? `rgb(${Math.floor(Math.abs(Math.tan(t / 450)) * 255)}, ${Math.floor(Math.abs(Math.tan(t / 450)) * 255)}, 0)` : 'alternative-color', // #8 - The Blazing Sunlight
  Math.random() * (Math.cos(t / 500) + Math.sin(t / 500)) < 0.5 ? `rgb(0, ${Math.floor(Math.abs(Math.sin(t / 500)) * 255)}, ${Math.floor(Math.abs(Math.cos(t / 500)) * 255)})` : 'alternative-color', // #9 - The Cool Breeze
  Math.random() * Math.pow(Math.sin(t / 550), 2) > 0.7 ? `rgb(${Math.floor(Math.abs(Math.pow(Math.sin(t / 550), 2)) * 255)}, 0, ${Math.floor(Math.abs(Math.pow(Math.sin(t / 550), 2)) * 255)})` : 'alternative-color', // #10 - The Deep Purple Pulse
  `rgb(${Math.floor(128 + Math.sin(Date.now() / 1000) * 127)}, ${Math.floor(128 + Math.sin(Date.now() / 1500) * 127)}, ${Math.floor(128 + Math.sin(Date.now() / 2000) * 127)})`,
  // #81
  `rgb(${Math.floor(Math.sin(Date.now()) * 1 + 16)}, ${Math.floor(Math.sin(Date.now() / 1000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,
  // #94 Slow pulsing violet to blue transition
  `rgb(${Math.floor(Math.sin(Date.now() / 3000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 4000) * 127 + 64)}, ${Math.floor(Math.sin(Date.now() / 5000) * 127 + 200)})`,
  
  // #96 Gentle green to teal waves
  `rgb(${Math.floor(Math.sin(Date.now() / 3500) * 127 + 32)}, ${Math.floor(Math.sin(Date.now() / 4000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 4500) * 127 + 128)})`,
  
  // #98 Slow morphing magenta to pink
  `rgb(${Math.floor(Math.sin(Date.now() / 5500) * 127 + 200)}, ${Math.floor(Math.sin(Date.now() / 6000) * 127 + 50)}, ${Math.floor(Math.sin(Date.now() / 6500) * 127 + 128)})`,
  
  // #99 Deep blue to purple oscillation
  `rgb(${Math.floor(Math.sin(Date.now() / 7000) * 127 + 32)}, ${Math.floor(Math.sin(Date.now() / 7500) * 127 + 32)}, ${Math.floor(Math.sin(Date.now() / 8000) * 127 + 255)})`,
  // #101 Slow fade from orange to deep red
  `rgb(${Math.floor(Math.sin(Date.now() / 8000) * 127 + 255)}, ${Math.floor(Math.sin(Date.now() / 8500) * 127 + 64)}, ${Math.floor(Math.sin(Date.now() / 9000) * 127 + 32)})`,
  
  // #102 Cyan to soft blue pulse
  `rgb(${Math.floor(Math.sin(Date.now() / 9500) * 127 + 32)}, ${Math.floor(Math.sin(Date.now() / 10000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 10500) * 127 + 255)})`,
  // #104 Slow transition through blues and greens
  `rgb(${Math.floor(Math.sin(Date.now() / 4000) * 127 + 32)}, ${Math.floor(Math.sin(Date.now() / 4200) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 4400) * 127 + 128)})`,
  
  // #105 Gentle pink and purple glow
  `rgb(${Math.floor(Math.sin(Date.now() / 3500) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 3700) * 127 + 64)}, ${Math.floor(Math.sin(Date.now() / 3900) * 127 + 128)})`,
  
  // #106 Slow pulsing reds with a touch of blue
  `rgb(${Math.floor(Math.sin(Date.now() / 4500) * 127 + 255)}, ${Math.floor(Math.sin(Date.now() / 4700) * 127 + 32)}, ${Math.floor(Math.sin(Date.now() / 4900) * 127 + 128)})`,
  
  // #107 Oceanic theme: Deep blue to turquoise
  `rgb(${Math.floor(Math.sin(Date.now() / 5000) * 127 + 32)}, ${Math.floor(Math.sin(Date.now() / 5200) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 5400) * 127 + 255)})`,
  // #110 Subtle lavender to soft yellow transition
  `rgb(${Math.floor(Math.sin(Date.now() / 6800) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 7000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 7200) * 127 + 64)})`,
  
  // #111 Warm sunset: Red to yellow pulse
  `rgb(${Math.floor(Math.sin(Date.now() / 7300) * 127 + 255)}, ${Math.floor(Math.sin(Date.now() / 7500) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 7700) * 127 + 32)})`,
  
  // #113 Dusk to night: Purple to dark blue slow fade
  `rgb(${Math.floor(Math.sin(Date.now() / 8400) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 8600) * 127 + 32)}, ${Math.floor(Math.sin(Date.now() / 8800) * 127 + 255)})`,
  
  ];
}

    // Burning Orbs
    function burningOrbs (angle, tm, v) { // #8 - The Burning Orbs
    return [
    Math.random() < 0.5 ? `rgb(${Math.floor((v[0].z + R) / (4 * R) * 128)}, 0, 0)` : 'alternative-color', // #1 - The Red Shift
    Math.random() > 0.75 ? `rgb(0, ${Math.floor((v[0].z + R) / (4 * R) * 128)}, 0)` : 'alternative-color', // #2 - The Green Light
    Math.random() < 0.25 ? `rgb(0, 0, ${Math.floor((v[0].z + R) / (4 * R) * 128)})` : 'alternative-color', // #3 - The Blue Note
    Math.random() < 0.6 ? `rgb(${Math.floor((v[0].z + R) / (3 * R) * 192)}, 0, 0)` : 'alternative-color', // #1 - The Deep Red Surge
    Math.random() > 0.8 ? `rgb(0, ${Math.floor((v[0].z + R) / (3 * R) * 192)}, 0)` : 'alternative-color', // #2 - The Intense Green Beam
    Math.random() < 0.2 ? `rgb(0, 0, ${Math.floor((v[0].z + R) / (3 * R) * 192)})` : 'alternative-color', // #3 - The Bright Blue Pulse
    Math.random() < 0.7 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 64)}, ${Math.floor((v[0].z + R) / (4 * R) * 32)}, 0)` : 'alternative-color', // #4 - The Sunset Glow
    Math.random() > 0.85 ? `rgb(0, ${Math.floor((v[0].z + R) / (5 * R) * 255)}, ${Math.floor((v[0].z + R) / (5 * R) * 255)})` : 'alternative-color', // #5 - The Cool Cyan Whisper
    Math.random() < 0.3 ? `rgb(${Math.floor((v[0].z + R) / (6 * R) * 255)}, ${Math.floor((v[0].z + R) / (6 * R) * 128)}, 0)` : 'alternative-color', // #6 - The Warm Amber Flash
    Math.random() > 0.9 ? `rgb(${Math.floor((v[0].z + R) / (7 * R) * 255)}, ${Math.floor((v[0].z + R) / (7 * R) * 255)}, ${Math.floor((v[0].z + R) / (7 * R) * 255)})` : 'alternative-color', // #7 - The Brilliant White Star
    Math.random() < 0.4 ? `rgb(0, ${Math.floor((v[0].z + R) / (4 * R) * 64)}, ${Math.floor((v[0].z + R) / (4 * R) * 128)})` : 'alternative-color', // #8 - The Mysterious Blue-Green
    Math.random() > 0.65 ? `rgb(${Math.floor((v[0].z + R) / (8 * R) * 255)}, 0, ${Math.floor((v[0].z + R) / (8 * R) * 255)})` : 'alternative-color', // #9 - The Purple Haze
    Math.random() < 0.55 ? `rgb(0, ${Math.floor((v[0].z + R) / (2 * R) * 128)}, ${Math.floor((v[0].z + R) / (3 * R) * 192)})` : 'alternative-color', // #10 - The Deep Ocean Current
    ];
}

function flashingOnes (angle, tm, v) { // #9 - The Flashing Ones
    return [
    t % 400 > 200 ? `rgb(0, 0, 0)` : 'white', // #1 - The Classic Flip Flashing white black
    t % 600 < 300 ? `rgb(${t % 255}, ${t % 255}, ${t % 255})` : `rgb(${255 - (t % 255)}, ${255 - (t % 255)}, ${255 - (t % 255)})`, // #2 - The Slow Pulse
    Math.sin(t / 1000) > 0.5 ? `rgb(${Math.floor(Math.abs(Math.cos(t / 1000)) * 255)}, ${Math.floor(Math.abs(Math.sin(t / 1000)) * 255)}, ${Math.floor(Math.abs(Math.cos(t / 1000)) * 255)})` : 'grey', // #3 - The Gentle Wave
    t % 800 < 400 ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)', // #6 - The Binary
    
    t % 1200 < 600 ? `rgb(${Math.floor((v[0].z + R) / (3 * R) * 120)}, ${Math.floor((v[0].z + R) / (3 * R) * 120)}, ${Math.floor((v[0].z + R) / (3 * R) * 120)})` : 'rgb(60, 60, 60)', // #10 - The Midnight
    t % 1400 > 700 ? 'rgb(100, 100, 100)' : 'rgb(155, 155, 155)', // #12 - The Grey Scale
    Math.abs(Math.sin(t / 1500)) < 0.5 ? `rgb(${255}, ${255}, ${255})` : 'rgb(0, 0, 0)', // #13 - The Eclipse
    
    // Stormy Night
    t % 1600 < 800 ? `rgb(${t % 128}, ${t % 128}, ${t % 128})` : `rgb(${128 - (t % 128)}, ${128 - (t% 128)}, ${128 - (t % 128)})`, // #14 - The Grayscale Dance
    
    
    Math.sin(t / 1700) > 0 ? `rgb(${Math.floor(255 - Math.abs(Math.sin(t / 1700)) * 100)}, ${Math.floor(255 - Math.abs(Math.sin(t / 1700)) * 100)}, ${Math.floor(255 - Math.abs(Math.sin(t / 1700)) * 100)})` : 'rgb(155, 155, 155)', // #15 - The Sine Night
    t % 1800 === 0 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (8 * R) * 120)}, ${Math.random() * Math.floor((v[0].z + R) / (8 * R) * 120)}, ${Math.random() * Math.floor((v[0].z + R) / (8 * R) * 120)})` : 'rgb(60, 60, 60)', // #16 - The Gentle Flicker
  ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? 'turquoise' : 'black', // #61 - CRAZY FROG (Flash warning)
  `hsl(${tm % 72}, 100%, 50%)`,

];
}

  // Favourite Crazy Frogs
  function crazyFrogs (angle, tm, v) { // #10 - The Crazy Frogs
    return [
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #0 - The Crazy One
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #1 - The Wild Card
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #2 - The Spectrum
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #3 - The Color Burst
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #4 - The Vibrant Mix
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #5 - The Electric Glow
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #6 - The Neon Flash
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #7 - The Psychedelic
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #8 - The Disco Ball
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #9 - The Kaleidoscope
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #10 - The Radiant Burst
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #11 - The Colorful Twist
  ];
  }

  //Grey crazy Frogs
  function greyCrazyFrogs (angle, tm, v) { // #11 - The Grey Crazy Frogs
    return [
   // #63 Adding a function to compute the color or return 'alternative-color' 
   (() => {
    const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (2 * R) * 255));
    return colorValue > 128 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
  })(),
  
  // #67 Dynamic alternative-color based on lightness - GREY SCALE CRAZY ONE 
  ((lightness) => lightness > 128 ? `rgb(${lightness}, ${lightness}, ${lightness})` : 'dark-mode-color')(Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)),
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
  
  // #80 Gradual grayscale transition with a lower bound
  (() => {
    const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (7 * R) * 255));
    return colorValue > 4 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
  })(),
  
  // #81 Introducing a subtle shift towards lighter grays
  (() => {
    const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (8 * R) * 255));
    return colorValue > 128 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'light-mode-color';
  })(),
  
  // #82 Mixing thresholds for an unpredictable pattern
  (() => {
    const threshold = [64, 128, 32, 16].sort(() => 0.5 - Math.random())[0];
    const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (2 * R) * 255));
    return colorValue > threshold ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
  })(),
  
  // #83 Dynamic range with a random factor affecting lightness
  (() => {
    const randomFactor = Math.random() < 0.5 ? 2 : 3;
    const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (randomFactor * R) * 255));
    return colorValue > 50 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'dark-mode-color';
  })(),
  
  // #84 Using a cosine function for a cyclic grayscale effect
  (() => {
    const colorValue = Math.floor((Math.cos(Date.now() / 1000) + 1) / 2 * ((v[0].z + R) / (2 * R) * 255));
    return colorValue > 100 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
  })(),
  
  // #85 Incorporating sine for alternating dark and light cycles
  (() => {
    const colorValue = Math.floor((Math.sin(Date.now() / 2000) + 1) / 2 * ((v[0].z + R) / (2 * R) * 255));
    return colorValue > 75 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'dark-mode-color';
  })(),
  
  // #86 Adjusting color based on a quadratic curve for depth
  (() => {
    const colorValue = Math.floor(Math.pow(Math.random(), 2) * ((v[0].z + R) / (2 * R) * 255));
    return colorValue > 90 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
  })(),
  
  // #87 Leveraging a logarithmic scale for fine-tuned shades
  (() => {
    const colorValue = Math.floor(Math.log(Math.random() * 10 + 1) / Math.log(11) * ((v[0].z + R) / (2 * R) * 255));
    return colorValue > 60 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
  })(),
  
  // #88 Utilizing exponential growth for sharp contrast
  (() => {
    const colorValue = Math.floor(Math.pow(Math.random() * 2, 2) * ((v[0].z + R) / (2 * R) * 255));
    return colorValue > 120 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'alternative-color';
  })(),
  
  // #89 Blending thresholds for a subtle grayscale dance
  (() => {
    const colorValue = Math.floor(Math.random() * ((v[0].z + R) / (9 * R) * 255));
    return colorValue > 10 ? `rgb(${colorValue}, ${colorValue}, ${colorValue})` : 'light-mode-color';
  })(),
  
    ];
  }

function crazyCircus (angle, tm, v) { // #12 - The Crazy Circus
  return [

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
];
}

function someOthers (angle, tm, v) { // #13 - Some Others
    return [
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 85) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 170) % 255})` : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255) + 50})` : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? (Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? 'blue' : 'red') : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 360) < 180 ? `hsl(${Math.floor((v[0].z + R) / (2 * R) * 360)}, 100%, 50%)` : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, 0, ${255 - Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #46 Plain Pink
  Math.floor((v[0].z + R) / (2 * R) * 360) < 180 ? `hsl(${Math.floor((v[0].z + R) / (2 * R) * 360)}, 100%, 50%)` : 'alternative-color', // #47 Goggle Eyes
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgba(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, 0.5)` : 'alternative-color', // #48 Plain pastel pink
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, 100, 150)` : 'alternative-color', // #49 Crazy Circus
  
];
}

 function splitCreepers (angle, tm, v) { // #14 - Split Creepers
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
((Math.floor(v[0].x / 100) + Math.floor(v[0].y / 100)) % 8 === 0) ? '#FF5733' : 'black', // Bright Orange
((Math.floor(v[0].x / 90) + Math.floor(v[0].y / 90)) % 73 === 0) ? '#FFD700' : 'black', // Gold
((Math.floor(v[0].x / 80) + Math.floor(v[0].y / 80)) % 7 === 0) ? '#FF7F50' : 'black', // Coral
((Math.floor(v[0].x / 70) + Math.floor(v[0].y / 70)) % 16 === 0) ? '#20B2AA' : 'black', // Light Sea Green
((Math.floor(v[0].x / 60) + Math.floor(v[0].y / 60)) % 8 === 0) ? '#7FFF00' : 'black', // Chartreuse
((Math.floor(v[0].x / 50) + Math.floor(v[0].y / 50)) % 16 === 0) ? '#00FF00' : 'black', // Lime
((Math.floor(v[0].x / 40) + Math.floor(v[0].y / 40)) % 8 === 0) ? '#00FA9A' : 'black', // Medium Spring Green
((Math.floor(v[0].x / 30) + Math.floor(v[0].y / 30)) % 16 === 0) ? '#00FFFF' : 'black', // Cyan
((Math.floor(v[0].x / 20) + Math.floor(v[0].y / 20)) % 8 === 0) ? '#AFEEEE' : 'black', // Pale Turquoise
((Math.floor(v[0].x / 10) + Math.floor(v[0].y / 10)) % 16 === 0) ? '#ADD8E6' : 'black', // Light Blue
((Math.floor(v[0].x / 5) + Math.floor(v[0].y / 5)) % 8 === 0) ? '#4682B4' : 'black', // Steel Blue
((Math.floor(v[0].x / 4) + Math.floor(v[0].y / 4)) % 16 === 0) ? '#87CEFA' : 'black', // Light Sky Blue
((Math.floor(v[0].x / 3) + Math.floor(v[0].y / 3)) % 8 === 0) ? '#00BFFF' : 'black', // Deep Sky Blue
((Math.floor(v[0].x / 2) + Math.floor(v[0].y / 2)) % 16 === 0) ? '#4169E1' : 'black', // Royal Blue
((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 1)) % 8 === 0) ? '#0000FF' : 'black', // Blue
((Math.floor(v[0].x * 2) + Math.floor(v[0].y * 2)) % 16 === 0) ? '#8A2BE2' : 'black', // Blue Violet
((Math.floor(v[0].x * 3) + Math.floor(v[0].y * 3)) % 8 === 0) ? '#9932CC' : 'black', // Dark Orchid
((Math.floor(v[0].x * 4) + Math.floor(v[0].y * 4)) % 16 === 0) ? '#8B008B' : 'black', // Dark Magenta
((Math.floor(v[0].x * 5) + Math.floor(v[0].y * 5)) % 8 === 0) ? '#800080' : 'black', // Purple
((Math.floor(v[0].x * 6) + Math.floor(v[0].y * 6)) % 16 === 0) ? '#4B0082' : 'black', // Indigo
((Math.floor(v[0].x * 7) + Math.floor(v[0].y * 7)) % 8 === 0) ? '#000080' : 'black', // Navy
((Math.floor(v[0].x / 123) + Math.floor(v[0].y / 234)) % 8 === 0) ? '#FF4500' : 'black', // Orange Red
((Math.floor(v[0].x / 234) + Math.floor(v[0].y / 345)) % 73 === 0) ? '#FF8C00' : 'black', // Dark Orange
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? '#00001E' : 'black',
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? '#00001E' : 'black',
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 11 === 0) ? 'purple' : 'black',
((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 7 === 0) ? 'blue' : 'black',

 ];
 }

 function hslEffects (angle, tm, v) { // #15 - HSL Effects
  return [
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
 `hsl(${(tm % 2) * 180}, 100%, 50%)`, // #41 - Intense Flash
 `hsl(${((tm + 1) % 2) * 180}, 100%, 50%)`, // #42
 `hsl(${(tm % 12) * 30}, 100%, 50%)`, // #43 - Colorful Burst
 `hsl(${((tm + 18) % 12) * 30}, 100%, 50%)`, // #44
 `hsl(${(tm % 0.1) * 3600}, 100%, 50%)`, // #45 - Hyper Flash
 `hsl(${((tm + 1) % 0.1) * 3600}, 100%, 50%)`, // #46
 `hsl(${(tm % 24) * 15}, 100%, 50%)`, // #47 - Psychedelic Wave
 `hsl(${((tm + 18) % 24) * 15}, 100%, 50%)`, // #48
 `hsl(${(tm % 0.02) * 18000}, 100%, 50%)`, // #49 - Mega Flash
 `hsl(${((tm + 1) % 0.02) * 18000}, 100%, 50%)`, // #50
 `hsl(${(tm % 36) * 10}, 100%, 50%)`, // #51 - Radiant Glow
 `hsl(${((tm + 18) % 36) * 10}, 100%, 50%)`, // #52
 `hsl(${(tm % 0.002) * 180000}, 100%, 50%)`, // #53 - Ultra Flash
 `hsl(${((tm + 1) % 0.002) * 180000}, 100%, 50%)`, // #54
 `hsl(${(tm % 72) * 5}, 100%, 50%)`, // #55 - Vibrant Pulse
 `hsl(${((tm + 18) % 72) * 5}, 100%, 50%)`, // #56
 `hsl(${(tm % 0.005) * 36000}, 100%, 50%)`, // #57 - Super Flash
 `hsl(${((tm + 1) % 0.005) * 36000}, 100%, 50%)`, // #58
 `hsl(${(tm % 144) * 2.5}, 100%, 50%)`, // #59 - Hypnotic Swirl
 `hsl(${((tm + 18) % 144) * 2.5}, 100%, 50%)`, // #60
 
 ];
 }
  // PLAIN COLOURS
  function plainColours (angle, tm, v) { // #16 - Plain Colours
    return [
  Math.random() < 0.5 ? `rgb(255, 255, 0)` : 'alternative-color', // #6 - The Yellow Highlight
  Math.random() > 0.5 ? `rgb(0, 255, 255)` : 'alternative-color', // #7 - The Cyan Cool
  `linear-gradient(45deg, rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}), rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}))`,
  ];
  }
  
  // XRAY / NEGATIVES
  function xrayNegatives (angle, tm, v) { // #17 - Xray Negatives
    return [
  // #66 Using bitwise operators for a more compact approach - XRAY SPECS 
  `rgb(${((v[0].z + R) / (2 * R) * 255) & 255}, ${((v[0].z + R) / (2 * R) * 255) & 255}, ${((v[0].z + R) / (2 * R) * 255) & 255})`,
  
  ];
}

function trippin (angle, tm, v) { // #18 - Trippin'
    return [

  (v[0].y + tm) % 200 < 100 ? `hsl(0, 0%, ${(v[0].y + tm) % 100}%)` : 'alternative-color',
  (v[0].y + tm) % 720 < 360 ? `hsl(${(v[0].y + tm) % 360}, 100%, 75%)` : 'alternative-color',
  (v[0].y + tm) % 720 < 360 ? `hsl(${(v[0].y + tm) % 360}, 60%, 80%)` : 'alternative-color',
  (v[0].y * 2 + tm) % 720 < 360 ? `hsl(${(v[0].y * 2 + tm) % 360}, 100%, 50%)` : 'alternative-color',
  360 - ((v[0].y + tm) % 360) > 180 ? `hsl(${360 - ((v[0].y + tm) % 360)}, 100%, 50%)` : 'alternative-color',
  (v[0].y + tm) % 720 < 360 ? `hsl(${(v[0].y + tm) % 360}, 100%, ${(tm % 100)}%)` : 'alternative-color',
  (v[0].y + tm) % 720 < 360 ? `hsl(${(v[0].y + tm) % 360}, ${(tm % 100)}%, ${(tm % 100)}%)` : 'alternative-color',
  `hsl(${(v[0].y + tm) % 360}, 100%, 50%)`,
  `hsl(${tm % 360}, 100%, ${50 + 25 * Math.sin(tm / 1000)}%)`,
  ((Math.floor(v[0].x / 50) + Math.floor(v[0].y / 50)) % 2 === 0) ? 'black' : 'white',
  '#' + Math.floor(Math.random() * 16777215).toString(16),
  `hsl(${Math.atan2(v[0].y - S / 2, v[0].x - S / 2) * 180 / Math.PI % 360}, 100%, ${50 + 25 * Math.cos(tm / 1000)}%)`,
  `rgb(0, ${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, ${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)})`,
  `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)})`,
  `hsl(${(v[0].x + v[0].y) % 360}, 100%, 50%)`,
//   `rgba(255, 0, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`,
//   `rgba(255, 0, 0, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`,
  `rgba(255, 165, 0, 0.5)`, // Placeholder for moveGradient
  tm % 200 < 100 ? `hsl(240, ${(tm % 100)}%, 50%)` : 'alternative-color',
  tm % 720 < 360 ? `hsl(${tm % 360}, 100%, 30%)` : 'alternative-color',
  255 - Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${255 - Math.floor((v[0].z + R) / (2 * R) * 255)}, ${255 - Math.floor((v[0].z + R) / (2 * R) * 255)}, ${255 - Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 85) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 170) % 255})` : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255) + 50})` : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? (Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? 'blue' : 'red') : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 360) < 180 ? `hsl(${Math.floor((v[0].z + R) / (2 * R) * 360)}, 100%, 50%)` : 'alternative-color',
  Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, 0, ${255 - Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 360) < 180 ? `hsl(${Math.floor((v[0].z + R) / (2 * R) * 360)}, 100%, 50%)` : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgba(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, 0.5)` : 'alternative-color',
  Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, 100, 150)` : 'alternative-color',
  Math.random() < 0.5 ? '#' + Math.floor(Math.random() * 16777215).toString(16) : 'alternative-color', 
  Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 360)}, 30%, 50%)`,
  Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60) + 40}, 50%, 50%)` : `hsl(${Math.floor(Math.random() * 60) + 250}, 70%, 50%)`,
  Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 40) + 30}, 70%, 30%)` : `hsl(${Math.floor(Math.random() * 60) + 180}, 70%, 60%)`,
  Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 40) + 30}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 30) + 270}, 80%, 50%)`,
  Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 360)}, 60%, 80%)` : `hsl(${Math.floor(Math.random() * 360)}, 100%, 40%)`,
  Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 30) + 240}, 70%, 40%)` : `hsl(${Math.floor(Math.random() * 30) + 10}, 80%, 60%)`,
  Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60) + 220}, 80%, 50%)` : `hsl(${Math.floor(Math.random() * 60) + 30}, 90%, 50%)`,
  Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 50) + 90}, 40%, 40%)` : `hsl(${Math.floor(Math.random() * 30) + 40}, 60%, 50%)`,
  Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60) + 180}, 70%, 50%)` : `hsl(${Math.floor(Math.random() * 40) + 10}, 90%, 60%)`,
  Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 50) + 70}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 50) + 20}, 100%, 50%)`,
  Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60)}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 60) + 180}, 100%, 50%)`,
  `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`,
  Math.random() < 0.5 ? `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})` : 'alternative-color',
  `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
  '#' + (Math.floor((Math.random() + 1) * 8388607) | 0x808080).toString(16),
  '#' + (Math.floor(Math.random() * 16777215) & 0x7F7F7F).toString(16),
  '#' + (Math.floor(Math.random() * 16777215) | 0x808080).toString(16),
  `hsl(${(v[0].y + tm) % 360}, 100%, 50%)`,
  `hsl(${tm % 360}, 100%, ${50 + 25 * Math.sin(tm / 1000)}%)`,
  ((Math.floor(v[0].x / 50) + Math.floor(v[0].y / 50)) % 2 === 0) ? 'black' : 'white',
  '#' + Math.floor(Math.random() * 16777215).toString(16),
  `hsl(${Math.atan2(v[0].y - S / 2, v[0].x - S / 2) * 180 / Math.PI % 360}, 100%, ${50 + 25 * Math.cos(tm / 1000)}%)`,
  `rgb(0, ${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, ${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)})`,
  `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)})`,
  `hsl(${(v[0].x + v[0].y) % 360}, 100%, 50%)`,
//   `rgba(255, 0, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`,
//   `rgba(255, 0, 0, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`,
    ];
}

  function theRest (angle, tm, v) { // #19 - The Rest
    return [
  `hsl(${tm % 1}, 100%, 50%)`,
  Math.abs(Math.sin(tm / 600000)) < 0.5 ? 'red' : 'blue',
  Math.abs(Math.sin(tm / 60000)) < 0.5 ? 'indigo' : 'orange',
  Math.abs(Math.sin(tm / 30000)) < 0.5 ? 'red' : 'blue',
  Math.abs(Math.sin(tm / 15000)) < 0.5 ? 'green' : 'magenta',
  Math.abs(Math.sin(tm / 5000)) < 0.5 ? 'saddlebrown' : 'olive',
  Math.abs(Math.sin(tm / 50000)) < 0.5 ? 'violet' : 'skyblue',
  Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'neongreen' : 'neonpurple',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'coral' : 'navy',
  Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'lightpink' : 'lightblue',
  Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'tan' : 'aquamarine',
  Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'gold' : 'silver',
  Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'peach' : 'forestgreen',
  Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'black' : 'white',
  Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'beige' : 'slategray',
  Math.abs(Math.sin(tm / 5000)) < 0.5 ? 'teal' : 'maroon',
  Math.abs(Math.sin(tm / 5000)) < 0.5 ? 'goldenrod' : 'plum',
  Math.abs(Math.sin(tm / 5000)) < 0.5 ? 'pink' : 'lime',
  Math.abs(Math.sin(tm / 5000)) < 0.5 ? 'khaki' : 'lavender',
  Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'purple' : 'orange',
  Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'turquoise' : 'crimson',
  Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'green' : 'yellow',
  Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'azure' : 'chocolate',
  Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'red' : 'blue',
  Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'midnightblue' : 'wheat',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'saddlebrown' : 'olive',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'palevioletred' : 'darkseagreen',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'neongreen' : 'neonpurple',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'royalblue' : 'palegoldenrod',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'lightpink' : 'lightblue',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'sienna' : 'palegreen',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'gold' : 'silver',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'aliceblue' : 'darkorchid',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'black' : 'white',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'darkslateblue' : 'lemonchiffon',
  Math.abs(Math.sin(tm / 2000)) < 0.5 ? 'teal' : 'maroon',
  Math.abs(Math.sin(tm / 2000)) < 0.5 ? 'springgreen' : 'hotpink',
  Math.abs(Math.sin(tm / 500)) < 0.5 ? 'pink' : 'lime',
  Math.abs(Math.sin(tm / 500)) < 0.5 ? 'darkturquoise' : 'rosybrown',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'purple' : 'orange',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'cadetblue' : 'darkgoldenrod',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'green' : 'yellow',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'deepskyblue' : 'tomato',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'red' : 'blue',
  Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'seagreen' : 'salmon',      
  Math.random() * 360 < 180 ? `hsl(${Math.random() * 360}, 100%, ${Math.random() * 100}%)` : 'alternative-color',

   ];
  }

  function others (angle, tm, v) { // #20 - Others
    return [
        `hsl(${tm % 1}, 100%, 50%)`,
        `hsl(${(tm + 1) % 1}, 100%, 50%)`,
        `hsl(${tm % 72}, 100%, 50%)`,
        `hsl(${(tm + 18) % 72}, 100%, 50%)`,
        Math.abs(Math.sin(tm / 600000)) < 0.5 ? 'red' : 'blue',
        Math.abs(Math.sin(tm / 60000)) < 0.5 ? 'indigo' : 'orange',
        Math.abs(Math.sin(tm / 30000)) < 0.5 ? 'red' : 'blue',
        Math.abs(Math.sin(tm / 15000)) < 0.5 ? 'green' : 'magenta',
        Math.abs(Math.sin(tm / 5000)) < 0.5 ? 'saddlebrown' : 'olive',
        Math.abs(Math.sin(tm / 50000)) < 0.5 ? 'violet' : 'skyblue',
        Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'neongreen' : 'neonpurple',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'coral' : 'navy',
        Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'lightpink' : 'lightblue',
        Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'tan' : 'aquamarine',
        Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'gold' : 'silver',
        Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'peach' : 'forestgreen',
        Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'black' : 'white',
        Math.abs(Math.sin(tm / 10000)) < 0.5 ? 'beige' : 'slategray',
        Math.abs(Math.sin(tm / 5000)) < 0.5 ? 'teal' : 'maroon',
        Math.abs(Math.sin(tm / 5000)) < 0.5 ? 'goldenrod' : 'plum',
        Math.abs(Math.sin(tm / 5000)) < 0.5 ? 'pink' : 'lime',
        Math.abs(Math.sin(tm / 5000)) < 0.5 ? 'khaki' : 'lavender',
        Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'purple' : 'orange',
        Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'turquoise' : 'crimson',
        Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'green' : 'yellow',
        Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'azure' : 'chocolate',
        Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'red' : 'blue',
        Math.abs(Math.sin(tm / 3000)) < 0.5 ? 'midnightblue' : 'wheat',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'saddlebrown' : 'olive',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'palevioletred' : 'darkseagreen',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'neongreen' : 'neonpurple',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'royalblue' : 'palegoldenrod',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'lightpink' : 'lightblue',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'sienna' : 'palegreen',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'gold' : 'silver',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'aliceblue' : 'darkorchid',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'black' : 'white',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'darkslateblue' : 'lemonchiffon',
        Math.abs(Math.sin(tm / 2000)) < 0.5 ? 'teal' : 'maroon',
        Math.abs(Math.sin(tm / 2000)) < 0.5 ? 'springgreen' : 'hotpink',
        Math.abs(Math.sin(tm / 500)) < 0.5 ? 'pink' : 'lime',
        Math.abs(Math.sin(tm / 500)) < 0.5 ? 'darkturquoise' : 'rosybrown',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'purple' : 'orange',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'cadetblue' : 'darkgoldenrod',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'green' : 'yellow',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'deepskyblue' : 'tomato',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'red' : 'blue',
        Math.abs(Math.sin(tm / 1000)) < 0.5 ? 'seagreen' : 'salmon',      
        Math.random() * 360 < 180 ? `hsl(${Math.random() * 360}, 100%, ${Math.random() * 100}%)` : 'alternative-color',
        (v[0].y + tm) % 200 < 100 ? `hsl(0, 0%, ${(v[0].y + tm) % 100}%)` : 'alternative-color',
        (v[0].y + tm) % 720 < 360 ? `hsl(${(v[0].y + tm) % 360}, 100%, 75%)` : 'alternative-color',
        (v[0].y + tm) % 720 < 360 ? `hsl(${(v[0].y + tm) % 360}, 60%, 80%)` : 'alternative-color',
        (v[0].y * 2 + tm) % 720 < 360 ? `hsl(${(v[0].y * 2 + tm) % 360}, 100%, 50%)` : 'alternative-color',
        360 - ((v[0].y + tm) % 360) > 180 ? `hsl(${360 - ((v[0].y + tm) % 360)}, 100%, 50%)` : 'alternative-color',
        (v[0].y + tm) % 720 < 360 ? `hsl(${(v[0].y + tm) % 360}, 100%, ${(tm % 100)}%)` : 'alternative-color',
        (v[0].y + tm) % 720 < 360 ? `hsl(${(v[0].y + tm) % 360}, ${(tm % 100)}%, ${(tm % 100)}%)` : 'alternative-color',
        `hsl(${(v[0].y + tm) % 360}, 100%, 50%)`,
        `hsl(${tm % 360}, 100%, ${50 + 25 * Math.sin(tm / 1000)}%)`,
        ((Math.floor(v[0].x / 50) + Math.floor(v[0].y / 50)) % 2 === 0) ? 'black' : 'white',
        '#' + Math.floor(Math.random() * 16777215).toString(16),
        `hsl(${Math.atan2(v[0].y - S / 2, v[0].x - S / 2) * 180 / Math.PI % 360}, 100%, ${50 + 25 * Math.cos(tm / 1000)}%)`,
        `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)})`,
        `hsl(${(v[0].x + v[0].y) % 360}, 100%, 50%)`,
       
        tm % 200 < 100 ? `hsl(240, ${(tm % 100)}%, 50%)` : 'alternative-color',
        tm % 720 < 360 ? `hsl(${tm % 360}, 100%, 30%)` : 'alternative-color',
        255 - Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${255 - Math.floor((v[0].z + R) / (2 * R) * 255)}, ${255 - Math.floor((v[0].z + R) / (2 * R) * 255)}, ${255 - Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color',
        Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 85) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 170) % 255})` : 'alternative-color',
        Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255) + 50})` : 'alternative-color',
        Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? (Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? 'blue' : 'red') : 'alternative-color',
        Math.floor((v[0].z + R) / (2 * R) * 360) < 180 ? `hsl(${Math.floor((v[0].z + R) / (2 * R) * 360)}, 100%, 50%)` : 'alternative-color',
        Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color',
        Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, 0, ${255 - Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color',
        Math.floor((v[0].z + R) / (2 * R) * 360) < 180 ? `hsl(${Math.floor((v[0].z + R) / (2 * R) * 360)}, 100%, 50%)` : 'alternative-color',
        Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgba(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, 0.5)` : 'alternative-color',
        Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, 100, 150)` : 'alternative-color',
        Math.random() < 0.5 ? '#' + Math.floor(Math.random() * 16777215).toString(16) : 'alternative-color', 
        Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 360)}, 30%, 50%)`,
        Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60) + 40}, 50%, 50%)` : `hsl(${Math.floor(Math.random() * 60) + 250}, 70%, 50%)`,
        Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 40) + 30}, 70%, 30%)` : `hsl(${Math.floor(Math.random() * 60) + 180}, 70%, 60%)`,
        Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 40) + 30}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 30) + 270}, 80%, 50%)`,
        Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 360)}, 60%, 80%)` : `hsl(${Math.floor(Math.random() * 360)}, 100%, 40%)`,
        Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 30) + 240}, 70%, 40%)` : `hsl(${Math.floor(Math.random() * 30) + 10}, 80%, 60%)`,
        Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60) + 220}, 80%, 50%)` : `hsl(${Math.floor(Math.random() * 60) + 30}, 90%, 50%)`,
        Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 50) + 90}, 40%, 40%)` : `hsl(${Math.floor(Math.random() * 30) + 40}, 60%, 50%)`,
        Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60) + 180}, 70%, 50%)` : `hsl(${Math.floor(Math.random() * 40) + 10}, 90%, 60%)`,
        Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 50) + 70}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 50) + 20}, 100%, 50%)`,
        Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 60)}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 60) + 180}, 100%, 50%)`,
        `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`,
        Math.random() < 0.5 ? `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})` : 'alternative-color',
        `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
        '#' + (Math.floor((Math.random() + 1) * 8388607) | 0x808080).toString(16),
        '#' + (Math.floor(Math.random() * 16777215) & 0x7F7F7F).toString(16),
        '#' + (Math.floor(Math.random() * 16777215) | 0x808080).toString(16),
        `hsl(${(v[0].y + tm) % 360}, 100%, 50%)`,
        `hsl(${tm % 360}, 100%, ${50 + 25 * Math.sin(tm / 1000)}%)`,
        ((Math.floor(v[0].x / 50) + Math.floor(v[0].y / 50)) % 2 === 0) ? 'black' : 'white',
        '#' + Math.floor(Math.random() * 16777215).toString(16),
        `hsl(${Math.atan2(v[0].y - S / 2, v[0].x - S / 2) * 180 / Math.PI % 360}, 100%, ${50 + 25 * Math.cos(tm / 1000)}%)`,
        `rgb(0, ${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, ${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)})`,
        `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)})`,
        `hsl(${(v[0].x + v[0].y) % 360}, 100%, 50%)`,
        `rgba(255, 0, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`,
        `rgba(255, 0, 0, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`,
        `rgba(255, 165, 0, 0.5)`, // Placeholder for moveGradient
    ];
  }

  function newEffect (angle, tm, v) { // #21 - New Effect
    return [
  ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 9999)) % 9999 === 0) ? 'grey' : 'black',
  ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 5555)) % 9999 === 0) ? 'red' : 'black',
  ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 3333)) % 9999 === 0) ? 'white' : 'black',
  ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 3333)) % 9999 === 0) ? 'yellow' : 'black',
  ((Math.floor(v[0].x / 0.55555) + Math.floor(v[0].y / 333)) % 666 === 0) ? 'yellow' : 'black',
  ((Math.floor(v[0].x / 0.55555) + Math.floor(v[0].y / 30000)) % 666 === 0) ? 'red' : 'black',
  ((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 2000)) % 666 === 0) ? 'red' : 'black',
    ];
}

   function slowSpin (angle, tm, v) { // #22 - Slow Spin
    return [
        `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 100%, 5%)`,
        `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 10%, 50%)`, // Original
        `hsl(${(angle + 30 * Math.sin(tm / 1000)) % 360}, 1%, 50%)`, // Slower spin
        `hsl(${(angle + 90 * Math.sin(tm / 1000)) % 360}, 100%, 500%)`, // Faster spin
        `hsl(${(angle + 120 * Math.sin(tm / 1000)) % 360}, 1000%, 50%)`, // Different amplitude
        `hsl(${(angle + 60 * Math.sin(tm / 2000)) % 360}, 1000%, 5%)`, // Slower frequency
        `hsl(${(angle + 60 * Math.sin(tm / 500)) % 360}, 1000%, 0.5%)`, // Faster frequency
        `hsl(${(angle + 60 * Math.sin(tm / 1000) + 60) % 360}, 1000%, 10%)`, // Shifted hue
        `hsl(${(angle + 60 * Math.sin(tm / 1000) + 180) % 360}, 100%, 5000%)`, // Opposite hue
        `hsl(${(angle + 60 * Math.sin(tm / 1000) + 30) % 360}, 8000%, 60%)`, // Lighter shade
        `hsl(${(angle + 60 * Math.sin(tm / 1000) + 30) % 360}, 70%, 40%)`, // Darker shade
        `hsl(${(angle + 60 * Math.sin(tm / 1000) + 90) % 360}, 100%, 70%)`, // Higher saturation
        `hsl(${(angle + 60 * Math.sin(tm / 1000) + 120) % 360}, 90%, 40%)`, // Lower saturation
        `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 80%, 60%)`, // Lighter shade
        `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 70%, 40%)`, // Darker shade
        `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 90%, 70%)`, // Higher saturation
        `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 80%, 30%)`, // Lower saturation
        `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 100%, 60%)`, // Different lightness
        `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 100%, 40%)`, // Different lightness
        `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 100%, 70%)`, // Different lightness
        `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 100%, 30%)`, // Different lightness
    
    ];
}

function scatterSpin (angle, tm, v) { // #23 - Scatter Spin
    return [
        ((Math.floor(v[0].x / 0.0001) + Math.floor(v[0].y / 1000)) % 666 === 0) ? 'grey' : 'black',
        ((Math.floor(v[0].x / 0.01) + Math.floor(v[0].y / 1000)) % 666 === 0) ? 'green' : 'black',   
        ((Math.floor(v[0].x / 0.55555) + Math.floor(v[0].y / 333)) % 666 === 0) ? 'yellow' : 'black',
        ((Math.floor(v[0].x / 0.55555) + Math.floor(v[0].y / 30000)) % 666 === 0) ? 'red' : 'black',
        ((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 2000)) % 666 === 0) ? 'darkred' : 'black',
        ((Math.floor(v[0].x / 0.0001) + Math.floor(v[0].y / 1000)) % 666 === 0) ? 'darkgrey' : 'black',
        ((Math.floor(v[0].x / 0.01) + Math.floor(v[0].y / 1000)) % 666 === 0) ? 'darkgreen' : 'black',
        ((Math.floor(v[0].x / 0.1) + Math.floor(v[0].y / 1000)) % 111 === 0) ? 'orange' : 'black', 
        ((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 1000)) % 111 === 0) ? 'pink' : 'black',
        ((Math.floor(v[0].x / 0.0001) + Math.floor(v[0].y / 1000)) % 666 === 0) ? 'green' : 'black',
        ((Math.floor(v[0].x / 0.01) + Math.floor(v[0].y / 1000)) % 666 === 0) ? 'white' : 'black',   
        ((Math.floor(v[0].x / 0.55555) + Math.floor(v[0].y / 333)) % 666 === 0) ? 'khaki' : 'black',
        ((Math.floor(v[0].x / 0.55555) + Math.floor(v[0].y / 30000)) % 666 === 0) ? 'yellow' : 'black',
        ((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 2000)) % 666 === 0) ? 'orange' : 'black',
        ((Math.floor(v[0].x / 0.0001) + Math.floor(v[0].y / 1000)) % 666 === 0) ? 'purple' : 'black',
        ((Math.floor(v[0].x / 0.01) + Math.floor(v[0].y / 1000)) % 666 === 0) ? 'white' : 'black',
        ((Math.floor(v[0].x / 0.1) + Math.floor(v[0].y / 1000)) % 111 === 0) ? 'pink' : 'black', 
        ((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 1000)) % 111 === 0) ? 'blue' : 'black',
    ];
}

function bicycle (angle, tm, v) { // #24 - Bicycle
    return [

        ((Math.floor(v[0].x / 0.1) + Math.floor(v[0].y / 1000)) % 111 === 0) ? 'orange' : 'black',
        ((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 1000)) % 111 === 0) ? 'pink' : 'black',
        ((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 111)) % 11 === 0) ? 'purple' : 'black',
        ((Math.floor(v[0].x / 11) + Math.floor(v[0].y / 111)) % 11 === 0) ? 'purple' : 'black',   
        ((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 111)) % 11 === 0) ? 'purple' : 'black',
        ((Math.floor(v[0].x / 11) + Math.floor(v[0].y / 111)) % 11 === 0) ? 'purple' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'orange' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'yellow' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'green' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'cyan' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'blue' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'violet' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'red' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'magenta' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'brown' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'navy' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'teal' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'olive' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'coral' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'indigo' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'skyblue' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'lime' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'turquoise' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'gold' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'silver' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'maroon' : 'black',
        ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'slategray' : 'black',
       

    
    ];
}

function splitCapsules (angle, tm, v) { // #25 - Split Capsules
    return [
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 999)) % 5 === 0) ? 'purple' : 'grey',
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 999)) % 3 === 0) ? 'green' : 'black',
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 999)) % 2 === 0) ? 'yellow' : 'black',
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 999)) % 2 === 0) ? 'red' : 'blue',
        ((Math.floor(v[0].x / 333) + Math.floor(v[0].y / 666)) % 2 === 0) ? 'red' : 'blue',
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 2 === 0) ? '#F7031C' : '#F7931A',
        ((Math.floor(v[0].x / 333) + Math.floor(v[0].y / 333)) % 2 === 0) ? '#F7031C' : '#F7931A',
        ((Math.floor(v[0].x / 1000) + Math.floor(v[0].y / 1000)) % 2 === 0) ? 'purple' : 'orange',
        ((Math.floor(v[0].x / 666) + Math.floor(v[0].y / 666)) % 2 === 0) ? 'pink' : 'yellow',
        ((Math.floor(v[0].x / 500) + Math.floor(v[0].y / 500)) % 2 === 0) ? 'orange' : 'purple',
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 999)) % 5 === 0) ? 'purple' : 'grey',
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 999)) % 3 === 0) ? 'green' : 'black',
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 999)) % 2 === 0) ? 'yellow' : 'black',
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 999)) % 2 === 0) ? 'red' : 'blue',
        ((Math.floor(v[0].x / 333) + Math.floor(v[0].y / 666)) % 2 === 0) ? 'red' : 'blue',
        ((Math.floor(v[0].x / 15) + Math.floor(v[0].y / 9000)) % 2 === 0) ? 'red' : 'blue',
        ((Math.floor(v[0].x / 15) + Math.floor(v[0].y / 9000)) % 2 === 0) ? 'purple' : 'pink',
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 2 === 0) ? '#F7031C' : '#F7931A',
        ((Math.floor(v[0].x / 333) + Math.floor(v[0].y / 333)) % 2 === 0) ? '#F7031C' : '#F7931A',
        ((Math.floor(v[0].x / 1000) + Math.floor(v[0].y / 1000)) % 2 === 0) ? 'purple' : 'orange',
        ((Math.floor(v[0].x / 666) + Math.floor(v[0].y / 666)) % 2 === 0) ? 'pink' : 'yellow',
        ((Math.floor(v[0].x / 500) + Math.floor(v[0].y / 500)) % 2 === 0) ? 'orange' : 'purple',
    ];
}

function spinningTops (angle, tm, v) { // #26 - Spinning Tops
    return [
        ((Math.floor(v[0].x / 15) + Math.floor(v[0].y / 9000)) % 2 === 0) ? 'red' : 'blue', // Red or blue based on coordinates
        ((Math.floor(v[0].x / 15) + Math.floor(v[0].y / 9000)) % 2 === 0) ? 'purple' : 'pink', // Purple or pink based on coordinates
        ((Math.floor(v[0].x / 20) + Math.floor(v[0].y / 10000)) % 2 === 0) ? 'green' : 'orange', // Green or orange based on coordinates
        ((Math.floor(v[0].x / 20) + Math.floor(v[0].y / 10000)) % 2 === 0) ? 'cyan' : 'yellow', // Cyan or yellow based on coordinates
        ((Math.floor(v[0].x / 25) + Math.floor(v[0].y / 11000)) % 2 === 0) ? 'brown' : 'lime', // Brown or lime based on coordinates
        ((Math.floor(v[0].x / 25) + Math.floor(v[0].y / 11000)) % 2 === 0) ? 'teal' : 'magenta', // Teal or magenta based on coordinates
        ((Math.floor(v[0].x / 30) + Math.floor(v[0].y / 12000)) % 2 === 0) ? 'gold' : 'indigo', // Gold or indigo based on coordinates
        ((Math.floor(v[0].x / 30) + Math.floor(v[0].y / 12000)) % 2 === 0) ? 'silver' : 'maroon', // Silver or maroon based on coordinates
        ((Math.floor(v[0].x / 35) + Math.floor(v[0].y / 13000)) % 2 === 0) ? 'navy' : 'skyblue', // Navy or skyblue based on coordinates
        ((Math.floor(v[0].x / 35) + Math.floor(v[0].y / 13000)) % 2 === 0) ? 'olive' : 'orchid', // Olive or orchid based on coordinates
        ((Math.floor(v[0].x / 40) + Math.floor(v[0].y / 14000)) % 2 === 0) ? 'salmon' : 'seagreen', // Salmon or seagreen based on coordinates
        ((Math.floor(v[0].x / 40) + Math.floor(v[0].y / 14000)) % 2 === 0) ? 'tan' : 'thistle', // Tan or thistle based on coordinates
        ((Math.floor(v[0].x / 45) + Math.floor(v[0].y / 15000)) % 2 === 0) ? 'tomato' : 'turquoise', // Tomato or turquoise based on coordinates
        ((Math.floor(v[0].x / 45) + Math.floor(v[0].y / 15000)) % 2 === 0) ? 'violet' : 'wheat', // Violet or wheat based on coordinates
        ((Math.floor(v[0].x / 50) + Math.floor(v[0].y / 16000)) % 2 === 0) ? 'coral' : 'cornflowerblue', // Coral or cornflowerblue based on coordinates
        ((Math.floor(v[0].x / 50) + Math.floor(v[0].y / 16000)) % 2 === 0) ? 'crimson' : 'darkcyan', // Crimson or darkcyan based on coordinates
        ((Math.floor(v[0].x / 55) + Math.floor(v[0].y / 17000)) % 2 === 0) ? 'darkgoldenrod' : 'darkgreen', // Darkgoldenrod or darkgreen based on coordinates
        ((Math.floor(v[0].x / 55) + Math.floor(v[0].y / 17000)) % 2 === 0) ? 'darkkhaki' : 'darkmagenta', // Darkkhaki or darkmagenta based on coordinates
        ((Math.floor(v[0].x / 60) + Math.floor(v[0].y / 18000)) % 2 === 0) ? 'darkolivegreen' : 'darkorange', // Darkolivegreen or darkorange based on coordinates
        ((Math.floor(v[0].x / 60) + Math.floor(v[0].y / 18000)) % 2 === 0) ? 'darkorchid' : 'darkred', // Darkorchid or darkred based on coordinates
    

    ];
}

function creepingFiller (angle, tm, v) { // #27 - Creeping Filler
    return [
        ((Math.floor(v[0].x / 345) + Math.floor(v[0].y / 456)) % 7 === 0) ? '#FFA500' : 'black', // Orange
        ((Math.floor(v[0].x / 456) + Math.floor(v[0].y / 567)) % 16 === 0) ? '#FFD700' : 'black', // Gold
        ((Math.floor(v[0].x / 567) + Math.floor(v[0].y / 678)) % 8 === 0) ? '#FFB6C1' : 'black', // Light Pink
        ((Math.floor(v[0].x / 678) + Math.floor(v[0].y / 789)) % 16 === 0) ? '#FF69B4' : 'black', // Hot Pink
        ((Math.floor(v[0].x / 789) + Math.floor(v[0].y / 890)) % 8 === 0) ? '#FF1493' : 'black', // Deep Pink
        ((Math.floor(v[0].x / 890) + Math.floor(v[0].y / 901)) % 16 === 0) ? '#DB7093' : 'black', // Pale Violet Red
        ((Math.floor(v[0].x / 901) + Math.floor(v[0].y / 123)) % 8 === 0) ? '#B0E0E6' : 'black', // Powder Blue
        ((Math.floor(v[0].x / 456) + Math.floor(v[0].y / 234)) % 16 === 0) ? '#7FFFD4' : 'black', // Aquamarine
        ((Math.floor(v[0].x / 789) + Math.floor(v[0].y / 567)) % 8 === 0) ? '#00CED1' : 'black', // Dark Turquoise
        ((Math.floor(v[0].x / 234) + Math.floor(v[0].y / 678)) % 16 === 0) ? '#4682B4' : 'black', // Steel Blue
        ((Math.floor(v[0].x / 567) + Math.floor(v[0].y / 901)) % 8 === 0) ? '#800080' : 'black', // Purple
        ((Math.floor(v[0].x / 123) + Math.floor(v[0].y / 890)) % 16 === 0) ? '#4B0082' : 'black', // Indigo
        ((Math.floor(v[0].x / 901) + Math.floor(v[0].y / 456)) % 8 === 0) ? '#800000' : 'black', // Maroon
        ((Math.floor(v[0].x / 567) + Math.floor(v[0].y / 234)) % 16 === 0) ? '#8B0000' : 'black', // Dark Red
        ((Math.floor(v[0].x / 678) + Math.floor(v[0].y / 789)) % 8 === 0) ? '#556B2F' : 'black', // Dark Olive Green
        ((Math.floor(v[0].x / 789) + Math.floor(v[0].y / 890)) % 16 === 0) ? '#228B22' : 'black', // Forest Green
        ((Math.floor(v[0].x / 456) + Math.floor(v[0].y / 678)) % 8 === 0) ? '#006400' : 'black', // Dark Green
        ((Math.floor(v[0].x / 901) + Math.floor(v[0].y / 234)) % 16 === 0) ? '#00FF7F' : 'black', // Spring Green
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 11 === 0) ? 'purple' : 'black',
        ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 7 === 0) ? 'blue' : 'black',
    ];
}

function scatter (angle, tm, v) { // #28 - Scatter
    return [
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 9999)) % 9999 === 0) ? 'grey' : 'black',
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 5555)) % 9999 === 0) ? 'red' : 'black',
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 3333)) % 9999 === 0) ? 'white' : 'black',
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 3333)) % 9999 === 0) ? 'yellow' : 'black',
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 9999)) % 9999 === 0) ? 'grey' : 'black', // Grey or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 5555)) % 9999 === 0) ? 'red' : 'black', // Red or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 3333)) % 9999 === 0) ? 'white' : 'black', // White or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 3333)) % 9999 === 0) ? 'yellow' : 'black', // Yellow or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 2222)) % 9999 === 0) ? 'green' : 'black', // Green or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 1111)) % 9999 === 0) ? 'blue' : 'black', // Blue or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 1234)) % 9999 === 0) ? 'purple' : 'black', // Purple or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 4321)) % 9999 === 0) ? 'pink' : 'black', // Pink or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 5678)) % 9999 === 0) ? 'cyan' : 'black', // Cyan or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 8765)) % 9999 === 0) ? 'magenta' : 'black', // Magenta or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 999)) % 9999 === 0) ? 'orange' : 'black', // Orange or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 777)) % 9999 === 0) ? 'violet' : 'black', // Violet or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 888)) % 9999 === 0) ? 'lime' : 'black', // Lime or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 666)) % 9999 === 0) ? 'turquoise' : 'black', // Turquoise or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 555)) % 9999 === 0) ? 'gold' : 'black', // Gold or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 444)) % 9999 === 0) ? 'silver' : 'black', // Silver or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 333)) % 9999 === 0) ? 'maroon' : 'black', // Maroon or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 222)) % 9999 === 0) ? 'skyblue' : 'black', // Skyblue or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 111)) % 9999 === 0) ? 'teal' : 'black', // Teal or black based on coordinates
        ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 9876)) % 9999 === 0) ? 'olive' : 'black', // Olive or black based on coordinates
    
    ];
}

function dullAche (angle, tm, v) { // #29 - Dull Ache
    return [
        `rgb(${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, 0, 0)`, // Red shades based on distance from center
        `rgb(0, ${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, 0)`, // Green shades based on distance from center
        `rgb(0, 0, ${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)})`, // Blue shades based on distance from center
        `rgb(${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, 0, ${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)})`, // Cyan shades based on distance from center
        `rgb(${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, ${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, 0)`, // Yellow shades based on distance from center
        `rgb(${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, ${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, 0)`, // Magenta shades based on distance from center
        `rgb(${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, 0, ${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)})`, // Blue shades based on distance from center
        `rgb(0, ${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, ${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)})`, // Red and blue shades based on distance from center
        `rgb(${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, ${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, 255)`, // Purple and green shades based on distance from center
        `rgb(${Math.floor(128 + 127 * Math.sin(3.14 * (Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))) / S))}, ${Math.floor(128 + 127 * Math.cos(3.14 * (Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))) / S))}, ${Math.floor(128 + 127 * Math.sin(3.14 * (Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))) / S))})`,
        `rgb(0, ${Math.floor(255 * Math.sin(v[0].y / S * Math.PI))}, ${Math.floor(255 * Math.cos(v[0].y / S * Math.PI))})`,
        `rgb(${255 - Math.floor(255 * (Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)))}, ${Math.floor(100 + 155 * (Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / S))}, 0)`,
       `rgb(${Math.floor(35 + 220 * (v[0].y / S))}, 0, ${Math.floor(255 * (v[0].x / S))})`,
        `rgb(255, ${Math.floor(100 + 155 * (v[0].y / S))}, ${Math.floor(85 + 170 * (1 - (v[0].y / S)))})`,
        `rgb(${Math.floor(75 + 180 * Math.sin((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))) / S))}, 0, ${Math.floor(125 + 130 * Math.cos((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))) / S))})`,

    ];
}

function eyeRollers (angle, tm, v) { // #30 - Eye Rollers
    return [
        `rgba(255, 0, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Red
        `rgba(0, 255, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Green
        `rgba(0, 0, 255, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Blue
        `rgba(255, 255, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Yellow
        `rgba(255, 0, 255, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Magenta
        `rgba(0, 255, 255, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Cyan
        `rgba(255, 165, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Orange
        `rgba(128, 0, 128, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Purple
        `rgba(0, 128, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Dark Green
        `rgba(128, 128, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Olive
        `rgba(0, 0, 128, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Navy
        `rgba(128, 0, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Maroon
        `rgba(0, 128, 128, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Teal
        `rgba(128, 128, 128, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Gray
        `rgba(255, 215, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Gold
        `rgba(0, 255, 127, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Spring Green
        `rgba(255, 0, 255, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Fuchsia
        `rgba(255, 192, 203, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Pink
        `rgba(0, 255, 255, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Aqua
    ];
}

function partialTransparency (angle, tm, v) { // #31 - Partial Transparency
    return [

        `rgba(255, 0, 0, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`, // Calculated alpha value based on vertices
        `rgba(255, 165, 0, 0.5)`, // Orange with fixed alpha value
        `rgba(0, 255, 0, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`, // Calculated alpha value based on vertices
        `rgba(0, 128, 128, 0.3)`, // Teal with fixed alpha value
        `rgba(255, 0, 255, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`, // Calculated alpha value based on vertices
        `rgba(128, 0, 128, 0.7)`, // Purple with fixed alpha value
        `rgba(0, 0, 255, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`, // Calculated alpha value based on vertices
        `rgba(255, 255, 0, 0.4)`, // Yellow with fixed alpha value
        `rgba(0, 255, 255, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`, // Calculated alpha value based on vertices
        `rgba(128, 128, 0, 0.6)`, // Olive with fixed alpha value
        `rgba(255, 192, 203, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`, // Calculated alpha value based on vertices
        `rgba(255, 215, 0, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`, // Calculated alpha value based on vertices
        `rgba(0, 255, 127, 0.8)`, // Spring Green with fixed alpha value
        `rgba(255, 0, 255, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`, // Calculated alpha value based on vertices
        `rgba(255, 20, 147, 0.5)`, // Deep Pink with fixed alpha value
        `rgba(0, 128, 0, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`, // Calculated alpha value based on vertices
        `rgba(0, 0, 128, 0.3)`, // Navy with fixed alpha value
        `rgba(255, 140, 0, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`, // Calculated alpha value based on vertices
        `rgba(70, 130, 180, 0.6)`, // Steel Blue with fixed alpha value
    
    ];
}

function prettySpinners (angle, tm, v) { // #32 - Pretty Spinners
    return [
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) + angle))}, ${Math.floor(128 + 127 * Math.cos(angle))}, 255)`,
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(128 + 127 * Math.cos(angle))}, 100)`,
        `rgb(100, ${Math.floor(128 + 127 * Math.sin(angle))}, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))})`,
        `rgb(${Math.floor(200 * Math.sin(angle))}, 255, ${Math.floor(200 * Math.cos(angle))})`,
        `rgb(${Math.floor(255 - 127 * Math.sin(angle))}, ${Math.floor(255 - 127 * Math.cos(angle))}, 255)`,
        `rgb(${Math.floor(128 + 120 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, 100, ${Math.floor(128 + 120 * Math.sin(angle))})`,
        `rgb(100, ${Math.floor(255 - 120 * Math.cos(angle))}, ${Math.floor(128 + 120 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(angle))}, 255, ${Math.floor(128 + 127 * Math.cos(angle))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(128 + 127 * Math.sin(angle))}, 100)`,
        `rgb(100, ${Math.floor(128 + 127 * Math.cos(angle))}, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))})`,
        `rgb(${Math.floor(255 * Math.sin(angle))}, ${Math.floor(255 * Math.cos(angle))}, 255)`,
        `rgb(255, ${Math.floor(255 * Math.sin(angle))}, ${Math.floor(255 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))})`,
        `rgb(${Math.floor(255 - 127 * Math.cos(angle))}, ${Math.floor(255 - 127 * Math.sin(angle))}, 100)`,
        `rgb(100, ${Math.floor(255 - 127 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(255 - 127 * Math.sin(angle))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) + tm))}, ${Math.floor(128 + 127 * Math.cos(tm + angle))}, 255)`,
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm + angle))}, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm))}, 255)`,
        `rgb(${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm * 2 + angle))}, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm * 2))}, 200)`,
        `rgb(200, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm / 2 + angle))}, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm / 2))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm / 3 + angle))}, 255, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm / 3))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) - tm + angle))}, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) - tm))}, 220)`,
        `rgb(220, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm * 1.5 + angle))}, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm * 1.5))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm * 0.75 + angle))}, 220, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm * 0.75))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) - tm * 1.25 + angle))}, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) - tm * 1.25))}, 180)`,
        `rgb(180, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm * 1.1 + angle))}, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm * 1.1))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) - tm * 0.5 + angle))}, 180, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) - tm * 0.5))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm * 0.25 + angle))}, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm * 0.25))}, 160)`,
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm))}, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm))}, 255)`,
        `rgb(${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm * 2))}, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm * 2))}, 200)`,
        `rgb(200, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm / 2))}, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm / 2))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm / 3))}, 255, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm / 3))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) - tm))}, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) - tm))}, 220)`,
        `rgb(220, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm * 1.5))}, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm * 1.5))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm * 0.75))}, 220, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm * 0.75))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) - tm * 1.25))}, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) - tm * 1.25))}, 180)`,
        `rgb(180, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm * 1.1))}, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm * 1.1))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) - tm * 0.5))}, 180, ${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) - tm * 0.5))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2)) + tm * 0.25))}, ${Math.floor(128 + 127 * Math.cos(Math.sqrt(Math.pow(v[0].y - S/2, 2)) + tm * 0.25))}, 160)`,
        `rgb(${Math.floor(200 + 55 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(100 + 155 * Math.sin(angle))}, ${Math.floor(50 + 50 * Math.cos(angle))})`,
        `rgb(${Math.floor(100 * Math.sin(angle))}, ${Math.floor(100 + 155 * Math.cos(angle))}, ${Math.floor(200 + 55 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))})`,
        `rgb(${Math.floor(255 - 127 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(50 + 205 * Math.sin(angle))}, ${Math.floor(50 + 205 * Math.cos(angle))})`,

       
    ];
}



function strobeEffects (angle, tm, v) { // #33 - Strobe Effects
    return [
        `rgb(${Math.floor(255 * ((v[0].x / S) + Math.sin(tm)))}, ${Math.floor(255 * Math.abs(Math.cos(tm)))}, ${Math.floor(255 * ((v[0].x / S) + Math.cos(tm)))})`,
        `rgb(${Math.floor(50 + 205 * Math.abs(Math.sin(tm)))}, 255, ${Math.floor(50 + 205 * (Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / S))})`,
        `rgb(${Math.floor(100 + 155 * Math.sin(tm))}, ${Math.floor(255 * Math.abs(Math.cos(tm / 2)))}, ${Math.floor(255 * Math.sin(tm))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm))}, 255, ${Math.floor(128 + 127 * Math.sin(tm))})`,
        `rgb(255, ${Math.floor(128 + 127 * Math.sin(tm))}, ${Math.floor(128 + 127 * Math.cos(tm))})`,
        `rgb(${Math.floor(255 * Math.sin(tm))}, ${Math.floor(255 * Math.cos(tm))}, 100)`,
        `rgb(100, ${Math.floor(255 * Math.cos(tm))}, ${Math.floor(255 * Math.sin(tm))})`,
        `rgb(0, ${Math.floor(128 + 127 * Math.sin(tm * 2))}, ${Math.floor(128 + 127 * Math.cos(tm * 2 + Math.PI / 2))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm / 2))}, ${Math.floor(128 + 127 * Math.sin(tm / 2))}, 0)`,
        `rgb(${Math.floor(128 + 127 * Math.sin(tm))}, 0, ${Math.floor(128 + 127 * Math.cos(tm))})`,
        `rgb(0, ${Math.floor(128 + 127 * Math.sin(tm * 2))}, ${Math.floor(128 + 127 * Math.cos(tm * 2 + Math.PI / 2))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm / 2))}, ${Math.floor(128 + 127 * Math.sin(tm / 2))}, 0)`,
        `rgb(${Math.floor(128 + 127 * Math.sin(tm))}, 0, ${Math.floor(128 + 127 * Math.cos(tm))})`,
        `rgb(0, ${Math.floor(255 * Math.abs(Math.sin(tm * 4)))}, 0)`,
        `rgb(${Math.floor(255 * Math.abs(Math.cos(tm * 5)))}, ${Math.floor(255 * Math.abs(Math.sin(tm * 5)))}, ${Math.floor(128 + 127 * Math.sin(tm * 5))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm / 4))}, 255, ${Math.floor(128 + 127 * Math.sin(tm / 4))})`,
        `rgb(${Math.floor(255 * Math.abs(Math.sin(tm)))}, 0, ${Math.floor(128 + 127 * Math.cos(tm * 2))})`,
        `rgb(255, ${Math.floor(128 + 127 * Math.sin(tm / 2))}, 0)`,
        `rgb(0, ${Math.floor(128 + 127 * Math.cos(tm * 2))}, ${Math.floor(128 + 127 * Math.sin(tm * 2))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(tm * 7))}, 0, ${Math.floor(128 + 127 * Math.cos(tm * 7))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm + Math.PI / 3))}, ${Math.floor(128 + 127 * Math.sin(tm + Math.PI / 3))}, 255)`,
        `rgb(255, ${Math.floor(128 + 127 * Math.sin(tm + Math.PI / 4))}, ${Math.floor(128 + 127 * Math.cos(tm + Math.PI / 4))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm + Math.PI / 2))}, 255, ${Math.floor(128 + 127 * Math.sin(tm + Math.PI / 2))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(tm + Math.PI / 6))}, 255, ${Math.floor(128 + 127 * Math.cos(tm + Math.PI / 6))})`,
        `rgb(255, ${Math.floor(128 + 127 * Math.cos(tm + Math.PI / 5))}, ${Math.floor(128 + 127 * Math.sin(tm + Math.PI / 5))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(tm + Math.PI))}, ${Math.floor(128 + 127 * Math.cos(tm + Math.PI))}, 255)`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm + Math.PI * 2 / 3))}, 255, ${Math.floor(128 + 127 * Math.sin(tm + Math.PI * 2 / 3))})`,
        `rgb(255, ${Math.floor(128 + 127 * Math.sin(tm + Math.PI / 8))}, ${Math.floor(128 + 127 * Math.cos(tm + Math.PI / 8))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm + Math.PI / 7))}, ${Math.floor(128 + 127 * Math.sin(tm + Math.PI / 7))}, 255)`,
        `rgb(${Math.floor(128 + 127 * Math.sin(tm + Math.PI / 9))}, 255, ${Math.floor(128 + 127 * Math.cos(tm + Math.PI / 9))})`,
        `rgb(255, ${Math.floor(128 + 127 * Math.cos(tm + Math.PI * 3 / 4))}, ${Math.floor(128 + 127 * Math.sin(tm + Math.PI * 3 / 4))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(tm + Math.PI / 10))}, ${Math.floor(128 + 127 * Math.cos(tm + Math.PI / 10))}, 255)`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm + Math.PI * 3 / 2))}, 255, ${Math.floor(128 + 127 * Math.sin(tm + Math.PI * 3 / 2))})`,
        `rgb(255, ${Math.floor(128 + 127 * Math.sin(tm + Math.PI * 4 / 3))}, ${Math.floor(128 + 127 * Math.cos(tm + Math.PI * 4 / 3))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm + Math.PI / 11))}, ${Math.floor(128 + 127 * Math.sin(tm + Math.PI / 11))}, 255)`,
        `rgb(${Math.floor(128 + 127 * Math.sin(tm + Math.PI * 5 / 6))}, 255, ${Math.floor(128 + 127 * Math.cos(tm + Math.PI * 5 / 6))})`,
        `rgb(${Math.floor(128 + 127 * Math.sin(tm * 2))}, ${Math.floor(128 + 127 * Math.cos(tm * 2))}, ${Math.floor(128 + 127 * Math.sin(tm * 2))})`,
        `rgb(${Math.floor(255 * Math.abs(Math.sin(tm * 4)))}, ${Math.floor(64 + 191 * Math.abs(Math.sin(tm * 4)))}, 0)`,
        `rgb(0, ${Math.floor(128 + 127 * Math.sin(tm / 4))}, ${Math.floor(128 + 127 * Math.cos(tm / 4))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm / 2))}, ${Math.floor(255 * Math.abs(Math.sin(tm / 2)))}, 0)`,
        `rgb(${Math.floor(128 + 127 * Math.sin(tm * 5))}, ${Math.floor(128 + 127 * Math.cos(tm * 5))}, ${Math.floor(255 * Math.abs(Math.sin(tm * 5)))})`,
        `rgb(${Math.floor(255 * Math.abs(Math.cos(tm / 6)))}, ${Math.floor(128 + 127 * Math.sin(tm / 6))}, 0)`,
        `rgb(${Math.floor(255 * Math.abs(Math.sin(tm / 7)))}, ${Math.floor(128 + 127 * Math.cos(tm / 7))}, 0)`,
        `rgb(${Math.floor(128 + 127 * Math.sin(tm / 8))}, ${Math.floor(255 * Math.abs(Math.cos(tm / 8)))}, ${Math.floor(128 + 127 * Math.sin(tm / 8))})`,
       
        
    ];
}

function strobingSpinners (angle, tm, v) { // #34 - Strobing Spinners
    return [
        `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) + tm))}, ${Math.floor(128 + 127 * Math.cos(tm))}, 255)`,
       
    ];
}

function colourPulses (angle, tm, v) { // #35 - Colour Pulses
    return [
     
        `rgb(${Math.floor(128 + 127 * Math.sin(tm * 3))}, 0, 255)`,
        `rgb(255, ${Math.floor(128 + 127 * Math.sin(tm / 3))}, ${Math.floor(128 + 127 * Math.cos(tm / 3))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm * 3))}, ${Math.floor(128 + 127 * Math.sin(tm * 3))}, ${Math.floor(255 * Math.abs(Math.cos(tm * 3)))})`,
        `rgb(255, 255, ${Math.floor(128 + 127 * Math.sin(tm * 6))})`,
        `rgb(${Math.floor(255 * Math.abs(Math.sin(tm / 5)))}, ${Math.floor(255 * Math.abs(Math.cos(tm / 5)))}, 0)`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm * 3))}, ${Math.floor(128 + 127 * Math.cos(tm * 3))}, ${Math.floor(255 * Math.abs(Math.sin(tm * 3)))})`,
        `rgb(${Math.floor(128 + 127 * Math.cos(tm * 6))}, ${Math.floor(128 + 127 * Math.sin(tm * 6))}, ${Math.floor(255 * Math.abs(Math.cos(tm * 6)))})`,

    ];
}

function staticSpinners (angle, tm, v) { // #36 - Static Spinners
    return [
        `rgb(255, ${Math.floor(255 - 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(255 - 127 * Math.cos(angle))})`,
        `rgb(${Math.floor(200 + 55 * Math.cos(angle))}, ${Math.floor(220 - 20 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(255 - 127 * Math.sin(angle))})`,
        `rgb(${Math.floor(140 * Math.sin(angle))}, ${Math.floor(160 + 95 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(60 + 60 * Math.cos(angle))})`,
        `rgb(${Math.floor(0 + 55 * Math.cos(angle))}, ${Math.floor(50 + 105 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(100 + 155 * Math.cos(angle))})`,
        `rgb(${Math.floor(255 - 127 * Math.sin(angle))}, ${Math.floor(100 + 155 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(50 + 205 * Math.cos(angle))})`,
        `rgb(${Math.floor(255 - 127 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(255 - 127 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(255 - 127 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))})`,
        `rgb(${Math.floor(50 + 205 * Math.sin(angle))}, ${Math.floor(255 - 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(50 + 205 * Math.cos(angle))})`,
        `rgb(${Math.floor(0 + 55 * Math.sin(angle))}, ${Math.floor(85 + 170 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(100 + 155 * Math.sin(angle))})`,
        `rgb(${Math.floor(50 + 205 * Math.cos(angle))}, ${Math.floor(255 - 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(100 + 155 * Math.sin(angle))})`,
        `rgb(${Math.floor(255 - 100 * Math.sin(angle))}, ${Math.floor(150 + 105 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(100 + 155 * Math.cos(angle))})`,
        `rgb(${Math.floor(50 + 205 * Math.sin(angle))}, ${Math.floor(200 + 55 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(0 + 155 * Math.cos(angle))})`,
        `rgb(${Math.floor(0 + 55 * Math.cos(angle))}, ${Math.floor(50 + 105 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(120 + 135 * Math.sin(angle))})`,
        `rgb(${Math.floor(240 - 190 * Math.sin(angle))}, ${Math.floor(255 - 127 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(255 - 127 * Math.sin(angle))})`,
        `rgb(${Math.floor(150 + 105 * Math.sin(angle))}, ${Math.floor(130 + 125 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(255 - 127 * Math.cos(angle))})`,
        `rgb(${Math.floor(255 - 100 * Math.cos(angle))}, ${Math.floor(155 + 100 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(85 + 170 * Math.sin(angle))})`,
        `rgb(${Math.floor(200 + 55 * Math.sin(angle))}, ${Math.floor(220 - 20 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(255 - 127 * Math.cos(angle))})`,
        `rgb(${Math.floor(204 - 54 * Math.sin(angle))}, ${Math.floor(136 + 119 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(100 + 55 * Math.cos(angle))})`,
        `rgb(${Math.floor(0 + 155 * Math.sin(angle))}, ${Math.floor(255 - 127 * Math.cos(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(50 + 205 * Math.sin(angle))})`,




    ];
}

function patchWork (angle, tm, v) { // #37 - Patch Work
    return [
        ((Math.floor(v[0].x / 10) + Math.floor(v[0].y / 200)) % 20 === 0) ? 'blue' : 'white',
        ((Math.floor(v[0].x / 2) + Math.floor(v[0].y / 50)) % 5 === 0) ? 'red' : 'grey',
        ((Math.floor(v[0].x / 5) + Math.floor(v[0].y / 100)) % 10 === 0) ? 'green' : 'silver',
        ((Math.floor(v[0].x / 3) + Math.floor(v[0].y / 300)) % 33 === 0) ? 'yellow' : 'navy',
        ((Math.floor(v[0].x / 4) + Math.floor(v[0].y / 400)) % 44 === 0) ? 'cyan' : 'maroon',
        ((Math.floor(v[0].x / 7) + Math.floor(v[0].y / 70)) % 14 === 0) ? 'magenta' : 'olive',
        ((Math.floor(v[0].x / 6) + Math.floor(v[0].y / 600)) % 60 === 0) ? 'lime' : 'purple',
        ((Math.floor(v[0].x / 8) + Math.floor(v[0].y / 800)) % 80 === 0) ? 'teal' : 'fuchsia',
        ((Math.floor(v[0].x / 9) + Math.floor(v[0].y / 90)) % 18 === 0) ? 'aqua' : 'green',
        ((Math.floor(v[0].x / 15) + Math.floor(v[0].y / 150)) % 30 === 0) ? 'orange' : 'blue',
        ((Math.floor(v[0].x / 20) + Math.floor(v[0].y / 200)) % 40 === 0) ? 'pink' : 'brown',
        ((Math.floor(v[0].x / 10) + Math.floor(v[0].y / 200)) % 20 === 0) ? 'purple' : 'white',
        ((Math.floor(v[0].x / 2) + Math.floor(v[0].y / 50)) % 5 === 0) ? 'gold' : 'grey',
        ((Math.floor(v[0].x / 5) + Math.floor(v[0].y / 100)) % 10 === 0) ? 'turquoise' : 'silver',
        ((Math.floor(v[0].x / 3) + Math.floor(v[0].y / 300)) % 33 === 0) ? 'coral' : 'navy',
        ((Math.floor(v[0].x / 4) + Math.floor(v[0].y / 400)) % 44 === 0) ? 'lime' : 'maroon',
        ((Math.floor(v[0].x / 7) + Math.floor(v[0].y / 70)) % 14 === 0) ? 'fuchsia' : 'olive',
        ((Math.floor(v[0].x / 6) + Math.floor(v[0].y / 600)) % 60 === 0) ? 'cyan' : 'purple',
        ((Math.floor(v[0].x / 8) + Math.floor(v[0].y / 800)) % 80 === 0) ? 'aquamarine' : 'pink',
        ((Math.floor(v[0].x / 9) + Math.floor(v[0].y / 90)) % 18 === 0) ? 'indigo' : 'green',
        ((Math.floor(v[0].x / 15) + Math.floor(v[0].y / 150)) % 30 === 0) ? 'orange' : 'blue',
        ((Math.floor(v[0].x / 20) + Math.floor(v[0].y / 200)) % 40 === 0) ? 'yellow' : 'brown',
        ((Math.floor(v[0].x / 25) + Math.floor(v[0].y / 250)) % 50 === 0) ? 'teal' : 'crimson',
        ((Math.floor(v[0].x / 12) + Math.floor(v[0].y / 120)) % 24 === 0) ? 'magenta' : 'aquamarine',
        ((Math.floor(v[0].x / 18) + Math.floor(v[0].y / 180)) % 36 === 0) ? 'springgreen' : 'violet',
        ((Math.floor(v[0].x / 22) + Math.floor(v[0].y / 220)) % 44 === 0) ? 'salmon' : 'azure',
        ((Math.floor(v[0].x / 12) + Math.floor(v[0].y / 210)) % 21 === 0) ? 'hotpink' : 'lightblue',
        ((Math.floor(v[0].x / 22) + Math.floor(v[0].y / 55)) % 6 === 0) ? 'coral' : 'lightgrey',
        ((Math.floor(v[0].x / 18) + Math.floor(v[0].y / 180)) % 9 === 0) ? 'springgreen' : 'cream',
        ((Math.floor(v[0].x / 14) + Math.floor(v[0].y / 280)) % 28 === 0) ? 'gold' : 'darkblue',
        ((Math.floor(v[0].x / 16) + Math.floor(v[0].y / 320)) % 32 === 0) ? 'deepskyblue' : 'darkred',
        ((Math.floor(v[0].x / 19) + Math.floor(v[0].y / 95)) % 19 === 0) ? 'violet' : 'darkgreen',
        ((Math.floor(v[0].x / 21) + Math.floor(v[0].y / 420)) % 42 === 0) ? 'lemonchiffon' : 'indigo',
        ((Math.floor(v[0].x / 23) + Math.floor(v[0].y / 230)) % 23 === 0) ? 'orchid' : 'darkslategray',
        ((Math.floor(v[0].x / 25) + Math.floor(v[0].y / 50)) % 7 === 0) ? 'tomato' : 'slategrey',
        ((Math.floor(v[0].x / 27) + Math.floor(v[0].y / 270)) % 27 === 0) ? 'lightcoral' : 'steelblue',
        ((Math.floor(v[0].x / 29) + Math.floor(v[0].y / 290)) % 29 === 0) ? 'mediumspringgreen' : 'midnightblue',
        ((Math.floor(v[0].x / 31) + Math.floor(v[0].y / 310)) % 31 === 0) ? 'dodgerblue' : 'saddlebrown',
        ((Math.floor(v[0].x / 33) + Math.floor(v[0].y / 330)) % 33 === 0) ? 'salmon' : 'darkslateblue',
        ((Math.floor(v[0].x / 35) + Math.floor(v[0].y / 85)) % 17 === 0) ? 'mediumorchid' : 'darkcyan',
        ((Math.floor(v[0].x / 37) + Math.floor(v[0].y / 370)) % 37 === 0) ? 'lightsalmon' : 'navy',
    
    
    ];
}

function reflections (angle, tm, v) { // #38 - Reflections
    return [
        ((Math.floor(v[0].x / 30) + Math.floor(v[0].y / 300)) % 60 === 0) ? 'lightblue' : 'darkgreen',
        ((Math.floor(v[0].x / 35) + Math.floor(v[0].y / 350)) % 70 === 0) ? 'lightgreen' : 'darkblue',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / 400)) % 80 === 0) ? 'lightgrey' : 'darkred',
        ((Math.floor(v[0].x / 45) + Math.floor(v[0].y / 450)) % 90 === 0) ? 'lightpink' : 'darkcyan',
        ((Math.floor(v[0].x / 50) + Math.floor(v[0].y / 500)) % 100 === 0) ? 'lightyellow' : 'darkmagenta',
        ((Math.floor(v[0].x / 60) + Math.floor(v[0].y / 200)) % 40 === 0) ? 'lightcoral' : 'darkslateblue',
        ((Math.floor(v[0].x / 70) + Math.floor(v[0].y / 250)) % 50 === 0) ? 'lightskyblue' : 'darkolivegreen',
        ((Math.floor(v[0].x / 280) + Math.floor(v[0].y / 280)) % 5.6 === 0) ? 'lightseagreen' : 'darkorange',
        ((Math.floor(v[0].x / 32) + Math.floor(v[0].y / 320)) % 64 === 0) ? 'lightsteelblue' : 'darkorchid',
        ((Math.floor(v[0].x / 360) + Math.floor(v[0].y / 360)) % 7.2 === 0) ? 'lightgoldenrodyellow' : 'darksalmon',
        ((Math.floor(v[0].x / 38) + Math.floor(v[0].y / 380)) % 76 === 0) ? 'lightsalmon' : 'darkseagreen',
        ((Math.floor(v[0].x / 42) + Math.floor(v[0].y / 420)) % 84 === 0) ? 'lightgreen' : 'darkslategrey',
        ((Math.floor(v[0].x / 406) + Math.floor(v[0].y / 460)) % 9.2 === 0) ? 'lightpink' : 'darkturquoise',
        ((Math.floor(v[0].x / 48) + Math.floor(v[0].y / 480)) % 96 === 0) ? 'lightblue' : 'darkviolet',
        ((Math.floor(v[0].x / 52) + Math.floor(v[0].y / 520)) % 10.4 === 0) ? 'lightgray' : 'darkkhaki',
      
    ];
}

function experimental (angle, tm, v) { // #39 - Experimental
    return [
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'lightgrey' : 'darkred',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'yellow' : 'darkblue',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'pink' : 'black',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'purple' : 'darkred',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'orange' : 'yellow',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'lightgoldenrodyellow' : 'darksalmon',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'lightpink' : 'darkturquoise',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'lightblue' : 'darkgreen',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'fuchsia' : 'darkblue',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'quartz' : 'darkred',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'white' : 'darkcyan',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'orange' : 'darkmagenta',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'yellow' : 'darkslateblue',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'pink' : 'darkolivegreen',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'grey' : 'darkorange',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'red' : 'darkkhaki',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'indigo' : 'darkslategrey',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'orchid' : 'darkturquoise',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'plum' : 'darkviolet',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'lightblue' : 'darkkhaki',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'sapphire' : 'darkslategrey',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'denim' : 'darkturquoise',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'firebrick' : 'darkviolet',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'gold' : 'darkkhaki',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'hotpink' : 'darkslategrey',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'jade' : 'darkturquoise',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'khaki' : 'darkviolet',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'lavender' : 'darkkhaki',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'zircon' : 'darkslategrey',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'xanadu' : 'darkturquoise',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'carrot' : 'darkviolet',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'violet' : 'darkkhaki',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'blue' : 'darkslategrey',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'navy' : 'darkturquoise',
        ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'maroon' : 'darkviolet',
        ((Math.floor(v[0].x / 3600) + Math.floor(v[0].y / 360)) % 7.2 === 0) ? 'darkgrey' : 'darksalmon',
        ((Math.floor(v[0].x / 4006) + Math.floor(v[0].y / 460)) % 9.2 === 0) ? 'lightpink' : 'darkturquoise',
        ((Math.floor(v[0].x / 3540) + Math.floor(v[0].y / 300)) % 60 === 0) ? 'lightblue' : 'darkgreen',
        ((Math.floor(v[0].x / -4435) + Math.floor(v[0].y / 350)) % 70 === 0) ? 'lightgreen' : 'darkblue',
        ((Math.floor(v[0].x / -400) + Math.floor(v[0].y / 477)) % 80 === 0) ? 'lightgrey' : 'darkred',
        ((Math.floor(v[0].x / 5) + Math.floor(v[0].y / 450)) % -90 === 0) ? 'lightpink' : 'darkcyan',
        ((Math.floor(v[0].x / 530) + Math.floor(v[0].y / -500)) % 100 === 0) ? 'lightyellow' : 'darkmagenta',
        ((Math.floor(v[0].x / 650) + Math.floor(v[0].y / 200)) % -40 === 0) ? 'lightcoral' : 'darkslateblue',
        ((Math.floor(v[0].x / 70) + Math.floor(v[0].y / -250)) % 50 === 0) ? 'lightskyblue' : 'darkolivegreen',
        ((Math.floor(v[0].x / 280) + Math.floor(v[0].y / 280)) % 566 === 0) ? 'lightseagreen' : 'darkorange',
        ((Math.floor(v[0].x / 3002) + Math.floor(v[0].y / 32.2)) % 99 === 0) ? 'lightsteelblue' : 'darkorchid',
        ((Math.floor(v[0].x / 3660) + Math.floor(v[0].y / 67)) % 250 === 0) ? 'lightgoldenrodyellow' : 'darksalmon',
        ((Math.floor(v[0].x / 5538) + Math.floor(v[0].y / 380)) % 76 === 0) ? 'lightsalmon' : 'darkseagreen',
        ((Math.floor(v[0].x / 4432) + Math.floor(v[0].y / 420)) % 84 === 0) ? 'lightgreen' : 'darkslategrey',
        ((Math.floor(v[0].x / 4046) + Math.floor(v[0].y / 460)) % 9.2 === 0) ? 'lightpink' : 'darkturquoise',
        ((Math.floor(v[0].x / 4118) + Math.floor(v[0].y / 480)) % 96 === 0) ? 'lightblue' : 'darkviolet',
        ((Math.floor(v[0].x / 5112) + Math.floor(v[0].y / 520)) % 10.4 === 0) ? 'lightgray' : 'darkkhaki',

    ];
}

// Update initialization to include function names for logging
const colorEffectArrays = [
    { name: 'arrayZero', func: arrayZero }, // #0
    { name: 'frog1', func: frog1 }, // #1
    { name: 'sirens', func: sirens }, // #2
    { name: 'multiColourFlashes', func: multiColourFlashes }, // #3
    { name: 'googlyEyes', func: googlyEyes }, // #4
    { name: 'singleDualColourDisco', func: singleDualColourDisco }, // #5
    { name: 'discoBalls', func: discoBalls }, // #6
    { name: 'colourFadeEffects', func: colourFadeEffects }, // #7
    { name: 'burningOrbs', func: burningOrbs }, // #8
    { name: 'flashingOnes', func: flashingOnes }, // #9
    { name: 'crazyFrogs', func: crazyFrogs }, // #10
    { name: 'greyCrazyFrogs', func: greyCrazyFrogs }, // #11
    { name: 'crazyCircus', func: crazyCircus }, // #12
    { name: 'someOthers', func: someOthers }, // #13
    { name: 'splitCreepers', func: splitCreepers }, // #14
    { name: 'hslEffects', func: hslEffects }, // #15
    { name: 'plainColours', func: plainColours }, // #16
    { name: 'xrayNegatives', func: xrayNegatives }, // #17
    { name: 'trippin', func: trippin }, // #18
    { name: 'theRest', func: theRest }, // #19
    { name: 'others', func: others }, // #20
    { name: 'newEffect', func: newEffect }, // #21
    { name: 'slowSpin', func: slowSpin }, // #22
    { name: 'scatterSpin', func: scatterSpin }, // #23
    { name: 'bicycle', func: bicycle }, // #24
    { name: 'splitCapsules', func: splitCapsules }, // #25
    { name: 'spinningTops', func: spinningTops }, // #26
    { name: 'creepingFiller', func: creepingFiller }, // #27
    { name: 'scatter', func: scatter }, // #28
    { name: 'dullAche', func: dullAche }, // #29
    { name: 'eyeRollers', func: eyeRollers }, // #30
    { name: 'partialTransparency', func: partialTransparency }, // #31
    { name: 'prettySpinners', func: prettySpinners }, // #32
    { name: 'strobeEffects', func: strobeEffects }, // #33
    { name: 'strobingSpinners', func: strobingSpinners }, // #34
    { name: 'colourPulses', func: colourPulses }, // #35
    { name: 'staticSpinners', func: staticSpinners }, // #36
    { name: 'patchWork', func: patchWork }, // #37
    { name: 'reflections', func: reflections }, // #38
    { name: 'experimental', func: experimental }, // #39
];


function logColorArrayDetails() {
    colorEffectArrays.forEach((item) => {
        const resultArray = item.func(0, 0, [{z: 1}]); // Call each function
        console.log(`${item.name} returns an array of length ${resultArray.length}`);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const arrayIndexInput = document.getElementById('arrayIndex');
    const colorSettingIndexInput = document.getElementById('colorIndex');

    // Remove the button event listener and replace it with input event listeners
    arrayIndexInput.addEventListener('input', function() {
        arrayIndex = parseInt(arrayIndexInput.value, 10) || 0; // Fallback to 0 if NaN
        updateColor(); // Call updateColor whenever the input value changes
    });

    colorSettingIndexInput.addEventListener('input', function() {
        colorIndex = parseInt(colorSettingIndexInput.value, 10) || 0; // Fallback to 0 if NaN
        updateColor(); // Call updateColor whenever the input value changes
    });

    // Initialize with default values
    updateColor();
    logColorArrayDetails();
});




//     `rgb(${255 - (tm % 255)}, ${tm % 255}, ${(angle + tm) % 255})`, // Color changes with time and angle

//     `rgb(${Math.floor(Math.sin(Date.now() / 550) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 575) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 6000) * 127 + 64)})`, // #108 Muted gold to orange flicker

// `rgb(${Math.floor(Math.sin(Date.now()) * 127 + 64)}, ${Math.floor(Math.sin(Date.now() / 1000) * 127 + 128)}, ${Math.floor(Math.sin(Date.now() / 2000) * 127 + 128)})`,

// `rgb(${Math.random() < 0.5 ? Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) : 255}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})`,

// `rgb(${Math.floor(Math.pow(Math.random(), 2) * 255)}, ${Math.floor(Math.pow(Math.random(), 3) * 255)}, ${Math.floor(Math.random() * 255)})`,

// Math.random() > 0.99 ? `rgb(${Math.random() * 64}, ${Math.random() * 64}, ${Math.random() * 64})` : 'rgb(32, 32, 32)', // #7 - The Whisper of Color

// t % 1900 > 950 ? `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)})` : 'rgb(128, 128, 128)', // #18 - The Color Shuffle

// Math.random() * Math.sin(t / 100) > 0.5 ? `rgb(${Math.floor(Math.abs(Math.sin(t / 100)) * 255)}, 0, 0)` : 'alternative-color', // #1 - The Pulsing Heart

// t % 400 < 200 ? `rgb(${Math.floor(Math.random() * (t % 200) + 55)}, ${Math.floor(Math.random() * (t % 200) + 55)}, ${Math.floor(Math.random() * (t % 200) + 55)})` : 'alternative-color', // #7 - The Shifting Shadows

// `rgb(${Math.floor(128 + Math.sin(Date.now() / 1000) * 127)}, ${Math.floor(128 + Math.sin(Date.now() / 1500) * 127)}, ${Math.floor(128 + Math.sin(Date.now() / 2000) * 127)})`,

// Math.random() < 0.5 ? `rgb(${Math.floor((v[0].z + R) / (4 * R) * 128)}, 0, 0)` : 'alternative-color', // #1 - The Red Shift

// t % 400 > 200 ? `rgb(0, 0, 0)` : 'white', // #1 - The Classic Flip Flashing white black

// Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color', // #0 - The Crazy One

// Math.random() < 0.5 ? '#' + Math.floor(Math.random() * 16777215).toString(16) : 'alternative-color',  // #50 Crazy Circus (slightly less crazy)

// Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 85) % 255}, ${(Math.floor((v[0].z + R) / (2 * R) * 255) + 170) % 255})` : 'alternative-color',

// ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? '#00001E' : 'black', // #1 Red Scorpion

// `hsl(${tm % 1 * 360}, 100%, 50%)`,                // #21 - The Rainbow

// `rgb(${((v[0].z + R) / (2 * R) * 255) & 255}, ${((v[0].z + R) / (2 * R) * 255) & 255}, ${((v[0].z + R) / (2 * R) * 255) & 255})`,

// (v[0].y + tm) % 200 < 100 ? `hsl(0, 0%, ${(v[0].y + tm) % 100}%)` : 'alternative-color',

// Math.floor((v[0].z + R) / (2 * R) * 360) < 180 ? `hsl(${Math.floor((v[0].z + R) / (2 * R) * 360)}, 100%, 50%)` : 'alternative-color',

// Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 40) + 30}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 30) + 270}, 80%, 50%)`,

// `hsl(${(v[0].y + tm) % 360}, 100%, 50%)`,

// Math.abs(Math.sin(tm / 15000)) < 0.5 ? 'green' : 'magenta',

//     `hsl(${(tm + 1) % 1}, 100%, 50%)`,

//     Math.abs(Math.sin(tm / 50000)) < 0.5 ? 'violet' : 'skyblue',

//     (v[0].y + tm) % 720 < 360 ? `hsl(${(v[0].y + tm) % 360}, 100%, 75%)` : 'alternative-color',

//     255 - Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${255 - Math.floor((v[0].z + R) / (2 * R) * 255)}, ${255 - Math.floor((v[0].z + R) / (2 * R) * 255)}, ${255 - Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color',

//     Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255) > 128 ? `rgb(${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.random() * Math.floor((v[0].z + R) / (2 * R) * 255)})` : 'alternative-color',

//     Math.random() > 0.5 ? `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)` : `hsl(${Math.floor(Math.random() * 360)}, 30%, 50%)`,

// ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 3333)) % 9999 === 0) ? 'yellow' : 'black',

//     `hsl(${(angle + 60 * Math.sin(tm / 1000) + 60) % 360}, 1000%, 10%)`, // Shifted hue

//     ((Math.floor(v[0].x / 0.55555) + Math.floor(v[0].y / 333)) % 666 === 0) ? 'yellow' : 'black',

//     ((Math.floor(v[0].x / 0.05) + Math.floor(v[0].y / 2000)) % 111 === 0) ? 'orange' : 'black',

//     ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 999)) % 2 === 0) ? 'red' : 'blue',

//     ((Math.floor(v[0].x / 20) + Math.floor(v[0].y / 10000)) % 2 === 0) ? 'cyan' : 'yellow', // Cyan or yellow based on coordinates

//     ((Math.floor(v[0].x / 678) + Math.floor(v[0].y / 789)) % 16 === 0) ? '#FF69B4' : 'black', // Hot Pink

//     ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 5555)) % 9999 === 0) ? 'red' : 'black',

//     `rgb(${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, 0, 0)`, // Red shades based on distance from center

//     `rgb(0, ${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, 0)`, // Green shades based on distance from center

//     `rgba(255, 0, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`, // Red

//     `rgba(255, 0, 0, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`, // Calculated alpha value based on vertices

//     `rgb(${Math.floor(128 + 127 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(128 + 127 * Math.cos(angle))}, 100)`,

//     `rgb(${Math.floor(100 + 155 * Math.sin(tm))}, ${Math.floor(255 * Math.abs(Math.cos(tm / 2)))}, ${Math.floor(255 * Math.sin(tm))})`,

//     `rgb(255, ${Math.floor(128 + 127 * Math.sin(tm / 3))}, ${Math.floor(128 + 127 * Math.cos(tm / 3))})`,

//     `rgb(${Math.floor(200 + 55 * Math.cos(angle))}, ${Math.floor(220 - 20 * Math.sin(Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2))))}, ${Math.floor(255 - 127 * Math.sin(angle))})`,

//     ((Math.floor(v[0].x / 9) + Math.floor(v[0].y / 90)) % 18 === 0) ? 'aqua' : 'green',

//     ((Math.floor(v[0].x / 45) + Math.floor(v[0].y / 450)) % 90 === 0) ? 'lightpink' : 'darkcyan',

//     ((Math.floor(v[0].x / 400) + Math.floor(v[0].y / -400)) % 80 === 0) ? 'quartz' : 'darkred',
