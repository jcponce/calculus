// Click and Drag an object by
// Daniel Shiffman <http://www.shiffman.net>

class Draggable {
  constructor() {

    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?

    this.x = random(100, width - 100);
    this.y = random(100, height - 100);
    // Dimensions
    this.d = 30;
    this.bs = 10;
    
  }

  over() {
    // Is mouse over object
    if (mouseX > this.x - this.bs && mouseX < this.x + this.bs &&
      mouseY > this.y - this.bs && mouseY < this.y + this.bs) {
      this.rollover = true;
        
    } else {
      this.rollover = false;
        
    }

  }

  update() {

    // Adjust location if being dragged
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }

  }

  show() {
    imageMode(CENTER);
    stroke(0);
    // Different fill based on state
    if (this.dragging) {
      fill(60);
      stroke(255);
      strokeWeight(1.5);
        cursor('grab');
    } else if (this.rollover) {
      fill(250);
        cursor(HAND);
    } else {
      fill(200, 150);
    }
    ellipse(this.x, this.y, this.d, this.d);
  }

  pressed() {
    // Did I click on the cirlce?
    if (mouseX > this.x - this.bs && mouseX < this.x + this.bs &&
      mouseY > this.y - this.bs && mouseY < this.y + this.bs) {
      this.dragging = true;
        
      // If so, keep track of relative location of click to corner of rectangle
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
      
  }

  released() {
    // Quit dragging
    this.dragging = false;
  }
}
