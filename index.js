import { auth } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// Simple toast message function
function toast(msg, type="success") {
  const box = document.getElementById("toast");
  box.textContent = msg;
  box.style.display = "block";
  box.style.backgroundColor = type === "error" ? "#c62828" : "#2e7d32";
  setTimeout(() => box.style.display = "none", 2000);
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;

  if (!email || !pass) return toast("Fill all fields", "error");

  try {
    await signInWithEmailAndPassword(auth, email, pass);
    toast("Login successful!");
    setTimeout(() => window.location = "dashboard.html", 500);
  } catch (err) {
    toast(err.message, "error");
  }
});
