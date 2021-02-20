class TextObj {
  constructor(x, y, letters, obj) {
    this.x = x;
    this.y = y;
    this.score = 0;
    this.scene = obj;
    this.mainText = this._createRandomString(letters);
    this.deltaX = 1;
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
        fill: "#00ff00",
      }
    );
    this.wrongText = this.scene.add.text(
      this.x + this.correctText.width,
      this.y,
      this.falseLetters,
      {
        fontSize: "32px",
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
  isDone() {
    if (this.score == this.mainText.length) {
      this._deleteFromCanvas();
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

  update() {
    this.x -= this.deltaX;
    this.correctText.setX(this.x);
    this.wrongText.setX(this.x + this.correctText.width);
  }
}
