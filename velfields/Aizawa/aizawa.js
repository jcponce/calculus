/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 19-Jul-2018
 */

let easycam;
let particles = [];

let points = [];

let attractor = new AizawaAttractor();

let NUM_POINTS = 2500;//num of points in curve

let numMax = 600;
let t = 0;
let h = 0.01;
let currentParticle = 0;

// settings and presets
let parDef = {
Attractor: 'Aizawa',
Speed: 1.0,
Particles: true,
Preset: function() {
    removeElements();
    this.Particles = true;
    this.Speed = 1.0;
    attractor.a = 0.95;
    attractor.b = 0.7;
    attractor.c = 0.6;
    attractor.d = 3.5;
    attractor.e = 0.25;
    attractor.f = 0.1;
    attractor.x = 0.1;
    attractor.y = 1;
    attractor.z = 0.01;
    for (let i=points.length-1; i>=0; i-=1){
        points.splice(i,1);
    }
    initSketch();
},
Randomize: randomCurve,
};


function backAttractors () {
    window.location.href = "https://jcponce.github.io/strange-attractors";
}



function setup() {
    
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'Attractor');
    gui.add(parDef, 'Speed', 0, 5, 0.01).listen();
    gui.add(parDef, 'Particles' );
    gui.add(parDef, 'Randomize'  );
    gui.add(parDef, 'Preset'  );
    gui.add(this, 'backAttractors').name("Go Back");
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 5});
    
    // place initial samples
    initSketch();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]);
    
}

function randomCurve() {
    removeElements();
    for (var i = points.length-1; i>=0; i-=1){
        points.splice(i,1);
    }
    attractor.randomize();
    initSketch();
    
}

function initSketch(){
    
    var hleft = select('#hud-left');
    var hright = select('#hud-right');
    
    createElement('li', 'a = '+ nfc(attractor.a,2) ).parent(hleft);
    createElement('li', 'b = '+ nfc(attractor.b,2) ).parent(hleft);
    createElement('li', 'c = '+ nfc(attractor.c,2) ).parent(hleft);
    createElement('li', 'd = '+ nfc(attractor.d,2) ).parent(hleft);
    createElement('li', 'e = '+ nfc(attractor.e,2) ).parent(hleft);
    createElement('li', 'f = '+ nfc(attractor.f,2) ).parent(hleft);
    
    createElement('li', '----------' ).parent(hleft);
    
    createElement('li', 'x<sub>0</sub> = '+ nfc(attractor.x,2) ).parent(hleft);
    createElement('li', 'y<sub>0</sub> = '+ nfc(attractor.y,2) ).parent(hleft);
    createElement('li', 'z<sub>0</sub> = '+ nfc(attractor.z,2) ).parent(hleft);
    
    let p = {
    x: attractor.x,
    y: attractor.y,
    z: attractor.z
    }
    
    for( var j = 0; j < NUM_POINTS; j++ ) {
        
        p = attractor.generatePoint( p.x, p.y, p.z );
        
        if( isNaN( p.x ) || isNaN( p.y ) || isNaN( p.z ) ) {
            console.log( 'Failed, retry' );
            randomCurve();
            return;
        }
        
        points.push(new p5.Vector(attractor.scale * p.x,attractor.scale * p.y, attractor.scale * p.z));
        
    }
    let m = 2;
    for (var i=0; i < numMax; i++) {
        particles[i] = new Particle(random(-m, m), random(-m, m), random(0, m), t, h);
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
    
    if(parDef.Particles==true){
    //updating and displaying the particles
    for (let i=particles.length-1; i>=0; i-=1) {
        let p = particles[i];
        p.update();
        p.display();
        if ( p.x > 8 ||  p.y > 8 || p.z > 8 || p.x < -8 ||  p.y < -8 || p.z < -8 ) {
            particles.splice(i,1);
            currentParticle--;
            particles.push(new Particle(random(-5,5),random(-5,5),random(0,5),t,h) );
        }
    }
    }
    
    // gizmo
    //strokeWeight(0.1);
    //stroke(255, 32,  0); line(0,0,0,2,0,0);
    //stroke( 32,255, 32); line(0,0,0,0,2,0);
    //stroke(  0, 32,255); line(0,0,0,0,0,2);
    
}


function componentFX(t, x, y, z){
    return  ( parDef.Speed * ((z - attractor.b) * x - attractor.d * y) );//Change this function
}

function componentFY(t, x, y, z){
    return  (  parDef.Speed * (attractor.d * x + (z - attractor.b) * y) );//Change this function
}

function componentFZ(t, x, y, z){
    return ( parDef.Speed * (attractor.c + attractor.a * z - z*z*z/3 - (x*x+y*y)*(1+attractor.e*z)+attractor.f*z*x*x*x)  );//Change this function
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

function AizawaAttractor() {
    
    this.speed = 0.5;
    
    this.a = 0.95;
    this.b = 0.7;
    this.c = 0.6;
    this.d = 3.5;
    this.e = 0.25;
    this.f = 0.1;
    
    this.x = 0.1;
    this.y = 1;
    this.z = 0.01;
    
    this.h = .03;
    this.scale = 1;
    
}

AizawaAttractor.prototype.generatePoint = function( x, y, z ) {
    
    
    var nx = this.speed * ((z - this.b) * x - this.d * y) ;
    var ny =  this.speed * (this.d * x + (z - this.b) * y) ;
    var nz =  this.speed * (this.c + this.a * z - z*z*z/3 - (x*x+y*y)*(1+this.e*z)+this.f*z*x*x*x);
    
    x += this.h * nx; y += this.h * ny; z += this.h * nz;
    
    return { x: x, y: y, z: z }
    
}

AizawaAttractor.prototype.randomize = function() {
    
    this.a = random( 0.3, 3 );
    this.b = random( 0.3, 3 );
    this.c = random( 0.1, 3 );
    this.d = random( 1, 3 );
    this.e = random( 0.01, 3 );
    this.f = random( 0.01, 3 );
    
    this.x = random( -1.1, 1.1 );
    this.y = random( -1.1, 1.1 );
    this.z = random( -1, 1 );
    
}

