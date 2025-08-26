
"use client"

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
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { createUserProfile } from "@/services/userService"

export default function SignUpPage() {
    const router = useRouter();
    const { toast } = useToast();

    const handleEmailSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const name = (event.currentTarget.elements.namedItem('name') as HTMLInputElement).value;
        const email = (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
        const password = (event.currentTarget.elements.namedItem('password') as HTMLInputElement).value;

        if (!name || !email || !password) {
            toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update Firebase Auth profile
            await updateProfile(user, { displayName: name });

            // Create user profile in Firestore
            await createUserProfile(user, { name, email });

            toast({ title: "Success", description: "Account created successfully!" });
            router.push('/dashboard');
            
        } catch (error: any) {
            console.error("Error signing up: ", error);
            let description = "Failed to create account. Please try again.";
            if (error.code === 'auth/email-already-in-use') {
                description = "This email is already in use.";
            } else if (error.code === 'auth/weak-password') {
                description = "Password should be at least 6 characters.";
            }
            toast({ title: "Sign-up Error", description, variant: "destructive" });
        }
    };

    return (
        <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
            <div className="inline-flex justify-center">
                <UtensilsCrossed className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>
            Enter your details below to get started
            </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <form onSubmit={handleEmailSignUp} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" type="text" placeholder="Alex Doe" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required />
                </div>
                <Button type="submit" className="w-full">Create Account</Button>
            </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
                Sign in
            </Link>
            </div>
        </CardFooter>
        </Card>
    )
}
