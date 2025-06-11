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

// 로그인 상태에 따라 시작 버튼 활성화
onAuthStateChanged(getAuth(), (user) => {
  currentUser = user;
  const startBtn = document.getElementById("startBtn");

  if (!startBtn) {
    console.warn("❌ startBtn 버튼이 존재하지 않음");
    return;
  }

  if (user) {
    console.log("✅ 로그인됨:", user.displayName);
    startBtn.removeAttribute("disabled");
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "inline-block";
    document.getElementById("user-info").textContent = `👤 ${user.displayName}`;
  } else {
    console.warn("⚠️ 로그인 필요");
    startBtn.setAttribute("disabled", "true");
    document.getElementById("login-btn").style.display = "inline-block";
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("user-info").textContent = "";
  }
});

// 게임 시작 처리
function startGame() {
  if (!currentUser) {
    alert("로그인 후 게임을 시작할 수 있습니다.");
    return;
  }

  console.log("🎮 게임 시작");
  initBoard();
  drawBoard();
  setTurn('red');
  setIsPlayerTurn(true);
}

const startBtn = document.getElementById("startBtn");
if (startBtn) {
  startBtn.addEventListener("click", () => {
    console.log("[🖱️ 클릭] startBtn 클릭됨");
    startGame();
  });
}

// 선택된 말 기억
let selected = null;

// 셀 클릭 처리
window.handleCellClick = function (r, c) {
  if (!isPlayerTurn()) {
    console.log("❌ 플레이어 턴 아님");
    return;
  }

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
      console.warn("❌ 이동 실패");
      selected = null;
    }
  } else if (piece && piece.owner === 'red') {
    selected = { r, c };
    console.log(`✅ 선택됨 (${r},${c}) ${piece.type}`);
  } else {
    console.log("⚠️ 선택 무시: 빨간색 기물이 아님");
  }
};

// 항복 처리
window.surrender = function () {
  alert("항복하셨습니다. 다시 도전해보세요!");
  location.reload();
};

// 다시 시작 처리
window.restart = function () {
  const confirmRestart = confirm("다시 시작하시겠습니까?");
  if (confirmRestart) {
    startGame();
  }
};
