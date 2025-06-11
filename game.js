// game.js - 짱기 기본 장기판 렌더링 및 턴 처리 + 규칙 기반 이동
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
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      ctx.strokeStyle = "#333";
      ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);

      if (selectedPiece && validMoves.some(m => m.y === r && m.x === c)) {
        ctx.fillStyle = "#d0f0d0";
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }

      const piece = board[r][c];
      if (piece) {
        ctx.fillStyle = piece === piece.toUpperCase() ? "blue" : "red";
        ctx.font = "20px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(piece, c * TILE_SIZE + TILE_SIZE / 2, r * TILE_SIZE + TILE_SIZE / 2);
      }
    }
  }
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
