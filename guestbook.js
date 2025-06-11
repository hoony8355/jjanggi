// guestbook.js - 간단한 방명록 기능 (LocalStorage 기반)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("guestbook-form");
  const nicknameInput = document.getElementById("nickname");
  const commentInput = document.getElementById("comment");
  const entriesList = document.getElementById("guestbook-entries");

  function loadEntries() {
    const saved = localStorage.getItem("guestbookEntries");
    const entries = saved ? JSON.parse(saved) : [];
    entriesList.innerHTML = "";
    entries.slice(-10).reverse().forEach(({ nickname, comment, timestamp }) => {
      const li = document.createElement("li");
      li.textContent = `[${nickname}] ${comment} (${new Date(timestamp).toLocaleString()})`;
      entriesList.appendChild(li);
    });
  }

  function saveEntry(nickname, comment) {
    const saved = localStorage.getItem("guestbookEntries");
    const entries = saved ? JSON.parse(saved) : [];
    entries.push({ nickname, comment, timestamp: Date.now() });
    localStorage.setItem("guestbookEntries", JSON.stringify(entries));
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nickname = nicknameInput.value.trim();
    const comment = commentInput.value.trim();
    if (!nickname || !comment) return;

    saveEntry(nickname, comment);
    loadEntries();
    nicknameInput.value = "";
    commentInput.value = "";
  });

  loadEntries();
});
