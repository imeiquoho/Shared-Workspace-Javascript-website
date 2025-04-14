/****************************************************
 * UTILITIES
 ****************************************************/
// Get users from local storage
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
// Save users to local storage
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
// Get current user from local storage
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("user"));
}
// Logs out current user and redirects to home page
function logoutUser() {
  localStorage.removeItem("user");
  window.location.href = "../index.html";
}

/****************************************************
 * SIGN UP: Register new user through form
 ****************************************************/

const registerForm = document.getElementById("registerForm");
// Event listener for handling new user registration
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Create a new user objects from form inputs
    const newUser = {
      name: document.getElementById("userName").value,
      phone: document.getElementById("userPhone").value,
      email: document.getElementById("userEmail").value.toLowerCase(),
      role: document.getElementById("userRole").value,
    };

    // Get existing users from local storage
    const users = getUsers();

    // Check if the user email is already registered
    const exists = users.some(u => u.email === newUser.email);
    const successMsg = document.getElementById("signupSuccess");

    // Provide feedback if the email already exists
    if (exists) {
      successMsg.style.color = "red";
      successMsg.innerText = "❌ Email already registered!";
      return;
    }

    // Save new user to local storage
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

// Redirect unauthorized users to sign-in page
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
// Display a personalized greeting and adjust navigation items based on login status
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
