/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 06-Aug-2019
 * https://jcponce.github.io/
 *
 * This Chladni patterns simulation is based upon the work
 * of KaijinQ https://www.openprocessing.org/user/44852
 * The original sketch can me found here:
 * ChladniModoki_2.0 https://www.openprocessing.org/sketch/715119
 *
 * In this version, I added some draggable points to play with
 * different patterns and some parameters that the user can modified.
 *
 * I still want to figure out how to make a class for the Chladni particles,
 * which I will do later. For now, it looks pretty cool.
 *
 */

let N = 3500;
//let NNmax = 8;
let V = 0.5;
//let F = 0.15;
let PV = -1.5;
let d = 1;

let PX = [];
let PY = [];
let NN;
let SX = [];
let SY = [];
let I, II,L, R, D, C, VX, VY, T, TT;


// settings and presets
let parDef = {
  play: true,
  frq: 0.15,
  nPoints: 4,
  bckgR: 0,
  bckgG: 0,
  bckgB: 0,
  opt: 100,
  red: 255,
  green: 255,
  blue: 255,
  Save: function() {
    save('chladni-pattern.jpg');
  },
};

let dif;

function setup() {

  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  let gui = new dat.GUI();
  gui.add(parDef, 'play').name('Animation');
  gui.add(parDef, 'frq', 0.001, 0.6, 0.001).name('Frequency').listen();
  gui.add(parDef, 'nPoints', 1, 10, 1).name('Sources').listen();
  gui.add(this, 'resetPoints').name("Center Points");

  gui.add(parDef, 'Save').name('Save (jpg)');

  let pointsGUI = gui.addFolder('Point settings');

  pointsGUI.add(parDef, 'red', 0, 255, 1).name('Red').listen();
  pointsGUI.add(parDef, 'green', 0, 255, 1).name('Green').listen();
  pointsGUI.add(parDef, 'blue', 0, 255, 1).name('Blue').listen();
  pointsGUI.add(parDef, 'opt', 5, 100, 1).name('Trace').listen();

  //let backGUI = gui.addFolder('Background settings');
  //backGUI.add(parDef, 'bckgR', 0, 255, 1).name('Red').listen();
  //backGUI.add(parDef, 'bckgG', 0, 255, 1).name('Green').listen();
  //backGUI.add(parDef, 'bckgB', 0, 255, 1).name('Blue').listen();
  //backGUI.add(parDef, 'opt', 5, 100, 1).name('Trace').listen();

  gui.add(this, 'infoChladni').name("Chladni Info");
  gui.add(this, 'refreshPage').name("Restart");
    gui.add(this, 'sourceCode').name("Source Code");
  gui.add(this, 'backHome').name("Back Home");
  
  gui.close();
  
  textSize(24);

  NN = 4;
  T = 0;
  TT = 1;

  dif = width * 1 / 2 * 0.3;
  for (let i = 0; i < parDef.nPoints; i++) {
    pushRandomCircle();

  }

  resetPoints();

  for (I = 0; I < N; I++) {
    PX[I] = random(0, width);
    PY[I] = random(0, height);
  }

  frameRate(60);
    blendMode(BLEND);


} // setup()

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  resetPoints();
}

function resetPoints() {
  dif = width * 1 / 2 * 0.3;
    
    let nx, ny;

  for (let i = 0; i < ptsD.length; i++) {
      if(parDef.nPoints===1){
          nx = 0;
          ny = 0;
      }else if(parDef.nPoints===4){
          nx = map(cos(2 * PI * i / ptsD.length)-sin(2 * PI * i / ptsD.length), 0, 2 * PI, 0, width);
          ny = map(cos(2 * PI * i / ptsD.length)+sin(2 * PI * i / ptsD.length), 0, 2 * PI, 0, height);
      } else{
          nx = map(cos(2 * PI * i / ptsD.length), 0, 2 * PI, 0, width);
          ny = map(sin(2 * PI * i / ptsD.length), 0, 2 * PI, 0, height);
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

function draw() {

  background(parDef.bckgR, parDef.bckgG, parDef.bckgB, parDef.opt);
  noStroke();

  for (I = 0; I < N; I++) {
    R = 0;
    D = 0;
    C = 0;
    for (II = 0; II < ptsD.length; II++) {
      let sx = ptsD[II].x;
      let sy = ptsD[II].y;
      L = sqrt(((PX[I] - sx) * (PX[I] - sx)) + ((PY[I] - sy) * (PY[I] - sy)));

      C = C + sin(2 * PI * parDef.frq * (T - (L / V)) / 60);

      L = sqrt(((PX[I] + d - sx) * (PX[I] + d - sx)) + ((PY[I] - sy) * (PY[I] - sy)));

      R = R + sin(2 * PI * parDef.frq * (T - (L / V)) / 60);

      L = sqrt(((PX[I] - sx) * (PX[I] - sx)) + ((PY[I] + d - sy) * (PY[I] + d - sy)));

      D = D + sin(2 * PI * parDef.frq * (T - (L / V)) / 60);
    } //ends II

    R = abs(R);
    D = abs(D);
    C = abs(C);

    fill(parDef.red * (1 - C), parDef.green * (1 - C), parDef.blue * (1 - C));
    ellipse(PX[I], PY[I], 4, 4);

    L = sqrt(((R - C) * (R - C)) + ((D - C) * (D - C)));

    VX = PV * (R - C) / L;
    VY = PV * (D - C) / L;

    PX[I] = PX[I] + VX;
    PY[I] = PY[I] + VY;

    if (PX[I] < 0 || PX[I] > width || PY[I] < 0 || PY[I] > height || C < 0.0025) {
      PX[I] = random(0, width);
      PY[I] = random(0, height);
    }
  } // ends I

  for (let drag of ptsD) {
    drag.update();
    drag.over();
    drag.show();
  }

  T = T + TT;

  if (parDef.play === true) {
    TT = 1;
  } else if (parDef.play === false) {
    TT = 0;
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

  if (textIni == true) {
    noStroke()
    fill(70);
    rectMode(CENTER);
    rect(width / 2, 64, 260, 60, 20);
    strokeWeight(1);
    fill(250);
    textAlign(CENTER);
    text("Drag points around!", width / 2, 70);
    //text("Change values with controls", width / 2, 110)
  }

} // draw()


function infoChladni() {
  window.location.href = "https://core.ac.uk/download/pdf/12517675.pdf";
}

function sourceCode() {
  window.location.href = "https://github.com/jcponce/calculus/tree/gh-pages/chladni-patterns";
}

function backHome() {
  window.location.href = "https://jcponce.github.io/#sketches";
}

function refreshPage(){
    window.location.reload();
} 


let textIni = true;

function mousePressed() {

  for (let drag of ptsD) {
    drag.pressed();
      cursor('grab');
  }
  textIni = false;

} // mousePressed() 



function mouseReleased() {
  for (let drag of ptsD) {
    // Quit dragging
    drag.released();
      cursor(ARROW);
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
        cursor(ARROW);
    }
}


let ptsD = [];
// Make a new circle
function pushRandomCircle() {
  let dragP = new Draggable(); // Create a new circle
  ptsD.push(dragP); // Add the new circle to the points
}
