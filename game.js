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
let selected = null; // 선택된 기물 좌표

// ✅ 로그인 상태 확인 및 시작 버튼 제어
onAuthStateChanged(getAuth(), (user) => {
  currentUser = user;
  const startBtn = document.getElementById("startBtn");

  if (!startBtn) {
    console.error("❌ [DOM] 시작 버튼 요소(#startBtn)를 찾을 수 없습니다.");
    return;
  }

  if (user) {
    console.log("✅ [AUTH] 로그인됨:", user.displayName);
    startBtn.removeAttribute("disabled");
  } else {
    console.warn("⚠️ [AUTH] 로그인되지 않음 - 시작 버튼 비활성화");
    startBtn.setAttribute("disabled", "true");
  }
});

// ✅ 게임 시작 함수
function startGame() {
  console.log("🎮 [GAME] 게임 시작 요청됨");

  if (!currentUser) {
    console.warn("🚫 [GAME] 로그인 필요. 시작 불가");
    return;
  }

  // 보드 초기화
  const gameBoard = document.getElementById("gameBoard");
  if (gameBoard) {
    gameBoard.innerHTML = ""; // 보드 초기화
  } else {
    console.error("❌ [DOM] 게임 보드(#gameBoard)를 찾을 수 없습니다.");
  }

  initBoard();
  drawBoard();
  setTurn('red');
  setIsPlayerTurn(true);
  selected = null;

  console.log("✅ [GAME] 보드 초기화 완료 - 턴: red / 사용자 턴: true");
}

// ✅ 시작 버튼 이벤트 등록
const startBtn = document.getElementById("startBtn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    console.log("🖱️ [CLICK] 게임 시작 버튼 클릭됨");
    startGame();
  });
} else {
  console.warn("⚠️ [DOM] startBtn 요소를 찾을 수 없어 이벤트 등록 실패");
}

// ✅ 셀 클릭 핸들러
window.handleCellClick = function (r, c) {
  console.log(`👆 [CLICK] 셀 클릭 - (${r}, ${c})`);

  if (!isPlayerTurn()) {
    console.log("⛔ [TURN] 플레이어 턴 아님. 입력 차단");
    return;
  }

  const piece = board[r][c];

  if (selected) {
    const moved = movePiece(selected.r, selected.c, r, c);
    if (moved) {
      console.log(`✅ [MOVE] ${selected.r},${selected.c} → ${r},${c}`);
      selected = null;
      setIsPlayerTurn(false);

      setTimeout(() => {
        console.log("🤖 [AI] 턴 시작");
        aiTurn(board, 'blue', movePiece, () => {
          console.log("✅ [AI] 완료. 플레이어 턴으로 전환");
          setTurn('red');
          setIsPlayerTurn(true);
          drawBoard();
        });
      }, 500);
    } else {
      console.warn("❌ [MOVE] 이동 불가 위치");
      selected = null;
    }
  } else if (piece && piece.owner === 'red') {
    selected = { r, c };
    console.log(`🎯 [SELECT] 기물 선택: (${r}, ${c}) - ${piece.id}`);
  } else {
    console.log("⚠️ [SELECT] 선택 무시: 플레이어 기물 아님");
  }
};

// ✅ 항복 함수
window.surrender = function () {
  alert("😢 항복했습니다. 다시 도전해보세요!");
  console.log("🏳️ [SURRENDER] 게임 리셋");
  location.reload();
};

// ✅ 다시 시작 함수
window.restart = function () {
  if (confirm("🔁 다시 시작할까요?")) {
    console.log("♻️ [RESTART] 게임 초기화");
    startGame();
  } else {
    console.log("🚫 [RESTART] 취소됨");
  }
};
