import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-substitutions.ts';
import '@/ai/flows/summarize-recipe.ts';
import '@/ai/flows/generate-recipe.ts';