// pieces.js
// pieces.js 상단 또는 하단에 다음과 같이 추가해야 합니다.
export { board, drawBoard, initBoard, movePiece, turn, isPlayerTurn, setTurn, setIsPlayerTurn };

export const pieceRules = {
  JOL: {
    name: "졸",
    type: "soldier",
    cost: 1,
    getMoves: (y, x, board, owner) => {
      const moves = [];
      const dir = owner === 'red' ? -1 : 1;

      // 전진
      if (inBounds(y + dir, x)) moves.push([y + dir, x]);

      // 좌우 이동은 항상 가능
      if (inBounds(y, x - 1)) moves.push([y, x - 1]);
      if (inBounds(y, x + 1)) moves.push([y, x + 1]);

      // 궁 내 대각선
      moves.push(...getPalaceDiagonals(y, x, owner));
      return moves;
    },
  },

  CHA: {
    name: "차",
    type: "chariot",
    cost: 5,
    getMoves: (y, x, board, owner) => {
      return [
        ...linearMoves(y, x, board, owner, -1, 0),
        ...linearMoves(y, x, board, owner, 1, 0),
        ...linearMoves(y, x, board, owner, 0, -1),
        ...linearMoves(y, x, board, owner, 0, 1),
        ...getPalaceDiagonals(y, x, owner, true)
      ];
    },
  },

  MA: {
    name: "마",
    type: "horse",
    cost: 3,
    getMoves: (y, x, board, owner) => {
      const moves = [];
      const steps = [
        [-1, 0, -2, -1], [-1, 0, -2, 1],
        [1, 0, 2, -1], [1, 0, 2, 1],
        [0, -1, -1, -2], [0, -1, 1, -2],
        [0, 1, -1, 2], [0, 1, 1, 2],
      ];
      for (let [dy1, dx1, dy2, dx2] of steps) {
        const ny1 = y + dy1, nx1 = x + dx1;
        const ny2 = y + dy2, nx2 = x + dx2;
        if (inBounds(ny2, nx2) && !board[ny1][nx1]) {
          moves.push([ny2, nx2]);
        }
      }
      return moves;
    },
  },

  SANG: {
    name: "상",
    type: "elephant",
    cost: 3,
    getMoves: (y, x, board, owner) => {
      const moves = [];
      const steps = [
        [-1, -1, -2, -2], [-1, 1, -2, 2],
        [1, -1, 2, -2], [1, 1, 2, 2]
      ];
      for (let [dy1, dx1, dy2, dx2] of steps) {
        const ny1 = y + dy1, nx1 = x + dx1;
        const ny2 = y + dy2, nx2 = x + dx2;
        if (inBounds(ny2, nx2) && !board[ny1][nx1]) {
          moves.push([ny2, nx2]);
        }
      }
      return moves;
    },
  },

  PO: {
    name: "포",
    type: "cannon",
    cost: 4,
    getMoves: (y, x, board, owner) => {
      const moves = [];
      const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (let [dy, dx] of directions) {
        let ny = y + dy, nx = x + dx;
        let jumped = false;
        while (inBounds(ny, nx)) {
          if (!jumped && board[ny][nx]) {
            jumped = true;
          } else if (jumped) {
            if (board[ny][nx]) {
              if (board[ny][nx].owner !== owner && board[ny][nx].type !== 'cannon') {
                moves.push([ny, nx]);
              }
              break;
            } else {
              ny += dy;
              nx += dx;
              continue;
            }
          }
          ny += dy;
          nx += dx;
        }
      }
      // 궁 내 대각선 이동 가능
      moves.push(...getPalaceDiagonals(y, x, owner, true));
      return moves;
    },
  },
};

// Helper functions
function inBounds(y, x) {
  return y >= 0 && y < 10 && x >= 0 && x < 9;
}

function linearMoves(y, x, board, owner, dy, dx) {
  const moves = [];
  let ny = y + dy, nx = x + dx;
  while (inBounds(ny, nx)) {
    if (!board[ny][nx]) {
      moves.push([ny, nx]);
    } else {
      if (board[ny][nx].owner !== owner) moves.push([ny, nx]);
      break;
    }
    ny += dy;
    nx += dx;
  }
  return moves;
}

function getPalaceDiagonals(y, x, owner, allowAll = false) {
  const palaceCenters = owner === 'red' ? [[0, 4]] : [[9, 4]];
  const deltas = [
    [-1, -1], [-1, 1], [1, -1], [1, 1]
  ];
  const moves = [];
  for (let [cy, cx] of palaceCenters) {
    for (let [dy, dx] of deltas) {
      const ny = y + dy, nx = x + dx;
      if (Math.abs(ny - cy) <= 1 && Math.abs(nx - cx) <= 1 && inBounds(ny, nx)) {
        moves.push([ny, nx]);
      }
    }
  }
  return allowAll ? moves : moves.filter(([ny, nx]) => ny !== y || nx !== x);
}

export function getValidMoves(pieceId, y, x, board, owner) {
  const piece = pieceRules[pieceId];
  if (!piece) return [];
  return piece.getMoves(y, x, board, owner);
}
