// ai.js - 짱기 AI 턴 처리 (기본: 랜덤 이동)

function aiTurn() {
  // 현재 단순화된 AI: 무작위로 말 선택 + 무작위 이동
  const aiPieces = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece === piece.toLowerCase()) {
        aiPieces.push({ r, c });
      }
    }
  }

  if (aiPieces.length === 0) {
    isPlayerTurn = true;
    return;
  }

  const randomPiece = aiPieces[Math.floor(Math.random() * aiPieces.length)];
  const { r, c } = randomPiece;

  const possibleMoves = getAdjacentEmptyTiles(r, c);
  if (possibleMoves.length > 0) {
    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    board[move.r][move.c] = board[r][c];
    board[r][c] = 0;
  }

  drawBoard();
  isPlayerTurn = true;
}

function getAdjacentEmptyTiles(r, c) {
  const deltas = [
    [-1, 0], [1, 0], [0, -1], [0, 1]
  ];
  const moves = [];
  for (const [dr, dc] of deltas) {
    const nr = r + dr;
    const nc = c + dc;
    if (nr >= 0 && nr < 10 && nc >= 0 && nc < 9 && board[nr][nc] === 0) {
      moves.push({ r: nr, c: nc });
    }
  }
  return moves;
}
