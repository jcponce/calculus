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


let parDef = {
Attractor: 'Halsorven',
a: 1.4,
Randomize: initSketch,
Preset: function() {  this.a = 1.4; },
};

//parameters

let x = 0;
let y = -5;
let z = -2.01;

let points = new Array();

function setup() {
    
    pixelDensity(1);
    
    let gui = new dat.GUI();
    gui.add(parDef, 'Attractor');
    gui.add(parDef, 'a' , -1.5, 1.5  ).listen();
    gui.add(parDef, 'Randomize'  );
    gui.add(parDef, 'Preset'  );
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 35});
    
    for(let i = 0; i< 2000; i++){
        let dt = 0.02;
        let dx = speed*( -1.4 * x -4 * y-4 * z-y * y  ) * dt;
        let dy = speed*(  -1.4 * y-4 * z-4 * x-z * z ) * dt;
        let dz = speed*( -1.4 * z-4 * x-4 * y-x * x   ) * dt;
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
    easycam.setViewport([0, 0, windowWidth, windowHeight]);
    
    // place initial samples
    initSketch();
}

function initSketch(){
    
    let m = 15;
    for (let i=0; i<numMax; i++) {
        particles[i] = new Particle(random(-m, m), random(-m, m), random(-m, m), t, h);
    }
    
    
}

function draw(){
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
    
    let hu = 0;
    beginShape(POINTS);
    for (let v of points) {
        stroke(hu, 193, 255);
        strokeWeight(0.09);
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
            particles.push(new Particle(random(-7,7),random(-6,6), random(-6,6), t, h) );
        }
    }
    
    // gizmo
    //strokeWeight(0.1);
    //stroke(255, 32,  0); line(0,0,0,2,0,0);
    //stroke( 32,255, 32); line(0,0,0,0,2,0);
    //stroke(  0, 32,255); line(0,0,0,0,0,2);
    
    
    
    
}

let speed = 0.4;
function componentFX(t, x, y, z){
    return speed * ( -parDef.a * x -4 * y-4 * z-y * y );//Change this function
}

function componentFY(t, x, y, z){
    return speed * ( -parDef.a * y-4 * z-4 * x-z * z  );//Change this function
}

function componentFZ(t, x, y, z){
    return speed * ( -parDef.a * z-4 * x-4 * y-x * x );//Change this function
}

//Particle definition and motion
class Particle{
    
    constructor(_x, _y, _z, _t, _h){
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.time = _t;
        this.radius = random(0.11,0.11);
        this.h = _h;
        this.op = random(150,200);
        this.r = random(255);
        this.g = random(200,255);
        this.b = random(200,255);
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
        //sphere(-(this.x), this.y, this.z, 2*this.radius, 2*this.radius);
    }
    
}
