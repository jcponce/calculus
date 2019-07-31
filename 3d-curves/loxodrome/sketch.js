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
let lox;
// settings and presets
let parDef = {
View: 'Drag with mouse',
horn: false,
Axes: true,
Rotating: true,
aPar: 1,
scale: 10
    
};

let mic;

function setup() {
    
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.closed = true;
    gui.add(parDef, 'View');
    gui.add(parDef, 'Axes');
    gui.add(parDef, 'Rotating'  );
    gui.add(parDef, 'aPar',  0.0, 2).name("a").step(0.01).listen();
    gui.add(parDef, 'scale',  1, 15).name("Scale").step(0.01).listen();
    gui.add(parDef, 'horn').name("Horn");
    
    gui.add(this, 'sourceCode').name("Source");
    gui.add(this, 'backHome').name("Go Back");
    
    colorMode(HSB,1);
    
    pixelDensity(1);
    
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    setAttributes('antialias', true);
    
    console.log(Dw.EasyCam.INFO);
    
    easycam = new Dw.EasyCam(this._renderer, {distance : 50});
    
    lox = new Loxodrome(parDef.aPar, 20);
    //noLoop();
    
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


let phase = 0;
let zoff = 0;
let rot=0;

function draw(){
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    // BG
    background(0);
    
    //Adjust the view
    rotateX(1.1)
    rotateY(0);
    rotateZ(0.4);
    strokeWeight(0.01);
    //drawLoxo(parDef.aPar, 1);
    
    //lox.calculate();
    lox.show();
    
    //Axes
    if(parDef.Axes==true){
    strokeWeight(0.3);
    stroke(1, 1, 1); line(0,0,0,10,0,0);//x
    stroke(0.6, 1, 1); line(0,0,0,0,10,0);//y
    stroke(0.3, 1, 1); line(0,0,0,0,0,10);//z
    }
    
    /*
    let ver = [];
    let a = 0.06;
    let scale = 1;
    for(let i = 0; i < 500; i++){
        let t = map(i, 0, 500, -90 *PI, 90 * PI);
        let sqt = sqrt(1 + a * a * t * t);
        let xc = scale * cos(t) / sqt;
        let yc = scale * sin(t) / sqt;
        let zc =  scale * (-a * t )/ sqt;
        
        ver[i] = { x: xc, y: yc, z: zc };
    }*/
    
    //console.log(ver);
}

function drawLoxo(a, scale) {
    let hu = 50;
    
    noFill();
    beginShape();
    for(let i = -90*PI; i <= 90*PI; i+=PI/50){
        stroke(hu, 1, 1);
        strokeWeight(1);
        let xc = scale * cos(i) / sqrt(1 + a * a * i * i);
        let yc = scale * sin(i) / sqrt(1 + a * a * i * i);
        let zc =  scale * (-a * i )/ sqrt(1 + a * a * i * i);
        vertex(xc, yc, zc);
    }
    endShape();
    
}

class Loxodrome {
    
    constructor(a, scale){
        this.a = a;
        this.scale = scale;
        
    }
    
    show(){
        let pts = calculatePoints(100);
        noFill();
        strokeWeight(0.2);
        push()
        for(let i = 0; i <= pts.length-2; i++){
            stroke(0.5, 1, 1);
            strokeWeight(0.4);
            let v1 = pts[i];
            let v2 = pts[i+1];
            line(v1.x, v1.y, v1.z,v2.x, v2.y, v2.z);
        }
        pop();
        //console.log(this.ver);
    }
    
}

function calculatePoints(nump){
    let ver = [];
    let func = loxodromeFunction(t);
    for(let i = 0; i < nump; i++){
        
        let t = map(i, 0, 500, -90 *PI, 90 * PI);
        let sqt = sqrt(1 + parDef.aPar * parDef.aPar * t * t);
        let xc = parDef.scale * cos(t) / sqt;
        let yc = parDef.scale * sin(t) / sqt;
        let zc =  parDef.scale * (-parDef.aPar * t )/ sqt;
        //var z = new p5.Vector(xc, yc, zc);
        ver.push(createVector(xc,yc,zc));
    }
    return ver;
}

function loxodromeFunction(t){
    let sqt = sqrt(1 + parDef.aPar * parDef.aPar * t * t);
    let x = parDef.scale * cos(t) / sqt;
    let y = parDef.scale * sin(t) / sqt;
    let z = parDef.scale * (-parDef.aPar * t )/ sqt;
    return createVector(x, y);
}
