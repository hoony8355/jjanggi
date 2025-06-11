// pieces.js - 장기말 이동 규칙 정의 및 해석기

export const pieceRules = {
  "JOL": {
    type: "forward1",
    canTurnAfterRiver: true
  },
  "CHA": {
    type: "straight",
    range: "unlimited",
    jump: false
  },
  "MA": {
    type: "knight",
    blockedBy: "center"
  },
  "SANG": {
    type: "elephant",
    blockedBy: "middle"
  },
  "PO": {
    type: "cannon",
    requiresJumpToAttack: true
  },
  "SA": {
    type: "palace-diagonal",
    range: 1
  },
  "WANG": {
    type: "palace-omni",
    range: 1
  },
  "화염차": {
    type: "move1",
    onDeath: "explode",
    range: 1
  },
  "지원사": {
    type: "palace-diagonal",
    passive: {
      boost: "JOL",
      effect: "+1 range"
    }
  }
};

export function getValidMoves(pieceId, y, x, board, owner) {
  const rule = pieceRules[pieceId];
  if (!rule) return [];
  const moves = [];

  switch (rule.type) {
    case "forward1": {
      const dy = owner === "player" ? -1 : 1;
      const ny = y + dy;
      if (ny >= 0 && ny < 10 && board[ny][x] === 0) {
        moves.push({ y: ny, x });
      }
      break;
    }

    case "straight": {
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dy, dx]) => {
        let ny = y + dy;
        let nx = x + dx;
        while (ny >= 0 && ny < 10 && nx >= 0 && nx < 9) {
          if (board[ny][nx] === 0) {
            moves.push({ y: ny, x: nx });
          } else {
            if ((owner === "player" && board[ny][nx] !== board[ny][nx].toUpperCase()) ||
                (owner === "ai" && board[ny][nx] !== board[ny][nx].toLowerCase())) {
              moves.push({ y: ny, x: nx });
            }
            break;
          }
          ny += dy;
          nx += dx;
        }
      });
      break;
    }

    case "move1": {
      [[-1,0],[1,0],[0,-1],[0,1]].forEach(([dy, dx]) => {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= 0 && ny < 10 && nx >= 0 && nx < 9 && board[ny][nx] === 0) {
          moves.push({ y: ny, x: nx });
        }
      });
      break;
    }

    // TODO: 향후 knight, elephant, cannon 등 추가 구현
  }

  return moves;
}
