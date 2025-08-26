import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

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
    await setDoc(userDocRef, { 
        ...data,
        // Ensure createdAt is only set once
        createdAt: data.createdAt || serverTimestamp(), 
    }, { merge: true });
}
