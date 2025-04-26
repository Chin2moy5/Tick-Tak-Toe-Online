const socket = io();
const board = document.getElementById('board');
const status = document.getElementById('status');
const joinBtn = document.getElementById('joinBtn');
const roomInput = document.getElementById('roomInput');
const restartBtn = document.getElementById('restartBtn');

const chooseSection = document.getElementById('choose-section');
const createSection = document.getElementById('create-section');
const joinSection = document.getElementById('join-section');
const gameSection = document.getElementById('game-section');
const roomCodeDisplay = document.getElementById('roomCode');

let roomId;
let mySymbol;
let isMyTurn = false;

// Handle button clicks
document.getElementById('createRoomBtn').addEventListener('click', () => {
  roomId = generateRoomCode();
  socket.emit('joinRoom', roomId);
  chooseSection.style.display = 'none';
  createSection.style.display = 'block';
  roomCodeDisplay.textContent = roomId;
});

document.getElementById('joinRoomBtn').addEventListener('click', () => {
  chooseSection.style.display = 'none';
  joinSection.style.display = 'block';
});

joinBtn.addEventListener('click', () => {
  roomId = roomInput.value.trim();
  if (roomId) {
    socket.emit('joinRoom', roomId);
  }
});

// Server responses
socket.on('startGame', (data) => {
  createSection.style.display = 'none';
  joinSection.style.display = 'none';
  gameSection.style.display = 'block';
  mySymbol = data.symbols[socket.id];
  isMyTurn = data.currentTurn === socket.id;
  status.textContent = isMyTurn ? "Your turn" : "Opponent's turn";
  createBoard();
});

socket.on('updateBoard', ({ board: serverBoard, currentTurn }) => {
  updateBoard(serverBoard);
  isMyTurn = currentTurn === socket.id;
  status.textContent = isMyTurn ? "Your turn" : "Opponent's turn";
});

socket.on('gameOver', ({ winner, board: finalBoard }) => {
  updateBoard(finalBoard);
  if (winner) {
    status.textContent = (winner === mySymbol) ? "🎉 You Win!" : "You lost!";
  } else {
    status.textContent = "It's a draw!";
  }
  restartBtn.style.display = "inline-block";
});

socket.on('roomFull', () => {
  alert("Room is full! Please choose a different room.");
});

socket.on('playerLeft', () => {
  alert("Opponent left the game.");
  location.href = "index.html";
});

function createBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', () => makeMove(i));
    board.appendChild(cell);
  }
}

function makeMove(index) {
  if (!isMyTurn) return;
  if (board.children[index].textContent) return;
  socket.emit('makeMove', { roomId, index });
}

function updateBoard(serverBoard) {
  for (let i = 0; i < 9; i++) {
    board.children[i].textContent = serverBoard[i] || '';
  }
}

restartBtn.addEventListener('click', () => {
  location.reload();
});

// Generate Random Room Code
function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
