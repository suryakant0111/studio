'use server';

/**
 * @fileOverview An AI agent to suggest ingredient substitutions.
 *
 * - suggestIngredientSubstitutions - A function that suggests ingredient substitutions based on dietary restrictions or availability.
 * - SuggestIngredientSubstitutionsInput - The input type for the suggestIngredientSubstitutions function.
 * - SuggestIngredientSubstitutionsOutput - The return type for the suggestIngredientSubstitutions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIngredientSubstitutionsInputSchema = z.object({
  ingredient: z.string().describe('The ingredient to find a substitution for.'),
  dietaryRestrictions: z.string().optional().describe('Dietary restrictions to consider, such as vegetarian, vegan, gluten-free, etc.'),
  availableIngredients: z.string().optional().describe('List of available ingredients to use as substitutions.'),
  reason: z.string().optional().describe('The reason for the substitution, such as allergy or lack of availability.'),
});
export type SuggestIngredientSubstitutionsInput = z.infer<typeof SuggestIngredientSubstitutionsInputSchema>;

const SuggestIngredientSubstitutionsOutputSchema = z.object({
  substitutions: z.array(z.string()).describe('A list of suggested ingredient substitutions.'),
  reasoning: z.string().describe('The reasoning behind the suggested substitutions.'),
});
export type SuggestIngredientSubstitutionsOutput = z.infer<typeof SuggestIngredientSubstitutionsOutputSchema>;

export async function suggestIngredientSubstitutions(input: SuggestIngredientSubstitutionsInput): Promise<SuggestIngredientSubstitutionsOutput> {
  return suggestIngredientSubstitutionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIngredientSubstitutionsPrompt',
  input: {schema: SuggestIngredientSubstitutionsInputSchema},
  output: {schema: SuggestIngredientSubstitutionsOutputSchema},
  prompt: `You are a culinary expert. A user is looking for a substitution for the ingredient "{{ingredient}}".

  Reason for substitution: {{reason}}
  Dietary restrictions: {{dietaryRestrictions}}
  Available ingredients: {{availableIngredients}}

  Suggest at least three possible substitutions, and explain your reasoning.
  Format your response as a JSON object with "substitutions" and "reasoning" fields. The "substitutions" field should be a list of strings. The "reasoning" field should be a string.
  `,
});

const suggestIngredientSubstitutionsFlow = ai.defineFlow(
  {
    name: 'suggestIngredientSubstitutionsFlow',
    inputSchema: SuggestIngredientSubstitutionsInputSchema,
    outputSchema: SuggestIngredientSubstitutionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
