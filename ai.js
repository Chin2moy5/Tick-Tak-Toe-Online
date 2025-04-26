const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

let cells = Array(9).fill(null);
let isPlayerTurn = true;

function createBoard() {
  board.innerHTML = '';
  cells = Array(9).fill(null);
  isPlayerTurn = true;
  status.textContent = "Your turn";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', playerMove);
    board.appendChild(cell);
  }
}

function playerMove(e) {
  if (!isPlayerTurn) return;
  const index = e.target.dataset.index;
  if (cells[index]) return;

  makeMove(index, 'X');
  if (!checkEnd('X')) {
    isPlayerTurn = false;
    setTimeout(aiMove, 500);
  }
}

function aiMove() {
  const emptyIndexes = cells.map((v, i) => v === null ? i : null).filter(v => v !== null);
  const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  makeMove(randomIndex, 'O');
  checkEnd('O');
  isPlayerTurn = true;
}

function makeMove(index, symbol) {
  cells[index] = symbol;
  board.children[index].textContent = symbol;
  board.children[index].removeEventListener('click', playerMove);
}

function checkEnd(symbol) {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let [a, b, c] of wins) {
    if (cells[a] === symbol && cells[b] === symbol && cells[c] === symbol) {
      status.textContent = symbol === 'X' ? "🎉 You win!" : "🤖 AI wins!";
      disableBoard();
      return true;
    }
  }

  if (!cells.includes(null)) {
    status.textContent = "It's a draw!";
    return true;
  }
  return false;
}

function disableBoard() {
  for (let cell of board.children) {
    cell.removeEventListener('click', playerMove);
  }
}

restartBtn.addEventListener('click', createBoard);
createBoard();
