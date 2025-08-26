// In src/app/page.tsx

"use client"; // Use client component for authentication state check

import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Assuming you have your firebase auth instance exported from here

export default function Home() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, redirect to dashboard
        redirect('/dashboard');
      } else {
        // User is signed out, redirect to login
        redirect('/login');
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Optionally display a loading state while checking authentication
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Loading...</p> {/* Or a spinner */}
    </div>
  );
}
