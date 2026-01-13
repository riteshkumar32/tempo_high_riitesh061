// minimal client-side auth + UI glue for serverless API
let AUTH_USER = null;
let AUTH_PASS = null;

// DOM refs
const userInput = document.getElementById("user");
const passInput = document.getElementById("pass");
const textInput = document.getElementById("text");
const appDiv = document.getElementById("app");
const loginSection = document.getElementById("loginSection");

const loginBtn = document.getElementById("loginBtn");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

const loginMsg = document.getElementById("loginMsg");
const saveMsg = document.getElementById("saveMsg");
const themeToggle = document.getElementById("themeToggle");

if (!userInput || !passInput || !textInput || !appDiv) {
  throw new Error("Required DOM elements not found");
}

/* ---------------- Theme (dark) ---------------- */
function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️ Light";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "🌙 Dark";
  }
  localStorage.setItem("theme", theme);
}

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.textContent = isDark ? "☀️ Light" : "🌙 Dark";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
// load saved theme
if (localStorage.getItem("theme") === "dark") setTheme("dark");

/* ---------------- Login ---------------- */
async function login() {
  loginMsg.textContent = "";
  saveMsg.textContent = "";

  const username = userInput.value.trim();
  const password = passInput.value.trim();

  if (!username || !password) {
    loginMsg.textContent = "Enter username and password.";
    return;
  }

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      loginMsg.textContent = "Invalid login.";
      return;
    }

    // STORE auth locally for subsequent save calls (demo)
    AUTH_USER = username;
    AUTH_PASS = password;

    loginSection.hidden = true;
    appDiv.hidden = false;
    await loadText();

  } catch (err) {
    console.error(err);
    loginMsg.textContent = "Server error.";
  }
}

/* ---------------- Save ---------------- */
async function save() {
  saveMsg.textContent = "";

  if (!AUTH_USER || !AUTH_PASS) {
    saveMsg.textContent = "Session expired. Login again.";
    return;
  }

  try {
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: AUTH_USER,
        password: AUTH_PASS,
        text: textInput.value
      })
    });

    if (!res.ok) {
      saveMsg.textContent = "Save failed (invalid session).";
      return;
    }
    saveMsg.textContent = "Saved on server.";
  } catch (err) {
    console.error(err);
    saveMsg.textContent = "Server error while saving.";
  }
}

/* ---------------- Load ---------------- */
async function loadText() {
  try {
    const res = await fetch("/api/save");
    const data = await res.json();
    textInput.value = data.text || "";
  } catch (err) {
    console.error(err);
  }
}

/* ---------------- Logout ---------------- */
function logout() {
  AUTH_USER = null;
  AUTH_PASS = null;

  userInput.value = "";
  passInput.value = "";
  textInput.value = "";
  loginSection.hidden = false;
  appDiv.hidden = true;
  loginMsg.textContent = "";
  saveMsg.textContent = "";
}

/* ---------------- Event bindings ---------------- */
loginBtn.addEventListener("click", login);
saveBtn.addEventListener("click", save);
logoutBtn.addEventListener("click", logout);

// allow Enter to submit login
passInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") login();
});
