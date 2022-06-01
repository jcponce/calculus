/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 30-Jul-2020
 * https://jcponce.github.io/
 */
 
// Updated 31-May-2022 

let easycam;

// Butterfly model
let wl, wr;

function preload() {
  wl = loadModel('wl.obj');
  wr = loadModel('wr.obj');
}

function setup() {
  
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);

  console.log(Dw.EasyCam.INFO);

  easycam = new Dw.EasyCam(this._renderer, {
    distance: 60
  });
  
  pixelDensity(2);

  //create attractor curve
  attractor = new LorenzAttractor();

  // create gui (dat.gui)
  let gui = new dat.GUI();
  gui.close();
  gui.add(parDef, 'Attractor');
  gui.add(parDef, 'Speed', 0, 1.5, 0.01).listen();
  gui.add(parDef, 'Particles').name("Butterflies");
  gui.add(parDef, 'Curve');
  gui.add(parDef, 'Animate').name("Animate C");
  gui.add(parDef, 'Randomize');
  gui.add(parDef, 'Preset');
  gui.add(parDef, 'Snapshot');
  //gui.add(this, 'backHome').name("See more");

  // Place initial samples
  initSketch();

}


function draw() {

  // projection
  perspective(60 * PI / 180, width / height, 1, 5000);

  // BG
  background(255);

  ambientLight(255);
  rotateX(PI / 2);
  rotateZ(-0.6);
  translate(-5, 0, -23);

  if (parDef.Particles == true) {
    //updating and displaying the particles
    for (let i = particles.length - 1; i >= 0; i -= 1) {
      let p = particles[i];
      p.updateEuler();
      p.display();
      if (p.x > 100 || p.y > 100 || p.z > 100 || p.x < -100 || p.y < -100 || p.z < -100) {
        particles.splice(i, 1);
        //currentParticle--;
        particles.push(new Particle(random(-5, 5), random(-5, 5), random(-5, 5), t, h));
      }
    }
  }

  // gizmo for reference :)
  //strokeWeight(0.1);
  //stroke(255, 32,  0); line(0,0,0,2,0,0);
  //stroke( 32,255, 32); line(0,0,0,0,2,0);
  //stroke(  0, 32,255); line(0,0,0,0,0,2);


  if (parDef.Curve === true) {
    push();
    noFill();
    beginShape();
    for (let k = 0; k < addPoints; k++) {
      stroke(41, 82, 163);
      strokeWeight(0.15);
      vertex(points[k].x, points[k].y, points[k].z);
    }
    endShape();
    pop();
  }

  if (parDef.Animate === false) {
    addPoints += 0;
    addPoints = NUM_POINTS;
  } else {
    addPoints += 2;
    if (addPoints > points.length - 2) {
      addPoints = 2;
    }
  }

}


