'use server';

/**
 * @fileOverview Summarizes a recipe from a given URL.
 *
 * - summarizeRecipeFromUrl - A function that takes a URL and returns a summarized recipe.
 * - SummarizeRecipeFromUrlInput - The input type for the summarizeRecipeFromUrl function.
 * - SummarizeRecipeFromUrlOutput - The return type for the summarizeRecipeFromUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeRecipeFromUrlInputSchema = z.object({
  url: z.string().url().describe('The URL of the recipe to summarize.'),
});
export type SummarizeRecipeFromUrlInput = z.infer<typeof SummarizeRecipeFromUrlInputSchema>;

const SummarizeRecipeFromUrlOutputSchema = z.object({
  title: z.string().describe('The title of the recipe.'),
  summary: z.string().describe('A concise summary of the recipe.'),
  ingredients: z.string().describe('A list of key ingredients.'),
  steps: z.string().describe('A summary of the key steps involved.'),
});
export type SummarizeRecipeFromUrlOutput = z.infer<typeof SummarizeRecipeFromUrlOutputSchema>;

export async function summarizeRecipeFromUrl(
  input: SummarizeRecipeFromUrlInput
): Promise<SummarizeRecipeFromUrlOutput> {
  return summarizeRecipeFromUrlFlow(input);
}

const summarizeRecipePrompt = ai.definePrompt({
  name: 'summarizeRecipePrompt',
  input: {schema: SummarizeRecipeFromUrlInputSchema},
  output: {schema: SummarizeRecipeFromUrlOutputSchema},
  prompt: `You are a recipe summarization expert. Given a URL to a recipe, you will extract the title, summarize the recipe, list the key ingredients, and summarize the key steps.

URL: {{{url}}}

Respond in a JSON format.
Title:
Summary:
Ingredients:
Steps:`,
});

const summarizeRecipeFromUrlFlow = ai.defineFlow(
  {
    name: 'summarizeRecipeFromUrlFlow',
    inputSchema: SummarizeRecipeFromUrlInputSchema,
    outputSchema: SummarizeRecipeFromUrlOutputSchema,
  },
  async input => {
    const {output} = await summarizeRecipePrompt(input);
    return output!;
  }
);
