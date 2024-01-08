const Gameboard = (function () {
  const _gameboard = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  function isGameOver() {
    let gameOver = false;
    let winner = 0;
    for (let i = 0; i < 3; i++) {
      if (
        _gameboard[i][0] &&
        _gameboard[i][0] === _gameboard[i][1] &&
        _gameboard[i][0] === _gameboard[i][2]
      ) {
        gameOver = true;
        winner = _gameboard[i][0];
        console.log(`The winner is player${winner}`);
      } else if (
        _gameboard[0][i] &&
        _gameboard[0][i] === _gameboard[i][1] &&
        _gameboard[0][i] === _gameboard[i][2]
      ) {
        gameOver = true;
        winner = _gameboard[0][i];
        console.log(`The winner is player${winner}`);
      }
    }
  }

  function updateGameboard(player, row, col) {
    if (_gameboard[row][col]) {
      console.log(
        `Position ${(row, col)} has already been selected by player${
          _gameboard[row][col]
        }`
      );
    } else {
      _gameboard[row][col] = player;
      console.log(
        `Player ${player} has selected the row nr ${row} and column nr ${col}`
      );
      isGameOver();
    }
  }

  function getGameboard() {
    console.log(_gameboard);
    return _gameboard;
  }

  return { updateGameboard, getGameboard };
})();

const players = {
  player1: 1,
  player2: 2,
};

Gameboard.updateGameboard(players.player1, 2, 0);
Gameboard.updateGameboard(players.player1, 2, 1);
Gameboard.updateGameboard(players.player1, 2, 2);
Gameboard.getGameboard();
