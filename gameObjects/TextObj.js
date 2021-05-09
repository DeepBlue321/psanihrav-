class TextObj {
  constructor(x, y, letters, obj, word) {
    this.x = x;
    this.y = y;
    this.score = 0;
    this.scene = obj;
    // this.mainText = this._createRandomString(letters);
    this.mainFont = 'Arial , "Goudy Bookletter 1911", Times, serif';
    this.scene.emitter = [];
    this.mainText = word ? word : this._createRandomString(letters);
    this.pointsAnim = null;
    this.deltaX = 0.05;
    this.progressBarPointX = game.canvas.width / 2;
    this.progressBarPointY = 10;
    this.isDeath = false;
    this._createTextData();
  }

  _createTextData() {
    this.correctLetters = this._returnCorrectLetters(this.mainText);
    this.falseLetters = this._returnFalseLetters(this.mainText);

    this.correctText = this.scene.add.text(
      this.x,
      this.y,
      this.correctLetters,
      {
        fontSize: "32px",
        fontFamily: this.mainFont,
        fill: "#00ff00",
      }
    );

    this.wrongText = this.scene.add.text(
      this.x + this.correctText.width,
      this.y,
      this.falseLetters,
      {
        fontSize: "32px",
        fontFamily: this.mainFont,
        fill: "#222222",
      }
    );
    this.wantedLetter = this.scene.add.text(
      this.x + this.correctText.width,
      this.y,
      this.falseLetters[0],
      {
        fontSize: "32px",
        fontFamily: this.mainFont,
        fill: "#000000",
      }
    );
    this.underline = this.scene.add.graphics();

    this.underline.lineStyle(4, 0x283044, 1);

    this.underline.lineBetween(
      this.wantedLetter.x - 2,
      this.wantedLetter.y + 40,
      this.wantedLetter.x + 15,
      this.wantedLetter.y + 40
    );
  }

  _createRandomString(letters) {
    const textLength = getRandomInt(2, 7);
    let resultText = "";

    for (let i = 0; i < textLength; i++) {
      const randomElement = letters[Math.floor(Math.random() * letters.length)];
      resultText += randomElement;
    }
    return resultText;
  }

  _returnCorrectLetters(letters) {
    let result = "";
    for (let i = 0; i < this.score; i++) {
      result += letters[i];
    }
    return result;
  }

  _returnFalseLetters(letters) {
    let result = "";

    for (let i = this.score; i < letters.length; i++) {
      result += letters[i];
    }
    return result;
  }

  _deleteFromCanvas() {
    this.correctText.destroy();
    this.wrongText.destroy();
    this.wantedLetter.destroy();
    this.underline.destroy();
  }
  gainPointsAnim() {
    let points = this.scene.add.text(this.x, this.y, 10, {
      fontSize: "32px",
      fontFamily: this.mainFont,
      fill: "#00ff00",
    });

    this.updatePoins(points);
  }

  death() {
    if (!this.isDeath) {
      this.scene.emitter.push(
        this.scene.add.particles("particle").createEmitter({
          lifespan: 200,
          speed: 40,
          x: this.x + 40,
          y: this.y,
          speed: { min: 400, max: 700 },

          scale: { start: 0.02, end: 0 },
        })
      );
      this.scene.time.delayedCall(200, () => {
        this.scene.emitter.forEach((emitter) => {
          emitter.stop();
          console.log(emitter);
          this.scene.emitter = [];
        });
      });

      this._deleteFromCanvas();

      this.isDeath = true;
    }
  }
  isDone() {
    if (this.score == this.mainText.length) {
      this.death();
      return true;
    }
  }
  incScore() {
    this.score++;
    this._deleteFromCanvas();
    this._createTextData();
  }

  reset() {
    this.score = 0;
    this._deleteFromCanvas();
    this._createTextData();
  }

  update(deltaX) {
    let newX = this.correctText.x - deltaX;
    this.correctText.setX(newX);
    this.wrongText.setX(newX + this.correctText.width);
    this.wantedLetter.setX(newX + this.correctText.width);
    this.underline.setX(this.underline.x - deltaX);
    this.x = newX;
  }
  updatePoins(points) {
    let poinsInterval = setInterval(() => {
      let newX = (this.progressBarPointX - points.x) * 0.1;
      points.setX(newX + points.x);

      let newY = (this.progressBarPointY - points.y) * 0.1;
      points.setY(newY + points.y);

      if (
        points.x > this.progressBarPointX - 10 &&
        points.x < this.progressBarPointX + 10
      ) {
        if (
          points.y > this.progressBarPointY - 10 &&
          points.y < this.progressBarPointY + 10
        ) {
          points.destroy();
          clearInterval(poinsInterval);
        }
      }
    }, 1000 / 60);
  }
  isOut() {
    if (this.correctText.x <= 0) {
      return true;
    }
  }
}
