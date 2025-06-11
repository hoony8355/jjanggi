// ✅ pieces.js (기물 배치 및 drawBoard 포함 리팩토링)
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
      board[row2 + 1][i] = { type: 'JOL', owner, id: `${prefix}-JOL-${(i + 1) / 2}` };
    }
  };

  setupPieces(red, 9, 7);
  setupPieces(blue, 0, 2);
}

function getPieceSymbol(type, owner) {
  const symbols = {
    WANG: owner === 'red' ? '帥' : '將',
    SA: '士',
    SANG: '象',
    MA: '馬',
    CHA: '車',
    PO: '包',
    JOL: '卒',
  };
  return symbols[type] || '?';
}

export function drawBoard() {
  const boardEl = document.getElementById('gameBoard');
  boardEl.innerHTML = '';

  const cellWidth = boardEl.clientWidth / 8;
  const cellHeight = boardEl.clientHeight / 9;

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const piece = board[y][x];
      if (!piece) continue;

      const pieceEl = document.createElement('div');
      pieceEl.className = 'piece';
      pieceEl.textContent = getPieceSymbol(piece.type, piece.owner);
      pieceEl.style.backgroundColor = piece.owner === 'red' ? '#ffdddd' : '#ddeeff';
      pieceEl.style.position = 'absolute';
      pieceEl.style.left = `${(x / 8) * 100}%`;
      pieceEl.style.top = `${(y / 9) * 100}%`;
      pieceEl.style.transform = 'translate(-50%, -50%)';
      pieceEl.dataset.row = y;
      pieceEl.dataset.col = x;

      pieceEl.addEventListener('click', () => window.handleCellClick(y, x));
      boardEl.appendChild(pieceEl);
    }
  }
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
