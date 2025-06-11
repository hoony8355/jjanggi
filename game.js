// game.js - 짱기 전통 장기판 그리기 + 말 시각 개선
import { pieceRules, getValidMoves } from './pieces.js';

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const TILE_SIZE = 60;
const ROWS = 10;
const COLS = 9;

let board = [];
let selectedPiece = null;
let validMoves = [];
let isPlayerTurn = true;

const initialSetup = [
  ["cha", "ma", "sang", "sa", "wang", "sa", "sang", "ma", "cha"],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, "po", 0, 0, 0, 0, 0, "po", 0],
  ["jol", 0, "jol", 0, "jol", 0, "jol", 0, "jol"],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["JOL", 0, "JOL", 0, "JOL", 0, "JOL", 0, "JOL"],
  [0, "PO", 0, 0, 0, 0, 0, "PO", 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ["CHA", "MA", "SANG", "SA", "WANG", "SA", "SANG", "MA", "CHA"]
];

function initBoard() {
  board = JSON.parse(JSON.stringify(initialSetup));
  drawBoard();
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#333";
  ctx.lineWidth = 1.2;

  // 격자
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }

  // 강 표시
  ctx.fillStyle = "#eef";
  ctx.fillRect(0, 4 * TILE_SIZE, COLS * TILE_SIZE, TILE_SIZE);

  // 궁성 대각선 그리기
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  // 위 궁성
  ctx.moveTo(3 * TILE_SIZE, 0);
  ctx.lineTo(5 * TILE_SIZE, 2 * TILE_SIZE);
  ctx.moveTo(5 * TILE_SIZE, 0);
  ctx.lineTo(3 * TILE_SIZE, 2 * TILE_SIZE);
  // 아래 궁성
  ctx.moveTo(3 * TILE_SIZE, 7 * TILE_SIZE);
  ctx.lineTo(5 * TILE_SIZE, 9 * TILE_SIZE);
  ctx.moveTo(5 * TILE_SIZE, 7 * TILE_SIZE);
  ctx.lineTo(3 * TILE_SIZE, 9 * TILE_SIZE);
  ctx.stroke();

  // 말 그리기
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const piece = board[r][c];
      if (selectedPiece && validMoves.some(m => m.y === r && m.x === c)) {
        ctx.fillStyle = "#d0f0d0";
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
      if (piece) drawPiece(piece, c, r);
    }
  }
}

function drawPiece(piece, col, row) {
  const x = col * TILE_SIZE + TILE_SIZE / 2;
  const y = row * TILE_SIZE + TILE_SIZE / 2;
  const radius = TILE_SIZE * 0.4;
  const color = piece === piece.toUpperCase() ? "blue" : "red";

  // 팔각형 모양
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // 말 이름
  ctx.fillStyle = color;
  ctx.font = "16px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(piece.toUpperCase(), x, y);
}

canvas.addEventListener("click", (e) => {
  if (!isPlayerTurn) return;

  const x = Math.floor(e.offsetX / TILE_SIZE);
  const y = Math.floor(e.offsetY / TILE_SIZE);
  const clicked = board[y][x];

  if (selectedPiece) {
    if (validMoves.some(m => m.y === y && m.x === x)) {
      const [fromY, fromX] = selectedPiece;
      board[y][x] = board[fromY][fromX];
      board[fromY][fromX] = 0;
      selectedPiece = null;
      validMoves = [];
      isPlayerTurn = false;
      drawBoard();
      setTimeout(aiTurn, 500);
    } else {
      selectedPiece = null;
      validMoves = [];
      drawBoard();
    }
  } else if (clicked && clicked === clicked.toUpperCase()) {
    selectedPiece = [y, x];
    validMoves = getValidMoves(clicked.toUpperCase(), y, x, board, "player");
    drawBoard();
  }
});

initBoard();
