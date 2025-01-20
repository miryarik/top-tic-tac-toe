const Game = (() => {
    let board;

    let players = [
        {
            id: 1,
            mark: "X",
            winCount: 0,
        },
        {
            id: 2,
            mark: "O",
            winCount: 0,
        },
    ];

    function initBoard() {
        // initialize board as 3 x 3
        // each element is a cell

        const size = 3;
        board = [];

        for (let i = 0; i < size; i++) {
            board.push([]);

            for (let j = 0; j < size; j++) {
                board[i].push(cell());
            }
        }
    }

    function cell(mark = "") {
        // creates a cell object
        // a cell has :
        //      mark - default ''

        return {
            mark,
        };
    }

    function initPlayers(name1, name2) {
        // make two players
        // each with a name, mark, winCount = 0
        // one random player gets isMyTurn = true
        // other gets isMyTurn = false
        // declare who gets what mark
        // and who plays first

        if (board) {
            players[0].name = name1;
            players[1].name = name2;

            players[0].winCount = 0;
            players[1].winCount = 0;

            pickFirstMove();
        }
    }

    function pickFirstMove() {
        players.forEach((player) => {
            player.isMyTurn = false;
        });

        const randomIdx = Math.floor(Math.random() * 2);
        players[randomIdx].isMyTurn = true;
    }

    function start(name1, name2) {
        // initialises board with empty cells
        // sets players

        if (name1 && name2) {
            initBoard();
            initPlayers(name1, name2);
            DisplayHandler.renderBoard();
            DisplayHandler.renderScores();
        }
    }

    function markCell(i, j) {
        // handle cell mark and return true if it can be marked
        // if not return false
        // mark the cell as per cooridnates
        // with the mark of the player whose turn it is now
        // atm : board[i][j] is an object cell

        if (board && board[i][j].mark === "") {
            const turnPlayer = getWhoseTurn();
            board[i][j].mark = turnPlayer.mark;
            return true;
        } else {
            return false;
        }
    }

    function getWhoseTurn() {
        // get the player object whose turn it is now
        return players.find(player => player.isMyTurn);
    }

    function safelyGetWhoseTurn() {
        // to avoid exposing the players
        const playersCopy = players.map((player) => (
            {   
                mark : player.mark,
                name : player.name,
                isMyTurn : player.isMyTurn,
            }
        ));

        return playersCopy.find(player => player.isMyTurn);
    }


    function handleRoundEnd(i, j) {
        // return true if round end otherwise false
        // check if the current turn player has won
        // if yes, declare winner, increment win counts
        // and the reset board
        // else check if theres a die
        // if yes declare tie and reset board

        // player can only win on their turn
        // and the other player cannot win on this turn
        const turnPlayer = getWhoseTurn();
        let win = false;

        // there are only three ways to win on a turn
        //      row -> turnPlayer's mark is on all three j's of i
        if (
            board[i][0].mark === board[i][1].mark &&
            board[i][1].mark === board[i][2].mark &&
            board[i][0].mark !== ""
        ) {
            win = true;
        }

        //      column win -> turnPlayer's mark is on all three i's of j
        if (
            board[0][j].mark === board[1][j].mark &&
            board[1][j].mark === board[2][j].mark &&
            board[0][j].mark !== ""
        ) {
            win = true;
        }

        //      diagonal win -> turnPlayer's mark is on all three i,j : i = j
        if (
            ((board[0][0].mark === board[1][1].mark &&
                board[1][1].mark === board[2][2].mark) ||
                (board[0][2].mark === board[1][1].mark &&
                    board[1][1].mark === board[2][0].mark)) &&
            board[1][1].mark !== ""
        ) {
            win = true;
        }

        if (win) {
            const roundWinner = turnPlayer.name;

            DisplayHandler.renderBoard();

            // increment win count by 1 for winner
            // decrement win count by 1 for loser
            players.forEach((player) => {
                player.winCount += player === turnPlayer ? 1 : -1;
                player.winCount = player.winCount < 0 ? 0 : player.winCount;
                player.winCount = player.winCount > 3 ? 3 : player.winCount;
            });

            DisplayHandler.renderScores();

            // wait 3 seconds before resetting board
            window.setTimeout(() => {
                initBoard();
                pickFirstMove();
                DisplayHandler.renderBoard();
                DisplayHandler.renderScores();
            }, 2500);

            return true;
        } else {
            // if no one has won
            // it's a tie if every cell of every row is marked

            const isTie = board.every((row) =>
                row.every((cell) => cell.mark !== "")
            );
            if (isTie) {
                DisplayHandler.renderBoard();
                DisplayHandler.renderScores();
                
                // wait 3 seconds before resetting board
                window.setTimeout(() => {
                    initBoard();
                    pickFirstMove();
                    DisplayHandler.renderBoard();
                    DisplayHandler.renderScores();
                }, 2500);

                return true;
            }
        }

        // execution reaching here means game didn't end
        return false;
    }

    function checkGameEnd() {
        // game ends when someone has won 3 in a row

        if (players.find((player) => player.winCount === 3)) {
            return true;
        }
        return false;
    }

    function playTurn(i, j) {
        // mark a cell with appropriate current turn mark
        // if it was marked
        //      check if this marking resulted in round end
        //      if it did handle it
        //      if not then
        //          switch turns
        //          declare whose turn it is
        //      check if game ended
        //      if it did
        //          declare winner and wipe board
        // render board

        if (markCell(i, j)) {            

            if (!handleRoundEnd(i, j)) {
                players.forEach((player) => {
                    player.isMyTurn = player.isMyTurn ? false : true;
                });

                DisplayHandler.renderBoard();
                DisplayHandler.renderScores();
            }

            if (checkGameEnd()) {
                board = [];
            }
        }
    }

    function getBoard() {
        // return current board state
        if (board) {
            return board.map((row) => row.map((cell) => ({ ...cell })));
        }
    }

    function getScores() {
        // return current player scores

        if (players) {
            const scores = players.map((player) => ({
                name: player.name,
                winCount: player.winCount,
            }));

            return scores;
        }
    }

    return {
        start,
        getBoard,
        playTurn,
        safelyGetWhoseTurn,
        getScores,
    };
})();

const DisplayHandler = (() => {
    const size = 3;

    const circleSVG = document.querySelector("dialog .ipt-2 img");
    const crossSVG = document.querySelector("dialog .ipt-1 img");

    function renderBoard() {
        // render a new board
        // based on the game state
        // give each cell click -> playTurn

        // remove any board
        document.querySelectorAll(".board").forEach((node) => node.remove());

        const boardState = Game.getBoard();

        const boardContainer = document.querySelector(".board-container");
        const boardDiv = document.createElement("div");
        boardDiv.classList.add("board");

        for (let i = 0; i < size; i++) {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add(`row-${i}`);

            for (let j = 0; j < size; j++) {
                // create cell as per cell in board state
                const cellDiv = document.createElement("div");
                cellDiv.classList.add(`col-${j}`);
                cellDiv.classList.add("cell");

                if (boardState[i][j].mark === "O") {
                    cellDiv.innerHTML = circleSVG.outerHTML;
                }

                if (boardState[i][j].mark === "X") {
                    cellDiv.innerHTML = crossSVG.outerHTML;
                }

                rowDiv.appendChild(cellDiv);

                // play when cell clicked
                cellDiv.addEventListener("click", (event) => {
                    Game.playTurn(i, j);
                });
            }

            boardDiv.appendChild(rowDiv);
        }

        boardContainer.appendChild(boardDiv);

        handleRoundEnd();
        handleGameEnd();
    }

    function handleGameEnd() {
        // replace board with banner
        // with winner declaration

        const scores = Game.getScores();
        const winner = scores.find((player) => player.winCount === 3);

        if (winner) {
            // change scoreboard to banner
            const board = document.querySelector(".board-container");
            board.innerHTML = "";

            const banner = document.createElement("div");
            banner.classList.add("banner");

            banner.innerText = `${winner.name} wins!`;

            board.appendChild(banner);
        }
    }

    function handleRoundEnd() {
        // check if someone has won
        // remove all cell listeners
        // by replacing the board with a clone

        const turnPlayer = Game.safelyGetWhoseTurn();
        const boardState = Game.getBoard();
        let win = false;

        // 3 ways to win
        for (let i = 0; i < size; i++) {
            if (
                boardState[i][0].mark === boardState[i][1].mark &&
                boardState[i][1].mark === boardState[i][2].mark &&
                boardState[i][0].mark !== ""
            ) {
                win = true;
            }
        }

        for (let j = 0; j < size; j++) {
            if (
                boardState[0][j].mark === boardState[1][j].mark &&
                boardState[1][j].mark === boardState[2][j].mark &&
                boardState[0][j].mark !== ""
            ) {
                win = true;
            }
        }

        if (
            ((boardState[0][0].mark === boardState[1][1].mark &&
                boardState[1][1].mark === boardState[2][2].mark) ||
                (boardState[0][2].mark === boardState[1][1].mark &&
                    boardState[1][1].mark === boardState[2][0].mark)) &&
            boardState[1][1].mark !== ""
        ) {
            win = true;
        }

        if (win) {
            const boardContainer = document.querySelector(".board-container");
            const clone = boardContainer.cloneNode(true);
            boardContainer.parentNode.replaceChild(clone, boardContainer);
        }
    }

    function renderScores() {
        // render scoreboard contents as per game states

        const scores = Game.getScores();

        document.querySelector("#player-1-name").innerText = scores[0].name;
        document.querySelector("#player-2-name").innerText = scores[1].name;

        const player1Score = document.querySelector("#player-1-score");
        const player2Score = document.querySelector("#player-2-score");

        player1Score.innerHTML = "";
        player2Score.innerHTML = "";

        for (let i = 0; i < scores[0].winCount; i++) {
            const cross = crossSVG.cloneNode();
            cross.setAttribute("width", "52em");
            cross.setAttribute("height", "52em");
            player1Score.appendChild(cross);
        }

        for (let i = 0; i < scores[1].winCount; i++) {
            const circle = circleSVG.cloneNode();
            circle.setAttribute("width", "52em");
            circle.setAttribute("height", "52em");
            player2Score.appendChild(circle);
        }

        highlightTurn();
    }

    function highlightTurn() {
        // keep the score border for the player
        // whose turn it is now
        // remove the other's

        const scoreContainers = document.querySelectorAll('.score-container');

        const turnPlayer = Game.safelyGetWhoseTurn();

        if (turnPlayer.mark === 'X') {
            scoreContainers[0].classList.add('turn');
            scoreContainers[1].classList.remove('turn');
        }

        if (turnPlayer.mark === 'O') {
            scoreContainers[0].classList.remove('turn');
            scoreContainers[1].classList.add('turn');
        }
    }


    return {
        renderBoard,
        renderScores,
    };
})();

// on page load
document.addEventListener("DOMContentLoaded", (event) => {
    // show start modal with inputs
    const startDialog = document.querySelector("#start-dialog");
    startDialog.showModal();

    function starter(player1Name, player2Name) {
        // starts game with given or default names
        const p1Name = player1Name ? player1Name : "Player X";
        const p2Name = player2Name ? player2Name : "Player O";
        Game.start(p1Name, p2Name);
        startDialog.close();
    }

    // get names on click and start game
    const startBtn = startDialog.querySelector("button");
    startBtn.addEventListener("click", () => {
        const player1Name = startDialog.querySelector("#player-1-name").value;
        const player2Name = startDialog.querySelector("#player-2-name").value;
        starter(player1Name, player2Name);
    });

    // handling escape on dialog
    startDialog.addEventListener("keydown", (event) => {
        if (event.keyCode === 27) {
            event.preventDefault();
            starter();
        }
    });
});
