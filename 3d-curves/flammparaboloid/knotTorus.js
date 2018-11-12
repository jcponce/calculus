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
Surface: 'Flamm paraboloid',
Radius: 0,
q: 3,
xyzAxes: axesSketch,
Random: function() { this.p = floor(random(-40,40)); this.q = floor(random(-39,39)); },
Sphere: showSphere,
};

function setup() {
    
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'Surface');
    gui.add(parDef, 'Radius'  , 0, 1, 0.01 ).listen();
    gui.add(parDef, 'q'  , -49, 49 ,1 ).listen();
    gui.add(parDef, 'xyzAxes'  );
    gui.add(parDef, 'Random'  );
    gui.add(parDef, 'Sphere');
    gui.add(this, 'backHome').name("Go Back");
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 7});
    
}

function backHome() {
    window.location.href = "https://jcponce.github.io/";
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

let shows = true;
function showSphere(){
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
    
    translate(0,0,-1)
    rotateX(0.9)
    rotateY(0.0);
    rotateZ(0.3);
    let hu = 255;
    
    //Sequence(Curve(cos(u) i, sin(u) i, 2sqrt(rs (i - rs)), u, 0, 4π), i, -1, 4π, π / 2)
    
    
    beginShape();
    for(let i = 0; i <= 2*PI; i+=PI/2){
    for(let j = 0; j <= 2*PI; j+=0.1){
        stroke(hu, 255, 255);
        strokeWeight(0.01);
        let xc = cos(j) * i;
        let yc = sin(j) * i;
        let zc = 2 * pow( parDef.Radius * (i - parDef.Radius ) , 1/2 );
        vertex(xc, yc, zc);
    }
    endShape(CLOSE);
    }
    
    //Sequence(Curve(cos(i) u, sin(i) u, 2sqrt(rs (u - rs)), u, 0, 4π), i, 0, 2π, π / 8)
    
    beginShape();
    for(let i = 0; i <= 2*PI; i+=PI/8){
        for(let j = 0; j <= 2*PI; j+=0.1){
            stroke(hu, 255, 255);
            strokeWeight(0.01);
            let xc = cos(i) * j;
            let yc = sin(i) * j;
            let zc = 2 * pow( parDef.Radius * (j - parDef.Radius ) , 1/2 );
            vertex(xc, yc, zc);
        }
        endShape();
    }
    
    if(shows){
    stroke(0);
    strokeWeight(0.015);
    fill(0);
    sphere(parDef.Radius);
    }
    
    if(gizmo==true){
    // gizmo
    strokeWeight(0.04);
    stroke(255, 32,  0); line(0,0,0,1.5,0,0);
    stroke( 32,255, 32); line(0,0,0,0,1.5,0);
    stroke(  0, 32,255); line(0,0,0,0,0,1.5);
    }
}
