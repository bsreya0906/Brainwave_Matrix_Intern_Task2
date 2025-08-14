import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

function toast(msg, type="success") {
  const box = document.getElementById("toast");
  box.textContent = msg;
  box.style.display = "block";
  box.style.backgroundColor = type === "error" ? "#c62828" : "#2e7d32";
  setTimeout(() => box.style.display = "none", 2000);
}

document.getElementById("signupBtn").addEventListener("click", async () => {
  const name = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const pass = document.getElementById("password").value;

  if (!name || !email || !pass) return toast("Fill all fields", "error");

  try {
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(cred.user, { displayName: name });
    toast("Registered!");
    setTimeout(() => window.location = "index.html", 500);
  } catch (err) {
    toast(err.message, "error");
  }
});
