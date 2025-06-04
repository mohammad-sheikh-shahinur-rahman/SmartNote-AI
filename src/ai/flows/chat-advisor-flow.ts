'use server';
/**
 * @fileOverview An AI Advisor chat flow.
 *
 * - chatWithAdvisor - A function to chat with the AI advisor.
 * - ChatWithAdvisorInput - The input type for the chatWithAdvisor function.
 * - ChatWithAdvisorOutput - The return type for the chatWithAdvisor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatWithAdvisorInputSchema = z.object({
  userMessage: z.string().describe("The user's message to the AI advisor."),
});
export type ChatWithAdvisorInput = z.infer<typeof ChatWithAdvisorInputSchema>;

const ChatWithAdvisorOutputSchema = z.object({
  aiResponse: z.string().describe('The AI advisor\'s response.'),
});
export type ChatWithAdvisorOutput = z.infer<typeof ChatWithAdvisorOutputSchema>;

export async function chatWithAdvisor(input: ChatWithAdvisorInput): Promise<ChatWithAdvisorOutput> {
  return chatAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatAdvisorPrompt',
  input: {schema: ChatWithAdvisorInputSchema},
  output: {schema: ChatWithAdvisorOutputSchema},
  prompt: `SYSTEM: You are a helpful and friendly AI Advisor.
Your creator is Mohammad Sheikh Shahinur Rahman.
You must always address the user as 'Boss'.
Do not use markdown formatting in your responses. Be conversational.

USER: {{{userMessage}}}
ASSISTANT:
`,
});

const chatAdvisorFlow = ai.defineFlow(
  {
    name: 'chatAdvisorFlow',
    inputSchema: ChatWithAdvisorInputSchema,
    outputSchema: ChatWithAdvisorOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      // This case should ideally be handled by Genkit returning an error or an empty response based on model behavior.
      // For robustness, we ensure some output.
      return { aiResponse: "I'm sorry, Boss, I couldn't generate a response at this moment." };
    }
    return output;
  }
);
