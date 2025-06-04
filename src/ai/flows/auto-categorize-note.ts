// Auto-categorize note
'use server';
/**
 * @fileOverview Automatically categorizes a note and suggests relevant tags.
 *
 * - autoCategorizeNote - A function that handles the note auto-categorization process.
 * - AutoCategorizeNoteInput - The input type for the autoCategorizeNote function.
 * - AutoCategorizeNoteOutput - The return type for the autoCategorizeNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoCategorizeNoteInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to categorize.'),
});
export type AutoCategorizeNoteInput = z.infer<typeof AutoCategorizeNoteInputSchema>;

const AutoCategorizeNoteOutputSchema = z.object({
  suggestedTags: z
    .array(z.string())
    .describe('An array of suggested tags for the note.'),
});
export type AutoCategorizeNoteOutput = z.infer<typeof AutoCategorizeNoteOutputSchema>;

export async function autoCategorizeNote(
  input: AutoCategorizeNoteInput
): Promise<AutoCategorizeNoteOutput> {
  return autoCategorizeNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoCategorizeNotePrompt',
  input: {schema: AutoCategorizeNoteInputSchema},
  output: {schema: AutoCategorizeNoteOutputSchema},
  prompt: `You are an AI assistant that categorizes notes by suggesting relevant tags.

  Analyze the content of the note provided and suggest a list of tags that would be appropriate for categorizing the note.

  Note Content: {{{noteContent}}}
  `,
});

const autoCategorizeNoteFlow = ai.defineFlow(
  {
    name: 'autoCategorizeNoteFlow',
    inputSchema: AutoCategorizeNoteInputSchema,
    outputSchema: AutoCategorizeNoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
