'use server';

import { suggestNoteTitle } from '@/ai/flows/suggest-note-title';
import type { SuggestNoteTitleInput } from '@/ai/flows/suggest-note-title';

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
