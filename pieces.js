// pieces.js

console.log("[📦 pieces.js] 모듈 로드됨");

// 게임 상태 변수
export let board = Array.from({ length: 10 }, () => Array(9).fill(null));
export let turn = 'red';
let playerTurn = true;

export function setTurn(newTurn) {
  console.log(`[🔄 턴 변경] ${turn} → ${newTurn}`);
  turn = newTurn;
}
export function isPlayerTurn() {
  return playerTurn;
}
export function setIsPlayerTurn(val) {
  console.log(`[🎯 플레이어 턴 설정] ${val}`);
  playerTurn = val;
}

// 초기 기물 배치
export function initBoard() {
  console.log("[🧩 보드 초기화]");
  board = Array.from({ length: 10 }, () => Array(9).fill(null));
  // 예시 배치 (기본 피스만 일부 배치)
  board[9][4] = { id: "JOL", owner: "red" };
  board[0][4] = { id: "JOL", owner: "blue" };
}

// 보드 그리기
export function drawBoard() {
  console.log("[🧱 drawBoard] 보드 렌더링 시작");
  const container = document.getElementById("gameBoard");
  if (!container) return console.warn("❌ gameBoard DOM 요소 없음");

  container.innerHTML = "";
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.dataset.row = r;
      cell.dataset.col = c;
      cell.onclick = () => window.handleCellClick(r, c);

      const piece = board[r][c];
      if (piece) {
        cell.textContent = piece.id[0] + (piece.owner === 'red' ? '🔴' : '🔵');
      }

      container.appendChild(cell);
    }
  }
}

// 이동 처리
export function movePiece(fromY, fromX, toY, toX) {
  const piece = board[fromY][fromX];
  if (!piece) return false;

  const moves = getValidMoves(piece.id, fromY, fromX, board, piece.owner);
  const valid = moves.some(([y, x]) => y === toY && x === toX);

  if (!valid) {
    console.warn(`[❌ 이동 실패] ${fromY},${fromX} → ${toY},${toX}`);
    return false;
  }

  const target = board[toY][toX];
  if (target) console.log(`[💥 공격] ${piece.id}가 ${target.id} 제거`);

  board[toY][toX] = piece;
  board[fromY][fromX] = null;

  console.log(`[✅ 이동 성공] ${fromY},${fromX} → ${toY},${toX}`);
  return true;
}
