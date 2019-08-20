/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 19-Jul-2018
 */

// Updated Jan-2019

let img;
function preload() {
    img = loadImage('blue-violet-wings-butterfly.jpg');
}

let easycam;
let particles = [];

let points = [];
let points2 = [];

let attractor;

let NUM_POINTS = 3300;//num of points in curve

let numMax = 550;
let t = 0;
let h = 0.009;
let currentParticle = 0;

// settings and presets
let parDef = {
Attractor: 'Lorenz',
Speed: 1.0,
Particles: true,
Animate: false,
Preset: function() {
    removeElements();
    this.Speed = 1.0;
    this.Particles = true;
    attractor.p = 10.0;
    attractor.r = 28.0;
    attractor.b = 8.0 / 3.0;
    attractor.x = 1.1;
    attractor.y = 2;
    attractor.z = 7;
    attractor.x2 = 1.1;
    attractor.y2 = 2.05;
    attractor.z2 = 7;
    for (let i=points.length-1; i>=0; i-=1){
        points.splice(i,1);
        points2.splice(i,1);
    }
    initSketch();
},
Randomize: randomCurve,
};


function backAttractors () {
    window.location.href = "https://jcponce.github.io/strange-attractors";
}


function setup() {
    
    attractor = new LorenzAttractor();
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'Attractor');
    gui.add(parDef, 'Speed', 0, 3, 0.01).listen();
    gui.add(parDef, 'Particles' );
    gui.add(parDef, 'Animate' ).name("Compare");
    gui.add(parDef, 'Randomize'  );
    gui.add(parDef, 'Preset'  );
    gui.add(this, 'backAttractors').name("Go Back");
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 60});
    
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
        points2.splice(i,1);
    }
    attractor.randomize();
    initSketch();
    
}

function initSketch(){
    
    var hleft = select('#hud-left');
    var hright = select('#hud-right');
    
    createElement('li', 'p = '+ nfc(attractor.p,2) ).parent(hleft);
    createElement('li', 'r = '+ nfc(attractor.r,2) ).parent(hleft);
    createElement('li', 'b = '+ nfc(attractor.b,2) ).parent(hleft);
    
    createElement('li', '----------' ).parent(hleft);
    createElement('li', 'In. Cond.' ).parent(hleft);
    
    createElement('li', 'x<sub>1</sub> = '+ nfc(attractor.x,2) ).parent(hleft);
    createElement('li', 'y<sub>1</sub> = '+ nfc(attractor.y,2) ).parent(hleft);
    createElement('li', 'z<sub>1</sub> = '+ nfc(attractor.z,2) ).parent(hleft);
    
    createElement('li', '----------' ).parent(hleft);
    
    createElement('li', 'x<sub>2</sub> = '+ nfc(attractor.x2,2) ).parent(hleft);
    createElement('li', 'y<sub>2</sub> = '+ nfc(attractor.y2,2) ).parent(hleft);
    createElement('li', 'z<sub>2</sub> = '+ nfc(attractor.z2,2) ).parent(hleft);
    
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
    
    let q = {
    x: attractor.x2,
    y: attractor.y2,
    z: attractor.z2
    }
    for( var j = 0; j < NUM_POINTS; j++ ) {
        
        q = attractor.generatePoint( q.x, q.y, q.z );
        
        if( isNaN( q.x ) || isNaN( q.y ) || isNaN( q.z ) ) {
            console.log( 'Failed, retry' );
            randomCurve();
            return;
        }
        
        points2.push(new p5.Vector(attractor.scale * q.x,attractor.scale * q.y, attractor.scale * q.z));
        
    }
    
    let m = 30;
    for (var i=0; i < numMax; i++) {
        particles[i] = new Particle(random(-m, m), random(-m, m), random(-m, m), t, h);
    }
    
}

let addPoints = 3200;

function draw(){
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
    
    translate(0,0,-23);
    
    beginShape(POINTS);
    for (let k=0; k<addPoints;k++) {
        stroke(128, 200, 255);
        strokeWeight(0.1);
        vertex(points[k].x, points[k].y, points[k].z);
        
    }
    endShape();
    
    beginShape(POINTS);
    for (let l=0; l<addPoints;l++) {
        stroke(255, 102, 163);
        strokeWeight(0.1);
        vertex(points2[l].x, points2[l].y, points2[l].z);
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
    if(parDef.Animate === false){
        addPoints+=0;
        addPoints=3200;
    }else {
        addPoints+=2;
        if(addPoints>points.length-2){
            addPoints=2;
        }
    }
    
    
    
}


function componentFX(t, x, y, z){
    return 0.5 * parDef.Speed * ( attractor.p * (-x + y) );//Change this function
}

function componentFY(t, x, y, z){
    return 0.5 * parDef.Speed * (  -x * z + attractor.r * x - y );//Change this function
}

function componentFZ(t, x, y, z){
    return 0.5 * parDef.Speed * ( x * y - attractor.b * z );//Change this function
}

//Particle definition and motion
class Particle{
    
    constructor(_x, _y, _z, _t, _h){
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.time = _t;
        this.radius = 0.3;
        this.h = _h;
        this.op = random(210,250);
        this.r = random(80,224);
        this.g = random(10,252);
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
        //ambientMaterial(this.r, this.b, this.g);
        texture(img);
        noStroke();
        sphere(this.radius, 7, 6);
        //image(img, 0, 0, 20, 20);
        pop();
    }
    
}

class LorenzAttractor {
    
    constructor(){
    this.speed = 0.5;
    
    this.p = 10.0;
    this.r = 28.0;
    this.b = 8.0 / 3.0;
    
    this.x = 1.1;
    this.y = 2;
    this.z = 7;
        
    this.x2 = 1.1;
    this.y2 = 2.05;
    this.z2 = 7;
    
    this.h = 0.01;
    this.scale = 1;
    
}

   generatePoint( x, y, z ) {
    
    
    var nx = this.speed * (this.p * (-x + y)) ;
    var ny =  this.speed * ( -x * z + this.r * x - y) ;
    var nz =  this.speed * (x * y - this.b * z);
    
    x += this.h * nx; y += this.h * ny; z += this.h * nz;
    
    return { x: x, y: y, z: z }
    
}

    randomize() {
    
    this.p = random( 0.1, 50 );
    this.r = random( 0.5, 60 );
    this.b = random( 0.1, 10 );
    
    this.x = random( -10, 10 );
    this.y = random( -10, 10 );
    this.z = random( 0, 10 );
        
    this.x2 = random( -10, 10 );
    this.y2 = random( -10, 10 );
    this.z2 = random( 0, 10 );
    
}

}
