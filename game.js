class Game {
  constructor(snake, ghostSnake, food, gridSize) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.score = new Score();
    this.gridSize = gridSize;
  }
  getState() {
    const state = {};
    state.snake = this.snake.getState();
    state.ghostSnake = this.ghostSnake.getState();
    state.food = {
      location: this.food.location,
    };
    state.score = this.score.announce();
    return state;
  }
  update() {
    if (this.snake.eat(this.food)) {
      this.score.update(this.food.point);
      const newFoodPosition = [
        Math.floor(Math.random() * this.gridSize.noOfCols),
        Math.floor(Math.random() * this.gridSize.noOfRows),
      ];
      this.food = new Food(newFoodPosition, Math.ceil(Math.random() * 5));
    }
    this.snake.move();
    this.ghostSnake.move();
  }
  turnSnake(turnDirection) {
    const turners = {
      left: () => this.snake.turnLeft(),
      right: () => this.snake.turnRight(),
    };
    turners[turnDirection]();
  }
  isOver() {
    return this.snake.hasTouchItself() || this.snake.hasTouch(this.gridSize);
  }
}
