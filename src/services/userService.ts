import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    photoURL?: string;
    createdAt: any;
    healthGoals: {
        primaryGoal: string;
        dailyCalories: number;
        dailyProtein: number;
        dailyCarbs: number;
        dailyFats: number;
    };
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
        return userDocSnap.data() as UserProfile;
    } else {
        return null;
    }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    const userDocRef = doc(db, "users", userId);
    await setDoc(userDocRef, data, { merge: true });
}

export async function createUserProfile(user: User, additionalData: { name: string, email: string }): Promise<void> {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        const { uid, photoURL } = user;
        const { name, email } = additionalData;

        const defaultProfile: UserProfile = {
            uid,
            name,
            email,
            photoURL: photoURL || '',
            createdAt: serverTimestamp(),
            healthGoals: {
                primaryGoal: 'maintenance',
                dailyCalories: 2000,
                dailyProtein: 150,
                dailyCarbs: 200,
                dailyFats: 60,
            }
        };
        
        await setDoc(userDocRef, defaultProfile);
    }
}
