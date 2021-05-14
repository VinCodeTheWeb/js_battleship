class Game {
  constructor() {
    this.table = document.querySelectorAll('td');
    this.board = [];
    this.winningPatterns = [];
    this.battleship = { type: 'battleship', length: 5 };
    this.destroyer = { type: 'destroyer', length: 4 };
    this.default = {
      isWinner: false,
      maxlength: 9,
      startColumn: 0,
      endColumn: 0,
      horizontal: 0,
      vertical: 1,
      nOfPositions: 2,
    };
  }

  createMatrix() {
    const matrix = [];

    for (let i = 0; i < this.table.length; i++) {
      const last = matrix[matrix.length - 1];

      if (!last || last.length === 9) {
        matrix.push([]);
      } else {
        last.push(0);
      }
    }

    this.board = matrix;
  }

  checker(coords) {
    for (let x = 0; x < this.winningPatterns.length; x++) {
      for (let y = 0; y < this.winningPatterns[x].length; y++) {
        if (
          this.winningPatterns[x][y].x === coords.x &&
          this.winningPatterns[x][y].y === coords.y
        ) {
          this.winningPatterns[x][y] = true;
        }
      }
    }

    return !this.winningPatterns.length;
  }

  isSunk() {
    for (let i = 0; i < this.winningPatterns.length; i++) {
      const shipSunk = this.winningPatterns[i].every((isTrue) => isTrue === true);

      if (shipSunk) {
        this.winningPatterns.splice(i, 1);

        return true;
      }
    }

    return false;
  }

  setBoard(ship) {
    let x;
    let y;
    const randRow = Math.floor(Math.random() * this.board.length);
    const randCol = Math.floor(Math.random() * this.board.length);
    const randPosition = Math.floor(Math.random() * this.default.nOfPositions);

    this.startColumn = randCol;
    this.endColumn = this.startColumn + ship.length;

    if (this.startColumn + this.endColumn > this.default.maxlength) {
      return this.setBoard(ship);
    }

    const coords = [];

    for (let column = this.startColumn; column < this.endColumn; column++) {
      x = randRow;
      y = column;

      if (randPosition === this.default.vertical) {
        x = column;
        y = randRow;
      }

      if (this.board[x][y] === 1) {
        return this.setBoard(ship);
      }

      coords.push({ x, y });
    }

    for (let coord of coords) {
      this.board[coord.x][coord.y] = 1;
    }

    this.winningPatterns.push(coords);
  }

  init() {
    this.createMatrix();
    this.setBoard(this.destroyer);
    this.setBoard(this.destroyer);
    this.setBoard(this.battleship);
    this.fire();
  }

  fire() {
    for (let x = 0; x < this.board.length; x++) {
      for (let y = 0; y < this.board[x].length + 1; y++) {
        document.getElementById(`${x}${y}`).addEventListener('click', () => {
          if (this.default.isWinner) return;

          if (this.board[x][y] === 1) {
            document.getElementById(`${x}${y}`).classList = 'hits';

            this.checker({ x, y });

            this.message(`It is a ${this.isSunk() ? 'sunk!' : 'hit!'}`);

            if (this.checker({ x, y })) {
              this.message('You win! Well Done!');
              this.default.isWinner = true;
            }
          } else {
            document.getElementById(`${x}${y}`).classList = 'miss';
            this.message('It is a miss!');
          }
        });
      }
    }
  }

  message(text) {
    const messageArea = document.getElementById('messageArea');

    messageArea.textContent = text;
  }
}

const battleshipGame = new Game();
battleshipGame.init();
