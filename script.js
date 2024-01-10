const clearBtn = document.getElementById("clear");
const cells = document.querySelectorAll(".cell");

const Gameboard = (function () {
  let _gameboard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  let _round = 0;

  const updateGameboard = function (player, row, col) {
    _round++;
    _gameboard[row][col] = player;
    game.isGameOver();
  };

  const getGameboard = () => _gameboard;

  const clearBoard = function () {
    _gameboard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    game.resetWinner();
  };

  const getRound = () => _round;

  return { updateGameboard, getGameboard, clearBoard, getRound };
})();

const Players = (function () {
  const player1 = {
    id: 1,
    symbol: "O",
  };
  const player2 = {
    id: 2,
    symbol: "X",
  };

  const getP1 = () => player1;
  const getP2 = () => player2;

  return { getP1, getP2 };
})();

const game = (function () {
  let gameOver = false;
  let _winner = 0;

  const isGameOver = function () {
    const board = Gameboard.getGameboard();
    let roundPlayed = Gameboard.getRound();
    if (board[1][1]) {
      if (
        (board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
        (board[0][2] === board[1][1] && board[1][1] === board[2][0])
      ) {
        gameOver = true;
        _winner = board[1][1];
        Gameboard.clearBoard(); //necessary??
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
        Gameboard.clearBoard(); //necessary??
      } else if (
        board[0][i] &&
        board[0][i] === board[1][i] &&
        board[0][i] === board[2][i]
      ) {
        gameOver = true;
        _winner = board[0][i];
        displayController.gameOverDisplay();
        Gameboard.clearBoard(); //necessary??
      }
    }
    if (_winner === 0 && roundPlayed === 9) {
      gameOver = true;
      displayController.gameOverDisplay();
      Gameboard.clearBoard(); //necessary??
    }
  };

  const getWinner = () => _winner;
  const resetWinner = () => {
    _winner = 0;
  };

  return { isGameOver, getWinner, resetWinner };
})();

const displayController = (function () {
  const p1 = Players.getP1();
  const p2 = Players.getP2();
  const msg = document.getElementById("msg");

  const p1Move = function (e) {
    const pos = e.target.id.split("-");
    const posX = Number(pos[0]);
    const posY = Number(pos[1]);
    const boardSituation = Gameboard.getGameboard();

    if (boardSituation[posX][posY] === 0) {
      e.target.textContent = p1.symbol;
      Gameboard.updateGameboard(p1.id, posX, posY);

      Array.from(cells).forEach((cell) => {
        cell.removeEventListener("click", displayController.p1Move);
      });

      Array.from(cells).forEach((cell) => {
        cell.addEventListener("click", displayController.p2Move);
      });
    } else {
      msg.textContent = `Position has already been selected by player${boardSituation[posX][posY]}`;
    }
  };

  const p2Move = function (e) {
    const pos = e.target.id.split("-");
    const posX = Number(pos[0]);
    const posY = Number(pos[1]);
    const boardSituation = Gameboard.getGameboard();

    if (boardSituation[posX][posY] === 0) {
      e.target.textContent = p2.symbol;
      Gameboard.updateGameboard(p2.id, posX, posY);

      Array.from(cells).forEach((cell) => {
        cell.removeEventListener("click", displayController.p2Move);
      });

      Array.from(cells).forEach((cell) => {
        cell.addEventListener("click", displayController.p1Move);
      });
    } else {
      msg.textContent = `Position has already been selected by player${boardSituation[posX][posY]}`;
    }
  };

  const clearDisplay = function () {
    Gameboard.clearBoard();
    Array.from(cells).forEach((cell) => {
      cell.textContent = "";
    });
    msg.textContent = "";
  };

  const gameOverDisplay = function () {
    const winner = game.getWinner();
    if (winner) {
      msg.textContent = `The winner is player${winner}`;
    } else {
      msg.textContent = `The game ends in a draw`;
    }
  };

  return { p1Move, p2Move, clearDisplay, gameOverDisplay };
})();

Array.from(cells).forEach((cell) => {
  cell.addEventListener("click", displayController.p1Move);
});

clearBtn.addEventListener("click", displayController.clearDisplay);

/*
TO DO LIST:
FIX
the Gameboard.clearBoard() function call is probably in too many places, need to optimize;
after game over the event listener need to be disabled, and re-enabled after clear btn;
round counter needs to be put inside game instead of Gameboard + add getter and setter(reset);
NEW FEATURE:
need to build AI player from scratch, with difficulty settings(?);
 */

//console.log(document.getElementById("0-0").id.split("-"));//REMEMBER it returns a string!!
/*
Gameboard.updateGameboard(players.player1, 0, 0);
Gameboard.updateGameboard(players.player2, 1, 1);
Gameboard.updateGameboard(players.player1, 0, 1);
Gameboard.updateGameboard(players.player2, 1, 0);
console.log(Gameboard.getGameboard());
Gameboard.updateGameboard(players.player1, 0, 2); //chicken dinner player1
console.log(Gameboard.getGameboard());
Gameboard.updateGameboard(players.player2, 1, 2);
Gameboard.updateGameboard(players.player1, 2, 0);
Gameboard.updateGameboard(players.player2, 2, 1);
console.log(Gameboard.getGameboard());
Gameboard.updateGameboard(players.player1, 2, 2);
console.log(Gameboard.getGameboard()); 

//console.log(Gameboard.getGameboard());
the _gameBoard array gets messed up retroactively(ln 98 gets affected by what happens in ln99, which either means 
i understood nothing on how the browser processes stuff, or there is somenthing really weird going on)
by clearBoard if i execute all the above commands at the same time but not if i go step by step,
in that case it works as intended in the sources tab so let us hope that the app works in the DOM because 
i would not even know what i am doing wrong, i hope it is JS just being JS or maybe some browser shenannigans(chrome)
*/
