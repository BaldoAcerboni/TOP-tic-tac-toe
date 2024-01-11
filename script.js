const clearBtn = document.getElementById("clear");
const cells = document.querySelectorAll(".cell");

const Gameboard = (function () {
  let _gameboard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const updateGameboard = function (player, row, col) {
    _gameboard[row][col] = player;
    game.increaseRound();
    game.isGameOver();
  };

  const getGameboard = () => _gameboard;

  const clearBoard = () => {
    _gameboard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  };

  return { updateGameboard, getGameboard, clearBoard };
})();

const Players = (function () {
  const player1 = {
    id: 1,
    symbol: "O",
    turn: true,
    userStatus: "AI", //REMEMBER TO CHANGE IT BACK TO undefined
  };
  const player2 = {
    id: 2,
    symbol: "X",
    turn: false,
    userStatus: "player", //REMEMBER TO CHANGE IT BACK TO undefined
  };

  const getP1 = () => player1;
  const getP2 = () => player2;

  const switchTurn = () => {
    player1.turn = !player1.turn;
    player2.turn = !player2.turn;
  };

  const setUserStatus = function (p1, p2) {
    player1.userStatus = p1;
    player2.userStatus = p2;
  };

  return { getP1, getP2, switchTurn, setUserStatus };
})();

const game = (function () {
  let gameOver = false;
  let _winner = 0;
  let _roundCount = 0;

  const getRoundNr = () => _roundCount;

  const increaseRound = () => {
    _roundCount++;
    Players.switchTurn();
  };

  const isGameOver = function () {
    const board = Gameboard.getGameboard();

    if (board[1][1]) {
      if (
        (board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
        (board[0][2] === board[1][1] && board[1][1] === board[2][0])
      ) {
        gameOver = true;
        _winner = board[1][1];
        displayController.gameOverDisplay();
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] &&
        board[i][0] === board[i][1] &&
        board[i][0] === board[i][2]
      ) {
        gameOver = true;
        _winner = board[i][0];
        displayController.gameOverDisplay();
      } else if (
        board[0][i] &&
        board[0][i] === board[1][i] &&
        board[0][i] === board[2][i]
      ) {
        gameOver = true;
        _winner = board[0][i];
        displayController.gameOverDisplay();
      }
    }
    if (_winner === 0 && _roundCount === 9) {
      gameOver = true;
      displayController.gameOverDisplay();
    }
    if (gameOver) {
      Array.from(cells).forEach((cell) => {
        cell.removeEventListener("click", displayController.userMovePvp);
      });
    }
  };

  const resetGameOver = () => {
    gameOver = false;
  };

  const getWinner = () => _winner;
  const resetWinner = () => {
    _winner = 0;
  };
  const resetRound = () => {
    _roundCount = 0;
    if (Players.getP1().turn === false) {
      Players.switchTurn();
    }
  };

  return {
    isGameOver,
    getWinner,
    resetWinner,
    getRoundNr,
    increaseRound,
    resetRound,
    resetGameOver,
  };
})();

const AILogic = (function () {
  const AIPlayer = Players.getP1(); //TEMP
  const userPlayer = Players.getP2(); //TEMP

  //create a copy without reference of multi-dimensional array, it might not create problems with all the protections
  //that factory functions guarantee but why risk it? Hopefully performance won't be an issue.
  //i don't even know if it is really necessary but i think i need it for the AI logic
  const createBoardCopy = function () {
    let boardCopy = [];
    for (let i = 0; i < 3; i++) {
      boardCopy[i] = board[i].slice(0);
    }
    return boardCopy;
  };

  //need to put AI selector inside displayController
  const move = (/* difficulty(?) */) => {
    const board = Gameboard.getGameboard();
    const round = game.getRoundNr();

    if (!round) {
      Gameboard.updateGameboard(AIPlayer, 0, 0);
      msg.textContent = "Player's turn";
      document.getElementById(`0-0`).textContent = AIPlayer.symbol;

      Array.from(cells).forEach((cell) => {
        cell.addEventListener("click", displayController.userMovePvp);
      });
    } else if (round === 2) {
      if (board[0][2] === 0) {
        Gameboard.updateGameboard(AIPlayer, 0, 0);
        msg.textContent = "Player's turn";
        document.getElementById(`0-2`).textContent = AIPlayer.symbol;
      }
    }
  };
  return { move };
})();

const displayController = (function () {
  const p1 = Players.getP1();
  const p2 = Players.getP2();

  const msg = document.getElementById("msg");

  //move based on two human players need pvp option
  const whichUser = () => {
    if (p1.turn) {
      const user = p1;
      return user;
    } else {
      const user = p2;
      return user;
    }
  };

  const userMovePvp = function (e) {
    const pos = e.target.id.split("-");
    const posX = Number(pos[0]);
    const posY = Number(pos[1]);
    const boardSituation = Gameboard.getGameboard();

    if (boardSituation[posX][posY] === 0) {
      e.target.textContent = whichUser().symbol;
      msg.textContent = "";
      Gameboard.updateGameboard(whichUser().id, posX, posY);
    } else {
      msg.textContent = `Position has already been selected by player${boardSituation[posX][posY]}`;
    }
  };

  //DRY MIA(when i got something working i'll fix it)
  const userMovePve = function (e) {
    const pos = e.target.id.split("-");
    const posX = Number(pos[0]);
    const posY = Number(pos[1]);
    const boardSituation = Gameboard.getGameboard();

    if (boardSituation[posX][posY] === 0) {
      e.target.textContent = whichUser().symbol;
      msg.textContent = "";
      Gameboard.updateGameboard(whichUser().id, posX, posY);

      Array.from(cells).forEach((cell) => {
        cell.removeEventListener("click");
      });
    } else {
      msg.textContent = `Position has already been selected by player${boardSituation[posX][posY]}`;
    }
  };

  const clearDisplay = function () {
    Array.from(cells).forEach((cell) => {
      cell.textContent = "";
    });
    msg.textContent = "";

    Gameboard.clearBoard();
    game.resetWinner();
    game.resetRound();
    game.resetGameOver();

    Array.from(cells).forEach((cell) => {
      cell.addEventListener("click", displayController.userMovePvp);
    });
  };

  const gameOverDisplay = function () {
    const winner = game.getWinner();
    if (winner) {
      msg.textContent = `The winner is player${winner}`;
    } else {
      msg.textContent = `The game ends in a draw`;
    }
  };

  return { userMovePvp, clearDisplay, gameOverDisplay };
})();

/* Array.from(cells).forEach((cell) => {
  cell.addEventListener("click", displayController.userMovePvp);
}); */

AILogic.move();

clearBtn.addEventListener("click", displayController.clearDisplay);

/*
TO DO LIST:
FIX
smash your head against the ai and find a somewhat doable solution
try messing about and find bugs
NEW FEATURE:
need to build AI player from scratch, with difficulty settings(?);
 */
