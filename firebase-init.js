import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCZSaacAcA5x60NIGKUlvAQ4w1LUX-wwNE",
  authDomain: "tjpwcards.firebaseapp.com",
  projectId: "tjpwcards",
  storageBucket: "tjpwcards.firebasestorage.app",
  messagingSenderId: "373015570486",
  appId: "1:373015570486:web:691dbd7a6d5ecc9ef61097"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export async function initFirebase() {
  await signInAnonymously(auth);
  console.log("ログイン成功:", auth.currentUser.uid);
}

export { db, auth };