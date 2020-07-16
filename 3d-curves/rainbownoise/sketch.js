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

/*
 Inspired by the Conding Challenge #136
 Link:
 Written by Juan Carlos Ponce Campuzano
 https://jcponce.github.io/
 26-Feb-2019
*/

let easycam;

// settings and presets
let parDef = {
View: 'Drag with mouse',
horn: false,
xyzAxes: axesSketch,
Rotating: true,
Micro: false,
level: 15
};

let mic;

let complex = [];
let n = [];
let nt;

function setup() {
    
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.closed = true;
    gui.add(parDef, 'View');
    gui.add(parDef, 'xyzAxes'  );
    gui.add(parDef, 'Rotating'  );
    gui.add(parDef, 'level',  0.0, 30).name("Noise").step(0.01).listen();
    gui.add(parDef, 'horn').name("Horn");
    gui.add(parDef, 'Micro').name("Micro").onChange(startMicro);
    gui.add(this, 'sourceCode').name("Source");
    gui.add(this, 'backHome').name("Go Back");
    
    colorMode(HSB,1);
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 500});
    
    mic = new p5.AudioIn();
    startMicro();

    nt = getRndInteger(2, 4);
  
    for (let i = 0; i < 4; i++) {
        complex[i] = new p5.Vector(random(-1, 1), random(-1, 1));
      }
    
      for (let i = 0; i < 4; i++) {
        n[i] = getRndInteger(-30, 30);
      }
}

function startMicro(){
    if(parDef.Micro==false){
       mic.stop();
    }else{
        mic.start();
    }
}

function backHome() {
    window.location.href = "https://jcponce.github.io/#sketches";
}

function sourceCode() {
    window.location.href = "https://github.com/jcponce/calculus/tree/gh-pages/3d-curves/rainbownoise";
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

let phase = 0;
let zoff = 0;
let rot=0;

function draw(){
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
    
    //Adjust the view
    rotateX(3)
    rotateY(rot/2);
    rotateZ(0.4);
    
    //Create the rainbow loops
    for(let i=1; i<=30; i++){
        if(parDef.horn==true){
           //size, posz, strSize, hu
           noiseCircle(1/i, ((i+0.2)*70-70)/8, (30-i)/15, (i-1)/30);
        } else noiseCircle(1, (i*70-70)/5, (30-i)/18, (i-1)/30);
    }

    //Update values
    phase+=0.003;
    zoff += 0.01;
    
    if(parDef.Rotating==true){
      rot += 0.006;
    } else rot += 0.0;
    
    //Axes
    if(gizmo==true){
    strokeWeight(2);
    stroke(1, 1, 1); line(0,0,0,90,0,0);
    stroke(0.6, 1, 1); line(0,0,0,0,90,0);
    stroke(0.3, 1, 1); line(0,0,0,0,0,90);
    }
}


function noiseCircle(size, posz, strSize, hu){
    
    beginShape();
    strokeWeight(2.5);
    let noiseMax;
    if(parDef.Micro==true){
        noiseMax = mic.getLevel() * (parDef.level+30);
    }else{
        noiseMax = parDef.level;
    }
    for (let a = 0; a < TWO_PI; a += 0.01) {
        let xoff = map(cos(a + phase), -1, 1, 0, noiseMax);
        let yoff = map(sin(a + phase), -1, 1, 0, noiseMax);
        let r = map(noise(xoff, yoff, zoff), 0, 1, 100, height / 2);
        stroke(hu, 1, 1);
        strokeWeight(strSize);
        noFill();
        let x = size * r * cos(a);
        let y = size * r * sin(a);
        //let v = sumCurve(complex, n, nt, a);
        //let x = size * r * v.x;
        //let y = size * r * v.y;
        
        vertex(x, y, posz);
    }
    endShape(CLOSE);
    
}

function sumCurve(pos, n, terms, t) {
    let sumX = 0;
    let sumY = 0;
    let k = 0;
    while (k < terms) {
      let x = pos[k].x;
      let y = pos[k].y;
      let c = n[k];
      sumX += x * cos(c * t) - y * sin(c * t);
      sumY += x * sin(c * t) + y * cos(c * t);
      k++
    }
    let size = 0.2;//width * 0.9 / 10 ;
    sumX = sumX * size;
    sumY = sumY * size;
    return createVector(sumX, sumY);
  }

  function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
