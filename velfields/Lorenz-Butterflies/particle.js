//Particle definition and motion
class Particle {

  constructor(_x, _y, _z, _t, _h) {
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.time = _t;
    this.h = _h;
    this.r = random(20, 255); // red color of the butterfly
    this.g = random(0, 70); // green color of the butterfly
    this.b = random(10, 255); // blue color of the butterfly

    this.rotX = random(0.008, 0.029);
    this.sc = random(0.018, 0.033);
  }

  update() {
    this.k1 = componentFX(this.time, this.x, this.y, this.z);
    this.j1 = componentFY(this.time, this.x, this.y, this.z);
    this.i1 = componentFZ(this.time, this.x, this.y, this.z);
    this.k2 = componentFX(this.time + 1 / 2 * this.h, this.x + 1 / 2 * this.h * this.k1, this.y + 1 / 2 * this.h * this.j1, this.z + 1 / 2 * this.h * this.i1);
    this.j2 = componentFY(this.time + 1 / 2 * this.h, this.x + 1 / 2 * this.h * this.k1, this.y + 1 / 2 * this.h * this.j1, this.z + 1 / 2 * this.h * this.i1);
    this.i2 = componentFZ(this.time + 1 / 2 * this.h, this.x + 1 / 2 * this.h * this.k1, this.y + 1 / 2 * this.h * this.j1, this.z + 1 / 2 * this.h * this.i1);
    this.k3 = componentFX(this.time + 1 / 2 * this.h, this.x + 1 / 2 * this.h * this.k2, this.y + 1 / 2 * this.h * this.j2, this.z + 1 / 2 * this.h * this.i2);
    this.j3 = componentFY(this.time + 1 / 2 * this.h, this.x + 1 / 2 * this.h * this.k2, this.y + 1 / 2 * this.h * this.j2, this.z + 1 / 2 * this.h * this.i2);
    this.i3 = componentFZ(this.time + 1 / 2 * this.h, this.x + 1 / 2 * this.h * this.k2, this.y + 1 / 2 * this.h * this.j2, this.z + 1 / 2 * this.h * this.i2);
    this.k4 = componentFX(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3, this.z + this.h * this.i3);
    this.j4 = componentFY(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3, this.z + this.h * this.i3);
    this.i4 = componentFZ(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3, this.z + this.h * this.i3);
    this.x = this.x + this.h / 6 * (this.k1 + 2 * this.k2 + 2 * this.k3 + this.k4);
    this.y = this.y + this.h / 6 * (this.j1 + 2 * this.j2 + 2 * this.j3 + this.j4);
    this.z = this.z + this.h / 6 * (this.i1 + 2 * this.i2 + 2 * this.i3 + this.i4);
    this.time += this.h;
  }
  
  updateEuler(){
    
    this.x += this.h * componentFX(this.time, this.x, this.y, this.z);
    this.y += this.h * componentFY(this.time, this.x, this.y, this.z);
    this.z += this.h * componentFZ(this.time, this.x, this.y, this.z);
    this.time += this.h;
  }

  display() {
    noStroke();
    ambientMaterial(this.r, this.g, this.b);

    //normalMaterial();
    let fc = frameCount * 15;

    let o = createVector(this.x, this.y, this.z);
    let p = createVector(this.x - this.h, this.y - this.h, this.z - this.h);
    let v = p.sub(o);

    //Right wing
    push();

    translate(o.x, o.y, o.z);
    rotate(v.heading());
    scale(this.sc);
    rotateY(0.5);
    rotateX(PI / 2 * cos(fc * this.rotX));
    model(wr);
    pop();

    //Left wing
    push();
    translate(o.x, o.y, o.z);
    rotate(v.heading());
    scale(this.sc);
    rotateY(0.5);
    rotateX(-PI / 2 * cos(fc * this.rotX));
    model(wl);
    pop();
  }

}