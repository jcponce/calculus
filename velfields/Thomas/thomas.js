/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 19-Jul-2018
 */

// Updated 01/Jun-2022

let easycam; //3d enviroment

let particles = [];
let points = [];

let attractor; //Define attractor

let NUM_POINTS = 4000; //num of points in curve

let numMax = 600; //num of particles
let t = 0;
let h = 0.027;


// settings and presets
let parDef = {
    Attractor: 'Thomas',
    Speed: 4,
    Particles: true,
    Preset: function () {
        removeElements();
        this.Speed = 4;
        this.Particles = true;
        attractor.b = 0.208186;
        attractor.x = 1.1;
        attractor.y = 1.1;
        attractor.z = -0.01;
        for (let i = points.length - 1; i >= 0; i -= 1) {
            points.splice(i, 1);
        }
        initSketch();
    },
    Randomize: randomCurve,
};


function backAttractors() {
    window.location.href = "https://jcponce.github.io/strange-attractors/#thomas";
}

function setup() {

    attractor = new ThomasAttractor();

    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'Attractor');
    gui.add(parDef, 'Speed', 0, 8, 0.01).listen();
    gui.add(parDef, 'Particles');
    gui.add(parDef, 'Randomize');
    gui.add(parDef, 'Preset');
    gui.add(this, 'backAttractors').name("Go Back");

    pixelDensity(2);

    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);

    console.log(Dw.EasyCam.INFO);

    easycam = new Dw.EasyCam(this._renderer, {
        distance: 10
    });

    // place initial samples
    initSketch();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0, 0, windowWidth, windowHeight]);

}

function randomCurve() {
    removeElements();
    for (var i = points.length - 1; i >= 0; i -= 1) {
        points.splice(i, 1);
    }
    attractor.randomize();
    initSketch();

}

function initSketch() {

    var hleft = select('#hud-left');
    var hright = select('#hud-right');

    createElement('li', 'b = ' + nfc(attractor.b, 2)).parent(hleft);

    createElement('li', '----------').parent(hleft);

    createElement('li', 'x<sub>0</sub> = ' + nfc(attractor.x, 2)).parent(hleft);
    createElement('li', 'y<sub>0</sub> = ' + nfc(attractor.y, 2)).parent(hleft);
    createElement('li', 'z<sub>0</sub> = ' + nfc(attractor.z, 2)).parent(hleft);

    let p = {
        x: attractor.x,
        y: attractor.y,
        z: attractor.z
    }

    for (var j = 0; j < NUM_POINTS; j++) {

        p = attractor.generatePoint(p.x, p.y, p.z);

        if (isNaN(p.x) || isNaN(p.y) || isNaN(p.z)) {
            console.log('Failed, retry');
            randomCurve();
            return;
        }

        points.push(new p5.Vector(attractor.scale * p.x, attractor.scale * p.y, attractor.scale * p.z));

    }
    let m = 20;
    for (var i = 0; i < numMax; i++) {
        particles[i] = new Particle(random(-m, m), random(-m, m), random(-m, m), t, h);
    }

}

function draw() {

    // projection
    perspective(60 * PI / 180, width / height, 1, 5000);

    // BG
    background(0);
    push();
    noFill();
    beginShape(POINTS);
    for (var v of points) {
        stroke(204, 255, 255);
        strokeWeight(0.02);
        vertex(v.x, v.y, v.z);
    }
    endShape();
    pop();

    if (parDef.Particles == true) {
        //updating and displaying the particles
        for (var i = particles.length - 1; i >= 0; i -= 1) {
            let p = particles[i];
            p.update();
            p.display();
            if (p.x > 80 || p.y > 80 || p.z > 80 || p.x < -80 || p.y < -80 || p.z < -80) {
                particles.splice(i, 1);
                particles.push(new Particle(random(-7, 7), random(-6, 6), random(-6, 6), t, h));
            }
        }
    }
    // gizmo
    //strokeWeight(0.1);
    //stroke(255, 32,  0); line(0,0,0,2,0,0);
    //stroke( 32,255, 32); line(0,0,0,0,2,0);
    //stroke(  0, 32,255); line(0,0,0,0,0,2);

    //console.log(attractor.b);

}

//Define system funtions for using in Particle class
const componentFX = (t, x, y, z) => parDef.Speed * (sin(y) - attractor.b * x); //Change this function

const componentFY = (t, x, y, z) => parDef.Speed * (sin(z) - attractor.b * y); //Change this function

const componentFZ = (t, x, y, z) => parDef.Speed * (sin(x) - attractor.b * z); //Change this function

// Runge-Kutta method
function rungeKutta(time, x, y, z, h) {
    let k1 = componentFX(time, x, y, z);
    let j1 = componentFY(time, x, y, z);
    let i1 = componentFZ(time, x, y, z);

    let k2 = componentFX(
        time + (1 / 2) * h,
        x + (1 / 2) * h * k1,
        y + (1 / 2) * h * j1,
        z + (1 / 2) * h * i1
    );
    let j2 = componentFY(
        time + (1 / 2) * h,
        x + (1 / 2) * h * k1,
        y + (1 / 2) * h * j1,
        z + (1 / 2) * h * i1
    );
    let i2 = componentFZ(
        time + (1 / 2) * h,
        x + (1 / 2) * h * k1,
        y + (1 / 2) * h * j1,
        z + (1 / 2) * h * i1
    );
    let k3 = componentFX(
        time + (1 / 2) * h,
        x + (1 / 2) * h * k2,
        y + (1 / 2) * h * j2,
        z + (1 / 2) * h * i2
    );
    let j3 = componentFY(
        time + (1 / 2) * h,
        x + (1 / 2) * h * k2,
        y + (1 / 2) * h * j2,
        z + (1 / 2) * h * i2
    );
    let i3 = componentFZ(
        time + (1 / 2) * h,
        x + (1 / 2) * h * k2,
        y + (1 / 2) * h * j2,
        z + (1 / 2) * h * i2
    );
    let k4 = componentFX(time + h, x + h * k3, y + h * j3, z + h * i3);
    let j4 = componentFY(time + h, x + h * k3, y + h * j3, z + h * i3);
    let i4 = componentFZ(time + h, x + h * k3, y + h * j3, z + h * i3);
    x = x + (h / 6) * (k1 + 2 * k2 + 2 * k3 + k4);
    y = y + (h / 6) * (j1 + 2 * j2 + 2 * j3 + j4);
    z = z + (h / 6) * (i1 + 2 * i2 + 2 * i3 + i4);
    return {
        u: x,
        v: y,
        w: z
    };
}

//Particle class definition and motion
class Particle {

    constructor(_x, _y, _z, _t, _h) {
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.time = _t;
        this.radius = random(0.05, 0.05);
        this.h = _h;
        this.op = random(190, 200);
        this.r = random(0);
        this.g = random(164, 255);
        this.b = random(255);
    }

    update() {
        let tmp = rungeKutta(this.time, this.x, this.y, this.z, this.h);

        this.x = tmp.u;
        this.y = tmp.v;
        this.z = tmp.w;

        this.time += this.h;
    }

    display() {
        push();
        translate(this.x, this.y, this.z);
        ambientMaterial(this.r, this.b, this.g);
        noStroke();
        sphere(this.radius, 6, 6);
        pop();
    }

}

//Define attractor class for drawing the solution curve
class ThomasAttractor {

    constructor() {
        this.speed = 10;

        this.b = 0.208186;

        this.x = 1.1;
        this.y = 1.1;
        this.z = -0.01;

        this.h = .027;
        this.scale = 1;
    }

    generatePoint(x, y, z) {

        var nx = this.speed * (Math.sin(y) - this.b * x);
        var ny = this.speed * (Math.sin(z) - this.b * y);
        var nz = this.speed * (Math.sin(x) - this.b * z);

        x += this.h * nx;
        y += this.h * ny;
        z += this.h * nz;

        return {
            x: x,
            y: y,
            z: z
        }

    }

    randomize() {

        this.b = random(0.01, 0.4);

        this.x = random(-1.1, 1.1);
        this.y = random(-1.1, 1.1);
        this.z = random(-1, 1);

    }

}