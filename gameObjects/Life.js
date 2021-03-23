class Life {
  constructor(x, y, scene) {
    this.x = x;
    this.y = y;

    this.maxLife = 5;
    this.life = this.maxLife;
    this.scene = scene;
    this.images = [];
    this.width = 25;
    this.draw();
  }

  draw() {
    for (let i = 0; i < this.life; i++) {
      this.images[i] = this.scene.add.image(
        this.x + i * this.width,
        this.y,
        "heart"
      );

      this.images[i].setScale(1);
    }
  }

  decLife(amount) {
    this.images[this.life - 1].destroy();
    this.life -= amount;
    if (this.life == 0) {
      this.scene.isGameOver = true;
      this.scene.gameOver();
      this.scene.gameState = "gameOver";
    }
  }
}
