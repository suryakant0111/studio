import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-substitutions.ts';
import '@/ai/flows/summarize-recipe.ts';
import '@/ai/flows/generate-recipe.ts';
import '@/ai/flows/modify-recipe.ts';
import '@/ai/flows/enhance-recipe-text.ts';
