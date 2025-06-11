// pieces.js - 짱기 기물 및 보드 상태 관리 모듈

export let board = [];

// 보드 초기화
export function initBoard() {
  board = Array.from({ length: 10 }, (_, r) =>
    Array.from({ length: 9 }, (_, c) => null)
  );

  // 기본 기물 배치 (예시)
  board[0][4] = { id: "왕", type: "WANG", owner: "blue" };
  board[9][4] = { id: "왕", type: "WANG", owner: "red" };
}

// 보드 렌더링
export function drawBoard() {
  const container = document.getElementById("gameBoard");
  if (!container) {
    console.error("❌ [DOM] gameBoard 요소를 찾을 수 없습니다.");
    return;
  }
  container.innerHTML = "";

  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      const div = document.createElement("div");
      div.className = "cell";
      div.dataset.row = r;
      div.dataset.col = c;
      div.onclick = () => window.handleCellClick(r, c);
      if (cell) div.textContent = cell.id;
      container.appendChild(div);
    });
  });
}

// 기물 이동
export function movePiece(fromR, fromC, toR, toC) {
  const piece = board[fromR][fromC];
  const target = board[toR][toC];

  if (!piece) return false;
  const validMoves = getValidMoves(piece.type, fromR, fromC, board, piece.owner);
  const isValid = validMoves.some(([r, c]) => r === toR && c === toC);
  if (!isValid) return false;

  board[toR][toC] = piece;
  board[fromR][fromC] = null;
  drawBoard();
  return true;
}

// 턴 관련 상태
let turn = "red";
let isPlayerTurn = true;

export function setTurn(value) {
  turn = value;
}
export function getTurn() {
  return turn;
}
export function setIsPlayerTurn(value) {
  isPlayerTurn = value;
}
export function isPlayerTurnFn() {
  return isPlayerTurn;
}

// 기물 이동 가능 위치 계산 (단순 룰 예시)
export function getValidMoves(type, r, c, board, owner) {
  const directions = {
    WANG: [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ],
  };
  const moves = [];

  for (const [dy, dx] of directions[type] || []) {
    const nr = r + dy;
    const nc = c + dx;
    if (nr >= 0 && nr < 10 && nc >= 0 && nc < 9) {
      const target = board[nr][nc];
      if (!target || target.owner !== owner) {
        moves.push([nr, nc]);
      }
    }
  }

  return moves;
}

export { isPlayerTurnFn as isPlayerTurn, turn };
