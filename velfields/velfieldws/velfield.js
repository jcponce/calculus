/* Time-dependent simulation designed with p5.js (https://p5js.org/)
 Under Creative Commons License
 https://creativecommons.org/licenses/by-sa/4.0/
 
 Writen by Juan Carlos Ponce Campuzano, 19-August-2017
 */

/*
 Last update 12-July-2018
 */

var numMax = 80; //Number of particles
var t = 0;
var h = 0.01;
var particles = [];

//vector fiel variables
var xmax = 6;
var xmin = -6;
var ymax = 4;
var ymin = -4;
var sc = 0.3;//length of vector field
var xstep = 0.4;
var ystep = 0.4;


var currentParticle = 0;

var fshow = false;
var tshow = false;

var buttonField;
var buttonTrace;
var slideru0;
var sliderv0;
var sliderk;
var slideralpha;

var WIDTH = 700;
var HEIGHT = 500;
var frameWidth = WIDTH/100;
var frameHeight = HEIGHT/100;


function setup() {
    
    createCanvas(windowWidth, windowHeight);
    
  
    
    controls();
    
    //seting up particles
    for (var i=0; i<numMax; i++) {
        var valX = random(-frameWidth, frameWidth);
        var valY = random(-frameHeight, frameHeight);
        particles[i] = new Particle(valX, valY, t, h);
    }
    smooth();
    
}

function fieldShow() {
    
    if(fshow==false) {
        fshow = true;
    } else{
        fshow = false;
    }
    
    if(tshow==true) {
        tshow = false;
    }
    
}

function traceShow() {
    if(tshow==false) {
        tshow = true;
    }else{
        tshow = false;
    }
    
    if(fshow==true) {
        fshow = false;
    }
    
}

function draw() {
    
    //This is for drawing the trace of particles
    if(tshow==true){
        fill(0,6);
    } else{
        fill(0,110);
    }
    noStroke();
    rect(0,0,width,height);
    //////////////////////////
    
    
    translate(width/2, height/2);//we need the oringin at the center
    
    
    //Reference xy
    stroke(255, 0, 0,100);
    strokeWeight(2);
    line(0,0,100,0);//xAxis
    stroke(51, 204, 51,100);
    line(0,0,0,-100);//yAxis, the value is negative since axis in p5js is upside down
    
    t += h;
    
    
    //currentParticle = 0;
    
    
    //if(fieldShow == true){
    //updating and displaying the particles
    for (var i=particles.length-1; i>=0; i-=1) {
        var p = particles[i];
        p.update();
        p.display();
        if ( p.x > frameWidth ||  p.y > frameHeight || p.x < -frameWidth ||  p.y < -frameHeight ) {
            particles.splice(i,1);
            currentParticle--;
            particles.push(new Particle(random(-frameWidth, frameWidth),random(-frameHeight, frameHeight),t,h) );
        }
    }
    //}
    
    
    if(fshow == true){
        field(t);
    }
    
    //println(currentParticle);
    
    //Black background for text and sliders
    noStroke();
    fill(0);
    rect(-700, 180, 1400, 100);
    //text
    textSize(16);
    fill(250);
    text('u0= '+nfc(slideru0.value(),1,1), -320, 205);//for slider u0
    text('v0= '+nfc(sliderv0.value(),1,1),-200, 205);//for slider v0
    text('k= '+nfc(sliderk.value(),1,1), -100, 205);//for slider k
    text('alpha= '+nfc(slideralpha.value(),1,1), -5, 205);//for slider alpha
    
}

var P = (t, x, y) => 1.5*( slideru0.value() );//Change this function
var Q = (t, x, y) => 1.5*(  sliderv0.value()*cos(sliderk.value()*x-slideralpha.value()*t)  );//Change this function


function Particle(_x, _y, _t, _h) {
    
    this.x = _x;
    this.y = _y;
    this.time = _t;
    this.radius = random(3,3);
    this.h = _h;
    this.op = random(187,200);
    this.r = random(0);
    this.g = random(164,255);
    this.b = random(255);
    this.lifespan = 700.0;
    
    this.update = function() {
        this.k1 = P(this.time, this.x, this.y);
        this.j1 = Q(this.time, this.x, this.y);
        this.k2 = P(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1);
        this.j2 = Q(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1);
        this.k3 = P(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2);
        this.j3 = Q(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2);
        this.k4 = P(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3);
        this.j4 = Q(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3);
        this.x = this.x + this.h/6 *(this.k1 + 2 * this.k2 + 2 * this.k3 + this.k4);
        this.y = this.y + this.h/6 *(this.j1 + 2 * this.j2 + 2 * this.j3 + this.j4);
        this.time += this.h;
        //this.lifespan -= 1.0;
    };
    
    this.display = function() {
        fill(this.r, this.b, this.g, this.op);
        noStroke();//stroke(0,random(220,230),  random(250,255),this.lifespan);
        this.updatex = map(this.x, -7, 7, -width, width);
        this.updatey = map(-this.y, -5, 5, -height, height);
        ellipse(this.updatex, this.updatey, 2*this.radius, 2*this.radius);
    };
    
}

function controls() {
    
    slideru0 = createSlider(-2, 2, 0.5, 0.1);
    slideru0.position(10, 470);
    slideru0.style('width', '100px');
    
    sliderv0 = createSlider(-1.5, 1.5, 1, 0.1);
    sliderv0.position(120, 470);
    sliderv0.style('width', '100px');
    
    sliderk = createSlider(0, 2, 1.2, 0.1);
    sliderk.position(230, 470);
    sliderk.style('width', '100px');
    
    slideralpha = createSlider(0, 1.5, 1.4, 0.1);
    slideralpha.position(340, 470);
    slideralpha.style('width', '100px');
    
    buttonField = createButton('Field');
    buttonField.position(590, 470);
    buttonField.mousePressed(fieldShow);
    
    buttonTrace = createButton('Trace');
    buttonTrace.position(520, 470);
    buttonTrace.mousePressed(traceShow);
    
}

function field(_time) {
    this.time = _time;
    for(var k=ymin; k<=ymax; k+=ystep){
        for(var j=xmin; j<=xmax; j+=xstep){
            var xx = j + sc * P(this.time, j, k);
            var yy = k + sc * Q(this.time, j, k);
            
            var lj = map(j, -6, 6, -width, width);
            var lk = map(-k, -4, 4, -height, height);
            var lx = map(xx, -6, 6, -width, width);
            var ly = map(-yy, -4, 4, -height, height);
            var angle = atan2(ly-lk, lx-lj);
            var dist = sqrt((lk-ly)*(lk-ly)+(lj-lx)*(lj-lx));
            fill(220,dist);
            push();
            translate(lj, lk);
            rotate(angle);
            triangle(-11, -4, 11, 0, -11, 4);
            pop();
        }
    }
    
}

