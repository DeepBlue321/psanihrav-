class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
    this.enem = [];
  }

  preload() {}

  create() {
    document.addEventListener("keydown", (e) => {
      this.checkForLetter(e.key);
    });
    let k = 0;
    this.createEnemInterval = setInterval(() => {
      let yPosition = getRandomInt(0, game.canvas.height - 20);

      this.enem[k] = new TextObj(
        game.canvas.width,

        yPosition,
        ["d", "j", "k", "f"],
        this
      );
      k++;
    }, 3000);
    window.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearInterval(this.createEnemInterval);
      }
    });
    this.controlText = this.add.text(
      game.canvas.width / 2,
      game.canvas.height - 50,
      "",
      {
        fontSize: "32px",
        fill: "#00ff00",
      }
    );
  }

  update() {
    this.enem.forEach((enemy) => {
      enemy.update();
    });
  }

  checkForLetter(letter) {
    let oneCorrect = false;

    this.enem.forEach((enemy) => {
      if (enemy.falseLetters[0] == letter) {
        enemy.incScore();
        oneCorrect = true;
      }
    });
    if (!oneCorrect) {
      this.enem.forEach((enemy) => {
        enemy.reset();
      });
      this.controlText.setText("");
    } else {
      this.controlText.setText(this.controlText.text + letter);
      this.enem.forEach((enemy, key) => {
        if (enemy.isDone()) {
          this.enem.splice(key, 1);
          this.controlText.setText("");
        }
      });
    }
  }
}
