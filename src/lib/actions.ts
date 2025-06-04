
'use server';

import { suggestNoteTitle } from '@/ai/flows/suggest-note-title';
import type { SuggestNoteTitleInput } from '@/ai/flows/suggest-note-title';
import { autoCategorizeNote } from '@/ai/flows/auto-categorize-note';
import type { AutoCategorizeNoteInput } from '@/ai/flows/auto-categorize-note';

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
