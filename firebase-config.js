// ==============================
// Firebase: Configuration + Init
// ==============================

// Import the Firebase SDKs we need (direct from Google CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

// Your Firebase project settings (keep safe!)
const firebaseConfig = {
  apiKey: "AIzaSyCN-SI9hOugMvUBdOsFnaTn18gb9Zd4ww4",
  authDomain: "blogplatform-826d2.firebaseapp.com",
  projectId: "blogplatform-826d2",
  storageBucket: "blogplatform-826d2.appspot.com",
  messagingSenderId: "47416411868",
  appId: "1:47416411868:web:3b672e45e70e23089c9619",
  measurementId: "G-4H965YK34J"
};

// Initialize Firebase services
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);      // Database
export const auth = getAuth(app);         // Authentication
export const storage = getStorage(app);   // File Storage
