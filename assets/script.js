const Game = (() => {

    let board = [];

    
    function initBoard() {
        // initialize board as 3 x 3
        // each element is a cell

        let size = 3;

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


    function getBoard() {
        // return current board state
        return board;
    }


    return {
        initBoard,
        getBoard
    }

})();