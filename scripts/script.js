/****************************************************
 * UTILITIES
 ****************************************************/
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}

function logoutUser() {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
}

/****************************************************
 * SIGN UP: Register new user
 ****************************************************/
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newUser = {
      name: document.getElementById("userName").value,
      phone: document.getElementById("userPhone").value,
      email: document.getElementById("userEmail").value.toLowerCase(),
      role: document.getElementById("userRole").value,
    };

    const users = getUsers();

    const exists = users.some(u => u.email === newUser.email);
    const successMsg = document.getElementById("signupSuccess");

    if (exists) {
      successMsg.style.color = "red";
      successMsg.innerText = "❌ Email already registered!";
      return;
    }

    users.push(newUser);
    saveUsers(users);

    successMsg.style.color = "green";
    successMsg.innerText = "✅ Registration successful! Redirecting to Sign In...";

    this.reset();

    setTimeout(() => {
      window.location.href = "signin.html";
    }, 1200);
  });
}

/****************************************************
 * PROTECTED PAGES
 ****************************************************/
function protectPage() {
  const user = getCurrentUser();
  if (!user) {
    alert("⚠️ Please login to access this page.");
    window.location.href = "signin.html";
  }
}

/****************************************************
 * NAVBAR USER GREETING
 ****************************************************/
function showUserGreeting() {
  const user = getCurrentUser();
  const greetingLi = document.getElementById("userGreeting");
  const logoutLi = document.getElementById("logoutLink");
  const signupLi = document.getElementById("signupLink");
  const signinLi = document.getElementById("signinLink");

  if (user) {
    if (greetingLi) {
      greetingLi.style.display = "inline";
      greetingLi.textContent = `Hi, ${user.name}`;
    }
    if (logoutLi) logoutLi.style.display = "inline";
    if (signupLi) signupLi.style.display = "none";
    if (signinLi) signinLi.style.display = "none";
  }
}
