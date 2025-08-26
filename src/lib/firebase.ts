import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBNDfwcDnUaJTPBDnR6hz67tpvUUn7AG2I",
  authDomain: process.env.NODE_ENV === 'development' 
    ? 'localhost' 
    : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nutrichef-6a8sc.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nutrichef-6a8sc",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nutrichef-6a8sc.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "824487196976",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:824487196976:web:8f4d44461e9b779163b0f5",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };