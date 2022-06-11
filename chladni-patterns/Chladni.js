// Chladni class

class Chladni {
    constructor(N_, pts_) {
        this.N = N_; //number of particles
        this.p = [];
        this.V = 0.5; //elasticity
        this.F = parDef.frq;
        this.PV = -1.5;
        this.d = 1;

        this.pts = pts_; //Nodes

        this.T = 0;
        this.TT = 1;
    }

    init() {
        for (let i = 0; i < this.N; i++) {
            this.p[i] = createVector(random(0, width), random(0, height));
        }
    }


    run() {
        for (let i = 0; i < this.N; i++) {
            this.R = 0;
            this.D = 0;
            this.C = 0;
            for (let j = 0; j < this.pts.length; j++) {
                let sx = this.pts[j].x;
                let sy = this.pts[j].y;
                this.L = sqrt(((this.p[i].x - sx) * (this.p[i].x - sx)) + ((this.p[i].y - sy) * (this.p[i].y - sy)));

                this.C = this.C + sin(2 * PI * this.F * (this.T - (this.L / this.V)) / 60);

                this.L = sqrt(((this.p[i].x + this.d - sx) * (this.p[i].x + this.d - sx)) + ((this.p[i].y - sy) * (this.p[i].y - sy)));

                this.R = this.R + sin(2 * PI * this.F * (this.T - (this.L / this.V)) / 60);

                this.L = sqrt(((this.p[i].x - sx) * (this.p[i].x - sx)) + ((this.p[i].y + this.d - sy) * (this.p[i].y + this.d - sy)));

                this.D = this.D + sin(2 * PI * this.F * (this.T - (this.L / this.V)) / 60);
            } //ends II

            this.R = abs(this.R);
            this.D = abs(this.D);
            this.C = abs(this.C);

            this.draw(this.p[i].x, this.p[i].y);

            this.L = sqrt(((this.R - this.C) * (this.R - this.C)) + ((this.D - this.C) * (this.D - this.C)));

            let VX = this.PV * (this.R - this.C) / this.L;
            let VY = this.PV * (this.D - this.C) / this.L;

            this.p[i].x = this.p[i].x + VX;
            this.p[i].y = this.p[i].y + VY;

            if (this.p[i].x < 0 || this.p[i].x > width || this.p[i].y < 0 || this.p[i].y > height || this.C < 0.0025) {
                this.p[i].x = random(0, width);
                this.p[i].y = random(0, height);
            }
        } // ends I

        this.T = this.T + this.TT;
    }

    draw(px, py) {
        noStroke();
        fill(parDef.red * (1 - this.C), parDef.green * (1 - this.C), parDef.blue * (1 - this.C));
        ellipse(px, py, 4, 4);

    }

}