const Gameboard = (function () {
  let _gameboard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  let _round = 0;

  const updateGameboard = function (player, row, col) {
    if (_gameboard[row][col]) {
      console.log(
        `Position ${row} ${col} has already been selected by player${_gameboard[row][col]}`
      );
    } else {
      _round++;
      _gameboard[row][col] = player;
      console.log(
        `Player ${player} has selected the row nr ${row} and column nr ${col}`
      );
      game.isGameOver();
    }
  };

  const getGameboard = () => _gameboard;

  const clearBoard = function () {
    _gameboard = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
  };

  const getRound = () => _round;

  return { updateGameboard, getGameboard, clearBoard, getRound };
})();

const players = {
  player1: 1,
  player2: 2,
};
const game = (function () {
  let gameOver = false;
  let winner = 0;

  const isGameOver = function () {
    const board = Gameboard.getGameboard();
    let roundPlayed = Gameboard.getRound();
    if (board[1][1]) {
      if (
        (board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
        (board[0][2] === board[1][1] && board[1][1] === board[2][0])
      ) {
        gameOver = true;
        winner = board[1][1];
        console.log(`The winner is player${winner}`);
        Gameboard.clearBoard();
      }
    }
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] &&
        board[i][0] === board[i][1] &&
        board[i][0] === board[i][2]
      ) {
        gameOver = true;
        winner = board[i][0];
        console.log(`The winner is player${winner}`);
        Gameboard.clearBoard();
      } else if (
        board[0][i] &&
        board[0][i] === board[1][i] &&
        board[0][i] === board[2][i]
      ) {
        gameOver = true;
        winner = board[0][i];
        console.log(`The winner is player${winner}`);
        Gameboard.clearBoard();
      }
    }
    if (!gameOver && roundPlayed === 9) {
      gameOver = true;
      console.log(`The game ends in a draw`);
      Gameboard.clearBoard();
    }
  };

  return { isGameOver };
})();

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
i understood nothing, on how the browser processes stuff, or there is somenthing really weird going on)
by clearBoard if i execute all the above commands at the same time but not if i go step by step,
in that case it works as intended in the sources tab so let us hope that the app works in the DOM because 
i would not even know what i am doing wrong, i hope it is JS just being JS or maybe some browser shenannigans(chrome)
*/
