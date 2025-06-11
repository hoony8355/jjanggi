// auth.js - Firebase Google 로그인 처리

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

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

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userInfo = document.getElementById("user-info");

loginBtn.addEventListener("click", () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("로그인 성공:", user);
    })
    .catch((error) => {
      console.error("로그인 오류:", error);
    });
});

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    console.log("로그아웃 성공");
  });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    userInfo.innerHTML = `👤 ${user.displayName}`;
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    userInfo.innerHTML = "<button id='login-btn'>Google 로그인</button>";
  }
});
