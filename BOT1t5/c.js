function getColors(angle, tm, v) {
  return [
      `hsl(${(angle + 60 * Math.sin(tm / 1000)) % 360}, 100%, 50%)`,
      `hsl(${Math.random() * 360}, 100%, ${50 + 25 * Math.cos(tm / 1000)}%)`,
      ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 8 === 0) ? '#00001E' : 'black',
      ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 16 === 0) ? '#00001E' : 'black',
      ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 9999)) % 9999 === 0) ? 'grey' : 'black',
      ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 5555)) % 9999 === 0) ? 'red' : 'black',
      ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 3333)) % 9999 === 0) ? 'white' : 'black',
      ((Math.floor(v[0].x / 0.0111) + Math.floor(v[0].y / 3333)) % 9999 === 0) ? 'yellow' : 'black',
      ((Math.floor(v[0].x / 0.55555) + Math.floor(v[0].y / 333)) % 666 === 0) ? 'yellow' : 'black',
      ((Math.floor(v[0].x / 0.55555) + Math.floor(v[0].y / 30000)) % 666 === 0) ? 'red' : 'black',
      ((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 2000)) % 666 === 0) ? 'red' : 'black',
      ((Math.floor(v[0].x / 0.0001) + Math.floor(v[0].y / 1000)) % 666 === 0) ? 'grey' : 'black',
      ((Math.floor(v[0].x / 0.01) + Math.floor(v[0].y / 1000)) % 666 === 0) ? 'green' : 'black',
      ((Math.floor(v[0].x / 0.1) + Math.floor(v[0].y / 1000)) % 111 === 0) ? 'orange' : 'black',
      ((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 1000)) % 111 === 0) ? 'pink' : 'black',
      ((Math.floor(v[0].x / 1) + Math.floor(v[0].y / 111)) % 11 === 0) ? 'purple' : 'black',
      ((Math.floor(v[0].x / 11) + Math.floor(v[0].y / 111)) % 11 === 0) ? 'purple' : 'black',
      ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 11 === 0) ? 'purple' : 'black',
      ((Math.floor(v[0].x / 111) + Math.floor(v[0].y / 111)) % 7 === 0) ? 'blue' : 'black',
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
      `rgb(0, ${Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)}, ${255 - Math.floor((Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2)) / (S / 2)) * 255)})`,
      `rgb(${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)}, ${Math.floor((v[0].z + R) / (2 * R) * 255)})`,
      `hsl(${(v[0].x + v[0].y) % 360}, 100%, 50%)`,
      `rgba(255, 0, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`,
      `rgba(255, 0, 0, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`,
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
      `rgba(255, 0, 0, ${Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2)) / 50})`,
      `rgba(255, 0, 0, ${Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 5000)})`,
      `rgba(255, 165, 0, 0.5)`, // Placeholder for moveGradient
  ];
}

// let angle = Math.atan2(p[0].y - S / 2, p[0].x - S / 2) * 180 / Math.PI;
// cx.fillStyle = `hsl(${angle % 360}, 100%, ${50 + 25 * Math.cos(tm / 1000)}%)`;
// cx.fill();
// 
// let dynamicRadial = cx.createRadialGradient(S / 2, S / 2, 20, S / 2, S / 2, 100 + 50 * Math.sin(tm / 1000));
// dynamicRadial.addColorStop(0, 'lime');
// dynamicRadial.addColorStop(1, 'blue');
// cx.fillStyle = dynamicRadial;
// cx.fill();
// 
// cx.fillStyle = `hsl(${(p[0].x + p[0].y) % 360}, 100%, 50%)`;
// cx.fill();
// 
// let speed = Math.sqrt(Math.pow(v[0].x - v[1].x, 2) + Math.pow(v[0].y - v[1].y, 2));
// let speedGradient = cx.createLinearGradient(0, 0, S, S);
// speedGradient.addColorStop(0, `rgba(255, 0, 0, ${speed / 50})`);
// speedGradient.addColorStop(1, `rgba(0, 255, 0, ${speed / 50})`);
// cx.fillStyle = speedGradient;
// cx.fill();
// 
// let oscGradient = cx.createLinearGradient(0, 0, S, S);
// oscGradient.addColorStop(Math.abs(Math.sin(tm / 1000)), 'magenta');
// oscGradient.addColorStop(1 - Math.abs(Math.sin(tm / 1000)), 'cyan');
// cx.fillStyle = oscGradient;
// cx.fill();
// 
// 
// cx.fillStyle = `hsl(${(p[0].y + tm) % 360}, 100%, 50%)`;
// cx.fill();
// 
// let moveGradient = cx.createLinearGradient(p[0].x, p[0].y, p[1].x, p[1].y);
// moveGradient.addColorStop(0, `rgba(255, 165, 0, 0.5)`);
// moveGradient.addColorStop(1, `rgba(0, 0, 255, 0.5)`);
// cx.fillStyle = moveGradient;
// cx.fill();
// 
// cx.fillStyle = `hsl(${tm % 360}, 100%, ${50 + 25 * Math.sin(tm / 1000)}%)`;
// cx.fill();
// 
// 
// let dist = Math.sqrt(Math.pow(v[0].x - S/2, 2) + Math.pow(v[0].y - S/2, 2));
// let distColor = Math.floor((dist / (S / 2)) * 255);
// cx.fillStyle = `rgb(0, ${distColor}, ${255 - distColor})`;
// cx.fill(); 
// 
// cx.fillStyle = f[0] % 2 === 0 ? '#00ff00' : '#ff00ff';
// cx.fill();
// 
// let area = Math.abs((v[0].x * (v[1].y - v[2].y) + v[1].x * (v[2].y - v[0].y) + v[2].x * (v[0].y - v[1].y)) / 2);
// let areaGradient = cx.createLinearGradient(0, 0, S, S);
// areaGradient.addColorStop(0, `rgba(255, 0, 0, ${area / 5000})`);
// areaGradient.addColorStop(1, `rgba(0, 0, 255, ${area / 5000})`);
// cx.fillStyle = areaGradient;
// cx.fill();
// 
// let zColor = Math.floor((v[0].z + R) / (2 * R) * 255);
// cx.fillStyle = `rgb(${zColor}, ${zColor}, ${zColor})`;
// cx.fill();
// 
// 
// if ((Math.floor(v[0].x / 50) + Math.floor(v[0].y / 50)) % 2 === 0) {
//   cx.fillStyle = 'black';
// } else {
//   cx.fillStyle = 'white';
// }
// cx.fill();
// 
// cx.fillStyle = `rgba(255, 0, 0, ${Math.abs(Math.cos(a))})`; // Transparency varies with rotation angle
// cx.fill();
// 
// cx.fillStyle = `rgba(255, 0, 0, ${Math.abs(Math.cos(a))})`; // Transparency varies with rotation angle
// cx.fill();
// 
// 
// let radialGradient = cx.createRadialGradient(S / 2, S / 2, 10, S / 2, S / 2, S / 2);
// radialGradient.addColorStop(0, 'green');
// radialGradient.addColorStop(1, 'yellow');
// cx.fillStyle = radialGradient;
// cx.fill();
// 
// let diagonalGradient = cx.createLinearGradient(0, 0, S, S);
// diagonalGradient.addColorStop(0, 'purple');
// diagonalGradient.addColorStop(1, 'orange');
// cx.fillStyle = diagonalGradient;
// cx.fill();
// 
// let gradient = cx.createLinearGradient(0, 0, S, 0);
// gradient.addColorStop(0, '#ff0000');
// gradient.addColorStop(1, '#0000ff');
// cx.fillStyle = gradient;
// cx.fill();
// 
// let g = cx.createLinearGradient(0, S / 2, 0, S);
// if (m < S / 2) {
//     g.addColorStop(0, '#80ff00');
//     g.addColorStop(1, '#80ff00');
// } else {
//     g.addColorStop(0, '#0080ff');
//     g.addColorStop(1, '#000000');
// }
// cx.fillStyle = g;
// cx.fill();
// 
// 
// let color = '#' + Math.floor(Math.random()*16777215).toString(16);
// cx.fillStyle = color;
// cx.fill();
// 
// g = cx.createLinearGradient(0, S / 2, 0, S);
// if (m < S / 2) {
//     g.addColorStop(0, '#80ff00');
//     g.addColorStop(1, '#80ff00');
// } else {
//     g.addColorStop(0, '#0080ff');
//     g.addColorStop(1, '#000000');
// }
// cx.fillStyle = g;
// cx.fill();
// 
// 