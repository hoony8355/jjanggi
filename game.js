// game.js - 짱기 메인 게임 로직

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";
import { board, drawBoard, initBoard, movePiece, turn, isPlayerTurn, setTurn, setIsPlayerTurn } from './pieces.js';
import { aiTurn } from './ai.js';

let currentUser = null;

// 로그인 확인 및 시작 버튼 활성화
onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    console.log("✅ 로그인됨:", user.displayName);
    currentUser = user;
    document.getElementById("startBtn")?.removeAttribute("disabled");
  } else {
    console.warn("⚠️ 로그인되지 않음");
    alert("로그인이 필요합니다.");
    document.getElementById("startBtn")?.setAttribute("disabled", "true");
  }
});

// 게임 시작
function startGame() {
  if (!currentUser) {
    alert("로그인이 필요합니다.");
    return;
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
    // 이동 시도
    if (movePiece(selected.r, selected.c, r, c)) {
      console.log(`🔄 ${selected.r},${selected.c} → ${r},${c}`);
      selected = null;
      setIsPlayerTurn(false);

      // AI 턴 지연 처리
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
    // 사용자 말 선택
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
