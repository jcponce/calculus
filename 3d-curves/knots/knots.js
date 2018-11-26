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

// settings and presets
let parDef = {
Curve: 'Knots',
a: 0.6,
b: 4,
c: 0.2,
d: 6,
e: 1.57,
f: 1.2,
xyzAxes: axesSketch,
Random: function() { this.a = random(-2,2); this.b = floor(random(0,10)); this.c = random(0,2); this.d = floor(random(0,12)); this.e = random(0, 2*PI); this.f = random(0,2); },
};

function setup() {
    
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'Curve');
    gui.add(parDef, 'a'  , -2, 2 , 0.1 ).listen();
    gui.add(parDef, 'b'  , 0, 10 , 1 ).listen();
    gui.add(parDef, 'c'  , 0, 2 , 0.1 ).listen();
    gui.add(parDef, 'd'  , 0, 12 , 1 ).listen();
    gui.add(parDef, 'e'  , 0, 2*PI , 0.1 ).listen();
    gui.add(parDef, 'f'  , 0, 2 , 0.1 ).listen();
    gui.add(parDef, 'xyzAxes'  );
    gui.add(parDef, 'Random'  );
    gui.add(this, 'backHome').name("Go Back");
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 7});
    
}

function backHome() {
    window.location.href = "https://jcponce.github.io/3dcurves";
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]);
}

let gizmo = false;
function axesSketch(){
    if(gizmo == false){
        return gizmo = true;
    }else gizmo = false;
}

function draw(){
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
    
    noFill();
    //stroke(255);
    rotateX(0.9)
    rotateY(0.0);
    rotateZ(0.3);
    
    
    beginShape();
    for(let i = 0; i <= 2*PI; i+=PI/900){
        stroke(255, 0, 0);
        strokeWeight(0.025);
        let phi = parDef.c*PI *sin(parDef.d*i);
        let r = parDef.f+parDef.a*sin(6*i+parDef.e);
        let theta = parDef.b*i;
        let xc = 1.5*(r*cos(phi)*cos(theta));
        let yc = 1.5*(r*cos(phi)*sin(theta));
        let zc =  -1.5*sin(phi);
        vertex(xc, yc, zc);
        
    }
    endShape(CLOSE);
    
    if(gizmo==true){
    // gizmo
    strokeWeight(0.04);
    stroke(255, 32,  0); line(0,0,0,1,0,0);
    stroke( 32,255, 32); line(0,0,0,0,1,0);
    stroke(  0, 32,255); line(0,0,0,0,0,1);
    }
}
