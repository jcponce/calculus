// Variable for curve - Lorenz attractor
let points = [];
let attractor;
let NUM_POINTS = 2300; //num of points in curve
let addPoints = 2300;

// Particles variables
let particles = [];
let numMax = 280;
let t = 0;
let h = 0.01;
//let currentParticle = 0;

// Settings and presets
let parDef = {
  Attractor: 'Lorenz with butterflies',
  Speed: 0.35,
  Particles: true,
  Curve: true,
  Animate: false,
  Preset: function() {
    removeElements();
    this.Speed = 0.35;
    this.Particles = true;
    this.Curve = true;
    attractor.p = 10.0;
    attractor.r = 28.0;
    attractor.b = 8.0 / 3.0;
    attractor.x = 1.1;
    attractor.y = 2;
    attractor.z = 7;
    for (let i = points.length - 1; i >= 0; i -= 1) {
      points.splice(i, 1);
    }
    initSketch();
  },
  Randomize: randomCurve,
};

function initSketch() {

  let hleft = select('#hud-left');
  let hright = select('#hud-right');

  createElement('li', '&sigma; = ' + nfc(attractor.p, 2)).parent(hleft);
  createElement('li', '&rho; = ' + nfc(attractor.r, 2)).parent(hleft);
  createElement('li', '&beta; = ' + nfc(attractor.b, 2)).parent(hleft);

  createElement('li', '----------').parent(hleft);
  createElement('h3', 'Init. Cond.').parent(hleft);

  createElement('li', 'x<sub>1</sub> = ' + nfc(attractor.x, 2)).parent(hleft);
  createElement('li', 'y<sub>1</sub> = ' + nfc(attractor.y, 2)).parent(hleft);
  createElement('li', 'z<sub>1</sub> = ' + nfc(attractor.z, 2)).parent(hleft);


  let p = {
    x: attractor.x,
    y: attractor.y,
    z: attractor.z
  }

  for (let j = 0; j < NUM_POINTS; j++) {

    p = attractor.generatePoint(p.x, p.y, p.z);

    if (isNaN(p.x) || isNaN(p.y) || isNaN(p.z)) {
      console.log('Failed, retry');
      randomCurve();
      return;
    }

    points.push(new p5.Vector(attractor.scale * p.x, attractor.scale * p.y, attractor.scale * p.z));

  }

  let m = 30;
  for (let i = 0; i < numMax; i++) {
    particles[i] = new Particle(random(-m, m), random(-m, m), random(-m, m), t, h);
  }

}