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

// 로그인 상태에 따라 시작 버튼 활성화/비활성화
onAuthStateChanged(getAuth(), (user) => {
  currentUser = user;
  const startBtn = document.getElementById("startBtn");

  if (!startBtn) {
    console.warn("❌ [DOM 오류] startBtn 버튼을 찾을 수 없습니다.");
    return;
  }

  if (user) {
    console.log("✅ [로그인됨] 사용자:", user.displayName);
    startBtn.removeAttribute("disabled");
  } else {
    console.warn("⚠️ [미로그인] 게임 시작 불가. 시작 버튼 비활성화");
    startBtn.setAttribute("disabled", "true");
  }
});

// 게임 시작 처리
function startGame() {
  console.log("[🎯 startGame 호출됨]");
  if (!currentUser) {
    console.warn("🚫 [오류] 로그인되지 않아 게임 시작 불가");
    return;
  }

  console.log("🎮 [게임 시작됨] 보드 초기화 및 턴 세팅");
  initBoard();
  drawBoard();
  setTurn('red');
  setIsPlayerTurn(true);
  console.log("✅ [초기화 완료] 턴: red / 사용자 턴 여부:", isPlayerTurn());
}

// 시작 버튼 이벤트 바인딩
const startBtn = document.getElementById("startBtn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    console.log("[🖱️ 클릭] startBtn 클릭됨");
    startGame();
  });
} else {
  console.warn("❌ [DOM 오류] startBtn 요소가 없어 이벤트를 바인딩하지 못했습니다.");
}

// 선택된 말 기억
let selected = null;

// 셀 클릭 처리
window.handleCellClick = function (r, c) {
  console.log(`[👆 셀 클릭됨] 위치: (${r}, ${c})`);
  if (!isPlayerTurn()) {
    console.log("⛔ [차단] 현재는 플레이어 턴이 아님");
    return;
  }

  const piece = board[r][c];
  if (selected) {
    console.log(`[➡️ 이동 시도] ${selected.r},${selected.c} → ${r},${c}`);
    const moved = movePiece(selected.r, selected.c, r, c);

    if (moved) {
      selected = null;
      setIsPlayerTurn(false);
      console.log("✅ [이동 성공] AI 턴으로 전환");

      // AI 처리
      setTimeout(() => {
        console.log("🤖 [AI 턴 시작]");
        aiTurn(board, 'blue', movePiece, () => {
          console.log("✅ [AI 완료] 다시 플레이어 턴");
          setTurn('red');
          setIsPlayerTurn(true);
          drawBoard();
        });
      }, 500);
    } else {
      console.warn("❌ [이동 실패] 유효하지 않은 위치입니다.");
      selected = null;
    }
  } else if (piece && piece.owner === 'red') {
    selected = { r, c };
    console.log(`✅ [기물 선택됨] 위치: ${r},${c}, 기물: ${piece.id}`);
  } else {
    console.log("⚠️ [선택 무시] 플레이어 기물이 아닙니다.");
  }
};

// 항복 처리
window.surrender = function () {
  alert("😢 항복했습니다. 다시 도전해보세요!");
  console.log("🏳️ [항복] 게임 리셋");
  location.reload();
};

// 다시 시작 처리
window.restart = function () {
  const confirmRestart = confirm("🔁 다시 시작할까요?");
  if (confirmRestart) {
    console.log("♻️ [다시 시작] 게임 초기화");
    startGame();
  } else {
    console.log("🚫 [다시 시작 취소]");
  }
};
