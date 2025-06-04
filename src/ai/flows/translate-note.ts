'use server';

/**
 * @fileOverview AI agent that translates note content into different languages.
 *
 * - translateNote - A function that handles the translation of note content.
 * - TranslateNoteInput - The input type for the translateNote function.
 * - TranslateNoteOutput - The return type for the translateNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateNoteInputSchema = z.object({
  content: z.string().describe('The content of the note to translate.'),
  targetLanguage: z.string().describe('The language to translate the note content to (e.g., Bangla, English, Spanish).'),
});
export type TranslateNoteInput = z.infer<typeof TranslateNoteInputSchema>;

const TranslateNoteOutputSchema = z.object({
  translatedContent: z.string().describe('The translated content of the note.'),
});
export type TranslateNoteOutput = z.infer<typeof TranslateNoteOutputSchema>;

export async function translateNote(input: TranslateNoteInput): Promise<TranslateNoteOutput> {
  return translateNoteFlow(input);
}

const translateNotePrompt = ai.definePrompt({
  name: 'translateNotePrompt',
  input: {schema: TranslateNoteInputSchema},
  output: {schema: TranslateNoteOutputSchema},
  prompt: `You are a translation expert. Translate the given note content into the target language.

Note Content: {{{content}}}
Target Language: {{{targetLanguage}}}

Translation:`,
});

const translateNoteFlow = ai.defineFlow(
  {
    name: 'translateNoteFlow',
    inputSchema: TranslateNoteInputSchema,
    outputSchema: TranslateNoteOutputSchema,
  },
  async input => {
    const {output} = await translateNotePrompt(input);
    return output!;
  }
);
