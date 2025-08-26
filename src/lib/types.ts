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
  dateAdded: string; // ISO string
  diet: ('Vegetarian' | 'Vegan' | 'Keto' | 'High-protein' | 'Low-carb')[];
};
