'use server';

/**
 * @fileOverview Converts audio recordings to text using the Gemini API.
 *
 * - voiceToText - A function that converts audio to text.
 * - VoiceToTextInput - The input type for the voiceToText function.
 * - VoiceToTextOutput - The return type for the voiceToText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VoiceToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio recording as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VoiceToTextInput = z.infer<typeof VoiceToTextInputSchema>;

const VoiceToTextOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio recording.'),
});
export type VoiceToTextOutput = z.infer<typeof VoiceToTextOutputSchema>;

export async function voiceToText(input: VoiceToTextInput): Promise<VoiceToTextOutput> {
  return voiceToTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceToTextPrompt',
  input: {schema: VoiceToTextInputSchema},
  output: {schema: VoiceToTextOutputSchema},
  prompt: `Transcribe the following audio recording to text:\n\n{{media url=audioDataUri}}`,
});

const voiceToTextFlow = ai.defineFlow(
  {
    name: 'voiceToTextFlow',
    inputSchema: VoiceToTextInputSchema,
    outputSchema: VoiceToTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
