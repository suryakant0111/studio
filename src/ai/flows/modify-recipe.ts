'use server';
/**
 * @fileOverview An AI agent to modify an existing recipe based on user instructions.
 *
 * - modifyRecipe - A function that handles the recipe modification process.
 * - ModifyRecipeInput - The input type for the modifyRecipe function.
 * - ModifyRecipeOutput - The return type for the modifyRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateRecipeOutputSchema } from './generate-recipe';

const ModifyRecipeInputSchema = z.object({
  recipe: GenerateRecipeOutputSchema.describe('The original recipe object to be modified.'),
  instruction: z.string().describe('The user\'s instruction for how to modify the recipe (e.g., "make it vegan", "double the servings", "add a spicy kick").'),
});
export type ModifyRecipeInput = z.infer<typeof ModifyRecipeInputSchema>;

export type ModifyRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function modifyRecipe(input: ModifyRecipeInput): Promise<ModifyRecipeOutput> {
  return modifyRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'modifyRecipePrompt',
  input: {schema: ModifyRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `You are a world-class chef. A user wants to modify an existing recipe. 
  
  Based on the user's instruction, modify the following recipe. Ensure you return the entire recipe in the same format, including the name, ingredients, instructions, and nutrition info.

  Original Recipe:
  Name: {{{recipe.recipeName}}}
  Ingredients: {{#each recipe.ingredients}}- {{{this}}}{{/each}}
  Instructions: {{#each recipe.instructions}}- {{{this}}}{{/each}}
  Nutrition Info: {{{recipe.nutritionInfo}}}

  User's Instruction: "{{{instruction}}}"

  Generate the complete, modified recipe.`,
});

const modifyRecipeFlow = ai.defineFlow(
  {
    name: 'modifyRecipeFlow',
    inputSchema: ModifyRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
