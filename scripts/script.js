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

        let size = 3;
        board = [];

        for (let i = 0; i < size; i++) {
            board.push([]);

            for (let j = 0; j < size; j++) {
                board[i].push(cell());
            }
        }

        console.log("Board ready.");
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
        } else {
            console.log("Board not initialized");
        }
    }

    function pickFirstMove() {
        players.forEach((player) => {
            player.isMyTurn = false;
        });

        const randomIdx = Math.floor(Math.random() * 2);
        players[randomIdx].isMyTurn = true;

        console.log(
            `${players[0].name} (${players[0].mark}) -- v/s -- ${players[1].name} (${players[1].mark})`
        );

        console.log(
            `${players[randomIdx].name} (${players[randomIdx].mark}) plays first`
        );
    }

    function start(name1, name2) {
        // initialises board with empty cells
        // sets players

        if (name1 && name2) {
            console.log("Starting Game");
            initBoard();
            initPlayers(name1, name2);
        } else {
            console.log("Call start with player names");
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
        return players.find((player) => player.isMyTurn);
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
            console.log(`${turnPlayer.name} wins!`);

            // increment win count by 1 for winner
            // decrement win count by 1 for loser
            players.forEach((player) => {
                player.winCount += player === turnPlayer ? 1 : -1;
                player.winCount = player.winCount < 0 ? 0 : player.winCount;
                player.winCount = player.winCount > 3 ? 3 : player.winCount;
            });

            initBoard();
            pickFirstMove();
            return true;
        } else {
            // if no one has won
            // it's a tie if every cell of every row is marked

            const isTie = board.every((row) =>
                row.every((cell) => cell.mark !== "")
            );
            if (isTie) {
                console.log(`It's a tie!`);
                initBoard();
                pickFirstMove();
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

        if (markCell(i, j)) {
            let turnPlayer = getWhoseTurn();

            if (!handleRoundEnd(i, j)) {
                players.forEach((player) => {
                    player.isMyTurn = player.isMyTurn ? false : true;
                });

                turnPlayer = getWhoseTurn();
                console.log(`${turnPlayer.name}'s (${turnPlayer.mark}) turn`);
            }

            if (checkGameEnd()) {
                board = [];
                console.log(`${turnPlayer.name} wins!`);
                console.log(`Game over`);
            }
        } else {
            console.log("Invalid move. Try again");
        }
    }

    function getBoard() {
        // return current board state
        if (board) {
            return board.map((row) => row.map((cell) => ({ ...cell })));
        } else {
            console.log("Game has not started");
        }
    }

    return {
        start,
        getBoard,
        playTurn,
    };
})();
