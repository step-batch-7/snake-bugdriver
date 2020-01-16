const GRID_ID = 'grid';

const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

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

const createGrids = function(gridSize) {
  const { noOfCols, noOfRows } = gridSize;
  const grid = getGrid();
  for (let y = 0; y < noOfRows; y++) {
    for (let x = 0; x < noOfCols; x++) {
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

const eraseEatenFood = function(eatenFood) {
  const [colId, rowId] = eatenFood.location;
  const cell = getCell(colId, rowId);
  cell.classList.remove(eatenFood.getState().type);
};

const drawScoreBoard = function(score) {
  scoreCard.innerText = `SCORE : ${score}`;
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};
const drawFood = function(food) {
  const { position, type, point } = food;
  const [colId, rowId] = position;
  const cell = getCell(colId, rowId);
  cell.classList.add(type);
};
const drawGame = function(game) {
  const { snake, ghostSnake, food, score } = game.getState();
  renderSnake(snake);
  renderSnake(ghostSnake);
  eraseEatenFood(snake.eatenFood);
  drawFood(food);
  drawScoreBoard(score);
};

const handleKeyPress = (event, game) => {
  const keyTurnCmds = { 37: 'left', 39: 'right' };
  const turnDirection = keyTurnCmds[event.keyCode];
  turnDirection && game.turnSnake(turnDirection);
};

const attachEventListeners = game => {
  document.body.onkeydown = () => handleKeyPress(event, game);
};

const initSnake = gridSize => {
  const snakePositions = [
    [40, 25],
    [41, 25],
    [42, 25],
  ];
  return new Snake(snakePositions, new Direction(EAST), 'snake');
};

const initGhostSnake = gridSize => {
  const ghostSnakePositions = [
    [40, 30],
    [41, 30],
    [42, 30],
  ];
  return new Snake(ghostSnakePositions, new Direction(SOUTH), 'ghost');
};

const startGame = function(game) {
  const interval = setInterval(() => {
    if (game.isOver()) {
      clearInterval(interval);
      alert('game over');
    }
    game.update();
    drawGame(game);
  }, 100);
};

const main = function() {
  const gridSize = { noOfCols: 100, noOfRows: 60 };
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food([50, 25], 'food');
  createGrids(gridSize);
  const game = new Game(snake, ghostSnake, food, gridSize);
  drawGame(game);
  attachEventListeners(game);
  startGame(game);
  setInterval(() => {
    let x = Math.random() * 100;
    if (x > 1) {
      ghostSnake.turnLeft();
    }
  }, 500);
};
