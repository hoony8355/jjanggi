// ✅ game.js - 짱기 메인 게임 로직
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

// 로그인 상태에 따라 시작 버튼 활성화/비활성화
onAuthStateChanged(getAuth(), (user) => {
  currentUser = user;
  const startBtn = document.getElementById("startBtn");
  if (!startBtn) return;
  user ? startBtn.removeAttribute("disabled") : startBtn.setAttribute("disabled", "true");
});

// 게임 시작 처리
function startGame() {
  if (!currentUser) return;
  initBoard();
  drawBoard();
  setTurn('red');
  setIsPlayerTurn(true);
}

// DOMContentLoaded 이후 버튼 이벤트 등록
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn")?.addEventListener("click", startGame);
  document.getElementById("restartBtn")?.addEventListener("click", restart);
  document.getElementById("surrenderBtn")?.addEventListener("click", surrender);
});

// 선택된 말 기억
let selected = null;

// 셀 클릭 처리
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

// 항복 처리
window.surrender = function () {
  alert("😢 항복했습니다. 다시 도전해보세요!");
  location.reload();
};

// 다시 시작 처리
window.restart = function () {
  if (confirm("🔁 다시 시작할까요?")) startGame();
};

// ✅ ai.js - 기본 AI 로직
export function aiTurn(board, color, movePiece, callback) {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      const piece = board[r][c];
      if (piece && piece.owner === color) {
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].length; j++) {
            if (movePiece(r, c, i, j)) {
              callback();
              return;
            }
          }
        }
      }
    }
  }
  callback(); // 이동 못할 경우에도 콜백 호출
}

// ✅ guestbook.js
// 방명록 폼 바인딩 (DOMContentLoaded 이후 실행)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guestbook-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("방명록 등록 기능은 아직 구현되지 않았습니다.");
    });
  }
});
