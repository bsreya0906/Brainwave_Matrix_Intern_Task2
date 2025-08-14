import { auth, db, storage } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import {
  collection, addDoc, getDocs, doc, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

// Toast UI helper
function toast(msg, type="success") {
  const box = document.getElementById("toast");
  box.textContent = msg;
  box.style.display = "block";
  box.style.backgroundColor = type === "error" ? "#c62828" : "#2e7d32";
  setTimeout(() => box.style.display = "none", 2000);
}

let currentUser = null;
let cachedPosts = [];

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
  if (!user) window.location = "index.html";
  else { currentUser = user; loadPosts(); }
});

// Handle new posts
document.getElementById("postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = e.target.title.value.trim();
  const content = e.target.content.value.trim();
  const imgFile = e.target.image.files[0];
  let imageURL = "";

  try {
    if (imgFile) {
      const imgRef = ref(storage, `postImages/${Date.now()}-${imgFile.name}`);
      await uploadBytes(imgRef, imgFile);
      imageURL = await getDownloadURL(imgRef);
    }

    await addDoc(collection(db, "posts"), {
      title, content, imageURL,
      authorId: currentUser.uid,
      authorEmail: currentUser.email,
      timestamp: serverTimestamp(),
      likesCount: 0
    });

    e.target.reset();
    toast("Post added");
    loadPosts();
  } catch (err) { toast(err.message, "error"); }
});

// Load & render posts
async function loadPosts() {
  const cont = document.getElementById("postsContainer");
  cont.innerHTML = "Loading...";
  const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
  const snap = await getDocs(q);
  cachedPosts = snap.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
  renderPosts(cachedPosts);
}

// Render posts on screen
function renderPosts(posts) {
  const cont = document.getElementById("postsContainer");
  cont.innerHTML = "";
  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "post-card";
    card.innerHTML = `
      <h3>${post.title}</h3>
      ${post.imageURL ? `<img class="post-img" src="${post.imageURL}">` : ""}
      <p>${post.content}</p>
      <small>By ${post.authorEmail}</small><br/>
      <button data-like="${post.id}">❤️ Like (${post.likesCount})</button>
      ${post.authorId === currentUser.uid ?
        `<button data-edit="${post.id}">Edit</button>
         <button data-del="${post.id}">Delete</button>` : ""}
    `;
    cont.appendChild(card);
  });
}

// Event delegation for like/edit/delete
document.getElementById("postsContainer").addEventListener("click", async (e) => {
  if (e.target.dataset.like) {
    const id = e.target.dataset.like;
    const refDoc = doc(db, "posts", id);
    const snap = await getDoc(refDoc);
    await updateDoc(refDoc, { likesCount: (snap.data().likesCount || 0) + 1 });
    loadPosts();
  }
  if (e.target.dataset.edit) {
    const id = e.target.dataset.edit;
    const newTitle = prompt("New Title:");
    const newContent = prompt("New Content:");
    if(newTitle && newContent) {
      await updateDoc(doc(db, "posts", id), { title: newTitle, content: newContent });
      loadPosts();
    }
  }
  if (e.target.dataset.del) {
    if (confirm("Delete post?")) {
      await deleteDoc(doc(db, "posts", e.target.dataset.del));
      loadPosts();
    }
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => window.location = "index.html");
});
