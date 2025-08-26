'use server';
/**
 * @fileOverview An AI recipe generator that creates recipes based on ingredients.
 *
 * - generateRecipe - A function that handles the recipe generation process.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z
    .string()
    .describe('A comma-separated list of ingredients to use in the recipe.'),
  purpose: z
    .string()
    .describe(
      'The purpose of the recipe, such as muscle gain, weight loss, or energy boost.'
    ),
  numPeople: z
    .number()
    .min(1)
    .max(8)
    .describe('The number of people the recipe should serve.'),
  availableTime: z
    .number()
    .min(5)
    .max(120)
    .describe('The amount of time available to prepare the recipe, in minutes.'),
  dietaryRestrictions: z
    .string()
    .describe('A comma-separated list of dietary restrictions, such as vegetarian, vegan, or keto.')
    .optional(),
  cuisinePreference: z
    .string()
    .describe('The preferred cuisine for the recipe, such as Italian, Chinese, or Mexican.')
    .optional(),
  cookingSkillLevel: z
    .string()
    .describe('The cooking skill level of the user, such as beginner, intermediate, or advanced.')
    .optional(),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  recipeName: z.string().describe('The name of the generated recipe.'),
  ingredients: z.array(z.string()).describe('The list of ingredients required for the recipe.'),
  instructions: z.array(z.string()).describe('The step-by-step instructions for preparing the recipe.'),
  nutritionInfo: z.string().describe('A summary of the nutritional information for the recipe (e.g., "Calories: 350, Protein: 30g").'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `You are a world-class chef specializing in creating delicious and healthy recipes based on user-provided ingredients and preferences.

  Based on the following information, create a new recipe. Ensure ingredients and instructions are returned as arrays of strings.

  Ingredients: {{{ingredients}}}
  Purpose: {{{purpose}}}
  Number of People: {{{numPeople}}}
  Available Time: {{{availableTime}}} minutes
  Dietary Restrictions: {{#if dietaryRestrictions}}{{{dietaryRestrictions}}}{{else}}None{{/if}}
  Cuisine Preference: {{#if cuisinePreference}}{{{cuisinePreference}}}{{else}}None{{/if}}
  Cooking Skill Level: {{#if cookingSkillLevel}}{{{cookingSkillLevel}}}{{else}}Any{{/if}}`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
