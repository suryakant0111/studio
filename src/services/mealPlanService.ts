import { db } from "@/lib/firebase";
import { MealPlan } from "@/lib/types";
import { doc, getDoc, setDoc } from "firebase/firestore";

const getMealPlanRef = (userId: string, planId: string) => doc(db, `users/${userId}/mealPlans`, planId);

export async function getMealPlan(userId: string, planId: string): Promise<MealPlan | null> {
    const docRef = getMealPlanRef(userId, planId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as MealPlan;
    }
    return null;
}

export async function saveMealPlan(userId: string, plan: Omit<MealPlan, 'id' | 'userId'>): Promise<void> {
    const planId = new Date().toISOString().slice(0, 10); // Simple ID for now
    const docRef = getMealPlanRef(userId, planId);
    await setDoc(docRef, { userId, ...plan }, { merge: true });
}
