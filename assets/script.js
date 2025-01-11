const Game = (() => {

    let board;

    let players = [
        {
            id: 1,
            mark: 'X',
        },
        {
            id: 2,
            mark: 'O',
        }
    ]

    
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


    function cell(mark = '') {
        // creates a cell object
        // a cell has :
        //      mark - default ''

        return {
            mark,
        }
    }


    function initPlayers(name1, name2) {
        // make two players
        // each with a name, mark
        // one random player gets isMyTurn = true
        // other gets isMyTurn = false
        // log who plays first

        if (board) {
            players[0].name = name1;
            players[1].name = name2;

            players.forEach(player => {
                player.isMyTurn = false;
            });

            randomIdx = Math.floor(Math.random() * 2);
            players[randomIdx].isMyTurn = true;

            console.log(`${players[randomIdx].name} plays first`);

        } else {
            console.log("Board not initialized");
            
        }
    }


    function getBoard() {
        // return current board state
        return board;
    }


    return {
        initBoard,
        getBoard,
        initPlayers
    }

})();