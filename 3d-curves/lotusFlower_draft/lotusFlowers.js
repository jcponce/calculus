function make2DArray(rows, cols) {
    var arr = new Array(rows); //like arr[]; but with number of columns hardcoded
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(cols);
    }
    return arr;
}

let angle = 0;
let w = 120;
let cols;
let rows;
let curves;

function setup() {
    createCanvas(windowWidth, windowHeight);
    cols = floor(width / w) - 1;
    rows = floor(height / w) - 1;
    curves = make2DArray(rows,cols);
    
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            curves[j][i] = new Curve();
        }
    }
}

function draw() {
    background(0);
    let d = w - 0.2 * w;
    let r = d / 2;
    
    noFill();
    stroke(255);
    for (let i = 0; i < cols; i++) {
        let cx = w + i * w + w / 2;
        let cy = w / 2;
        strokeWeight(1);
        stroke(255);
        ellipse(cx, cy, d, d);
        let x = r * cos(angle * (i + 1) - HALF_PI);
        let y = r * sin(angle * (i + 1) - HALF_PI);
        strokeWeight(8);
        stroke(255);
        point(cx + x, cy + y);
        stroke(255, 150);
        strokeWeight(1);
        line(cx + x, 0, cx + x, height);
        
        for (let j = 0; j < rows; j++) {
            curves[j][i].setX(cx + x);
        }
    }
    
    noFill();
    stroke(255);
    for (let j = 0; j < rows; j++) {
        let cx = w / 2;
        let cy = w + j * w + w / 2;
        strokeWeight(1);
        stroke(255);
        ellipse(cx, cy, d, d);
        let x = r * cos(angle * (j + 1) - HALF_PI);
        let y = r * sin(angle * (j + 1) - HALF_PI);
        strokeWeight(8);
        stroke(255);
        point(cx + x, cy + y);
        stroke(255, 150);
        strokeWeight(1);
        line(0, cy + y, width, cy + y);
        
        for (let i = 0; i < cols; i++) {
            curves[j][i].setY(cy + y);
        }
    }
    
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            curves[j][i].addPoint();
            curves[j][i].show();
        }
    }
    
    
    angle -= 0.01;
    
    if (angle < -TWO_PI) {
        for (let j = 0; j < rows; j++) {
            for (let i = 0; i < cols; i++) {
                curves[j][i].reset();
            }
        }
        // saveFrame("lissajous#####.png");
        angle = 0;
    }
}
