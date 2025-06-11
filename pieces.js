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
      { type: 'PO', owner, id: `${prefix}-PO-1` },
      { type: 'WANG', owner, id: `${prefix}-WANG` },
      { type: 'PO', owner, id: `${prefix}-PO-2` },
      { type: 'SANG', owner, id: `${prefix}-SANG-2` },
      { type: 'MA', owner, id: `${prefix}-MA-2` },
      { type: 'CHA', owner, id: `${prefix}-CHA-2` },
    ];

    for (let i = 0; i < 9; i += 2) {
      board[row2][i] = { type: 'JOL', owner, id: `${prefix}-JOL-${(i+1)/2+1}` };
    }
  };

  setupPieces(red, 9, 6);
  setupPieces(blue, 0, 3);
}

export function drawBoard() {
  const gameBoard = document.getElementById("gameBoard");
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(9, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(10, 1fr)`;

  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.onclick = () => handleCellClick(r, c);

      const piece = board[r][c];
      if (piece) {
        const symbol = getSymbol(piece.type, piece.owner);
        cell.innerHTML = `<div class="piece ${piece.owner}">${symbol}</div>`;
      }

      gameBoard.appendChild(cell);
    }
  }
}

function getSymbol(type, owner) {
  const symbols = {
    CHA: '車',
    MA: '馬',
    SANG: '象',
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
  // for extension, currently always true for red's turn
}
