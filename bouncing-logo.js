class BouncingLogo {
  // unit: pixels per frame
  speed = 2;

  constructor(elementId) {
    this.viewport = { height: 0, width: 0 };
    this.element = document.getElementById(elementId);
    this.position = { x: 0, y: 0 };

    // polarity (+/-) indicates direction:
    //  +x +y = right and down
    //  +x -y = right and up
    //  -x +y = left and down
    //  -x -y = left and up
    this.speed = { x: +this.speed, y: +this.speed };
  }

  // subtracting element size since positioning is based on element's top left corner
  updateViewport() {
    this.viewport.width = window.innerWidth - this.element.offsetWidth;
    this.viewport.height = window.innerHeight - this.element.offsetHeight;
  }

  applyElementPosition() {
    this.element.style.setProperty("--x", this.position.x);
    this.element.style.setProperty("--y", this.position.y);
  }

  animationFrame() {
    // calculate new element position
    this.position.x += this.speed.x;
    this.position.y += this.speed.y;

    // when exceeding viewport bounds, change direction
    if (isOutsideBounds(this.position.x, [0, this.viewport.width])) {
      this.speed.x *= -1;
      this.position.x = getBoundedValue(this.position.x, [
        0,
        this.viewport.width,
      ]);
    }
    if (isOutsideBounds(this.position.y, [0, this.viewport.height])) {
      this.speed.y *= -1;
      this.position.y = getBoundedValue(this.position.y, [
        0,
        this.viewport.height,
      ]);
    }

    this.applyElementPosition();

    // animate next frame
    requestAnimationFrame(() => this.animationFrame());
  }

  async startAnimation() {
    this.updateViewport();

    this.position.x = this.viewport.width / 2;
    this.position.y = this.viewport.height / 2;
    this.applyElementPosition();
    this.element.classList.add("ready");

    // wait for scaling animation to finish before starting movement
    await wait(0.3);
    this.animationFrame();
  }
}

onClassAdded(document.getElementById("main"), "ready", () => {
  const logo = new BouncingLogo("bouncing-logo");
  window.addEventListener("resize", () => logo.updateViewport());
  setTimeout(() => {
    logo.startAnimation();
  }, 1000);
});
