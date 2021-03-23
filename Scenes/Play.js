class Play extends Phaser.Scene {
  constructor() {
    super("play");
    this.enem = [];
    //this.isPaused = false;
    //this.isGameOver = false;
    this.gameState = "play";
    this.score;
    this.life;
    this.numEnem = 0;
    this.targetWord = null;
    this.keysPressed = {};

    this.interval = 150;
    this.k = 0;
    this.deltaX = 1;
    this.wordsToUse = [];
  }
  preload() {
    this.load.image("heart", "./assets/heart.png");
    this.load.image("particle", "./assets/particle.jpg");
    this.load.image("red", "./assets/red.png");
    this.load.image("pauza", "./assets/pauza.png");
  }

  create() {
    this.gameInput();
    this.prepareBackground();
    this.wordsToUse = this.createRandomStringArr(["f", "d", "j", "k"], 10);
  }

  update() {
    this.k++;
    if (this.k == this.interval) {
      this.makeEnemy();
      this.k = 0;
      this.interval -= 1;
      this.deltaX += 0.08;
    }

    this.enem.forEach((enemy, key) => {
      if (enemy) {
        enemy.update(this.deltaX);
        if (enemy.isOut()) {
          this.enem[key].death();
          this.life.decLife(1);
          this.enem.splice(key, 1);
          this.controlText.setText("");
          this.damageEffect();
        }
      }
    });
  }

  makeEnemy() {
    let Yplaces = [];
    for (let i = 2; i < Math.floor(game.canvas.height / 32) - 2; i++) {
      Yplaces.push(i * 32);
    }

    let yPosition = Yplaces[Math.floor(Math.random() * Yplaces.length)];
    for (let i = 0; i < this.enem.length + 1; i++) {
      if (!this.enem[i]) {
        this.numEnem = i;
      }
    }

    let word = this.wordsToUse[
      Math.floor(Math.random() * this.wordsToUse.length)
    ];

    this.enem[this.numEnem] = new TextObj(
      game.canvas.width,

      yPosition,
      ["d", "j", "k", "f"],
      this,
      word
    );
  }

  damageEffect() {
    let red = this.add.image(0, 0, "red");
    red.alpha -= 0.5;
    red.setScale(2);
    this.createEnemInterval = setInterval(() => {
      red.alpha -= 0.1;
    }, 100);
  }

  damagePlayer() {
    this.life.decLife(1);
    this.damageEffect();
  }

  checkForLetter(letter) {
    let oneCorrect = false;
    var BreakException = {};
    if (!this.targetWord) {
      this.enem.forEach((enemy, key) => {
        if (enemy) {
          if (enemy.falseLetters[0] == letter) {
            this.targetWord = key;
            enemy.incScore();
            this.controlText.setText(this.controlText.text + letter);
            oneCorrect = true;
            if (enemy.isDone()) {
              this.enem[key].death();
              this.enem[key] = null;
              this.controlText.setText("");
              this.score.addScore(20);
            }
            throw BreakException;
          }
        }
      });
    } else {
      if (this.enem[this.targetWord].falseLetters[0] == letter) {
        this.enem[this.targetWord].incScore();
        this.controlText.setText(this.controlText.text + letter);
        oneCorrect = true;
        if (this.enem[this.targetWord].isDone()) {
          this.enem[this.targetWord].death();
          this.enem[this.targetWord] = null;
          this.controlText.setText("");
          this.score.addScore(20);

          this.targetWord = null;
        }
      }
    }

    if (!oneCorrect) {
      this.damagePlayer();

      if (this.targetWord != null) {
        console.log(this.targetWord);
        this.enem[this.targetWord].reset();
      }
      this.controlText.setText("");
    }
  }

  pauseScreen() {
    this.scene.pause();
    this.pausedPage = this.add.image(0, 0, "pauza").setOrigin(0, 0);

    this.isPaused = true;
  }
  unpauseScreen() {
    this.pausedPage.destroy();

    this.isPaused = false;
    this.scene.resume();
  }
  gameOver() {
    this.pausedPage = this.add.rectangle(
      this.sys.game.canvas.width / 2,
      this.sys.game.canvas.height / 2,
      this.sys.game.canvas.width,
      this.sys.game.canvas.height,
      0x6666ff
    );
    this.textInfo1 = this.add.text(200, 80, "Konec hry", {
      fontSize: "25px",
      fill: 0x6666ff,
    });
    this.textInfo2 = this.add.text(200, 150, "Pro restartování: ctr + r", {
      fontSize: "25px",
      fill: 0x6666ff,
    });
    this.scene.pause();
  }

  gameInput() {
    document.addEventListener("keyup", (e) => {
      delete this.keysPressed[e.key];
    });
    document.addEventListener("keydown", (e) => {
      this.keysPressed[e.key] = true;

      if (this.gameState === "play") {
        if (e.key === "Escape") {
          this.gameState = "pause";
          this.pauseScreen();
        } else {
          this.checkForLetter(e.key);
        }
      } else if (this.gameState === "pause") {
        if (e.key === "Escape") {
          this.gameState = "play";
          this.unpauseScreen();

          if (this.keysPressed["Control"] && e.key == "r") {
            this.scene.remove();
            game.scene.add("play", Play, true);
            this.isGameOver = false;
          }
        }
      } else if (this.gameState === "gameOver") {
        if (this.keysPressed["Control"] && e.key == "r") {
          this.scene.remove();
          game.scene.add("play", Play, true);
          this.isGameOver = false;
        }
      }
    });
  }
  createRandomStringArr(letters, max) {
    let returnArr = [];
    let x = 0;
    while (x < max) {
      const textLength = getRandomInt(2, 7);
      let resultText = "";

      for (let i = 0; i < textLength; i++) {
        const randomElement =
          letters[Math.floor(Math.random() * letters.length)];
        resultText += randomElement;
      }
      returnArr.push(resultText);
      x++;
    }

    return returnArr;
  }

  prepareBackground() {
    this.life = new Life(20, 32, this);

    this.score = new Score(game.canvas.width / 2 - 200 / 2, 28, 500, this);
    this.add.text(game.canvas.width - 150, 20, "Pro pauznutí: Ecs", {
      fontSize: "12px",
      fill: "#0xff",
    });

    this.controlText = this.add.text(
      game.canvas.width / 2,
      game.canvas.height - 50,
      "",
      {
        fontSize: "32px",
        fill: "#000000",
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
      }
    );
  }
}
