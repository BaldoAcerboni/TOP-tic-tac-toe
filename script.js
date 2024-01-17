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
    userStatus: "player",
  };
  const player2 = {
    id: 2,
    symbol: "X",
    turn: false,
    userStatus: "player",
  };

  const getP1 = () => player1;
  const getP2 = () => player2;

  const switchTurn = () => {
    player1.turn = !player1.turn;
    player2.turn = !player2.turn;
  };
  const resetTurn = () => {
    player1.turn = true;
    player2.turn = false;
  };

  const setUserStatus = function (p1, p2) {
    player1.userStatus = p1;
    player2.userStatus = p2;
  };
  const getAI = function () {
    if (player1.userStatus === "AI") {
      return player1;
    } else {
      return player2;
    }
  };
  const getUser = function () {
    if (player1.userStatus === "player") {
      return player1;
    } else {
      return player2;
    }
  };

  return { getP1, getP2, switchTurn, setUserStatus, resetTurn, getAI, getUser };
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

  const crossCheck = function (board) {
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
      return [true, 0];
    } else if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
      return [true, 1];
    }
  };
  const rowCheck = function (board) {
    for (let row = 0; row < 3; row++) {
      if (
        board[row][0] &&
        board[row][0] === board[row][1] &&
        board[row][0] === board[row][2]
      ) {
        return [true, row];
      }
    }
  };
  const colCheck = function (board) {
    for (let col = 0; col < 3; col++) {
      if (
        board[0][col] &&
        board[0][col] === board[1][col] &&
        board[0][col] === board[2][col]
      ) {
        return [true, col];
      }
    }
  };

  const isGameOver = function () {
    const board = Gameboard.getGameboard();

    if (board[1][1]) {
      const crossWin = crossCheck(board);
      if (crossWin) {
        gameOver = crossWin[0];
        _winner = board[1][1];
        displayController.winningCellsColorChange("cross", crossWin[1]);
      }
    }
    if (board[0][0] || board[1][0] || board[2][0]) {
      const rowWin = rowCheck(board);
      if (rowWin) {
        const whichRow = rowWin[1];
        gameOver = rowWin[0];
        _winner = board[whichRow][0];
        displayController.winningCellsColorChange("row", whichRow);
      }
    }
    if (board[0][0] || board[0][1] || board[0][2]) {
      const colWin = colCheck(board);
      if (colWin) {
        const whichCol = colWin[1];
        gameOver = colWin[0];
        _winner = board[0][whichCol];
        displayController.winningCellsColorChange("col", whichCol);
      }
    }
    if (_winner === 0 && _roundCount === 9) {
      gameOver = true;
    }
    if (gameOver) {
      displayController.gameOverDisplay();
    }
  };

  const getGameOverStatus = () => gameOver;
  const resetGameOver = () => {
    gameOver = false;
  };

  const getWinner = () => _winner;
  const resetWinner = () => {
    _winner = 0;
  };
  const resetRound = () => {
    _roundCount = 0;
  };

  return {
    getGameOverStatus,
    isGameOver,
    getWinner,
    resetWinner,
    getRoundNr,
    increaseRound,
    resetRound,
    resetGameOver,
    crossCheck,
    rowCheck,
    colCheck,
  };
})();

const AILogic = (function () {
  let _difficulty = "";

  const setDifficulty = function (dif) {
    _difficulty = dif;
  };

  const optimalOrRandom = function () {
    const value = Math.floor(Math.random() * 101);
    console.log(value);
    if (_difficulty === "U") {
      optimalMove();
    } else if (_difficulty === "H") {
      if (value < 65) {
        optimalMove();
      } else {
        playRandomMove();
      }
    } else if (_difficulty === "N") {
      if (value < 40) {
        optimalMove();
      } else {
        playRandomMove();
      }
    } else if (_difficulty === "E") {
      if (value < 10) {
        //TEMP FOR BUG CHECK
        optimalMove();
      } else {
        playRandomMove();
      }
    }
  };

  const winningMove = function (playerId) {
    const board = Gameboard.getGameboard();
    let win = false;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const boardCopy = [];

        //loop below(k) copies array of arrays(depth 2) without reference as to not mess up the original board array
        for (let k = 0; k < 3; k++) {
          boardCopy[k] = board[k].slice(0);
        }
        if (boardCopy[i][j] === 0) {
          boardCopy[i][j] = playerId;

          if (boardCopy[1][1] === playerId) {
            const crossWin = game.crossCheck(boardCopy); //
            if (crossWin) {
              gameOver = crossWin;
              win = boardCopy[1][1];
            }
          }
          if (
            boardCopy[0][0] === playerId ||
            boardCopy[1][0] === playerId ||
            boardCopy[2][0] === playerId
          ) {
            const rowWin = game.rowCheck(boardCopy); //
            if (rowWin) {
              const whichRow = rowWin[1];
              gameOver = rowWin[0];
              win = boardCopy[whichRow][0];
            }
          }
          if (
            boardCopy[0][0] === playerId ||
            boardCopy[0][1] === playerId ||
            boardCopy[0][2] === playerId
          ) {
            const colWin = game.colCheck(boardCopy); //
            if (colWin) {
              const whichCol = colWin[1];
              gameOver = colWin[0];
              win = boardCopy[0][whichCol];
            }
          }
        }
        if (win) {
          return [i, j];
        }
      }
    }
    return false;
  };

  const optimalMove = () => {
    const board = Gameboard.getGameboard();
    const round = game.getRoundNr();
    const AIPlayer = Players.getAI();
    const userPlayer = Players.getUser();

    //userWin AIWin and random are probably a bit redundant here since they are not used for the first few moves
    //but otherwise i would need to declare them each time i need them so since performance is not an issue
    //i would rather avoid the risk of typos, also this function is long enough already.
    const userWin = winningMove(userPlayer.id);
    const AIWin = winningMove(AIPlayer.id);
    const random = randomMove();

    //first few moves(when no player has a chance of victory) have a defined set of instructions,
    //otherwise always prioritize AIWin over userWin, worst case scenario go for random move
    if (round === 0) {
      Gameboard.updateGameboard(AIPlayer.id, 0, 0);
      document.getElementById(`0-0`).textContent = AIPlayer.symbol;
      document.getElementById(`0-0`).style.fontSize = "5rem";
    } else if (round === 1) {
      if (board[1][1] !== 0) {
        Gameboard.updateGameboard(AIPlayer.id, 0, 0);
        document.getElementById(`0-0`).textContent = AIPlayer.symbol;
        document.getElementById(`0-0`).style.fontSize = "5rem";
      } else {
        Gameboard.updateGameboard(AIPlayer.id, 1, 1);
        document.getElementById(`1-1`).textContent = AIPlayer.symbol;
        document.getElementById(`1-1`).style.fontSize = "5rem";
      }
    } else if (round === 2) {
      if (board[0][2] === 0 && board[0][1] === 0) {
        Gameboard.updateGameboard(AIPlayer.id, 0, 2);
        document.getElementById(`0-2`).textContent = AIPlayer.symbol;
        document.getElementById(`0-2`).style.fontSize = "5rem";
      } else {
        Gameboard.updateGameboard(AIPlayer.id, 2, 0);
        document.getElementById(`2-0`).textContent = AIPlayer.symbol;
        document.getElementById(`2-0`).style.fontSize = "5rem";
      }
    } else if (round === 3) {
      if (userWin) {
        Gameboard.updateGameboard(AIPlayer.id, userWin[0], userWin[1]);
        document.getElementById(`${userWin[0]}-${userWin[1]}`).textContent =
          AIPlayer.symbol;
        document.getElementById(`${userWin[0]}-${userWin[1]}`).style.fontSize =
          "5rem";
      } else if (board[0][1] === 0 && board[2][1] === 0) {
        Gameboard.updateGameboard(AIPlayer.id, 0, 1);
        document.getElementById(`0-1`).textContent = AIPlayer.symbol;
        document.getElementById(`0-1`).style.fontSize = "5rem";
      } else {
        Gameboard.updateGameboard(AIPlayer.id, 1, 0);
        document.getElementById(`1-0`).textContent = AIPlayer.symbol;
        document.getElementById(`1-0`).style.fontSize = "5rem";
      }
    } else if (round === 4) {
      if (AIWin) {
        Gameboard.updateGameboard(AIPlayer.id, AIWin[0], AIWin[1]);
        document.getElementById(`${AIWin[0]}-${AIWin[1]}`).textContent =
          AIPlayer.symbol;
        document.getElementById(`${AIWin[0]}-${AIWin[1]}`).style.fontSize =
          "5rem";
      } else if (userWin) {
        Gameboard.updateGameboard(AIPlayer.id, userWin[0], userWin[1]);
        document.getElementById(`${userWin[0]}-${userWin[1]}`).textContent =
          AIPlayer.symbol;
        document.getElementById(`${userWin[0]}-${userWin[1]}`).style.fontSize =
          "5rem";
      } else if (board[2][2] === 0) {
        Gameboard.updateGameboard(AIPlayer.id, 2, 2);
        document.getElementById(`2-2`).textContent = AIPlayer.symbol;
        document.getElementById(`2-2`).style.fontSize = "5rem";
      } else if (board[2][0] === 0) {
        Gameboard.updateGameboard(AIPlayer.id, 2, 0);
        document.getElementById(`2-0`).textContent = AIPlayer.symbol;
        document.getElementById(`2-0`).style.fontSize = "5rem";
      } else {
        Gameboard.updateGameboard(AIPlayer.id, random[0], random[1]);
        document.getElementById(`${random[0]}-${random[1]}`).textContent =
          AIPlayer.symbol;
        document.getElementById(`${random[0]}-${random[1]}`).style.fontSize =
          "5rem";
      }
    } else if (round > 4) {
      if (AIWin) {
        Gameboard.updateGameboard(AIPlayer.id, AIWin[0], AIWin[1]);
        document.getElementById(`${AIWin[0]}-${AIWin[1]}`).textContent =
          AIPlayer.symbol;
        document.getElementById(`${AIWin[0]}-${AIWin[1]}`).style.fontSize =
          "5rem";
      } else if (userWin) {
        Gameboard.updateGameboard(AIPlayer.id, userWin[0], userWin[1]);
        document.getElementById(`${userWin[0]}-${userWin[1]}`).textContent =
          AIPlayer.symbol;
        document.getElementById(`${userWin[0]}-${userWin[1]}`).style.fontSize =
          "5rem";
      } else {
        Gameboard.updateGameboard(AIPlayer.id, random[0], random[1]);
        document.getElementById(`${random[0]}-${random[1]}`).textContent =
          AIPlayer.symbol;
        document.getElementById(`${random[0]}-${random[1]}`).style.fontSize =
          "5rem";
      }
    }
    if (!game.getGameOverStatus()) {
      displayController.playerMoveAddEventListener();
    }
  };

  const randomMove = function () {
    const board = Gameboard.getGameboard();
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

  const playRandomMove = function () {
    const AIPlayer = Players.getAI();
    const random = randomMove();
    Gameboard.updateGameboard(AIPlayer.id, random[0], random[1]);
    document.getElementById(`${random[0]}-${random[1]}`).textContent =
      AIPlayer.symbol;
    document.getElementById(`${random[0]}-${random[1]}`).style.fontSize =
      "5rem";
    if (!game.getGameOverStatus()) {
      displayController.playerMoveAddEventListener();
    }
  };
  return { setDifficulty, optimalOrRandom };
})();

const displayController = (function () {
  //main display
  const cells = document.querySelectorAll(".cell");
  const newGameBtn = document.getElementById("new-game-btn");
  const msg = document.getElementById("msg");
  const gameInfo = document.getElementById("game-info");
  const P1activity = document.getElementById("P1");
  const P2activity = document.getElementById("P2");
  //new game display
  const gameModeSelect = document.getElementById("game-mode-btns");
  const singlePlayerBtn = document.getElementById("single-player-btn");
  const multiplayerBtn = document.getElementById("multiplayer-btn");
  const difficultySelect = document.getElementById("difficulty-select-btns");
  const easyBtn = document.getElementById("easy-btn");
  const normalBtn = document.getElementById("normal-btn");
  const hardBtn = document.getElementById("hard-btn");
  const unbeatableBtn = document.getElementById("unbeatable-btn");
  const playerSelect = document.getElementById("player-select-btns");
  const player1Btn = document.getElementById("player1-btn");
  const player2Btn = document.getElementById("player2-btn");
  const newGameMsg = document.getElementById("new-game-msg");
  const newGameDisplay = document.getElementById("new-game-display");

  const whichPlayer = () => {
    const p1 = Players.getP1();
    const p2 = Players.getP2();
    if (p1.turn) {
      const player = p1;
      return player;
    } else {
      const player = p2;
      return player;
    }
  };

  //event listener done this way because because i do not want to type the whole thing multiple times
  //i also need it in AIlogic
  const playerMoveAddEventListener = function () {
    Array.from(cells).forEach((cell) => {
      cell.addEventListener("click", playerMove);
    });
  };
  //event listener done this way because because i do not want to type the whole thing multiple times
  const playerMoveRemoveEventListener = function () {
    Array.from(cells).forEach((cell) => {
      cell.removeEventListener("click", playerMove);
    });
  };

  const multiplayerSelect = function () {
    Players.setUserStatus("player", "player");
    newGameDisplay.style.display = "none";
    gameInfo.textContent = "Multiplayer";
    gameInfo.style.top = "38%";
    displayController.playerMoveAddEventListener();
    P1activity.className = "active";
    newGameBtn.addEventListener("click", displayController.clearDisplay);
  };
  //event listener done this way because i need it in the global scope
  const multiplayerSelectEventListener = function () {
    multiplayerBtn.addEventListener("click", multiplayerSelect);
  };

  const singlePlayerSelect = function () {
    gameModeSelect.style.display = "none";
    difficultySelect.style.display = "block";
    newGameMsg.textContent = "Please select the game difficulty";
    gameInfo.textContent = `Single player`;
    gameInfo.style.top = "33%";
    easyBtn.addEventListener("click", easySelect);
    normalBtn.addEventListener("click", normalSelect);
    hardBtn.addEventListener("click", hardSelect);
    unbeatableBtn.addEventListener("click", unbeatableSelect);
  };
  //event listener done this way because i need it in the global scope
  const singlePlayerSelectEventListener = function () {
    singlePlayerBtn.addEventListener("click", singlePlayerSelect);
  };

  const easySelect = function () {
    difficultyToPlayerSelect("E");
    gameInfo.innerHTML += "<br>Easy";
  };
  const normalSelect = function () {
    difficultyToPlayerSelect("N");
    gameInfo.innerHTML += "<br>Normal";
  };
  const hardSelect = function () {
    difficultyToPlayerSelect("H");
    gameInfo.innerHTML += "<br>Hard";
  };
  const unbeatableSelect = function () {
    difficultyToPlayerSelect("U");
    gameInfo.innerHTML += "<br>Unbeatable";
  };

  const difficultyToPlayerSelect = function (difficulty) {
    difficultySelect.style.display = "none";
    playerSelect.style.display = "block";
    newGameMsg.textContent = "Please select which player you want to be";
    player1Btn.addEventListener("click", player1Select);
    player2Btn.addEventListener("click", player2Select);
    AILogic.setDifficulty(difficulty);
  };

  const player1Select = function () {
    Players.setUserStatus("player", "AI");
    newGameDisplay.style.display = "none";
    P1activity.className = "active";
    displayController.playerMoveAddEventListener();
    newGameBtn.addEventListener("click", displayController.clearDisplay);
  };
  const player2Select = function () {
    Players.setUserStatus("AI", "player");
    newGameDisplay.style.display = "none";
    P2activity.className = "active";
    AILogic.optimalOrRandom();
    newGameBtn.addEventListener("click", displayController.clearDisplay);
  };

  const playerMove = function (e) {
    const p1 = Players.getP1();
    const p2 = Players.getP2();
    const pos = e.target.id.split("-");
    const posX = Number(pos[0]);
    const posY = Number(pos[1]);
    const boardSituation = Gameboard.getGameboard();
    if (boardSituation[posX][posY] === 0) {
      e.target.textContent = whichPlayer().symbol;
      e.target.style.fontSize = "5rem";
      msg.textContent = "";
      Gameboard.updateGameboard(whichPlayer().id, posX, posY);
    } else {
      msg.textContent = `Position has already been selected by player ${boardSituation[posX][posY]}`;
      return;
    }
    if (p1.userStatus === "AI" || p2.userStatus === "AI") {
      if (whichPlayer().userStatus === "AI") {
        playerMoveRemoveEventListener();
        if (!game.getGameOverStatus()) {
          AILogic.optimalOrRandom();
        }
      }
    } else {
      document.getElementById(`P1`).classList.toggle("active");
      document.getElementById(`P2`).classList.toggle("active");
    }
  };

  const clearDisplay = function () {
    Array.from(cells).forEach((cell) => {
      cell.textContent = "";
      cell.style.fontSize = "1rem";
      cell.className = "cell";
    });
    msg.textContent = "";

    Gameboard.clearBoard();
    game.resetWinner();
    game.resetRound();
    game.resetGameOver();
    Players.resetTurn();

    P1activity.className = "";
    P2activity.className = "";
    newGameDisplay.style.display = "block";
    newGameMsg.textContent = "Please select a game mode";
    gameModeSelect.style.display = "block";
    playerSelect.style.display = "none";
  };

  const gameOverDisplay = function () {
    displayController.playerMoveRemoveEventListener();
    const winner = game.getWinner();
    if (winner) {
      msg.textContent = `The winner is player ${winner}`;
    } else {
      msg.textContent = `The game ends in a draw`;
    }
  };

  const winningCellsColorChange = function (type, num) {
    if (type === "cross") {
      if (num) {
        document.getElementById(`0-2`).classList += " win";
        document.getElementById(`1-1`).classList += " win";
        document.getElementById(`2-0`).classList += " win";
      } else {
        document.getElementById(`0-0`).classList += " win";
        document.getElementById(`1-1`).classList += " win";
        document.getElementById(`2-2`).classList += " win";
      }
    } else if (type === "row") {
      document.getElementById(`${num}-0`).classList += " win";
      document.getElementById(`${num}-1`).classList += " win";
      document.getElementById(`${num}-2`).classList += " win";
    } else if (type === "col") {
      document.getElementById(`0-${num}`).classList += " win";
      document.getElementById(`1-${num}`).classList += " win";
      document.getElementById(`2-${num}`).classList += " win";
    } else {
      console.log("something's wrong");
    }
  };

  return {
    playerMove,
    clearDisplay,
    gameOverDisplay,
    playerMoveAddEventListener,
    playerMoveRemoveEventListener,
    whichPlayer,
    multiplayerSelectEventListener,
    singlePlayerSelectEventListener,
    winningCellsColorChange,
  };
})();

displayController.multiplayerSelectEventListener();
displayController.singlePlayerSelectEventListener();

/*
DONE:
change .container layout from absolute positioning to flex-box(p tags)
winning cells color change + animation
add random move in AILogic.optimalMove as last condition inside round === 4 condition
 */
