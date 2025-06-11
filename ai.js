// ai.js - 짱기 AI 턴 처리 (1스테이지용 보통 난이도)
import { getValidMoves } from './pieces.js';

export function aiTurn(board, currentTurn, moveCallback, endCallback) {
  console.log("🤖 [AI 턴 시작]");

  const aiPieces = [];

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const piece = board[y][x];
      if (piece && piece.owner === currentTurn) {
        aiPieces.push({ y, x, type: piece.type, owner: piece.owner });
      }
    }
  }

  console.log(`🧠 [AI 기물 수] ${aiPieces.length}개 스캔됨`);

  // 우선순위: 왕 제거 가능 > 공격 가능 > 일반 이동
  for (let priority of [targetKing, attackEnemy, randomMove]) {
    const move = priority(aiPieces, board);
    if (move) {
      console.log(`✅ [AI 이동 결정] ${move.fromY},${move.fromX} → ${move.toY},${move.toX}`);
      moveCallback(move.fromY, move.fromX, move.toY, move.toX);
      if (endCallback) setTimeout(endCallback, 300);
      return;
    }
  }

  console.warn("❌ [AI 실패] 가능한 이동이 없습니다.");

  // === 내부 함수 ===

  function targetKing(pieces, board) {
    for (let piece of pieces) {
      const moves = getValidMoves(piece.type, piece.y, piece.x, board, piece.owner);
      for (let [toY, toX] of moves) {
        const target = board[toY][toX];
        if (target && target.type === 'WANG' && target.owner !== piece.owner) {
          return { fromY: piece.y, fromX: piece.x, toY, toX };
        }
      }
    }
    return null;
  }

  function attackEnemy(pieces, board) {
    const candidates = [];
    for (let piece of pieces) {
      const moves = getValidMoves(piece.type, piece.y, piece.x, board, piece.owner);
      for (let [toY, toX] of moves) {
        const target = board[toY][toX];
        if (target && target.owner !== piece.owner) {
          candidates.push({ fromY: piece.y, fromX: piece.x, toY, toX });
        }
      }
    }
    return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
  }

  function randomMove(pieces, board) {
    const candidates = [];
    for (let piece of pieces) {
      const moves = getValidMoves(piece.type, piece.y, piece.x, board, piece.owner);
      for (let [toY, toX] of moves) {
        if (!board[toY][toX] || board[toY][toX].owner !== piece.owner) {
          candidates.push({ fromY: piece.y, fromX: piece.x, toY, toX });
        }
      }
    }
    return candidates.length ? candidates[Math.floor(Math.random() * candidates.length)] : null;
  }
}
