const areCellsEqual = function(cellA, cellB) {
  const [colIdA, rowIdA] = cellA;
  const [colIdB, rowIdB] = cellB;
  return colIdA === colIdB && rowIdA === rowIdB;
};

class Snake {
  #positions;
  #direction;
  #type;
  #previousTail;
  #eatenFood;
  constructor(positions, direction, type) {
    this.#positions = positions.slice();
    this.#direction = direction;
    this.#type = type;
    this.#previousTail = [0, 0];
    this.#eatenFood = new Food([0, 0], 0);
  }

  getState() {
    return {
      location: this.location,
      species: this.species,
      previousTail: this.#previousTail,
      eatenFood: this.#eatenFood,
    };
  }

  get location() {
    return this.#positions.slice();
  }

  get head() {
    return this.location[this.location.length - 1];
  }

  get species() {
    return this.#type;
  }

  grow(type) {
    type == 'specialFood' ||
      this.#type == 'ghost' ||
      this.#positions.unshift(this.#previousTail);
  }

  eat(food) {
    const [snakeHeadX, snakeHeadY] = this.head;
    const foodState = food.getState();
    const [foodX, foodY] = foodState.position;
    if (snakeHeadX == foodX && snakeHeadY == foodY) {
      this.#eatenFood = food;
      this.grow(foodState.type);
      return true;
    }
    return false;
  }

  changeDirection(newDirection) {
    this.#direction.changeDirection(newDirection);
  }

  turnLeft() {
    this.#direction.turnLeft();
  }

  turnRight() {
    this.#direction.turnRight();
  }

  move() {
    const [headX, headY] = this.head;
    this.#previousTail = this.#positions.shift();

    const [deltaX, deltaY] = this.#direction.delta;

    this.#positions.push([headX + deltaX, headY + deltaY]);
  }

  hasTouchBody(snake) {
    const snakeHead = this.head;
    const snakeStatus = snake.getState();
    const snakeBody = snakeStatus.location.slice(0, -1);
    return snakeBody.some(bodyPart => areCellsEqual(bodyPart, snakeHead));
  }

  hasTouch(gridSize) {
    const { noOfCols, noOfRows } = gridSize;
    const [headX, headY] = this.head;
    const hasTouchVerticalWalls = headX < 0 || headX > noOfCols;
    const hasTouchHorizontalWalls = headY < 0 || headY > noOfRows;
    return hasTouchHorizontalWalls || hasTouchVerticalWalls;
  }
}
