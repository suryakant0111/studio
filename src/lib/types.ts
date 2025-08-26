export type Recipe = {
  id: string;
  name: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Pre-workout' | 'Post-workout';
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number;
  protein: number; // in grams
  image: string;
  isFavorite: boolean;
  dateAdded: any; // Firestore timestamp
  diet: string[];
  ingredients?: string[];
  instructions?: string[];
  nutritionInfo?: string;
  source?: 'ai-generated' | 'user-added' | 'imported';
};

export type MealPlan = {
  id: string; // e.g. 2024-W30
  userId: string;
  days: Record<string, {
    Breakfast: Recipe | null;
    Lunch: Recipe | null;
    Dinner: Recipe | null;
  }>
}

export type FoodLogItem = {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    image?: string;
}

export type DailyLog = {
    id: string; // YYYY-MM-DD
    userId: string;
    date: any; // Firestore timestamp
    totals: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    meals: {
        breakfast: FoodLogItem[];
        lunch: FoodLogItem[];
        dinner: FoodLogItem[];
        snacks: FoodLogItem[];
    }
}
