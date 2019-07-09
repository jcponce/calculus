/* Time-dependent simulation designed with p5.js (https://p5js.org/)
 Under Creative Commons License
 https://creativecommons.org/licenses/by-sa/4.0/
 
 Writen by Juan Carlos Ponce Campuzano, 19-August-2017
 */

/*
 Last update 12-July-2018
 */

let numMax = 900; //Number of particles
let t = 0;
let h = 0.01;
let particles = [];

//vector fiel letiables
let xmax = 3;
let xmin = -3;
let ymax = 2;
let ymin = -2;
let sc = 0.5;//length of vector field
let xstep = 0.2;
let ystep = 0.2;

let currentParticle = 0;

let fshow = false;
let tshow = false;

let buttonField;
let buttonTrace;
let slideru0;
let sliderv0;
let sliderk;
let slideralpha;

let WIDTH = 700;
let HEIGHT = 500;
let frameWidth = WIDTH/100;
let frameHeight = HEIGHT/100;

function setup() {
    
    createCanvas(WIDTH, HEIGHT);
    controls();
    smooth();
    cursor(HAND);
    
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
    
    translate(width/2, height/2);//we need the oringin at the center
    
    //Reference xy-axis
    stroke(255, 0, 0,100);
    strokeWeight(2);
    line(0,0,100,0);//xAxis
    stroke(51, 204, 51,100);
    line(0,0,0,-100);//yAxis, the value is negative since axis in p5js is upside down
    
    t += h;
    
    if(mouseIsPressed){
        let splatter = 0.2;
        let newx = map(mouseX, 0, width, -2.5, 2.5);
        let newy = map(mouseY,  height, 0, -1.5, 1.5);
        particles[currentParticle] = new Particle(newx+random(-splatter,splatter), newy+random(-splatter,splatter), t,h);
        currentParticle++;
        if (currentParticle >= numMax)
        {
            currentParticle = 0;
        }
    }
    
    //updating and displaying the particles
    for (let i=particles.length-1; i>=0; i-=1) {
        let p = particles[i];
        p.update();
        p.display();
        if ( p.x > 3.5 ||  p.y > 3 || p.x < -3.5 ||  p.y < -2 ) {
            particles.splice(i,1);
            currentParticle--;
        }
    }
   
    if(fshow == true){
        field(t);
    }
    
    //println(currentParticle);
    
    //Black background for text and sliders
    textFrame();
    
}

let P = (t, x, y) => 1.5*( slideru0.value() );//Change this function
let Q = (t, x, y) => 1.5*(  sliderv0.value()*cos(sliderk.value()*x-slideralpha.value()*t)  );//Change this function

function Particle(_x, _y, _t, _h) {
    
    this.x = _x;
    this.y = _y;
    this.time = _t;
    this.radius = random(3,5);
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
        this.updatex = map(this.x, -5, 5, -width, width);
        this.updatey = map(-this.y, -3.5, 3.5, -height, height);
        ellipse(this.updatex, this.updatey, 2*this.radius, 2*this.radius);
    };
    
}

function controls() {
    
    slideru0 = createSlider(-2, 2, 0.5, 0.1);
    slideru0.position(10, 460);
    slideru0.style('width', '100px');
    
    sliderv0 = createSlider(-1.5, 1.5, 1, 0.1);
    sliderv0.position(120, 460);
    sliderv0.style('width', '100px');
    
    sliderk = createSlider(0, 2, 1.2, 0.1);
    sliderk.position(230, 460);
    sliderk.style('width', '100px');
    
    slideralpha = createSlider(0, 2.5, 1.4, 0.1);
    slideralpha.position(340, 460);
    slideralpha.style('width', '100px');
    
    buttonField = createButton('Field');
    buttonField.position(590, 460);
    buttonField.mousePressed(fieldShow);
    
    buttonTrace = createButton('Trace');
    buttonTrace.position(520, 460);
    buttonTrace.mousePressed(traceShow);
    
}

function textFrame(){
    noStroke();
    fill(0);
    rect(-700, 180, 1400, 100);
    //text defintion and format
    textSize(16);
    fill(250);
    text('u= '+nfc(slideru0.value(),1,1), -320, 205);//for slider u
    text('v= '+nfc(sliderv0.value(),1,1),-200, 205);//for slider v
    text('k= '+nfc(sliderk.value(),1,1), -100, 205);//for slider k
    text('alpha= '+nfc(slideralpha.value(),1,1), -5, 205);//for slider alpha
}

function field(_time) {
    this.time = _time;
    for(let k=ymin; k<=ymax; k+=ystep){
        for(let j=xmin; j<=xmax; j+=xstep){
            let xx = j + sc * P(this.time, j, k);
            let yy = k + sc * Q(this.time, j, k);
            let lj = map(j, -3, 3, -width, width);
            let lk = map(-k, -2, 2, -height, height);
            let lx = map(xx, -3, 3, -width, width);
            let ly = map(-yy, -2, 2, -height, height);
            let angle = atan2(ly-lk, lx-lj);
            let dist = sqrt((lk-ly)*(lk-ly)+(lj-lx)*(lj-lx));
            fill(250,dist);
            noStroke();
            push();
            translate(lj, lk);
            rotate(angle);
            scale(map(dist,0,1.5,0,0.01));
            triangle(-10, -3, 10, 0, -10, 3);
            pop();
        }
    }
}


