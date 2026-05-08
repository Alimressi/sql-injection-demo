const loginForm = document.getElementById("login-form");
const logoutBtn = document.getElementById("logout-btn");

const loginCard = document.getElementById("login-card");
const accountCard = document.getElementById("account-card");
const message = document.getElementById("message");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const INJECTION_PATTERN = /\bor\s+1\s*=\s*1\b/i;

function buildUnsafeQuery(username, password) {
  return (
    "SELECT * FROM users WHERE login = '" +
    username +
    "' AND password = '" +
    password +
    "'"
  );
}

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `message ${type}`.trim();
}

function openAccount(reason) {
  loginCard.classList.add("hidden");
  accountCard.classList.remove("hidden");
  setMessage("");
  console.log(`Account opened: ${reason}`);
}

function resetView() {
  accountCard.classList.add("hidden");
  loginCard.classList.remove("hidden");
  loginForm.reset();
  usernameInput.focus();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  const unsafeQuery = buildUnsafeQuery(username, password);

  if (username === "admin" && password === "admin") {
    openAccount("normal-login");
    return;
  }

  // Демонстрационный уязвимый путь: условие похоже на OR 1 = 1 и обходится проверка пароля.
  if (INJECTION_PATTERN.test(username)) {
    console.log("Potentially unsafe SQL:", unsafeQuery);
    setMessage("Вход выполнен через демонстрационный уязвимый путь.", "success");
    openAccount("injection-like-login");
    return;
  }

  setMessage("Неверный логин или пароль.", "error");
});

logoutBtn.addEventListener("click", () => {
  resetView();
  setMessage("Вы вышли из кабинета.", "success");
});
