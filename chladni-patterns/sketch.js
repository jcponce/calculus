/* p5.js (https://p5js.org/)
  Under Creative Commons License
  https://creativecommons.org/licenses/by-sa/4.0/
  Written by Juan Carlos Ponce Campuzano, 06-Aug-2019
  https://jcponce.github.io/
 
  This Chladni patterns simulation is based upon the work
  of KaijinQ https://www.openprocessing.org/user/44852
  The original sketch was written in Processing and can be
  found here: https://www.openprocessing.org/sketch/715119
  In this p5 version, I rewrote the Chladni particles as a
  class and added some draggable points to play with different
  patterns and some parameters that can be modified by the user.
 
  I am still learning about the maths behind these amazing patterns.
  For now, it looks pretty cool.
 
  Last update: 11-June-22
 
 */

let N = 2500; // Max number of particles
let chl; // Variable to store Chladni particles
let time; // Does not run forever

// settings and presets to use with dat.gui
let parDef = {
  nParticles: 1000,
  play: true,
  frq: 0.15,
  //elasticity: 0.5,
  showOcs: true,
  nPoints: 4,
  canvasSize: 'Square',
  bckgR: 0,
  bckgG: 0,
  bckgB: 0,
  color: [0, 128, 255, 0.3],
  opt: 100,
  red: 255,
  green: 255,
  blue: 255,
  hsbMod: false,
  Save: function () {
    save('chladni-pattern.jpg');
  },
};

//Main functions begins

function setup() {

  //createCanvas(windowWidth, windowHeight);
  createCanvas(500, 500);
  pixelDensity(1);
  smooth();
  //frameRate(60);

  //Gui controls
  let gui = new dat.GUI({
    width: 290
  });
  gui.add(parDef, 'play').name('Animation');
  gui.add(parDef, 'nParticles', 0, 2500, 1).name('Particles').listen(); // Number of particles on animation
  gui.add(parDef, 'frq', 0.03, 0.6, 0.001).name('Frequency').listen();
  //gui.add(parDef, 'elasticity', 0.001, 2, 0.001).name('Elasticity').listen();
  gui.add(parDef, 'canvasSize', ['Square', 'Landscape', 'Full-Screen']).name("Size: ").onChange(screenSize);

  let ocsGUI = gui.addFolder('Sources');
  ocsGUI.add(parDef, 'showOcs').name('Show');
  ocsGUI.add(parDef, 'nPoints', 1, 10, 1).name('n =').listen();
  ocsGUI.add(this, 'resetPoints').name('Set position');

  let pointsGUI = gui.addFolder('Particles settings');
  pointsGUI.add(parDef, 'hsbMod').name('HSB');
  pointsGUI.add(parDef, 'red', 0, 255, 1).name('Red/Hue').listen();
  pointsGUI.add(parDef, 'green', 0, 255, 1).name('Green/Sat').listen();
  pointsGUI.add(parDef, 'blue', 0, 255, 1).name('Blue/Brt').listen();

  //pointsGUI.add(parDef, 'color').name('Background').listen();
  //let backGUI = gui.addFolder('Background settings');
  //backGUI.add(parDef, 'bckgR', 0, 255, 1).name('Red').listen();
  //backGUI.add(parDef, 'bckgG', 0, 255, 1).name('Green').listen();
  //backGUI.add(parDef, 'bckgB', 0, 255, 1).name('Blue').listen();
  pointsGUI.add(parDef, 'opt', 5, 100, 1).name('Trace').listen();

  gui.add(parDef, 'Save').name('Save (jpg)');

  gui.add(this, 'sourceCode').name('Source Code');

  gui.close();
  //Ends GUI controls

  // Add draggable points
  for (let i = 0; i < parDef.nPoints; i++) {
    pushRandomCircle();
  }

  // Set Chladni particles to animate
  chl = new Chladni(N, ptsD);
  chl.init();

  // Reset my dragable points to specific positions
  resetPoints();

} // setup()

function draw() {

  background(parDef.bckgR, parDef.bckgG, parDef.bckgB, parDef.opt);
  cursor(ARROW)
  time = millis() / 1000;

  if (parDef.hsbMod === true) {
    colorMode(HSB, 255, 255, 255, 200);
  } else colorMode(RGB, 255, 255, 255);

  chl.run(); //Chladni is updated
  chl.F = parDef.frq;
  chl.N = parDef.nParticles;

  //Draggable objects
  if (parDef.showOcs === true) {
    for (let drag of ptsD) {
      drag.update();
      drag.over();
      drag.show();
    }
  }

  //animationon/off
  if (parDef.play === true) {
    chl.TT = 1;
  } else if (parDef.play === false) {
    chl.TT = 0;
  }

  // Adjust the amount of circles on screen according to the slider value
  let maxCircles = parDef.nPoints;
  let difference = ptsD.length - maxCircles;
  if (difference < 0) {
    for (let i = 0; i < -difference; i++) {
      pushRandomCircle(); // Add circles if there are less circles than the slider value
    }
  } else if (difference > 0) {
    for (let i = 0; i < difference; i++) {
      ptsD.pop(); // Remove circles if there are more circles than the slider value
    }
  }

  //initial message
  if (textIni === true && time < 25) {
    stroke(0)
    fill(70);
    rectMode(CENTER);
    rect(width / 2, 64, 260, 60, 20);
    strokeWeight(1);
    fill(250);
    textAlign(CENTER);
    textSize(24);
    text("Drag points around!", width / 2, 70);
    //text("Change values with controls", width / 2, 110)
  }

  if (time > 10 * 60) { // 10 minutes max runnig time, so it does not crash. Suggested by Alex :)
    noStroke()
    fill(70);
    rectMode(CENTER);
    rect(width / 2, 64, 260, 60, 20);
    strokeWeight(1);
    fill(250);
    textAlign(CENTER);
    textSize(18);
    text("Please, refresh your browser!", width / 2, 70);
    noLoop();
  }

  //chl.V = parDef.elasticy;

} // draw()

//End of main functions

//Auxiliary functions

function infoChladni() {
  window.location.href = "https://core.ac.uk/download/pdf/12517675.pdf";
}

function sourceCode() {
  window.location.href = "https://github.com/jcponce/calculus/tree/gh-pages/chladni-patterns";
}

function backHome() {
  window.location.href = "https://jcponce.github.io/chladni-patterns";
}

function refreshPage() {
  window.location.reload();
}

function screenSize() {
  if (parDef.canvasSize == 'Square') {
    resizeCanvas(500, 500);
  } else if (parDef.canvasSize == 'Landscape') {
    resizeCanvas(700, 500);
  } else if (parDef.canvasSize == 'Full-Screen') {
    resizeCanvas(windowWidth, windowHeight);
  }
  resetPoints();
}


function resetPoints() {
  let nx, ny;
  let rd = 2.5;
  for (let i = 0; i < ptsD.length; i++) {
    if (parDef.nPoints === 1) {
      nx = 0;
      ny = 0;
    } else if (parDef.nPoints === 4) {
      nx = map(rd * cos(2 * PI * i / ptsD.length) - rd * sin(2 * PI * i / ptsD.length), 0, 2 * PI, 0, width);
      ny = map(rd * cos(2 * PI * i / ptsD.length) + rd * sin(2 * PI * i / ptsD.length), 0, 2 * PI, 0, height);
    } else {
      nx = map(rd * cos(2 * PI * i / ptsD.length), 0, 2 * PI, 0, width);
      ny = map(rd * sin(2 * PI * i / ptsD.length), 0, 2 * PI, 0, height);
    }

    ptsD[i].x = nx + width / 2;
    ptsD[i].y = ny + height / 2;
  }
  /*
   ptsD[0].x = width / 2 - dif;
   ptsD[0].y = height / 2 - dif;
   ptsD[1].x = width / 2 + dif;
   ptsD[1].y = height / 2 - dif;
   ptsD[2].x = width / 2 - dif;
   ptsD[2].y = height / 2 + dif;
   ptsD[3].x = width / 2 + dif;
   ptsD[3].y = height / 2 + dif;
   */

}

let textIni = true;

let ptsD = [];
// Make a new circle
function pushRandomCircle() {
  let dragP = new Draggable(); // Create a new circle
  ptsD.push(dragP); // Add the new circle to the points
}

function mousePressed() {

  for (let drag of ptsD) {
    drag.pressed();
    //cursor('grab');
  }
  textIni = false;

} // mousePressed() 

function mouseReleased() {
  for (let drag of ptsD) {
    // Quit dragging
    drag.released();
    //cursor(ARROW);
  }
}

function touchStarted() {
  for (let drag of ptsD) {
    drag.pressed();
    cursor('grab');
  }
  textIni = false;
}

function touchEnded() {
  for (let drag of ptsD) {
    // Quit dragging
    drag.released();
    //cursor(ARROW);
  }
}