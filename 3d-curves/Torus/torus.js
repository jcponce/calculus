var easycam;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);
    
    setAttributes('antialias', true);
    
    easycam = createEasyCam({distance:10});
    
    document.oncontextmenu = function() { return false; }
    document.onmousedown   = function() { return false; }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0,0,windowWidth, windowHeight]);
}

function draw(){
    
    // projection
    perspective(60 * PI/180, width/height, 1, 5000);
    
    ambientLight(100);
    pointLight(255, 200, 200, 100, 0, 100);
    
    // BG
    background(32);
    ambientMaterial(102, 179, 255);
    noStroke();
    torus(2,1,64,64);
    
    //noFill();
    /*let hu = 50;
    beginShape();
    for(let i = 0; i <= 2*PI; i+=PI/900){
        stroke(hu, 255, 255);
        strokeWeight(0.02);
        noFill();
        let xc = 1.1*(cos(3*i)+2)*cos(4 * i);
        let yc = 1.1*(cos(3*i)+2)*sin(4 * i);
        let zc =  -1.1*sin(3 * i);
        vertex(xc, yc, zc);
    }
    endShape(CLOSE);*/
}
