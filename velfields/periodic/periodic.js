/* Periodic simulation designed with p5.js (https://p5js.org/)
 Under Creative Commons License
 https://creativecommons.org/licenses/by-sa/4.0/
 
 Writen by Juan Carlos Ponce Campuzano, 19-August-2017
 */

/*
 Last update 12-July-2018
 */

let numMax = 500;
let t = 0;
let h = 0.01;
let particles = [];


let xmax = 4.5;
let xmin = -4.5;
let ymax = 3;
let ymin = -3;
let sc = 0.3;
let xstep = 0.5;
let ystep = 0.5;

let currentParticle = 0;

let fshow = false;

let buttonField;

let WIDTH = 700;
let HEIGHT = 500;
let frameWidth = WIDTH/100;
let frameHeight = HEIGHT/100;

function setup() {
    
    createCanvas(WIDTH, HEIGHT);
    controls();
    cursor(HAND);
    
}

function fieldShow() {
    
    if(fshow==false) {
        fshow = true;
    } else{
        fshow = false;
    }
}

function draw() {
    
    fill(0,50);
    stroke(255);
    strokeWeight(0.5);
    rect(0,0,width,height);
    
    
    translate(width/2, height/2);//we need the oringin at the center
    
    
    //Reference xy
    stroke(255, 0, 0,100);
    strokeWeight(2);
    line(0,0,100,0);//xAxis
    stroke(51, 204, 51,100);
    line(0,0,0,-100);//yAxis, the value is negative since axis in p5js is upside down
    
    t += h;
    
    if(mouseIsPressed){
        let splatter = 0.4;
        let newx = map(mouseX, 0, width, -5, 5);
        let newy = map(mouseY,  height, 0, -3.5, 3.5);
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
        if ( p.x > 6 ||  p.y > 5 || p.x < -6 ||  p.y < -5 ) {
            particles.splice(i,1);
            currentParticle--;
            
        }
    }
    
    if(fshow == true){
        field(t);
    }
    
    //println(currentParticle);
    
}

function mousePressed(){
    if(mouseButton == RIGHT){
        if (fieldShow == false) {
            fieldShow = true;
        } else {
            fieldShow = false;
        }
    }
}

let P = (t, x, y) =>  1.5*( cos(y+ t)  );//Change this function

let Q = (t, x, y) => 1.5*(  sin(x- 1/2*t)  );//Change this function

function Particle(_x, _y, _t, _h) {
    
    this.x = _x;
    this.y = _y;
    this.time = _t;
    this.radius = random(4,6);
    this.h = _h;
    this.op = random(187,200);
    this.r = random(0,255);
    this.g = random(164,255);
    this.b = random(250,255);
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
    };
    
    this.display = function() {
        fill(this.r, this.b, this.g, this.op);
        noStroke();
        this.updatex = map(this.x, -9, 9, -width, width);
        this.updatey = map(-this.y, -7, 7, -height, height);
        ellipse(this.updatex, this.updatey, 2*this.radius, 2*this.radius);
    };
}


function controls() {
    buttonField = createButton('Field');
    buttonField.position(350, 470);
    buttonField.mousePressed(fieldShow);
    
}

function field(_time) {
    this.time = _time;
    for(let k=ymin; k<=ymax; k+=ystep){
        for(let j=xmin; j<=xmax; j+=xstep){
            let xx = j + sc * P(this.time, j, k);
            let yy = k + sc * Q(this.time, j, k);
            let lj = map(j, -9.9, 9.9, -width, width);
            let lk = map(-k, -7, 7, -height, height);
            let lx = map(xx, -9.9, 9.9, -width, width);
            let ly = map(-yy, -7, 7, -height, height);
            let angle = atan2(ly-lk, lx-lj);
            let dist = sqrt((lk-ly)*(lk-ly)+(lj-lx)*(lj-lx));
            fill(255,dist);
            noStroke();
            push();
            translate(lj, lk);
            rotate(angle);
            scale(map(dist,0,1,0,0.03));
            triangle(-10, -4, 10, 0, -10, 4);
            pop();
        }
    }
    
}

