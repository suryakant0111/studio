import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "nutrichef-6a8sc",
  appId: "1:824487196976:web:8f4d44461e9b779163b0f5",
  storageBucket: "nutrichef-6a8sc.firebasestorage.app",
  apiKey: "AIzaSyBNDfwcDnUaJTPBDnR6hz67tpvUUn7AG2I",
  authDomain: "nutrichef-6a8sc.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "824487196976",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
