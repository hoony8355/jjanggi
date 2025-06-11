// firebaseService.js - Firestore 연동 로직

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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
const db = getFirestore(app);

// 사용자 정보 저장 또는 초기화
export async function saveUserProgress(uid, userData) {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, userData, { merge: true });
}

// 사용자 정보 불러오기
export async function loadUserProgress(uid) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? snapshot.data() : null;
}

// 승점 사용해서 특수말 구매
export async function purchasePiece(uid, pieceId, cost) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return false;

  const data = snapshot.data();
  if (data.victoryPoints >= cost) {
    await updateDoc(userRef, {
      victoryPoints: data.victoryPoints - cost,
      unlockedPieces: arrayUnion(pieceId)
    });
    return true;
  } else {
    return false;
  }
}

// 스테이지 미션 보상 수령
export async function claimMissionReward(uid, stageId, rewardPiece, bonusPoints) {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) return;

  await updateDoc(userRef, {
    stage: stageId,
    victoryPoints: snapshot.data().victoryPoints + bonusPoints,
    unlockedPieces: arrayUnion(rewardPiece)
  });
}
