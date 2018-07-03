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
let numMax = 700;
let t = 0;
let h = 0.01;
let currentParticle = 0;

// settings and presets
let parDef = {
Attractor: 'Lorenz84',
a: 0.25,
b: 4.0,
f: 8.0,
g: 1.0,
ResetParticles: initSketch,
Preset: function() {  this.a = 0.25; this.b = 4.0; this.f = 8.0; this.g = 1.0; },
};

//parameters
let a = 0.25;//1.111;
let b = 4;//1.479;
let f = 8;//4.494;
let g = 1;//0.44;

let x1 = -3.04;
let y1 = 3.02;
let z1 = -0.01;

let points1 = new Array();

function setup() { 
 
    pixelDensity(1);
    
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'Attractor');
    gui.add(parDef, 'a'   , -0.35, 0.35  ).listen();
    gui.add(parDef, 'b'   , -5.5, 5.5  ).listen();
    gui.add(parDef, 'f'   , -8.5, 8.5  ).listen();
    gui.add(parDef, 'g'   , -1.5, 1.5  ).listen();
    gui.add(parDef, 'ResetParticles'  );
    gui.add(parDef, 'Preset'  );
  
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  
  console.log(Dw.EasyCam.INFO);
  
  easycam = new Dw.EasyCam(this._renderer, {distance : 6});
    
    for(let i = 0; i< 2000; i++){
        let dt = 0.02;
        let dx = speed * ( -a * x1 - y1 * y1 - z1 * z1 + a * f  ) * dt;
        let dy = speed * ( -y1 + x1 * y1 - b * x1 * z1 + g  ) * dt;
        let dz = speed * ( -z1 + b * x1 * y1 + x1 * z1 ) * dt;
        x1 = x1 + dx;
        y1 = y1 + dy;
        z1 = z1 + dz;
        
        points1.push(new p5.Vector(x1, y1, z1));
    }
    
    // place initial samples
    initSketch();
} 

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  easycam.setViewport([0, 0, windowWidth, windowHeight]);
}

function initSketch(){
    
    let m = 5;
    for (let i=0; i<numMax; i++) {
        particles[i] = new Particle(random(-m, m), random(-m, m), random(-m, m), t, h);
    }
    
}

function draw(){
    
  // projection
  perspective(60 * PI/180, width/height, 1, 5000);
  
  // BG
  background(0);
    
    // lights
    //ambientLight(250);
    //pointLight(255, 255, 255, 50, 0, 60);
    
    let hu1 = 0;
    beginShape(POINTS);
    for (let v of points1) {
        stroke(hu1, 103, 212);
        strokeWeight(0.015);
        vertex(v.x, v.y, v.z);
        
        hu1 += 1;
        if (hu1 > 255) {
            hu1 = 0;
        }
    }
    endShape();
    
  //updating and displaying the particles
    for (let i=particles.length-1; i>=0; i-=1) {
        let p = particles[i];
        p.update();
        p.display();
        if ( p.x > 800 ||  p.y > 800 || p.z > 800 || p.x < -800 ||  p.y < -800 || p.z < -800 ) {
            particles.splice(i,1);
            currentParticle--;
            particles.push(new Particle(random(-7,7),random(-6,6), random(-6,6), t, h) );
        }
    }
  
  // gizmo
  //strokeWeight(0.1);
  //stroke(255, 32,  0); line(0,0,0,2,0,0);
  //stroke( 32,255, 32); line(0,0,0,0,2,0);
  //stroke(  0, 32,255); line(0,0,0,0,0,2);
  
    
  
 
}

let speed = 0.7;
function componentFX(t, x, y, z){
    return speed * ( -parDef.a * x - y * y - z * z + parDef.a * parDef.f  );//Change this function
}

function componentFY(t, x, y, z){
    return speed * ( -y + x * y - parDef.b * x * z + parDef.g  );//Change this function
}

function componentFZ(t, x, y, z){
    return speed * ( -z +parDef.b * x * y + x * z );//Change this function
}

//Particle definition and motion
class Particle{
    
	constructor(_x, _y, _z, _t, _h){
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.time = _t;
    this.radius = random(0.03,0.03);
    this.h = _h;
    this.op = random(190,200);
    this.r = random(250);
    this.g = random(200,250);
    this.b = random(135,150);
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
        sphere(this.radius, 6, 6);
        pop();
    }
    
}
