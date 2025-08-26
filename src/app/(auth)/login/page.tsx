// In src/app/(auth)/login/page.tsx

"use client" // Ensure this is at the top if you're using client-side hooks

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { createUserProfile, getUserProfile } from "@/services/userService"
import { useState } from 'react'; // Import useState

// Inline SVG for Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
        <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
        <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
        <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.021 35.826 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
    </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false); // State for email/password sign-in
  const [isSigningInWithGoogle, setIsSigningInWithGoogle] = useState(false); // State for Google sign-in

  const handleGoogleSignIn = async () => {
    setIsSigningInWithGoogle(true); // Disable button on click
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user profile exists, if not, create one
      const userProfile = await getUserProfile(user.uid);
      if (!userProfile) {
          await createUserProfile(user, {
              name: user.displayName || 'New User',
              email: user.email!,
          });
      }

      router.push('/dashboard');
      toast({
        title: "Sign-in successful",
        description: "You have been successfully signed in with Google.",
      });

    } catch (error: any) {
      console.error("Error signing in with Google: ", error);

      let errorMessage = "Failed to sign in with Google. Please try again."; // Default message

      if (error.code === 'auth/popup-closed-by-user') {
        // Silent return as user intentionally closed the popup
        return;
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "A sign-in attempt was already in progress. Please try again.";
      }
      // Handle account-exists-with-different-credential error
      else if (error.code === 'auth/account-exists-with-different-credential') {
        // You might want to implement linking logic here
        // For now, inform the user
        errorMessage = "An account with this email already exists using a different sign-in method.";
      }
      // You can add more checks for other specific Firebase auth errors here

      // Only show toast for errors other than popup-closed-by-user
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive",
      });

    } finally {
      setIsSigningInWithGoogle(false); // Re-enable button after process completes
    }
  };

  const handleEmailSignIn = async () => {
    setIsSigningIn(true); // Disable button on click
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user profile exists (optional, depends on your flow for email/password users)
      // If you create profiles on sign up, this check might not be needed here
      const userProfile = await getUserProfile(user.uid);
      if (!userProfile) {
           // Optionally create a profile if it doesn't exist, or handle this in signup
           await createUserProfile(user, {
               name: user.email!.split('@')[0], // Simple default name
               email: user.email!,
           });
      }


      router.push('/dashboard');
      toast({
        title: "Sign-in successful",
        description: "You have been successfully signed in.",
      });

    } catch (error: any) {
      console.error("Error signing in:", error);

      let errorMessage = "Failed to sign in. Please try again."; // Default message

      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        errorMessage = "Invalid email or password. Please try again.";
      }
      // You can add more checks for other specific Firebase auth errors here

      toast({
        title: "Sign-in Failed",
        description: errorMessage,
        variant: "destructive",
      });

    } finally {
      setIsSigningIn(false); // Re-enable button after process completes
    }
  };


  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center space-x-2">
            <UtensilsCrossed className="h-6 w-6" />
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
        </div>
        <CardDescription>
          Enter your email and password below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button
            className="w-full"
            onClick={handleEmailSignIn}
            disabled={isSigningIn} // Apply disabled state
        >
            {isSigningIn ? "Signing In..." : "Sign In"}
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignIn}
          disabled={isSigningInWithGoogle} // Apply the disabled state
        >
            <GoogleIcon className="mr-2 h-5 w-5" />
            Sign in with Google
        </Button>
      </CardContent>
      <CardFooter>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
