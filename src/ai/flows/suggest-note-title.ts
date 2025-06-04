'use server';

/**
 * @fileOverview Provides AI-driven title suggestions for notes.
 *
 * - suggestNoteTitle - A function that suggests a title for a note.
 * - SuggestNoteTitleInput - The input type for the suggestNoteTitle function.
 * - SuggestNoteTitleOutput - The return type for the suggestNoteTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestNoteTitleInputSchema = z.object({
  noteContent: z.string().describe('The content of the note.'),
});
export type SuggestNoteTitleInput = z.infer<typeof SuggestNoteTitleInputSchema>;

const SuggestNoteTitleOutputSchema = z.object({
  title: z.string().describe('The suggested title for the note.'),
});
export type SuggestNoteTitleOutput = z.infer<typeof SuggestNoteTitleOutputSchema>;

export async function suggestNoteTitle(input: SuggestNoteTitleInput): Promise<SuggestNoteTitleOutput> {
  return suggestNoteTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestNoteTitlePrompt',
  input: {schema: SuggestNoteTitleInputSchema},
  output: {schema: SuggestNoteTitleOutputSchema},
  prompt: `Suggest a concise and relevant title for the following note content:\n\n{{noteContent}}\n\nTitle: `,
});

const suggestNoteTitleFlow = ai.defineFlow(
  {
    name: 'suggestNoteTitleFlow',
    inputSchema: SuggestNoteTitleInputSchema,
    outputSchema: SuggestNoteTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
