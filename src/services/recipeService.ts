import { db } from "@/lib/firebase";
import { Recipe } from "@/lib/types";
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "firebase/firestore";

const getRecipesCollection = (userId: string) => collection(db, `users/${userId}/recipes`);

export async function getRecipes(userId: string): Promise<Recipe[]> {
    const recipesCol = getRecipesCollection(userId);
    const q = query(recipesCol, orderBy("dateAdded", "desc"));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Recipe[];
}

export async function addRecipe(userId: string, recipeData: Omit<Recipe, 'id' | 'dateAdded'>): Promise<string> {
    const recipesCol = getRecipesCollection(userId);
    const docRef = await addDoc(recipesCol, {
        ...recipeData,
        dateAdded: serverTimestamp()
    });
    return docRef.id;
}
