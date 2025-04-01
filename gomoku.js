class Gomoku {
    constructor() {
        this.BOARD_SIZE = 15;
        this.board = Array(this.BOARD_SIZE).fill().map(() => Array(this.BOARD_SIZE).fill(null));
        this.currentPlayer = 'black';
        this.gameOver = false;

        this.init();
    }

    init() {
        this.createBoard();
        this.bindEvents();
        this.updateStatus();
    }

    createBoard() {
        const board = document.getElementById('board');
        board.innerHTML = '';

        for (let i = 0; i < this.BOARD_SIZE; i++) {
            for (let j = 0; j < this.BOARD_SIZE; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                board.appendChild(cell);
            }
        }
    }

    bindEvents() {
        const board = document.getElementById('board');
        board.addEventListener('click', (e) => {
            if (this.gameOver) return;

            const cell = e.target.closest('.cell');
            if (!cell) return;

            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);

            if (this.isValidMove(row, col)) {
                this.makeMove(row, col);
            }
        });

        const restartBtn = document.getElementById('restart-btn');
        restartBtn.addEventListener('click', () => this.restart());
    }

    isValidMove(row, col) {
        return this.board[row][col] === null;
    }

    makeMove(row, col) {
        this.board[row][col] = this.currentPlayer;
        this.placePiece(row, col);

        if (this.checkWin(row, col)) {
            this.handleWin();
            return;
        }

        this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black';
        this.updateStatus();
    }

    placePiece(row, col) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const piece = document.createElement('div');
        piece.className = `piece ${this.currentPlayer}`;
        cell.appendChild(piece);
    }

    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]],  // 水平
            [[1, 0], [-1, 0]],  // 垂直
            [[1, 1], [-1, -1]], // 对角线
            [[1, -1], [-1, 1]]  // 反对角线
        ];

        return directions.some(direction => {
            const count = this.countInDirection(row, col, direction[0])
                + this.countInDirection(row, col, direction[1])
                + 1;
            return count >= 5;
        });
    }

    countInDirection(row, col, [dx, dy]) {
        let count = 0;
        let x = row + dx;
        let y = col + dy;

        while (
            x >= 0 && x < this.BOARD_SIZE &&
            y >= 0 && y < this.BOARD_SIZE &&
            this.board[x][y] === this.currentPlayer
        ) {
            count++;
            x += dx;
            y += dy;
        }

        return count;
    }

    handleWin() {
        this.gameOver = true;
        document.getElementById('game-status').textContent = `${this.currentPlayer === 'black' ? '黑子' : '白子'}获胜！`;

        // 添加获胜动画
        const winningPieces = document.querySelectorAll(`.piece.${this.currentPlayer}`);
        winningPieces.forEach(piece => piece.classList.add('win'));
    }

    updateStatus() {
        document.getElementById('current-player').textContent =
            this.currentPlayer === 'black' ? '黑子' : '白子';
    }

    restart() {
        this.board = Array(this.BOARD_SIZE).fill().map(() => Array(this.BOARD_SIZE).fill(null));
        this.currentPlayer = 'black';
        this.gameOver = false;
        this.createBoard();
        this.updateStatus();
        document.getElementById('game-status').textContent = '';
    }
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    new Gomoku();
}); 