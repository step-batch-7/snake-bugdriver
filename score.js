class Score {
  constructor() {
    this.score = 0;
  }
  update(points) {
    this.score += points;
  }
  announce() {
    return this.score;
  }
}
