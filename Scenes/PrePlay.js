class PrePlay extends Phaser.Scene {
  constructor() {
    super("prePlay");
    this.prePlay = true;
    this.screen;
  }
  preload() {
    this.load.image("uvod", "./assets/uvod.png");
  }
  create() {
    this.gameInput();
    this.screen = this.add.image(0, 0, "uvod").setOrigin(0, 0);
  }
  gameInput() {
    document.addEventListener("keydown", (e) => {
      if (this.prePlay) {
        if (e.key === " ") {
          this.damageEffect();
          this.prePlay = false;
        }
      }
    });
  }
  damageEffect() {
    let k = 0;
    this.createEnemInterval = setInterval(() => {
      this.screen.alpha -= 0.1;
      k++;
      if (k == 18) {
        this.scene.start("play");
      }
    }, 50);
  }
}
