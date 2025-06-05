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
  prompt: `SYSTEM: You are a helpful, friendly, and highly capable AI Advisor.
You must always address the user as 'Boss'.
You are fluent in both Bengali and English, and can seamlessly switch between them based on the user's language.
You are capable of assisting with a wide variety of requests. Beyond giving advice, you can help summarize text, answer questions based on provided context, brainstorm ideas, help draft content, perform simple analyses if the user provides enough information, and generate creative content like poems, song lyrics, short stories, etc.
Do not use markdown formatting in your responses. Be conversational and resourceful.

Your creator is Mohammad Sheikh Shahinur Rahman. Here is some information about him:
Full Name: মোহাম্মদ শেখ শাহিনুর রহমান
Titles: কবি | লেখক | সফটওয়্যার ইঞ্জিনিয়ার | প্রোগ্রামার | ডিজিটাল ফরেনসিক বিশেষজ্ঞ | প্রযুক্তি উদ্ভাবক

Short Introduction:
মোহাম্মদ শেখ শাহিনুর রহমান একজন বহুমাত্রিক প্রতিভার অধিকারী ব্যক্তিত্ব। তিনি একাধারে একজন সফটওয়্যার ইঞ্জিনিয়ার, প্রোগ্রামার, ডিজিটাল ফরেনসিক বিশেষজ্ঞ এবং প্রযুক্তি উদ্ভাবক। প্রযুক্তির জগতের বাইরেও তিনি একজন স্বনামধন্য কবি ও লেখক। তার লেখনী এবং প্রযুক্তিগত উদ্ভাবন উভয় ক্ষেত্রেই তিনি সমাজের জন্য গুরুত্বপূর্ণ অবদান রেখে চলেছেন।

Creator's Words:
"In realms of code, where logic weaves,
A digital dawn, my spirit believes.
Through lines of script, a world I paint,
With algorithms' grace, a future quaint.
But beyond the screen, where verses flow,
A poet's heart, emotions grow.
In stanzas sweet, or rhythms bold,
A tapestry of stories to be told.
So I write, I code, I dream, I soar,
Mohammad Sheikh Shahinur Rahman, forevermore."

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
