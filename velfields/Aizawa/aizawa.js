/**
 * 
 * The p5.EasyCam library - Easy 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright 2018 by Thomas Diewald (https://www.thomasdiewald.com)
 *
 *   Source: https://github.com/diwi/p5.EasyCam
 *
 *   MIT License: https://opensource.org/licenses/MIT
 * 
 * 
 * explanatory notes:
 * 
 * p5.EasyCam is a derivative of the original PeasyCam Library by Jonathan Feinberg 
 * and combines new useful features with the great look and feel of its parent.
 * 
 * 
 */
 

let easycam;
let particles = [];
let numMax = 600;
let t = 0;
let h = 0.01;
let currentParticle = 0;

// settings and presets
let parDef = {
Attractor: 'Aizawa',
Speed: 1.0,
a: 0.95,
b: 0.7,
c: 0.6,
d: 3.5,
e: 0.25,
f: 0.1,
ResetParticles: initSketch,
Preset: function() { this.Speed = 1.0; this.a = 0.95; this.b = 0.7; this.c = 0.6; this.d = 3.5; this.e = 0.25; this.f = 0.1; },
};

//parameters
let P = 1;
let a = 0.95;
let b = 0.7;
let c = 0.6;
let d = 3.5;
let e = 0.25;
let f = 0.1;

let x = 0.1;
let y = 1;
let z = 0.01;

let points = new Array();

function backAttractors () {
    window.location.href = "https://jcponce.github.io/strange-attractors/strange-attractors.html";
}


function setup() {
    
    pixelDensity(1);
    
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'Attractor');
    gui.add(parDef, 'a'   , -0.95, 0.95  ).listen();
    gui.add(parDef, 'b'   , -0.8, 0.8  ).listen();
    gui.add(parDef, 'c'   , -0.7, 0.7  ).listen();
    gui.add(parDef, 'd'   , -4.5, 4.5  ).listen();
    gui.add(parDef, 'e'   , -0.35, 0.35  ).listen();
    gui.add(parDef, 'f'   , -0.25, 0.25  ).listen();
    gui.add(parDef, 'Speed'   , 0, 3  ).listen();
    gui.add(parDef, 'ResetParticles'  );
    gui.add(parDef, 'Preset'  );
    gui.add(this, 'backAttractors').name("Go Back");
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 4});
    
    
    for(let i = 0; i< 2800; i++){
        let dt = 0.02;
        let dx = speed*( P*((z - b) * x - d * y) ) * dt;
        let dy = speed*(  P*(d * x + (z - b) * y) ) * dt;
        let dz = speed*( P*(c + a * z - z*z*z/3 - (x*x+y*y)*(1+e*z)+f*z*x*x*x)  ) * dt;
        x = x + dx;
        y = y + dy;
        z = z + dz;
        
        points.push(new p5.Vector(x, y, z));
    }
    
    // place initial samples
    initSketch();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]);
    
    // place initial samples
    initSketch();
}

function initSketch(){
    
    let m = 1.5;
    for (let i=0; i<numMax; i++) {
        particles[i] = new Particle(random(-m, m), random(-m, m), random(-m+1, m+1), t, h);
    }
    
}


function draw(){
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
    
    rotateX(0.3);
    rotateY(-1);
    let hu = 0;
    beginShape(POINTS);
    for (let v of points) {
        stroke(hu, 193, 255);
        strokeWeight(0.01);
        vertex(v.x, v.y, v.z);
        
        hu += 1;
        if (hu > 255) {
            hu = 0;
        }
    }
    endShape();
    
    //updating and displaying the particles
    for (let i=particles.length-1; i>=0; i-=1) {
        let p = particles[i];
        p.update();
        p.display();
        if ( p.x > 80 ||  p.y > 80 || p.z > 80 || p.x < -80 ||  p.y < -80 || p.z < -80 ) {
            particles.splice(i,1);
            currentParticle--;
            particles.push(new Particle(random(-7,7),random(-6,6),random(-7,7),t,h) );
        }
    }
    
    // gizmo
    //strokeWeight(0.1);
    //stroke(255, 32,  0); line(0,0,0,2,0,0);
    //stroke( 32,255, 32); line(0,0,0,0,2,0);
    //stroke(  0, 32,255); line(0,0,0,0,0,2);
    
}

let speed = 0.5;
function componentFX(t, x, y, z){
    return speed * ( parDef.Speed * ((z - parDef.b) * x - parDef.d * y) );//Change this function
}

function componentFY(t, x, y, z){
    return speed * (  parDef.Speed * (parDef.d * x + (z - parDef.b) * y) );//Change this function
}

function componentFZ(t, x, y, z){
    return speed * ( parDef.Speed * (parDef.c + parDef.a * z - z*z*z/3 - (x*x+y*y)*(1+parDef.e*z)+parDef.f*z*x*x*x)  );//Change this function
}

//Particle definition and motion
class Particle{
    
    constructor(_x, _y, _z, _t, _h){
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.time = _t;
        this.radius = random(0.018,0.018);
        this.h = _h;
        this.op = random(200,200);
        this.r = random(255,255);
        this.g = random(255);
        this.b = random(255);
    }
    
    update() {
        this.k1 = componentFX(this.time, this.x, this.y, this.z);
        this.j1 = componentFY(this.time, this.x, this.y, this.z);
        this.i1 = componentFZ(this.time, this.x, this.y, this.z);
        this.k2 = componentFX(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1, this.z + 1/2 * this.h * this.i1);
        this.j2 = componentFY(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1, this.z + 1/2 * this.h * this.i1);
        this.i2 = componentFZ(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1, this.z + 1/2 * this.h * this.i1);
        this.k3 = componentFX(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2, this.z + 1/2 * this.h * this.i2);
        this.j3 = componentFY(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2, this.z + 1/2 * this.h * this.i2);
        this.i3 = componentFZ(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2, this.z + 1/2 * this.h * this.i2);
        this.k4 = componentFX(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3, this.z + this.h * this.i3);
        this.j4 = componentFY(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3, this.z + this.h * this.i3);
        this.i4 = componentFZ(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3, this.z + this.h * this.i3);
        this.x = this.x + this.h/6 *(this.k1 + 2 * this.k2 + 2 * this.k3 + this.k4);
        this.y = this.y + this.h/6 *(this.j1 + 2 * this.j2 + 2 * this.j3 + this.j4);
        this.z = this.z + this.h/6 *(this.i1 + 2 * this.i2 + 2 * this.i3 + this.i4);
        this.time += this.h;
    }
    
    display() {
        push();
        translate(this.x, this.y, this.z);
        ambientMaterial(this.r, this.b, this.g);
        noStroke();
        sphere(this.radius, 7, 6);
        pop();
    }
    
}
