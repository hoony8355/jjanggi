export let board = [];

// 전통 장기 배치로 초기화
export function initBoard() {
  board = Array(10).fill(null).map(() => Array(9).fill(null));

  const red = 'red';
  const blue = 'blue';

  const placePieces = (owner, rowMain, rowPo, rowJol) => {
    const prefix = owner === red ? 'R' : 'B';

    // 주요 기물 (차 마 상 사 왕 사 상 마 차)
    const mainPieces = [
      'CHA', 'MA', 'SANG', 'SA', 'WANG', 'SA', 'SANG', 'MA', 'CHA'
    ];
    mainPieces.forEach((type, idx) => {
      board[rowMain][idx] = {
        type,
        owner,
        id: `${prefix}-${type}-${idx + 1}`
      };
    });

    // 포
    board[rowPo][1] = { type: 'PO', owner, id: `${prefix}-PO-1` };
    board[rowPo][7] = { type: 'PO', owner, id: `${prefix}-PO-2` };

    // 졸/병
    for (let i = 0; i < 9; i += 2) {
      board[rowJol][i] = {
        type: 'JOL',
        owner,
        id: `${prefix}-JOL-${(i + 1) / 2 + 1}`
      };
    }
  };

  // 홍(red): 아래쪽, 청(blue): 위쪽
  placePieces(red, 9, 7, 6);
  placePieces(blue, 0, 2, 3);
}

// 보드 렌더링
export function drawBoard() {
  const boardEl = document.getElementById('gameBoard');
  boardEl.innerHTML = '';

  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 9; x++) {
      const intersection = document.createElement('div');
      intersection.className = 'intersection';

      // 왕성 구역이면 palace 클래스 추가
      const isPalace =
        ((y >= 0 && y <= 2 && x >= 3 && x <= 5) ||
         (y >= 7 && y <= 9 && x >= 3 && x <= 5));

      if (isPalace && ((y === x) || (x + y === 8))) {
        intersection.classList.add('palace');
      }

      const piece = board[y][x];
      if (piece) {
        const pieceEl = document.createElement('div');
        pieceEl.className = 'piece';
        pieceEl.textContent = getSymbol(piece.type, piece.owner);
        pieceEl.style.backgroundColor = piece.owner === 'red' ? '#ffdddd' : '#ddeeff';
        intersection.appendChild(pieceEl);
      }

      intersection.addEventListener('click', () => window.handleCellClick(y, x));
      boardEl.appendChild(intersection);
    }
  }
}

function getSymbol(type, owner) {
  const symbols = {
    CHA: '車',
    MA: '馬',
    SANG: '象',
    SA: '士',
    PO: '包',
    WANG: owner === 'red' ? '帥' : '將',
    JOL: owner === 'red' ? '兵' : '卒',
  };
  return symbols[type] || '?';
}

export function movePiece(fromR, fromC, toR, toC) {
  const piece = board[fromR][fromC];
  if (!piece) return false;
  board[toR][toC] = piece;
  board[fromR][fromC] = null;
  drawBoard();
  return true;
}

export let turn = 'red';
export function setTurn(t) {
  turn = t;
}
export function isPlayerTurn() {
  return turn === 'red';
}
export function setIsPlayerTurn(val) {
  // 확장용 placeholder
}
