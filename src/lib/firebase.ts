import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Environment detection
const isClient = typeof window !== 'undefined';
const isLocalhost = isClient && 
  (window.location.hostname === 'localhost' || 
   window.location.hostname === '127.0.0.1');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBNDfwcDnUaJ...",
  authDomain: isLocalhost 
    ? 'localhost' 
    : process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nutri-chef-seven.vercel.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nutrichef-6a8sc",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nutrichef-6a8sc.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "824487196976",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:824487196976:web:8f4d44461e9b779163b0f5",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app;
let auth;
let db;

if (isClient) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Enable offline persistence
    if (process.env.NODE_ENV !== 'production') {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('Offline persistence can only be enabled in one tab at a time.');
        } else if (err.code === 'unimplemented') {
          console.warn('The current browser does not support offline persistence.');
        }
      });
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  // Server-side initialization
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
}

export { app, auth, db };