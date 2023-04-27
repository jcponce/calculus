/* p5.js (https://p5js.org/)
 * Under Creative Commons License
 * https://creativecommons.org/licenses/by-sa/4.0/
 * Written by Juan Carlos Ponce Campuzano, 19-Jul-2018
 */

// Updated 01/Jun-2022

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
    removeElements(); //https://p5js.org/reference/#/p5/removeElements
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
    window.location.href = "https://jcponce.github.io/strange-attractors/#lorenz";
}

function goButterflies() {
    window.location.href = "../Lorenz-Butterflies";
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
    gui.add(this, 'goButterflies').name("Butterflies");
    gui.add(this, 'backAttractors').name("Go Back");
    
    pixelDensity(2);
    
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
    
    createElement('li', '&sigma; = '+ nfc(attractor.p,2) ).parent(hleft);
    createElement('li', '&rho; = '+ nfc(attractor.r,2) ).parent(hleft);
    createElement('li', '&beta; = '+ nfc(attractor.b,2) ).parent(hleft);
    
    createElement('li', '----------' ).parent(hleft);
    createElement('h3', 'Init. Cond.' ).parent(hleft);
    
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
    push();
    noFill();
    beginShape(POINTS);
    for (let k=0; k<addPoints;k++) {
        stroke(128, 200, 255);
        strokeWeight(0.1);
        vertex(points[k].x, points[k].y, points[k].z);
        
    }
    endShape();
    pop();
    
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
        addPoints=3280;
    }else {
        addPoints+=2;
        if(addPoints>points.length-2){
            addPoints=2;
        }
    }

}


const componentFX = (t, x, y, z) => 0.5 * parDef.Speed * ( attractor.p * (-x + y) );//Change this function

const componentFY = (t, x, y, z) => 0.5 * parDef.Speed * (  -x * z + attractor.r * x - y );//Change this function

const componentFZ = (t, x, y, z) => 0.5 * parDef.Speed * ( x * y - attractor.b * z );//Change this function

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
        sphere(this.radius, 7, 6);
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
