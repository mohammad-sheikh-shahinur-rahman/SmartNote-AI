
'use server';

import { suggestNoteTitle } from '@/ai/flows/suggest-note-title';
import type { SuggestNoteTitleInput } from '@/ai/flows/suggest-note-title';
import { autoCategorizeNote } from '@/ai/flows/auto-categorize-note';
import type { AutoCategorizeNoteInput } from '@/ai/flows/auto-categorize-note';
import { summarizeNote } from '@/ai/flows/summarize-note';
import type { SummarizeNoteInput } from '@/ai/flows/summarize-note';
import { voiceToText } from '@/ai/flows/voice-to-text';
import type { VoiceToTextInput } from '@/ai/flows/voice-to-text';
import { translateNote } from '@/ai/flows/translate-note';
import type { TranslateNoteInput } from '@/ai/flows/translate-note';
import { getAIAdvice } from '@/ai/flows/ai-advisor-flow';
import type { GetAIAdviceInput } from '@/ai/flows/ai-advisor-flow';
import { chatWithAdvisor } from '@/ai/flows/chat-advisor-flow';
import type { ChatWithAdvisorInput, ChatWithAdvisorOutput } from '@/ai/flows/chat-advisor-flow';


export async function suggestTitleAction(
  input: SuggestNoteTitleInput
): Promise<string> {
  try {
    const result = await suggestNoteTitle(input);
    if (!result || typeof result.title !== 'string') {
      console.error('suggestNoteTitleAction: AI returned invalid or undefined title. Result:', result);
      throw new Error('Failed to get a valid title suggestion from AI.');
    }
    return result.title;
  } catch (error) {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack, name: error.name, ...error } : { error };
    console.error('Error in suggestTitleAction:', JSON.stringify(errorDetails, null, 2));
    throw new Error('Failed to suggest title. Please try again.');
  }
}

export async function autoCategorizeNoteAction(
  input: AutoCategorizeNoteInput
): Promise<string[]> {
  try {
    const result = await autoCategorizeNote(input);
    if (!result || !Array.isArray(result.suggestedTags)) {
      console.error('autoCategorizeNoteAction: AI returned invalid or non-array suggestedTags. Result:', result);
      throw new Error('Failed to get valid tag suggestions from AI.');
    }
    return result.suggestedTags;
  } catch (error) {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack, name: error.name, ...error } : { error };
    console.error('Error in autoCategorizeNoteAction:', JSON.stringify(errorDetails, null, 2));
    throw new Error('Failed to suggest tags. Please try again.');
  }
}

export async function summarizeNoteAction(
  input: SummarizeNoteInput
): Promise<string> {
  try {
    const result = await summarizeNote(input);
    if (!result || typeof result.summary !== 'string') {
      console.error('summarizeNoteAction: AI returned invalid or undefined summary. Result:', result);
      throw new Error('Failed to get a valid summary from AI.');
    }
    return result.summary;
  } catch (error)
 {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack, name: error.name, ...error } : { error };
    console.error('Error in summarizeNoteAction:', JSON.stringify(errorDetails, null, 2));
    throw new Error('Failed to summarize note. Please try again.');
  }
}

export async function voiceToTextAction(
  input: VoiceToTextInput
): Promise<string> {
  try {
    const result = await voiceToText(input);
    if (!result || typeof result.text !== 'string') {
      console.error('voiceToTextAction: AI returned invalid or undefined text. Result:', result);
      throw new Error('Failed to get valid transcription from AI.');
    }
    return result.text;
  } catch (error) {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack, name: error.name, ...error } : { error };
    console.error('Error in voiceToTextAction:', JSON.stringify(errorDetails, null, 2));
    throw new Error('Failed to transcribe audio. Please try again.');
  }
}

export async function translateNoteAction(
  input: TranslateNoteInput
): Promise<string> {
  try {
    const result = await translateNote(input);
    if (!result || typeof result.translatedContent !== 'string') {
      console.error('translateNoteAction: AI returned invalid or undefined translatedContent. Result:', result);
      throw new Error('Failed to get valid translation from AI.');
    }
    return result.translatedContent;
  } catch (error) {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack, name: error.name, ...error } : { error };
    console.error('Error in translateNoteAction:', JSON.stringify(errorDetails, null, 2));
    throw new Error('Failed to translate note. Please try again.');
  }
}

export async function getAIAdviceAction(
  input: GetAIAdviceInput
): Promise<string> {
  try {
    const result = await getAIAdvice(input);
    if (!result || typeof result.advice !== 'string') {
      console.error('getAIAdviceAction: AI returned invalid or undefined advice. Result:', result);
      throw new Error('Failed to get valid advice from AI.');
    }
    return result.advice;
  } catch (error) {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack, name: error.name, ...error } : { error };
    console.error('Error in getAIAdviceAction:', JSON.stringify(errorDetails, null, 2));
    throw new Error('Failed to get AI advice. Please try again.');
  }
}

export async function chatWithAdvisorAction(
  input: ChatWithAdvisorInput
): Promise<string> {
  try {
    const result: ChatWithAdvisorOutput = await chatWithAdvisor(input);
    // The chatAdvisorFlow itself handles the case where output might be null and returns a default aiResponse.
    // So, we can expect result.aiResponse to be a string.
    if (!result || typeof result.aiResponse !== 'string') {
        console.error('chatWithAdvisorAction: AI flow returned unexpected result structure. Result:', result);
        // This case should ideally not be hit if chatAdvisorFlow is robust.
        return 'Sorry Boss, I encountered an unexpected issue. Please try again.';
    }
    return result.aiResponse;
  } catch (error) {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack, name: error.name, ...error } : { error };
    console.error('Error in chatWithAdvisorAction:', JSON.stringify(errorDetails, null, 2));
    if (error instanceof Error && error.message.includes("did not return a response")) {
        return "I'm sorry, Boss, I couldn't process that. Could you try rephrasing?";
    }
    return 'Sorry Boss, I encountered an issue trying to respond. Please try again in a moment.';
  }
}
