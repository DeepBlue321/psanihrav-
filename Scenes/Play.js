class Play extends Phaser.Scene {
  constructor() {
    super("play");
    this.enem = [];

    this.gameState = "play";
    this.score;
    this.life;
    this.numEnem = 0;
    this.targetWord = null;
    this.keysPressed = {};
    this.targetedWords = [];
    this.interval = 150;
    this.k = 0;
    this.deltaX = 1;
    this.wordsToUse = [];
  }
  preload() {
    this.load.image("heart", "./assets/heart.png");
    this.load.image("particle", "./assets/greenEffect.png");
    this.load.image("red", "./assets/red.png");
    this.load.image("pauza", "./assets/pauza.png");
  }

  create() {
    this.seconds = 0;
    this.secondsCounting = setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
    this.gameInput();
    this.prepareBackground();
    this.wordsToUse = this.createRandomStringArr(["f", "d", "j", "k"], 25);
  }

  update() {
    this.k++;
    if (this.k == this.interval) {
      this.makeEnemy();
      this.k = 0;
      this.interval -= 1;
      this.deltaX += 0.03;
    }

    this.enem.forEach((enemy, key) => {
      if (enemy) {
        enemy.update(this.deltaX);

        if (enemy.isOut()) {
          if (this.enem[key].correctLetters === this.controlText.text) {
            this.controlText.setText("");
          }
          this.targetWord = null;
          this.enem[key].death();
          this.life.decLife(1);

          this.enem[key] = null;

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
  _writeOfWord(key) {
    this.enem[key].death();
    console.log("dfsdf");
    this.enem[key].gainPointsAnim();
    this.enem[key] = null;
    this.controlText.setText("");
    this.score.addScore(10);
  }

  checkForLetter(letter) {
    let oneCorrect = false;

    if (this.targetedWords.length === 0) {
      console.log("nová");
      this.enem.forEach((enemy, key) => {
        if (enemy) {
          if (enemy.falseLetters[0] == letter) {
            enemy.incScore();
            this.controlText.setText(this.controlText.text + letter);
            oneCorrect = true;
            this.targetedWords.push(key);
            if (enemy.isDone()) {
              this._writeOfWord(key);
            }
          }
        }
      });
    } else {
      this.targetedWords.forEach((target, key) => {
        if (this.enem[target]) {
          console.log(this.targetedWords);
          if (this.enem[target].falseLetters[0] == letter) {
            console.log("trefa");
            this.enem[target].incScore();
            this.controlText.setText(this.controlText.text + letter);
            oneCorrect = true;

            if (this.enem[target].isDone()) {
              this._writeOfWord(target);
              this.targetedWords = [];
            }
          } else {
            this.enem[target].reset();
            this.targetedWords[key] = null;
          }
        }
      });
    }

    if (!oneCorrect) {
      this.damagePlayer();
      this.targetedWords.forEach((target, key) => {
        if (this.enem[target]) {
          this.enem[target].reset();
        }
      });

      this.controlText.setText("");
      this.targetedWords = [];
    }
  }

  checkFordLetter(letter) {
    let oneCorrect = false;
    var BreakException = {};
    if (this.targetWord === undefined || this.targetWord === null) {
      this.enem.forEach((enemy, key) => {
        if (enemy) {
          if (enemy.falseLetters[0] == letter) {
            this.targetWord = key;
            enemy.incScore();
            this.controlText.setText(this.controlText.text + letter);
            oneCorrect = true;
            /*  if (enemy.isDone()) {
              this.enem[key].death();
              console.log("dfsdf");
              this.enem[key].gainPointsAnim();
              this.enem[key] = null;
              this.controlText.setText("");
              this.score.addScore(20);
            } */
            throw BreakException;
          }
        }
      });
    } else {
      console.log(this.targetWord);
      if (this.enem[this.targetWord].falseLetters[0] == letter) {
        this.enem[this.targetWord].incScore();
        this.controlText.setText(this.controlText.text + letter);
        oneCorrect = true;
        if (this.enem[this.targetWord].isDone()) {
          this.enem[this.targetWord].death();
          this.enem[this.targetWord].gainPointsAnim();
          this.enem[this.targetWord] = null;
          this.controlText.setText("");
          this.score.addScore(20);
          if (this.score.score === 480) {
            this.gameOver();
          }

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
    this.textInfo2 = this.add.text(200, 150, "Pro restartování: shift + r", {
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
          console.log(this.keysPressed);
        }
        if (this.keysPressed["Shift"] && e.key == "R") {
          this.scene.remove();
          game.scene.add("play", Play, true);
          this.isGameOver = false;
        }
        if (this.keysPressed["Shift"] && e.key == "R") {
          this.scene.remove();
          game.scene.add("play", Play, true);
          this.isGameOver = false;
        }
      } else if (this.gameState === "gameOver") {
        if (this.keysPressed["Shift"] && e.key == "R") {
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

    let l = 0;
    let k = 0;
    while (x < max) {
      const textLength = getRandomInt(3, 8);
      let resultText = "";

      resultText += letters[k % 4];
      resultText += letters[l % 4];
      l++;
      k++;

      if (k % 4 == 0) {
        l++;
      }
      for (let i = 2; i < textLength; i++) {
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
