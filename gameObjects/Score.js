class Score {
  constructor(x, y, maxPoints, scene) {
    this.maxPoints = maxPoints;

    this.x = x;
    this.y = y;

    this.scene = scene;
    this.width = 200;
    this.score = 0;

    this.drawScore = this._calcDrawScore();
    this.backLine = this._backLine();
    this.fillLine = this._fillLine();
  }

  draw() {}

  _backLine() {
    var line = this.scene.add.graphics();

    line.lineStyle(15, 0x283044, 1);

    line.lineBetween(this.x, this.y, this.x + this.width, this.y);

    return line;
  }

  _fillLine() {
    var line = this.scene.add.graphics();

    line.lineStyle(15, 0x5cf64a, 1);

    line.lineBetween(
      this.x,
      this.y,
      this.x + this.drawScore * this.width,
      this.y
    );

    return line;
  }
  _calcDrawScore() {
    return this.score / this.maxPoints;
  }

  addScore(newScore) {
    this.score += newScore;
    this.drawScore = this._calcDrawScore();
    this.fillLine = this._fillLine();
  }
}
