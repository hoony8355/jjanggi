// game.js (리팩토링: 전통 장기판 + 정확한 기물 이동 처리)

import { pieceRules, getValidMoves } from './pieces.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const boardElement = document.getElementById('board');
const BOARD_ROWS = 10;
const BOARD_COLS = 9;
let board = Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null));
let selectedPiece = null;
let turn = 'red';

// 🟨 1. 전통 장기판 생성
function drawBoard() {
  boardElement.innerHTML = '';
  for (let y = 0; y < BOARD_ROWS; y++) {
    for (let x = 0; x < BOARD_COLS; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.y = y;
      cell.dataset.x = x;
      boardElement.appendChild(cell);
    }
  }

  // 교차점 표시용 선 (canvas나 배경 SVG로 개선 가능)
  boardElement.style.gridTemplateRows = `repeat(${BOARD_ROWS}, 1fr)`;
  boardElement.style.gridTemplateColumns = `repeat(${BOARD_COLS}, 1fr)`;

  console.log("📦 Board rendered with traditional Janggi layout");
}

function placeInitialPieces() {
  // 예시 배치 - 빨강 플레이어 (하단)
  const setup = [
    { type: 'CHA', x: 0 },
    { type: 'MA', x: 1 },
    { type: 'SANG', x: 2 },
    { type: 'SA', x: 3 },
    { type: 'WANG', x: 4 },
    { type: 'SA', x: 5 },
    { type: 'SANG', x: 6 },
    { type: 'MA', x: 7 },
    { type: 'CHA', x: 8 },
  ];
  for (let item of setup) {
    placePiece(9, item.x, item.type, 'red');
    placePiece(0, item.x, item.type, 'blue');
  }
  placePiece(7, 1, 'PO', 'red');
  placePiece(7, 7, 'PO', 'red');
  placePiece(2, 1, 'PO', 'blue');
  placePiece(2, 7, 'PO', 'blue');
  for (let x = 0; x < BOARD_COLS; x += 2) {
    placePiece(6, x, 'JOL', 'red');
    placePiece(3, x, 'JOL', 'blue');
  }
  console.log("♟ Initial pieces placed");
}

function placePiece(y, x, type, owner) {
  const piece = document.createElement('div');
  piece.classList.add('piece', owner);
  piece.textContent = type;
  piece.dataset.type = type;
  piece.dataset.owner = owner;
  piece.dataset.y = y;
  piece.dataset.x = x;
  board[y][x] = { type, owner };
  const cell = document.querySelector(`.cell[data-y='${y}'][data-x='${x}']`);
  if (cell) cell.appendChild(piece);
}

function clearHighlights() {
  document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('highlight'));
}

function movePiece(fromY, fromX, toY, toX) {
  const piece = board[fromY][fromX];
  if (!piece) return;

  board[toY][toX] = piece;
  board[fromY][fromX] = null;

  const fromCell = document.querySelector(`.cell[data-y='${fromY}'][data-x='${fromX}']`);
  const toCell = document.querySelector(`.cell[data-y='${toY}'][data-x='${toX}']`);

  const pieceEl = fromCell.querySelector('.piece');
  if (pieceEl) {
    pieceEl.dataset.y = toY;
    pieceEl.dataset.x = toX;
    toCell.innerHTML = '';
    toCell.appendChild(pieceEl);
    fromCell.innerHTML = '';
  }
  selectedPiece = null;
  turn = turn === 'red' ? 'blue' : 'red';
  clearHighlights();

  console.log(`🚚 Moved ${piece.type} from (${fromY},${fromX}) to (${toY},${toX})`);
}

boardElement.addEventListener('click', (e) => {
  const cell = e.target.closest('.cell');
  if (!cell) return;

  const y = parseInt(cell.dataset.y);
  const x = parseInt(cell.dataset.x);

  const clickedPiece = board[y][x];

  if (selectedPiece) {
    const { y: fromY, x: fromX, type, owner } = selectedPiece;
    const validMoves = getValidMoves(type, fromY, fromX, board, owner);
    const isValid = validMoves.some(([ty, tx]) => ty === y && tx === x);
    if (isValid) {
      movePiece(fromY, fromX, y, x);
    } else {
      console.log("❌ Invalid move");
    }
    selectedPiece = null;
    clearHighlights();
  } else if (clickedPiece && clickedPiece.owner === turn) {
    selectedPiece = { y, x, ...clickedPiece };
    const validMoves = getValidMoves(clickedPiece.type, y, x, board, clickedPiece.owner);
    clearHighlights();
    for (let [ty, tx] of validMoves) {
      const targetCell = document.querySelector(`.cell[data-y='${ty}'][data-x='${tx}']`);
      if (targetCell) targetCell.classList.add('highlight');
    }
    console.log(`🔍 Selected ${clickedPiece.type} at (${y},${x})`);
  }
});

// 실행
onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    console.log("🔐 Authenticated as", user.displayName);
    drawBoard();
    placeInitialPieces();
  } else {
    alert("로그인이 필요합니다");
    window.location.href = '/login.html';
  }
});
