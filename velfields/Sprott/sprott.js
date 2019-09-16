/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 19-Jul-2018
 */
//J. C. Sprott. A dynamical system with a strange attractor and invariant tori
//Physic Letters A, 378 (2014) 1361-1363.
//sprott.physics.wisc.edu/pubs/paper423.pdf

let easycam;
let particles = [];

let points = [];

let NUM_POINTS = 4500;//num of points in curve

let numMax = 450;
let t = 0;
let h = 0.01;
let currentParticle = 0;

// settings and presets
let parDef = {
Attractor: 'Sprott',
Speed: 3.0,
Particles: true,
Preset: function() {
    removeElements();
    this.Particles = true;
    this.Speed = 3.0;
    attractor.a = 2.07;
    attractor.b = 1.79;
    attractor.x = 0.63;
    attractor.y = 0.47;
    attractor.z = -0.54;
    for (let i=points.length-1; i>=0; i-=1){
        points.splice(i,1);
    }
    initSketch();
},
Randomize: randomCurve,
};


function backAttractors () {
    window.location.href = "https://jcponce.github.io/strange-attractors/#sprott";
}


function setup() {
    
    attractor = new SprottAttractor();
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'Attractor');
    gui.add(parDef, 'Speed', 0, 10, 0.01).listen();
    gui.add(parDef, 'Particles' );
    gui.add(parDef, 'Randomize'  );
    gui.add(parDef, 'Preset'  );
    gui.add(this, 'backAttractors').name("Go Back");
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 3.5});
    
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

let attractor;

function initSketch(){
    
    var hleft = select('#hud-left');
    var hright = select('#hud-right');
    
    createElement('li', 'a = '+ nfc(attractor.a,2) ).parent(hleft);
    createElement('li', 'b = '+ nfc(attractor.b,2) ).parent(hleft);
    
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
    let m = 1;
    for (var i=0; i < numMax; i++) {
        particles[i] = new Particle(random(-m, m), random(-m, m), random(-m, m), t, h);
    }
    
}

function draw(){
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
    
    rotateX(1.4);
    rotateY(0.1);
    rotateZ(1.7)
    let hu = 0;
    beginShape(POINTS);
    for (let v of points) {
        stroke(hu, 193, 25);
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
            if ( p.x > 5 ||  p.y > 5 || p.z > 5 || p.x < -5 ||  p.y < -5 || p.z < -5 ) {
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


const componentFX = (t, x, y, z) => parDef.Speed * ( y + attractor.a * x * y + x * z );//Change this function

const componentFY = (t, x, y, z) => parDef.Speed * (1 - attractor.b * x * x + y * z );//Change this function

const componentFZ = (t, x, y, z) => parDef.Speed * ( x - x * x - y * y  );//Change this function

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
        this.r = random(200, 255);
        this.g = random(100, 200);
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
//A solution curve
class SprottAttractor {
    
    constructor(){
        this.speed = 3.0;
        
        this.a = 2.07;
        this.b = 1.79;
        
        this.x = 0.63;
        this.y = 0.47;
        this.z = -0.54;
        
        this.h = .01;
        this.scale = 1;
    }
    
    generatePoint( x, y, z ) {
        
        var nx = this.speed * (y + this.a * x * y + x * z) ;
        var ny =  this.speed * (1 - this.b * x * x + y * z) ;
        var nz =  this.speed * (x - x * x - y * y);
        
        x += this.h * nx; y += this.h * ny; z += this.h * nz;
        
        return { x: x, y: y, z: z }
        
    }
    
    randomize() {
        
        this.a = random( 1.4, 2.4 );
        this.b = random( 1.4, 2.4 );
        
        this.x = random( -1, 1 );
        this.y = random( -1, 1 );
        this.z = random( -1, 1 );
        
    }
    
    
}
