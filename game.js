import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import {
  board,
  drawBoard,
  initBoard,
  movePiece,
  turn,
  isPlayerTurn,
  setTurn,
  setIsPlayerTurn
} from './pieces.js';
import { aiTurn } from './ai.js';

let currentUser = null;

onAuthStateChanged(getAuth(), (user) => {
  currentUser = user;
  const startBtn = document.getElementById("startBtn");
  if (!startBtn) return;

  if (user) {
    startBtn.removeAttribute("disabled");
  } else {
    startBtn.setAttribute("disabled", "true");
  }
});

function startGame() {
  if (!currentUser) return;
  initBoard();
  drawBoard();
  setTurn('red');
  setIsPlayerTurn(true);
}

document.getElementById("startBtn")?.addEventListener("click", () => {
  startGame();
});

window.restart = function () {
  const confirmRestart = confirm("🔁 다시 시작할까요?");
  if (confirmRestart) startGame();
};

window.surrender = function () {
  alert("😢 항복했습니다. 다시 도전해보세요!");
  location.reload();
};

let selected = null;

window.handleCellClick = function (r, c) {
  if (!isPlayerTurn()) return;

  const piece = board[r][c];
  if (selected) {
    const moved = movePiece(selected.r, selected.c, r, c);
    if (moved) {
      selected = null;
      setIsPlayerTurn(false);
      setTimeout(() => {
        aiTurn(board, 'blue', movePiece, () => {
          setTurn('red');
          setIsPlayerTurn(true);
          drawBoard();
        });
      }, 500);
    } else {
      selected = null;
    }
  } else if (piece && piece.owner === 'red') {
    selected = { r, c };
  }
};
