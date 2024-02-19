function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateSequence() {
    const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

    while (sequence.length) {
        const rand = getRandomInt(0, sequence.length - 1);
        const name = sequence.splice(rand, 1)[0];
        tetrominoSequence.push(name);
    }
}

function getNextTetromino() {
    if (tetrominoSequence.length === 0) {
        generateSequence();
    }

    const name = tetrominoSequence.pop();
    const matrix = tetrominos[name];

    const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

    const row = name === 'I' ? 0 : -1;  
    return {
        name: name,
        matrix: matrix,
        row: row,
        col: col
    };
}

function rotate(matrix) {
    const N = matrix.length - 1;
    const result = matrix.map((row, i) =>
        row.map((val, j) => matrix[N - j][i])
    );

    return result;
}

function isValidMove(matrix, cellRow, cellCol) {
    for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[row].length; col++) {
            if (matrix[row][col] && (
                cellCol + col < 0 ||
                cellCol + col >= playfield[0].length ||
                cellRow + row >= playfield.length ||
                playfield[cellRow + row][cellCol + col])
            ) {
                return false;
            }
        }
    }

    return true;
}

let score = 0;

function placeTetromino() {
    let successfullyPlaced = true;

    for (let row = 0; row < tetromino.matrix.length; row++) {
        for (let col = 0; col < tetromino.matrix[row].length; col++) {
            if (tetromino.matrix[row][col]) {
                const r = tetromino.row + row;
                const c = tetromino.col + col;

                if (r >= 0 && r < 20 && c >= 0 && c < 10) {
                    if (playfield[r][c] === 0) {
                        playfield[r][c] = tetromino.name;
                    } else {
                        showGameOver();
                        successfullyPlaced = false;
                        break;
                    }
                }
            }
        }
        if (!successfullyPlaced) {
            break;
        }
    }

    if (successfullyPlaced) {
        let linesCleared = 0;

        for (let row = playfield.length - 1; row >= 0; row--) {
            if (playfield[row].every(cell => !!cell)) {
                playfield.splice(row, 1);
                playfield.unshift(Array(10).fill(0));
                linesCleared++;
            }
        }

        tetromino = getNextTetromino();

        if (linesCleared > 0) {
            score += linesCleared * 10;
            updateScore();
        }

        if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
            showGameOver();
            successfullyPlaced = false;
        }
    }

    return successfullyPlaced;
}
function showGameOver() {
    cancelAnimationFrame(rAF);
    gameOver = true;

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.globalAlpha = 1;
    context.fillStyle = 'white';
    context.font = '36px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);

    
}

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 32;
const tetrominoSequence = [];

const playfield = [];

for (let row = -2; row < 20; row++) {
    playfield[row] = [];

    for (let col = 0; col < 10; col++) {
        playfield[row][col] = 0;
    }
}

const tetrominos = {
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'L': [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    'O': [
        [1, 1],
        [1, 1],
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    'T': [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ]
};

const colors = {
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

let count = 0;
let tetromino = getNextTetromino();
let rAF = null;
let gameOver = false;

function loop() {
    rAF = requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (tetromino) {
        if (++count > (isFastDrop ? 1 : 25)) {
            tetromino.row++;

            if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
                tetromino.row--;
                if (!placeTetromino()) {
                    showGameOver();
                    return;
                }
            }

            count = 0;
        }
    }

    for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 10; col++) {
            if (playfield[row][col]) {
                const name = playfield[row][col];
                context.fillStyle = colors[name];
                context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
            }
        }
    }

    if (tetromino) {
        context.fillStyle = colors[tetromino.name];

        for (let row = 0; row < tetromino.matrix.length; row++) {
            for (let col = 0; col < tetromino.matrix[row].length; col++) {
                if (tetromino.matrix[row][col]) {
                    const r = tetromino.row + row;
                    const c = tetromino.col + col;
                    if (r >= 0 && r < 20 && c >= 0 && c < 10) {
                        context.fillRect(c * grid, r * grid, grid - 1, grid - 1);
                    }
                }
            }
        }
    }

    context.fillStyle = 'white';
    context.font = '20px monospace';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillText(`Score: ${score}`, 10, 10);
}
let isFastDrop = false;  

document.addEventListener('keydown', function (e) {
    if (gameOver) return;

    if (e.which === 37 || e.which === 39) {
        const col = e.which === 37
            ? tetromino.col - 1
            : tetromino.col + 1;

        if (isValidMove(tetromino.matrix, tetromino.row, col)) {
            tetromino.col = col;
        }
    }

    if (e.which === 38) {
        const matrix = rotate(tetromino.matrix);
        if (isValidMove(matrix, tetromino.row, tetromino.col)) {
            tetromino.matrix = matrix;
        }
    }

    if (e.which === 40) {
        isFastDrop = true; 
    }
});

document.addEventListener('keyup', function (e) {
    if (e.which === 40) {
        isFastDrop = false; 
    }
});

rAF = requestAnimationFrame(loop);

