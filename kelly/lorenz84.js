/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 19-Jul-2018
 */

let easycam;
let particles = [];

let points = [];

let attractor = new Lorenz84Attractor();

let NUM_POINTS = 3600;//num of points in curve

let numMax = 800;
let t = 0;
let h = 0.01;
let currentParticle = 0;

// settings and presets
let parDef = {
Attractor: 'Lorenz-84',
Speed: 0.5,
Particles: true,
Preset: function() {
    removeElements();
    this.Speed = 1.0;
    this.Particles = true;
    attractor.a = 1.14;
    attractor.b = 4.44;
    attractor.f = 8.37;
    attractor.g = 6.40;
    attractor.x = -2.28;
    attractor.y = 2.24;
    attractor.z = 2.37;
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

var button;

function setup() {
    
    
    // create gui (dat.gui)
    //let gui = new dat.GUI();
    //gui.add(parDef, 'Attractor');
    //gui.add(parDef, 'Speed', 0, 3, 0.01).listen();
    //gui.add(parDef, 'Particles' );
    //gui.add(parDef, 'Randomize'  );
    //gui.add(parDef, 'Preset'  );
    //gui.add(this, 'backAttractors').name("Go Back");
    
    pixelDensity(1);
    
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 9 });
    
    
    document.getElementById("submit").onclick = () => {
        randomCurve();
    }
    
    document.getElementById("preset").onclick = () => {
        presetAttractor();
    }
    
    //button = createButton('Random');
    //button.position(width/2, height/2);
    //button.mousePressed(randomCurve);
    
    // place initial samples
    initSketch();
}

function presetAttractor() {
    removeElements();
    this.Speed = 1.0;
    this.Particles = true;
    attractor.a = 1.14;
    attractor.b = 4.44;
    attractor.f = 8.37;
    attractor.g = 6.40;
    attractor.x = -2.28;
    attractor.y = 2.24;
    attractor.z = 2.37;
    for (let i=points.length-1; i>=0; i-=1){
        points.splice(i,1);
    }
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
    
    /*var hleft = select('#hud-left');
    var hright = select('#hud-right');
    
    createElement('li', 'a = '+ nfc(attractor.a,2) ).parent(hleft);
    createElement('li', 'b = '+ nfc(attractor.b,2) ).parent(hleft);
    createElement('li', 'f = '+ nfc(attractor.f,2) ).parent(hleft);
    createElement('li', 'g = '+ nfc(attractor.g,2) ).parent(hleft);
    
    createElement('li', '----------' ).parent(hleft);
    
    createElement('li', 'x<sub>0</sub> = '+ nfc(attractor.x,2) ).parent(hleft);
    createElement('li', 'y<sub>0</sub> = '+ nfc(attractor.y,2) ).parent(hleft);
    createElement('li', 'z<sub>0</sub> = '+ nfc(attractor.z,2) ).parent(hleft);
    */
    let p = {
    x: attractor.x,
    y: attractor.y,
    z: attractor.z
    }
    
    for( var j = 0; j < NUM_POINTS; j++ ) {
        
        p = attractor.generatePoint( p.x, p.y, p.z );
        
        points.push(new p5.Vector(attractor.scale * p.x,attractor.scale * p.y, attractor.scale * p.z));
        
    }
    let m = 1.5;
    for (var i=0; i < numMax; i++) {
        particles[i] = new Particle(random(-m, m), random(-m, m), random(-m, m), t, h);
    }
    
}


function draw(){
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
    
    translate(0,-1.2,1.5);
    rotateY(0.9);
    rotateZ(0.2);
    
    beginShape(POINTS);
    for (let v of points) {
        stroke(128, 193, 255);
        strokeWeight(0.016);
        vertex(v.x, v.y, v.z);
        
    }
    endShape();
    
    if(parDef.Particles==true){
    //updating and displaying the particles
    for (let i=particles.length-1; i>=0; i-=1) {
        let p = particles[i];
        p.update();
        p.display();
        if ( p.x > 100 ||  p.y > 100 || p.z > 100 || p.x < -100 ||  p.y < -100 || p.z < -100 ) {
            particles.splice(i,1);
            currentParticle--;
            particles.push(new Particle(random(-5,5),random(-5,5),random(-5,5),t,h) );
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
    return 1 * parDef.Speed * ( -attractor.a * x - y * y - z * z + attractor.a * attractor.f );//Change this function
}

function componentFY(t, x, y, z){
    return 1 * parDef.Speed * ( -y + x * y - attractor.b * x * z + attractor.g );//Change this function
}

function componentFZ(t, x, y, z){
    return 1 * parDef.Speed * ( -z +attractor.b * x * y + x * z  );//Change this function
}

//Particle definition and motion
class Particle{
    
    constructor(_x, _y, _z, _t, _h){
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.time = _t;
        this.radius = 0.03;
        this.h = _h;
        this.r = random(129,255);
        this.g = random(200,255);
        this.b = random(100,255);
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

function Lorenz84Attractor() {
    
    this.speed = 1;
    
    this.a = 1.14;
    this.b = 4.44;
    this.f = 8.37;
    this.g = 6.40;
    
    this.x = -2.28;
    this.y = 2.24;
    this.z = 2.37;
    
    this.h = 0.01;
    this.scale = 1;
   
}

Lorenz84Attractor.prototype.generatePoint = function( x, y, z ) {
    
    
    var nx = this.speed * (-this.a * x - y * y - z * z + this.a * this.f);
    var ny =  this.speed * (-y + x * y - this.b * x * z + this.g );
    var nz =  this.speed * (-z + this.b * x * y + x * z );
    
    x += this.h * nx; y += this.h * ny; z += this.h * nz;
    
    return { x: x, y: y, z: z }
    
}

Lorenz84Attractor.prototype.randomize = function() {
    
    this.a = random( 0.01, 5 );
    this.b = random( 1, 9 );
    this.f = random( 3, 9 );
    this.g = random( 0.1, 9);
    
    this.x = random( -4,4 );
    this.y = random( -4,4 );
    this.z = random( -4,4 );
    
    
}
