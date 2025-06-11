// auth.js - Firebase Google 로그인 처리 v2 (리디렉션 없음 + UI 제어 개선)

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9WYtLGKHfmgVi27MEc_SRCJyAoZEbVzs",
  authDomain: "jjanggi.firebaseapp.com",
  projectId: "jjanggi",
  storageBucket: "jjanggi.firebasestorage.app",
  messagingSenderId: "704868438387",
  appId: "1:704868438387:web:fdd3b05da0883f1b497506",
  measurementId: "G-KJP25GES00"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM 요소
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");
const startBtn = document.getElementById("startBtn");

// 로그인 버튼 이벤트
loginBtn?.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("✅ 로그인 성공:", result.user);
    })
    .catch((error) => {
      console.error("❌ 로그인 실패:", error);
    });
});

// 로그아웃 버튼 이벤트
logoutBtn?.addEventListener("click", () => {
  signOut(auth).then(() => {
    console.log("👋 로그아웃 완료");
  });
});

// 상태 변화 감지
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ 로그인 상태:", user.displayName);
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (userInfo) userInfo.textContent = `👤 ${user.displayName}`;
    if (startBtn) startBtn.disabled = false;
  } else {
    console.warn("⚠️ 로그인 필요 - 시작 버튼 비활성화됨");
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (userInfo) userInfo.textContent = "로그인 필요";
    if (startBtn) startBtn.disabled = true;
  }
});
