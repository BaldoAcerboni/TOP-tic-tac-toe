const gameboard = (function () {
  const _board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  function getBoard() {
    return _board;
  }

  function clearBoard() {
    for (let i = 0; i < _board.length; i++) {
      _board[i] = [0, 0, 0];
    }
  }

  function updateBoard(row, col, player) {
    if (_board[row][col] === 0) {
      _board[row][col] = player.sign;
    }
  }

  return {
    getBoard,
    clearBoard,
    updateBoard,
  };
})();

const players = (function () {
  const playerOne = {
    id: 1,
    sign: "O",
    turn: true,
    userStatus: "player",
  };

  const playerTwo = {
    id: 2,
    sign: "X",
    turn: false,
    userStatus: "player",
  };

  const getP1 = () => playerOne;
  const getP2 = () => playerTwo;

  function swapActivePlayer() {
    playerOne.turn = !playerOne.turn;
    playerTwo.turn = !playerTwo.turn;
  }

  function resetActivePlayer() {
    playerOne.turn = true;
    playerTwo.turn = false;
  }

  return { getP1, getP2, swapActivePlayer, resetActivePlayer };
})();

const game = (function () {
  let _gameOver = false;
  let _roundcount = 0;

  function increaseRound() {
    _roundcount++;
  }

  function getRound() {
    return _roundcount;
  }

  function resetRoundCount() {
    _roundcount = 0;
  }

  function playRound(row, col) {
    const board = gameboard.getBoard();
    if (!board[row][col]) {
      increaseRound();
      const p1 = players.getP1();
      const p2 = players.getP2();
      if (p1.turn) {
        gameboard.updateBoard(row, col, p1);
      } else {
        gameboard.updateBoard(row, col, p2);
      }
      players.swapActivePlayer();
      checkWinner();
    }
  }

  function checkWinner() {
    console.log("chicken dinner");
    const board = gameboard.getBoard();
    const player1 = players.getP1();
    const player2 = players.getP2();
    const round = game.getRound();
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j]) {
          if (
            board[i][j] === board[i][j + 1] &&
            board[i][j] === board[i][j + 2] &&
            j === 0
          ) {
            if (board[i][j] === player1.sign) {
              console.log("player one wins");
            } else {
              console.log("player two wins");
            }
            setGameOver();
            return;
          } else if (
            i === 0 &&
            board[i][j] === board[i + 1][j] &&
            board[i][j] === board[i + 2][j]
          ) {
            if (board[i][j] === player1.sign) {
              console.log("player one wins");
            } else {
              console.log("player two wins");
            }
            setGameOver();
            return;
          } else if (
            i === 0 &&
            j === 0 &&
            board[1][1] === board[i][j] &&
            board[i][j] === board[2][2]
          ) {
            if (board[i][j] === player1.sign) {
              console.log("player one wins");
            } else {
              console.log("player two wins");
            }
            setGameOver();
            return;
          } else if (
            i === 0 &&
            j === 2 &&
            board[1][1] === board[i][j] &&
            board[i][j] === board[2][0]
          ) {
            if (board[i][j] === player1.sign) {
              console.log("player one wins");
            } else {
              console.log("player two wins");
            }
            setGameOver();
            return;
          }
        }
      }
    }
    if (round === 9) {
      setGameOver();
      return console.log("draw");
    }
    return false;
  }

  function setGameOver() {
    resetRoundCount();
    players.resetActivePlayer();
    gameboard.clearBoard();
  }

  return {
    increaseRound,
    getRound,
    resetRoundCount,
    checkWinner,
    playRound,
    setGameOver,
  };
})();
