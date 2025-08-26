'use server';
/**
 * @fileOverview An AI agent to enhance recipe text.
 *
 * - enhanceRecipeText - A function that enhances recipe ingredients or instructions.
 * - EnhanceRecipeTextInput - The input type for the enhanceRecipeText function.
 * - EnhanceRecipeTextOutput - The return type for the enhanceRecipeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceRecipeTextInputSchema = z.object({
  text: z.string().describe('The user-provided text to enhance.'),
  fieldType: z.enum(['ingredients', 'instructions']).describe('The type of text to enhance.'),
});
export type EnhanceRecipeTextInput = z.infer<typeof EnhanceRecipeTextInputSchema>;

const EnhanceRecipeTextOutputSchema = z.object({
  enhancedText: z.string().describe('The enhanced, well-formatted recipe text.'),
});
export type EnhanceRecipeTextOutput = z.infer<typeof EnhanceRecipeTextOutputSchema>;

export async function enhanceRecipeText(input: EnhanceRecipeTextInput): Promise<EnhanceRecipeTextOutput> {
  return enhanceRecipeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceRecipeTextPrompt',
  input: {schema: EnhanceRecipeTextInputSchema},
  output: {schema: EnhanceRecipeTextOutputSchema},
  prompt: `You are an expert recipe editor. A user is providing a list of {{fieldType}}. 
  
  Your task is to take their input and reformat it into a clear, concise, and professional list.

  - If the type is "ingredients", format it as a proper list, ensuring each ingredient is on a new line. Standardize measurements and add any helpful details (e.g., "sifted", "finely chopped").
  - If the type is "instructions", format it into clear, numbered steps. Each step should be on a new line. Improve the clarity and grammar.

  User's input text:
  "{{{text}}}"

  Return only the enhanced text.`,
});

const enhanceRecipeTextFlow = ai.defineFlow(
  {
    name: 'enhanceRecipeTextFlow',
    inputSchema: EnhanceRecipeTextInputSchema,
    outputSchema: EnhanceRecipeTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
