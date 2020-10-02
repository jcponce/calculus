class LorenzAttractor {

  constructor() {
    

    this.p = 10.0;
    this.r = 28.0;
    this.b = 8.0 / 3.0;

    this.x = 1.1;
    this.y = 2;
    this.z = 7;

    this.x2 = 1.1;
    this.y2 = 2.05;
    this.z2 = 7;

    this.h = 0.01;
    this.scale = 1;

  }

  generatePoint(x, y, z) {


    var nx = (this.p * (-x + y));
    var ny = (-x * z + this.r * x - y);
    var nz = (x * y - this.b * z);

    x += this.h * nx;
    y += this.h * ny;
    z += this.h * nz;

    return {
      x: x,
      y: y,
      z: z
    };

  }

  randomize() {

    this.p = random(0.1, 50);
    this.r = random(0.5, 60);
    this.b = random(0.1, 10);

    this.x = random(-10, 10);
    this.y = random(-10, 10);
    this.z = random(0, 10);

  }

}