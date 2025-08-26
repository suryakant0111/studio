import { db } from "@/lib/firebase";
import { DailyLog, FoodLogItem } from "@/lib/types";
import { doc, getDoc, setDoc, serverTimestamp, updateDoc, arrayUnion, runTransaction } from "firebase/firestore";

const getDailyLogRef = (userId: string, dateId: string) => doc(db, `users/${userId}/nutritionLog`, dateId);

async function createEmptyLog(userId: string, dateId: string): Promise<DailyLog> {
    const newLog: DailyLog = {
        id: dateId,
        userId,
        date: serverTimestamp(),
        totals: { calories: 0, protein: 0, carbs: 0, fats: 0 },
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
    };
    await setDoc(getDailyLogRef(userId, dateId), newLog);
    return newLog;
}

export async function getDailyLog(userId: string, dateId: string): Promise<DailyLog> {
    const docRef = getDailyLogRef(userId, dateId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as DailyLog;
    }
    return createEmptyLog(userId, dateId);
}

export async function addFoodToLog(userId: string, dateId: string, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks', food: FoodLogItem): Promise<void> {
    const docRef = getDailyLogRef(userId, dateId);

    await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);
        
        if (!docSnap.exists()) {
            await createEmptyLog(userId, dateId);
        }

        transaction.update(docRef, {
            [`meals.${mealType}`]: arrayUnion(food),
            'totals.calories': (docSnap.data()?.totals.calories || 0) + food.calories,
            'totals.protein': (docSnap.data()?.totals.protein || 0) + food.protein,
            'totals.carbs': (docSnap.data()?.totals.carbs || 0) + food.carbs,
            'totals.fats': (docSnap.data()?.totals.fats || 0) + food.fats,
        });
    });
}
