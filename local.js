const board = document.getElementById('board');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');
let currentPlayer = 'X';
let cells = Array(9).fill(null);

function createBoard() {
  board.innerHTML = '';
  cells = Array(9).fill(null);
  currentPlayer = 'X';
  status.textContent = "Player X's turn";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (cells[index]) return;

  cells[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  const winner = checkWinner();
  if (winner) {
    status.textContent = `🎉 Player ${winner} wins!`;
    board.querySelectorAll('.cell').forEach(cell => cell.removeEventListener('click', handleClick));
  } else if (!cells.includes(null)) {
    status.textContent = "It's a draw!";
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let [a, b, c] of wins) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return cells[a];
    }
  }
  return null;
}

restartBtn.addEventListener('click', createBoard);
createBoard();
