import { auth, storage, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// Signup
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  const profilePic = e.target.profilePic.files[0];

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    let photoURL = "";

    if (profilePic) {
      const storageRef = ref(storage, `profilePics/${userCred.user.uid}`);
      await uploadBytes(storageRef, profilePic);
      photoURL = await getDownloadURL(storageRef);
      await updateProfile(userCred.user, { photoURL });
    }

    await setDoc(doc(db, "users", userCred.user.uid), {
      email,
      photoURL
    });

    alert("Signup successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
});

// Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
});
