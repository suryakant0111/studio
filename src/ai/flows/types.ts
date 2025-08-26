/**
 * @fileOverview Shared types and schemas for AI recipe flows.
 */
import {z} from 'genkit';

export const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z.array(z.string()).describe('The list of ingredients required for the recipe.'),
  instructions: z.array(z.string()).describe('The step-by-step instructions for preparing the recipe.'),
  nutritionInfo: z.string().describe('A summary of the nutritional information for the recipe (e.g., "Calories: 350, Protein: 30g").'),
});
