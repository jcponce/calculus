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
Curve: 'Torus knot',
p: 2,
q: 3,
xyzAxes: axesSketch,
Random: function() { this.p = floor(random(-40,40)); this.q = floor(random(-39,39)); },
Torus: showTorus,
};

function setup() {
    
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'Curve');
    gui.add(parDef, 'p'  , -50, 50 ,1 ).listen();
    gui.add(parDef, 'q'  , -49, 49 ,1 ).listen();
    gui.add(parDef, 'xyzAxes'  );
    gui.add(parDef, 'Random'  );
    gui.add(parDef, 'Torus');
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

let showt = false;
function showTorus(){
    if(showt == false){
        return showt = true;
    }else showt = false;
}

function draw(){
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
    
    noFill();
    
    rotateX(0.9)
    rotateY(0.0);
    rotateZ(0.3);
    let hu = 50;
    beginShape();
    for(let i = 0; i <= 2*PI; i+=PI/1000){
        stroke(hu, 255, 255);
        strokeWeight(0.02);
        let xc = 1*(cos(parDef.q*i)+2)*cos(parDef.p * i);
        let yc = 1*(cos(parDef.q*i)+2)*sin(parDef.p * i);
        let zc =  -1*sin(parDef.q * i);
        vertex(xc, yc, zc);
    }
    endShape(CLOSE);
    
    if(showt){
    stroke(0);
    strokeWeight(0.015);
    fill(102, 140, 255);
    torus(2, 0.99);
    }
    
    if(gizmo==true){
    // gizmo
    strokeWeight(0.04);
    stroke(255, 32,  0); line(0,0,0,1.5,0,0);
    stroke( 32,255, 32); line(0,0,0,0,1.5,0);
    stroke(  0, 32,255); line(0,0,0,0,0,1.5);
    }
}
