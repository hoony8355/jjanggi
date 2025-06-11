export let board = [];

export function initBoard() {
  board = Array.from({ length: 10 }, () => Array(9).fill(null));

  const placePieces = (owner, baseRow, pawnRow) => {
    const prefix = owner === 'red' ? 'R' : 'B';
    board[baseRow] = [
      { type: 'CHA', owner, id: `${prefix}-CHA-1` },
      { type: 'MA', owner, id: `${prefix}-MA-1` },
      { type: 'SANG', owner, id: `${prefix}-SANG-1` },
      { type: 'SA', owner, id: `${prefix}-SA-1` },
      { type: 'WANG', owner, id: `${prefix}-WANG` },
      { type: 'SA', owner, id: `${prefix}-SA-2` },
      { type: 'SANG', owner, id: `${prefix}-SANG-2` },
      { type: 'MA', owner, id: `${prefix}-MA-2` },
      { type: 'CHA', owner, id: `${prefix}-CHA-2` }
    ];
    board[baseRow + (owner === 'red' ? -1 : 1)][1] = { type: 'PO', owner, id: `${prefix}-PO-1` };
    board[baseRow + (owner === 'red' ? -1 : 1)][7] = { type: 'PO', owner, id: `${prefix}-PO-2` };

    for (let i = 0; i < 9; i += 2) {
      board[pawnRow][i] = { type: 'JOL', owner, id: `${prefix}-JOL-${(i + 1) / 2}` };
    }
  };

  placePieces('red', 9, 6);
  placePieces('blue', 0, 3);
}

export function drawBoard() {
  const boardEl = document.getElementById('gameBoard');
  boardEl.innerHTML = '';

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const cell = document.createElement('div');
      cell.className = 'intersection';

      // 왕성 내부 대각선
      if (
        ((y >= 0 && y <= 2 && x >= 3 && x <= 5) ||
         (y >= 7 && y <= 9 && x >= 3 && x <= 5)) &&
        ((y === x) || (x + y === 8))
      ) {
        cell.classList.add('palace');
      }

      const piece = board[y][x];
      if (piece) {
        const pieceEl = document.createElement('div');
        pieceEl.className = 'piece';
        pieceEl.textContent = getPieceSymbol(piece.type, piece.owner);
        pieceEl.style.backgroundColor = piece.owner === 'red' ? '#ffdddd' : '#ddeeff';
        cell.appendChild(pieceEl);
      }

      cell.addEventListener('click', () => window.handleCellClick(y, x));
      boardEl.appendChild(cell);
    }
  }
}

function getPieceSymbol(type, owner) {
  const symbols = {
    WANG: owner === 'red' ? '帥' : '將',
    CHA: '車',
    MA: '馬',
    SANG: '象',
    SA: '士',
    PO: '包',
    JOL: owner === 'red' ? '兵' : '卒'
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
export function setIsPlayerTurn(val) {}
