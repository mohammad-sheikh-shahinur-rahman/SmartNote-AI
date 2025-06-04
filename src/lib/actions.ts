
'use server';

import { suggestNoteTitle } from '@/ai/flows/suggest-note-title';
import type { SuggestNoteTitleInput } from '@/ai/flows/suggest-note-title';
import { autoCategorizeNote } from '@/ai/flows/auto-categorize-note';
import type { AutoCategorizeNoteInput } from '@/ai/flows/auto-categorize-note';
import { summarizeNote } from '@/ai/flows/summarize-note';
import type { SummarizeNoteInput } from '@/ai/flows/summarize-note';
import { voiceToText } from '@/ai/flows/voice-to-text';
import type { VoiceToTextInput } from '@/ai/flows/voice-to-text';

export async function suggestTitleAction(
  input: SuggestNoteTitleInput
): Promise<string> {
  try {
    const result = await suggestNoteTitle(input);
    return result.title;
  } catch (error) {
    console.error('Error suggesting title:', error);
    throw new Error('Failed to suggest title. Please try again.');
  }
}

export async function autoCategorizeNoteAction(
  input: AutoCategorizeNoteInput
): Promise<string[]> {
  try {
    const result = await autoCategorizeNote(input);
    return result.suggestedTags;
  } catch (error) {
    console.error('Error auto-categorizing note:', error);
    throw new Error('Failed to suggest tags. Please try again.');
  }
}

export async function summarizeNoteAction(
  input: SummarizeNoteInput
): Promise<string> {
  try {
    const result = await summarizeNote(input);
    return result.summary;
  } catch (error) {
    console.error('Error summarizing note:', error);
    throw new Error('Failed to summarize note. Please try again.');
  }
}

export async function voiceToTextAction(
  input: VoiceToTextInput
): Promise<string> {
  try {
    const result = await voiceToText(input);
    return result.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio. Please try again.');
  }
}
