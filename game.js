class Game {
  #snake;
  #ghostSnake;
  #food;
  #score;
  #gridSize;

  constructor(snake, ghostSnake, food, gridSize) {
    this.#snake = snake;
    this.#ghostSnake = ghostSnake;
    this.#food = food;
    this.#score = new Score();
    this.#gridSize = gridSize;
  }

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

  getState() {
    const state = {};
    state.snake = this.#snake.getState();
    state.ghostSnake = this.#ghostSnake.getState();
    state.food = this.#food.getState();
    state.score = this.#score.announce();
    return state;
  }

  generateNewFood() {
    let foodX = Math.floor(Math.random() * this.#gridSize.noOfCols);
    let foodY = Math.floor(Math.random() * this.#gridSize.noOfRows);

    const [snakeX, snakeY] = this.#snake.head;
    const [ghostSnakeX, ghostSnakeY] = this.#ghostSnake.head;

    let diffX = Math.abs(snakeX - foodX) > Math.abs(ghostSnakeX - foodX);
    let diffY = Math.abs(snakeY - foodY) > Math.abs(ghostSnakeY - foodY);

    while (diffX || diffY) {
      foodX = Math.floor(Math.random() * this.#gridSize.noOfCols);
      foodY = Math.floor(Math.random() * this.#gridSize.noOfRows);
      diffX = Math.abs(snakeX - foodX) > Math.abs(ghostSnakeX - foodX);
      diffY = Math.abs(snakeY - foodY) > Math.abs(ghostSnakeY - foodY);
    }
    const newFoodType = Math.random() < 0.3 ? 'specialFood' : 'food';
    this.#food = new Food([foodX, foodY], newFoodType);
  }

  update() {
    if (this.#snake.eat(this.#food)) {
      this.#score.update(this.#food.point);
      this.generateNewFood();
    }
    if (this.#ghostSnake.eat(this.#food)) {
      this.generateNewFood();
    }
    this.#snake.move();
    this.#ghostSnake.move();
  }

  navigateGhostSnake() {
    setInterval(() => {
      const { position } = this.#food.getState();
      const [foodX, foodY] = position;
      const { location } = this.#ghostSnake.getState();
      const [snakeX, snakeY] = location[location.length - 1];
      const diffX = snakeX - foodX;
      const diffY = snakeY - foodY;
      diffY < 0 && this.#ghostSnake.changeDirection(SOUTH);
      diffY > 0 && this.#ghostSnake.changeDirection(NORTH);
      diffX < 0 && this.#ghostSnake.changeDirection(EAST);
      diffX > 0 && this.#ghostSnake.changeDirection(WEST);
    }, 100);
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
