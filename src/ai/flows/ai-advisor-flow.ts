
'use server';
/**
 * @fileOverview An AI advisor that provides insights and advice based on note content.
 *
 * - getAIAdvice - A function that handles the AI advice generation process.
 * - GetAIAdviceInput - The input type for the getAIAdvice function.
 * - GetAIAdviceOutput - The return type for the getAIAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetAIAdviceInputSchema = z.object({
  noteContent: z.string().describe('The content of the note to get advice on.'),
});
export type GetAIAdviceInput = z.infer<typeof GetAIAdviceInputSchema>;

const GetAIAdviceOutputSchema = z.object({
  advice: z.string().describe('The advice or insights provided by the AI, potentially in bullet points.'),
});
export type GetAIAdviceOutput = z.infer<typeof GetAIAdviceOutputSchema>;

export async function getAIAdvice(input: GetAIAdviceInput): Promise<GetAIAdviceOutput> {
  return aiAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAdvisorPrompt',
  input: {schema: GetAIAdviceInputSchema},
  output: {schema: GetAIAdviceOutputSchema},
  prompt: `You are an AI Advisor. Analyze the following note content and provide 2-3 actionable pieces of advice, insights, or next steps related to the topic.
Keep your response concise. If appropriate, format your advice using bullet points (e.g., using '-' or '*').

Note Content:
{{{noteContent}}}

Advice:
`,
});

const aiAdvisorFlow = ai.defineFlow(
  {
    name: 'aiAdvisorFlow',
    inputSchema: GetAIAdviceInputSchema,
    outputSchema: GetAIAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
