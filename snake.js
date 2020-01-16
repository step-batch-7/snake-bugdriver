const areCellsEqual = function(cellA, cellB) {
  const [colIdA, rowIdA] = cellA;
  const [colIdB, rowIdB] = cellB;
  return colIdA === colIdB && rowIdA === rowIdB;
};

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
    this.eatenFood = new Food([0, 0], 0);
  }

  getState() {
    return {
      location: this.location,
      species: this.species,
      previousTail: this.previousTail,
      eatenFood: this.eatenFood,
    };
  }

  get location() {
    return this.positions.slice();
  }

  get species() {
    return this.type;
  }

  grow() {
    this.positions.unshift(this.previousTail);
  }

  eat(food) {
    const [snakeHeadX, snakeHeadY] = this.location[this.location.length - 1];
    const [foodX, foodY] = food.location;
    if (snakeHeadX == foodX && snakeHeadY == foodY) {
      this.eatenFood = food;
      this.grow();
      return true;
    }
    return false;
  }

  turnLeft() {
    this.direction.turnLeft();
  }

  turnRight() {
    this.direction.turnRight();
  }

  move() {
    const [headX, headY] = this.positions[this.positions.length - 1];
    this.previousTail = this.positions.shift();

    const [deltaX, deltaY] = this.direction.delta;

    this.positions.push([headX + deltaX, headY + deltaY]);
  }

  hasTouchOther(snake) {
    const snakeHead = this.positions[this.positions.length - 1];
    const snakeBody = snake.positions.slice(0, -1);
    return snakeBody.some(bodyPart => areCellsEqual(bodyPart, snakeHead));
  }

  hasTouch(gridSize) {
    const { noOfCols, noOfRows } = gridSize;
    const [headX, headY] = this.positions[this.positions.length - 1];
    const hasTouchVerticalWalls = headX < 0 || headX > noOfCols;
    const hasTouchHorizontalWalls = headY < 0 || headY > noOfRows;
    return hasTouchHorizontalWalls || hasTouchVerticalWalls;
  }
}
