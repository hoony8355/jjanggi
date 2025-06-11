export let board = [];

export function initBoard() {
  board = Array(10).fill().map(() => Array(9).fill(null));

  const red = 'red';
  const blue = 'blue';

  const setupPieces = (owner, row1, row2) => {
    const prefix = owner === red ? 'R' : 'B';
    board[row1] = [
      { type: 'CHA', owner, id: `${prefix}-CHA-1` },
      { type: 'MA', owner, id: `${prefix}-MA-1` },
      { type: 'SANG', owner, id: `${prefix}-SANG-1` },
      { type: 'SA', owner, id: `${prefix}-SA-1` },
      { type: 'WANG', owner, id: `${prefix}-WANG` },
      { type: 'SA', owner, id: `${prefix}-SA-2` },
      { type: 'SANG', owner, id: `${prefix}-SANG-2` },
      { type: 'MA', owner, id: `${prefix}-MA-2` },
      { type: 'CHA', owner, id: `${prefix}-CHA-2` },
    ];

    board[row2][1] = { type: 'PO', owner, id: `${prefix}-PO-1` };
    board[row2][7] = { type: 'PO', owner, id: `${prefix}-PO-2` };

    for (let i = 0; i < 9; i += 2) {
      board[owner === red ? 6 : 3][i] = { type: 'JOL', owner, id: `${prefix}-JOL-${(i + 1) / 2 + 1}` };
    }
  };

  setupPieces(red, 9, 7);
  setupPieces(blue, 0, 2);
}

export function drawBoard() {
  const boardEl = document.getElementById('gameBoard');
  boardEl.innerHTML = '';

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const intersection = document.createElement('div');
      intersection.className = 'intersection';

      // 왕성 구역이면 palace 클래스 추가
      const isPalace = (
        (y >= 0 && y <= 2 && x >= 3 && x <= 5) ||
        (y >= 7 && y <= 9 && x >= 3 && x <= 5)
      );
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

function getPieceLabel(type) {
  const labels = {
    WANG: '왕',
    CHA: '차',
    MA: '마',
    SANG: '상',
    SA: '사',
    PO: '포',
    JOL: '졸',
  };
  return labels[type] || type;
}

function getSymbol(type, owner) {
  const symbols = {
    CHA: '車',
    MA: '馬',
    SANG: '象',
    SA: '士',
    PO: '包',
    WANG: owner === 'red' ? '帥' : '將',
    JOL: '卒',
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
export function setTurn(t) { turn = t; }
export function isPlayerTurn() { return turn === 'red'; }
export function setIsPlayerTurn(val) {
  // currently not implemented
}
