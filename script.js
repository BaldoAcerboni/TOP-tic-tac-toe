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
    console.log("first");

    if (board[1][1]) {
      if (
        (board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
        (board[0][2] === board[1][1] && board[1][1] === board[2][0])
      ) {
        gameOver = true;
        _winner = board[1][1];
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
      } else if (
        board[0][i] &&
        board[0][i] === board[1][i] &&
        board[0][i] === board[2][i]
      ) {
        gameOver = true;
        _winner = board[0][i];
      }
    }
    if (_winner === 0 && _roundCount === 9) {
      gameOver = true;
    }
    if (gameOver) {
      displayController.gameOverDisplay();
      Array.from(cells).forEach((cell) => {
        cell.removeEventListener("click", displayController.playerMove);
      });
      console.log("last");
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
  const board = Gameboard.getGameboard();

  const winningMove = function (playerId) {
    let win = false;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const boardCopy = [];
        for (let k = 0; k < 3; k++) {
          boardCopy[k] = board[k].slice(0);
        }
        if (boardCopy[i][j] === 0) {
          boardCopy[i][j] = playerId;

          //the crap below is basically a repetition of part of game.isGameOver function
          //need to optimize when i got it working properly
          if (boardCopy[1][1] === playerId) {
            if (
              (boardCopy[0][0] === boardCopy[1][1] &&
                boardCopy[1][1] === boardCopy[2][2]) ||
              (boardCopy[0][2] === boardCopy[1][1] &&
                boardCopy[1][1] === boardCopy[2][0])
            ) {
              win = true;
            }
          }
          for (let i = 0; i < 3; i++) {
            if (
              boardCopy[i][0] === playerId &&
              boardCopy[i][0] === boardCopy[i][1] &&
              boardCopy[i][0] === boardCopy[i][2]
            ) {
              win = true;
            } else if (
              boardCopy[0][i] === playerId &&
              boardCopy[0][i] === boardCopy[1][i] &&
              boardCopy[0][i] === boardCopy[2][i]
            ) {
              win = true;
            }
          }
        }
        if (win) {
          console.log([i, j]);
          return [i, j];
        }
      }
    }
    return false;
  };

  //need to put AI selector inside displayController
  const move = (/* difficulty(?) */) => {
    const round = game.getRoundNr();
    const userWin = winningMove(userPlayer.id);
    const AIWin = winningMove(AIPlayer.id);
    const random = randomMove();

    if (round === 0) {
      Gameboard.updateGameboard(AIPlayer.id, 0, 0);
      document.getElementById(`0-0`).textContent = AIPlayer.symbol;
    } else if (round === 2) {
      if (board[0][2] === 0 && board[0][1] === 0) {
        Gameboard.updateGameboard(AIPlayer.id, 0, 2);
        document.getElementById(`0-2`).textContent = AIPlayer.symbol;
      } else {
        Gameboard.updateGameboard(AIPlayer.id, 2, 0);
        document.getElementById(`2-0`).textContent = AIPlayer.symbol;
      }
    } else if (round === 4) {
      if (AIWin) {
        Gameboard.updateGameboard(AIPlayer.id, AIWin[0], AIWin[1]);
        document.getElementById(`${AIWin[0]}-${AIWin[1]}`).textContent =
          AIPlayer.symbol;
      } else if (userWin) {
        Gameboard.updateGameboard(AIPlayer.id, userWin[0], userWin[1]);
        document.getElementById(`${userWin[0]}-${userWin[1]}`).textContent =
          AIPlayer.symbol;
      } else if (board[2][2] === 0) {
        Gameboard.updateGameboard(AIPlayer.id, 2, 2);
        document.getElementById(`2-2`).textContent = AIPlayer.symbol;
      } else {
        Gameboard.updateGameboard(AIPlayer.id, 2, 0);
        document.getElementById(`2-0`).textContent = AIPlayer.symbol;
      }
    } else if (round > 4) {
      if (AIWin) {
        Gameboard.updateGameboard(AIPlayer.id, AIWin[0], AIWin[1]);
        document.getElementById(`${AIWin[0]}-${AIWin[1]}`).textContent =
          AIPlayer.symbol;
      } else if (userWin) {
        Gameboard.updateGameboard(AIPlayer.id, userWin[0], userWin[1]);
        document.getElementById(`${userWin[0]}-${userWin[1]}`).textContent =
          AIPlayer.symbol;
      } else {
        Gameboard.updateGameboard(AIPlayer.id, random[0], random[1]);
        document.getElementById(`${random[0]}-${random[1]}`).textContent =
          AIPlayer.symbol;
      }
    }

    displayController.playerMoveAddEventListener();
  };
  const randomMove = function () {
    const possibleMoves = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === 0) {
          possibleMoves.push([i, j]);
        }
      }
    }
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  };
  return { move };
})();

const displayController = (function () {
  const p1 = Players.getP1();
  const p2 = Players.getP2();

  const msg = document.getElementById("msg");

  const whichPlayer = () => {
    if (p1.turn) {
      const player = p1;
      return player;
    } else {
      const player = p2;
      return player;
    }
  };

  const playerMoveAddEventListener = function () {
    Array.from(cells).forEach((cell) => {
      cell.addEventListener("click", playerMove);
    });
  };
  const playerMoveRemoveEventListener = function () {
    Array.from(cells).forEach((cell) => {
      cell.removeEventListener("click", playerMove);
    });
  };

  const playerMove = function (e) {
    const pos = e.target.id.split("-");
    const posX = Number(pos[0]);
    const posY = Number(pos[1]);
    const boardSituation = Gameboard.getGameboard();

    if (boardSituation[posX][posY] === 0) {
      e.target.textContent = whichPlayer().symbol;
      msg.textContent = "";
      Gameboard.updateGameboard(whichPlayer().id, posX, posY);
    } else {
      msg.textContent = `Position has already been selected by player${boardSituation[posX][posY]}`;
      return;
    }
    if (p1.userStatus === "AI" || p2.userStatus === "AI") {
      if (whichPlayer().userStatus === "AI") {
        playerMoveRemoveEventListener();
        AILogic.move();
      }
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
      cell.addEventListener("click", displayController.playerMove);
    });
  };

  const gameOverDisplay = function () {
    const winner = game.getWinner();
    console.log(winner);
    if (winner) {
      console.log(`The winner is player${winner}`);
      msg.textContent = `The winner is player${winner}`;
    } else {
      msg.textContent = `The game ends in a draw`;
    }
  };

  return {
    playerMove,
    clearDisplay,
    gameOverDisplay,
    playerMoveAddEventListener,
  };
})();

/* Array.from(cells).forEach((cell) => {
  cell.addEventListener("click", displayController.playerMove);
}); */

AILogic.move();

clearBtn.addEventListener("click", displayController.clearDisplay);

/*
TO DO LIST:
FIX
make logic for AI when user starts game
all HTML and CSS for pvp/pve setting
try messing about and find bugs
delete all console.log() calls
NEW FEATURE:
difficulty settings;
 */
