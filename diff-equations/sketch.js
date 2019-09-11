/* Original code from Felix Auer
   http://www.felixauer.com/javascript/difeqrk.html
   
   Adapted by Vamoss https://www.openprocessing.org/user/65884
   https://www.openprocessing.org/sketch/751983
   
   This version made by Juan Carlos Ponce Campuzano
   with more examples
   https://jcponce.github.io
*/


var blobs = [];
var colors;
let variation = 0;
let xScale, yScale, centerX, centerY;

//auto change
//let changeDuration = 3000;
//let lastChange = 0;

// --Control variables--
let clts = {
  ode: "y'=cos(xy)",
  trace: true,
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  frameRate(50);
  xScale = width / 20;
  yScale = height / 20 * (width / height);

  centerX = width / 2;
  centerY = height / 2;

  colors = [color("#7beddc"), color("#78d9fa"), color("#91a7ff"), color("#28fcd2"), color("#456ff7")];

  // create gui (dat.gui)
  let gui = new dat.GUI({
    width: 260
  });
  gui.add(clts, 'ode', ["y'=cos(xy)", "y'=x+y", "y'=sin(x)cos(y)", "y'=cos(x)*y^2", "y'=log(x)log(y)", "y'=tan(x)cos(y)", "y'=4cos(y)(1-y)", "Pendulum", "Oval", "x''=-g*x'-sin(x)+F", "Lotka-Volterra", "Strudel", "Rauten", "Rauten2", "Regenbogen", "Duffing", "BSP Seite 11", "Sonstiges", "van der Pol", "Non linear", "Source & Sink", "Doublet"]).name("Select:").onChange(userSelection);
  gui.add(clts, 'trace').name("Streamlines");
}

function draw() {
  /*
  //DEBUG
  textSize(20);
  noStroke();
  fill(255);
  ellipse(centerX, centerY, 60, 60);
  fill(0);
  text(variation, centerX, centerY-10);
  text(length, centerX, centerY+10);
  */

  if (mouseIsPressed) {
    for (let i = 0; i < 15; i++) {
      let x = mouseX + random(-80, 80);
      let y = mouseY + random(-80, 80);
      var blob = {
        x: getXPos(x),
        y: getYPos(y),
        xSpeed: 0,
        ySpeed: 0,
        size: random(1, 5),
        lastX: x,
        lastY: y,
        color: colors[floor(random(colors.length))],
        direction: random(0.1, 1) //* (random() > 0.5 ? 1 : -1)
      };
      blobs.push(blob);
    }
  }

  var length = blobs.length;
  if (length == 0) {
    background("#1a0633");
    noStroke();
    fill(255);
    textSize(40);
    text("Use mouse to add particles", centerX, centerY);
    return;
  }

  noStroke();
  if (clts.trace == true) {
    fill(0, 10);
  } else {
    fill(0, 100);
  }
  rect(0, 0, width, height);

  //auto change
  //let time = millis();
  //if(time - lastChange > changeDuration) {
  //	lastChange = time;
  //	variation++;
  //	if(variation>11) variation = 0;
  //}

  var stepsize = deltaTime * 0.0008;
  for (var i = length - 1; i >= 0; i--) {
    let blob = blobs[i];

    var x = blob.x;
    var y = blob.y;

    var k1x = getSlopeX(x, y);
    var k1y = getSlopeY(x, y);

    var k2x = getSlopeX(x + blob.direction * stepsize * k1x, y + blob.direction * stepsize * k1y);
    var k2y = getSlopeY(x + blob.direction * stepsize * k1x, y + blob.direction * stepsize * k1y);

    var k3x = getSlopeX(x + blob.direction * stepsize * k2x, y + blob.direction * stepsize * k2y);
    var k3y = getSlopeY(x + blob.direction * stepsize * k2x, y + blob.direction * stepsize * k2y);

    var k4x = getSlopeX(x + blob.direction * 2 * stepsize * k3x, y + blob.direction * 2 * stepsize * k3y);
    var k4y = getSlopeY(x + blob.direction * 2 * stepsize * k3x, y + blob.direction * 2 * stepsize * k3y);

    blob.xSpeed = blob.direction * stepsize / 3 * (k1x + 2 * k2x + 2 * k3x + k4x);
    blob.ySpeed = blob.direction * stepsize / 3 * (k1y + 2 * k2y + 2 * k3y + k4y);

    blob.x += blob.xSpeed;
    blob.y += blob.ySpeed;

    x = getXPrint(blob.x);
    y = getYPrint(blob.y);
    stroke(blob.color);
    strokeWeight(blob.size);
    line(x, y, blob.lastX, blob.lastY);
    blob.lastX = x;
    blob.lastY = y;

    const border = 200;
    if (x < -border || y < -border || x > width + border || y > height + border || length > 3000) {
      blobs.splice(i, 1);
    }
  }
  //console.log(length);
  //noLoop();
}

function getSlopeY(x, y) {
  switch (variation) {
    case 0:
      return Math.cos(x * y);
    case 1:
      return x + y;
    case 2:
      return Math.sin(x) * Math.cos(y);
    case 3:
      return Math.cos(x) * y * y;
    case 4:
      return Math.log(Math.abs(x)) * Math.log(Math.abs(y));
    case 5:
      return Math.tan(x) * Math.cos(y);
    case 6:
      return 4 * cos(y) * (1 - y);
    case 7:
      return -Math.sin(x);
    case 8:
      return -2 * x;
    case 9:
      return -y - Math.sin(1.5 * x) + 0.7;
    case 10:
      return -y * (1 - x);
    case 11:
      return -x - y;
    case 12:
      return Math.sin(x);
    case 13:
      return Math.sin(x) * Math.cos(y);
    case 14:
      return Math.random();
    case 15:
      x = x / 4;
      return x - x * x * x;
    case 16:
      x = x / 5;
      y = y / 5;
      return x + y - y * (x * x + y * y);
    case 17:
      return y * (-1 + x);
    case 18:
      return 0.6 * (-(0.7 * 0.7 * x * x - 1) * 0.7 * y - 0.7 * x);
    case 19:
      return 4 - x * x - y * y;
    case 20:
      return 2 * 0.5 * 0.5 * x * y;
    case 21:
      return -(2 * 0.5 * 0.5 * x * y) / pow(0.5 * 0.5 * x * x + 0.5 * 0.5 * y * y, 2);

  }
}

function getSlopeX(x, y) {
  //return y;
  //return 3*x+2*y;
  switch (variation) {
    case 0:
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 6:
      return 1;
    case 7:
    case 8:
      return y;
    case 9:
      return 1.5 * y;
    case 10:
      return x * (1 - y);
    case 11:
      return y;
    case 12:
      return Math.cos(y);
    case 13:
      return Math.sin(y) * Math.cos(x);
    case 14:
      return Math.random();
    case 15:
      return y / 4;
    case 16:
      x = x / 5;
      y = y / 5;
      return x - y - x * (x * x + y * y);
    case 17:
      return x * (-x + 5) - y * x;
    case 18:
      return 0.6 * (0.7 * y);
    case 19:
      return x * (y - 1);
    case 20:
      return (0.5 * 0.5 * x * x - 0.5 * 0.5 * y * y - 1);
    case 21:
      return (pow(0.5 * x, 4) + 0.5 * 0.5 * x * x * (2 * 0.5 * 0.5 * y * y - 1) + pow(0.5 * y, 4) + 0.5 * 0.5 * y * y) / pow(0.5 * 0.5 * x * x + 0.5 * 0.5 * y * y, 2);

  }
}

// I know, there might me another simpler way to do this. I will refactor later :)
function userSelection() {
  if (clts.ode === "y'=cos(xy)") {
    variation = 0;
  }
  if (clts.ode === "y'=x+y") {
    variation = 1;
  }
  if (clts.ode === "y'=sin(x)cos(y)") {
    variation = 2;
  }
  if (clts.ode === "y'=cos(x)*y^2") {
    variation = 3;
  }
  if (clts.ode === "y'=log(x)log(y)") {
    variation = 4;
  }
  if (clts.ode === "y'=tan(x)cos(y)") {
    variation = 5;
  }
  if (clts.ode === "y'=4cos(y)(1-y)") {
    variation = 6;
  }
  if (clts.ode === "Pendulum") {
    variation = 7;
  }
  if (clts.ode === "Oval") {
    variation = 8;
  }
  if (clts.ode === "x''=-g*x'-sin(x)+F") {
    variation = 9;
  }
  if (clts.ode === "Lotka-Volterra") {
    variation = 10;
  }
  if (clts.ode === "Strudel") {
    variation = 11;
  }
  if (clts.ode === "Rauten") {
    variation = 12;
  }
  if (clts.ode === "Rauten2") {
    variation = 13;
  }
  if (clts.ode === "Regenbogen") {
    variation = 14;
  }
  if (clts.ode === "Duffing") {
    variation = 15;
  }
  if (clts.ode === "BSP Seite 11") {
    variation = 16;
  }
  if (clts.ode === "Sonstiges") {
    variation = 17;
  }
  if (clts.ode === "van der Pol") {
    variation = 18;
  }
  if (clts.ode === "Non linear") {
    variation = 19;
  }
  if (clts.ode === "Source & Sink") {
    variation = 20;
  }
  if (clts.ode === "Doublet") {
    variation = 21;
  }

  redraw();
}

function getXPos(x) {
  return (x - centerX) / xScale;
}

function getYPos(y) {
  return -(y - centerY) / yScale;
}

function getXPrint(x) {
  return xScale * x + centerX;
}

function getYPrint(y) {
  return -yScale * y + centerY;
}

/*Vector field: Maybe to add later
function field() {
  for(var k=ymin; k<=ymax; k+=ystep){
    for(var j=xmin; j<=xmax; j+=xstep){
      var xx = j + sc * getSlopeX(j, k);
      var yy = k + sc * getSlopeX(j, k);
			var lj = map(j, -9.9, 9.9, -width, width);
			var lk = map(-k, -7, 7, -height, height);
			var lx = map(xx, -9.9, 9.9, -width, width);
			var ly = map(-yy, -7, 7, -height, height);
			var angle = atan2(ly-lk, lx-lj);
			var dist = sqrt((lk-ly)*(lk-ly)+(lj-lx)*(lj-lx));
			fill(220,dist);
      push();
      translate(lj, lk);
      rotate(angle);
      triangle(-10, -4, 10, 0, -10, 4);
      pop();
   }
  }
	
}
*/
