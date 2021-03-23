class TextObj {
  constructor(x, y, letters, obj, word) {
    this.x = x;
    this.y = y;
    this.score = 0;
    this.scene = obj;
    // this.mainText = this._createRandomString(letters);

    this.mainText = word ? word : this._createRandomString(letters);

    this.deltaX = 1;

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
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        fill: "#00ff00",
      }
    );

    this.wrongText = this.scene.add.text(
      this.x + this.correctText.width,
      this.y,
      this.falseLetters,
      {
        fontSize: "32px",
        fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif',
        fill: "#000000",
      }
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
  }
  death() {
    if (!this.isDeath) {
      this.scene.emitter = [];
      this.scene.emitter.push(
        this.scene.add.particles("particle").createEmitter({
          lifespan: 200,
          speed: 50,
          x: this.x + 40,
          y: this.y,
          speed: { min: 400, max: 500 },
          scale: { start: 0.04, end: 0 },
        })
      );
      this.scene.time.delayedCall(150, () => {
        this.scene.emitter.forEach((emitter) => {
          emitter.stop();
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

    this.x = newX;
  }

  isOut() {
    if (this.correctText.x <= 0) {
      return true;
    }
  }
}
