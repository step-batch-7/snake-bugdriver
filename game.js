class Game {
  #snake;
  #ghostSnake;
  #food;
  #score;
  #gridSize;

  static create(snakeConfig, ghostSnakeConfig, foodConfig, gridBoundry) {
    const snakeDirection = new Direction(snakeConfig.initDirection);
    const snake = new Snake(snakeConfig.position, snakeDirection, 'snake');
    const ghostSnakeDirection = new Direction(ghostSnakeConfig.initDirection);
    const ghostSnake = new Snake(
      ghostSnakeConfig.position,
      ghostSnakeDirection,
      'ghost'
    );
    const food = new Food(foodConfig.position, foodConfig.type);
    return new Game(snake, ghostSnake, food, gridBoundry);
  }

  constructor(snake, ghostSnake, food, gridSize) {
    this.#snake = snake;
    this.#ghostSnake = ghostSnake;
    this.#food = food;
    this.#score = new Score();
    this.#gridSize = gridSize;
  }
  getState() {
    const state = {};
    state.snake = this.#snake.getState();
    state.ghostSnake = this.#ghostSnake.getState();
    state.food = this.#food.getState();
    state.score = this.#score.announce();
    return state;
  }
  update() {
    if (this.#snake.eat(this.#food)) {
      this.#score.update(this.#food.point);
      const newFoodPosition = [
        Math.floor(Math.random() * this.#gridSize.noOfCols),
        Math.floor(Math.random() * this.#gridSize.noOfRows),
      ];
      const newFoodType = Math.random() < 0.3 ? 'specialFood' : 'food';
      this.#food = new Food(newFoodPosition, newFoodType);
    }
    this.#snake.move();
    this.#ghostSnake.move();
  }

  navigateGhostSnake() {
    setInterval(() => {
      let x = Math.random() * 100;
      if (x > 1) {
        this.#ghostSnake.turnLeft();
      }
    }, 500);
  }

  turnSnake(turnDirection) {
    const turners = {
      left: () => this.#snake.turnLeft(),
      right: () => this.#snake.turnRight(),
    };
    turners[turnDirection]();
  }

  isOver() {
    return (
      this.#snake.hasTouchBody(this.#snake) ||
      this.#snake.hasTouch(this.#gridSize) ||
      this.#snake.hasTouchBody(this.#ghostSnake)
    );
  }
}
