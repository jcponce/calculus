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
INFO: 'Drag with mouse',
p: 2,
q: 3,
xyzAxes: axesSketch,
Random: function() { this.p = floor(random(-40,40)); this.q = floor(random(-39,39)); },
Torus: showTorus,
};

function setup() {
    
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'INFO');
    //gui.add(parDef, 'p'  , -50, 50 ,1 ).listen();
    //gui.add(parDef, 'q'  , -49, 49 ,1 ).listen();
    gui.add(parDef, 'xyzAxes'  );
    //gui.add(parDef, 'Random'  );
    //gui.add(parDef, 'Torus');
    gui.add(this, 'backHome').name("Go Back");
    
    colorMode(HSB,1);
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 600});
    mic = new p5.AudioIn();
    mic.start();
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

let phase = 0;
let zoff = 0;
let mic;

let rot=0;

function draw(){
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
    
    noFill();
    
    rotateX(3)
    rotateY(rot/2);
    rotateZ(0.4);
    let hu = 50;
    
    //noiseCircle(1, -60);
    //noiseCircle(1/2, 0);
    //noiseCircle(1/3, 60);
    for(let i=1; i<=15; i++){
        noiseCircle(1/i, i*70-70, (15-i)/5, (i-1)/15);
    }

    phase+=0.001;
    zoff += 0.001;
    rot += 0.001;
    if(showt){
    stroke(0);
    strokeWeight(0.015);
    fill(102, 140, 255);
    torus(2, 0.99);
    }
    
    if(gizmo==true){
    // gizmo
    strokeWeight(2);
    stroke(1); line(0,0,0,40,0,0);
    stroke(1); line(0,0,0,0,40,0);
    stroke(1); line(0,0,0,0,0,40);
    }
}


function noiseCircle(size, posz, strSize, hu){
    
    beginShape();
    strokeWeight(2.5);
    //let noiseMax = 70;
    /*for (let a = 0; a < TWO_PI; a+=0.05) {
     let xoff = map(cos(a+phase),-1,1,0,noiseMax);
     let yoff = map(sin(a+phase),-1,1,0,noiseMax);
     let r = map(noise(xoff, yoff, zoff), 0, 1, 100, 200);
     let x = r * cos(a);
     let y = r * sin(a);
     vertex(x,y);*/
    
    let noiseMax = mic.getLevel() * 50;
    //for(i = -2; i<=-2; i++){
    
    for (let a = 0; a < TWO_PI; a += 0.03) {
        let xoff = map(cos(a + phase), -1, 1, 0, noiseMax);
        let yoff = map(sin(a + phase), -1, 1, 0, noiseMax);
        let r = map(noise(xoff, yoff, zoff), 0, 1, 100, height / 2);
        stroke(hu, 1, 1);
        strokeWeight(strSize);
        noFill();
        let x = size * r * cos(a);
        let y = size * r * sin(a);
        
        vertex(x, y, posz);
    }
    
    //}
    
    endShape(CLOSE);
    
}
