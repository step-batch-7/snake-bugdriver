const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

class Game {
  constructor(snake, ghostSnake, food) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
  }
  getState() {
    return {
      snake: {
        location: this.snake.location,
        species: this.snake.species,
        previousTail: this.snake.previousTail,
        eatenFood: this.snake.eatenFood,
      },
      ghostSnake: {
        location: this.ghostSnake.location,
        species: this.ghostSnake.species,
        previousTail: this.ghostSnake.previousTail,
      },
      food: {
        location: this.food.location,
      },
    };
  }
  update() {
    if (this.snake.eat(this.food)) {
      const [foodX, foodY] = [Math.random];
      this.food = new Food([
        Math.floor(Math.random() * NUM_OF_COLS),
        Math.floor(Math.random() * NUM_OF_ROWS),
      ]);
    }
    this.snake.move();
    this.ghostSnake.move();
  }
  turnSnake(turnDirection) {
    console.log(turnDirection);
    const turners = {
      left: () => this.snake.turnLeft(),
      right: () => this.snake.turnRight(),
    };
    turners[turnDirection]();
  }
}

class Direction {
  constructor(initialHeading) {
    this.heading = initialHeading;
    this.deltas = {};
    this.deltas[EAST] = [1, 0];
    this.deltas[WEST] = [-1, 0];
    this.deltas[NORTH] = [0, -1];
    this.deltas[SOUTH] = [0, 1];
  }

  get delta() {
    return this.deltas[this.heading];
  }

  turnLeft() {
    this.heading = (this.heading + 1) % 4;
  }

  turnRight() {
    this.heading = (this.heading + 3) % 4;
  }
}
class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
    this.eatenFood = [];
  }

  get location() {
    return this.positions.slice();
  }

  get species() {
    return this.type;
  }

  eat(food) {
    const [snakeHeadX, snakeHeadY] = this.location[this.location.length - 1];
    const [foodX, foodY] = food.location;
    if (snakeHeadX == foodX && snakeHeadY == foodY) {
      this.eatenFood.push(food);
      this.positions.unshift(this.previousTail);
      const [deltaX, deltaY] = this.direction.delta;
      this.previousTail = [
        this.previousTail[0] - deltaX,
        this.previousTail[1] - deltaY,
      ];
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
}

class Food {
  constructor(position, potential) {
    this.position = position.slice();
    this.potential = potential;
  }

  get location() {
    return this.position.slice();
  }
}

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + '_' + rowId;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const renderSnake = function(snake) {
  eraseTail(snake);
  drawSnake(snake);
};

const drawGame = function(game) {
  const { snake, ghostSnake, food } = game.getState();
  renderSnake(snake);
  renderSnake(ghostSnake);
  eraseEatenFood(snake.eatenFood);
  drawFood(food);
};

const eraseEatenFood = function(eatenFood) {
  console.log(eatenFood);
  eatenFood.forEach(food => {
    const [colId, rowId] = food.location;
    const cell = getCell(colId, rowId);
    cell.classList.remove('food');
  });
};
const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const drawFood = function(food) {
  const [colId, rowId] = food.location;
  const cell = getCell(colId, rowId);
  cell.classList.add('food');
};

const handleKeyPress = (event, game) => {
  const keyTurnCmds = { 37: 'left', 39: 'right' };
  const turnDirection = keyTurnCmds[event.keyCode];
  turnDirection && game.turnSnake(turnDirection);
};

const attachEventListeners = game => {
  document.body.onkeydown = () => handleKeyPress(event, game);
};

const initSnake = () => {
  const snakePositions = [
    [40, 25],
    [41, 25],
    [42, 25],
  ];
  return new Snake(snakePositions, new Direction(EAST), 'snake');
};

const initGhostSnake = () => {
  const ghostSnakePositions = [
    [40, 30],
    [41, 30],
    [42, 30],
  ];
  return new Snake(ghostSnakePositions, new Direction(SOUTH), 'ghost');
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food([5, 5], 2);

  createGrids();
  const game = new Game(snake, ghostSnake, food);
  drawGame(game);
  attachEventListeners(game);

  setInterval(() => {
    game.update();
    drawGame(game);
  }, 100);

  setInterval(() => {
    let x = Math.random() * 100;
    if (x > 50) {
      ghostSnake.turnLeft();
    }
  }, 500);
};
