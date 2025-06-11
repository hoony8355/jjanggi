// game.js - 짱기 메인 게임 로직

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

// 로그인 확인 및 시작 버튼 제어
onAuthStateChanged(getAuth(), (user) => {
  currentUser = user;
  const startBtn = document.getElementById("startBtn");
  if (user) {
    console.log("✅ 로그인됨:", user.displayName);
    startBtn?.removeAttribute("disabled");
  } else {
    console.warn("⚠️ 로그인되지 않음 - 시작 버튼 비활성화");
    startBtn?.setAttribute("disabled", "true");
  }
});

// 게임 시작
function startGame() {
  if (!currentUser) {
    console.warn("🚫 로그인 필요 - 게임 시작 불가");
    return; // alert 제거
  }

  console.log("🎮 게임 시작됨");
  initBoard();
  drawBoard();
  setTurn('red');
  setIsPlayerTurn(true);
}

document.getElementById("startBtn")?.addEventListener("click", startGame);

// 기물 클릭 처리
let selected = null;

window.handleCellClick = function (r, c) {
  if (!isPlayerTurn()) return;

  const piece = board[r][c];

  if (selected) {
    if (movePiece(selected.r, selected.c, r, c)) {
      console.log(`🔄 ${selected.r},${selected.c} → ${r},${c}`);
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
      console.log("❌ 이동 불가 위치");
      selected = null;
    }
  } else if (piece && piece === piece.toUpperCase()) {
    selected = { r, c };
    console.log(`✅ 선택: ${r},${c}`);
  }
};

window.surrender = function () {
  alert("😢 항복했습니다. 다시 도전해보세요!");
  location.reload();
};

window.restart = function () {
  if (confirm("🔁 다시 시작할까요?")) {
    startGame();
  }
};
