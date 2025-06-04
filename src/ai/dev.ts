import { config } from 'dotenv';
config();

import '@/ai/flows/voice-to-text.ts';
import '@/ai/flows/summarize-note.ts';
import '@/ai/flows/suggest-note-title.ts';
import '@/ai/flows/translate-note.ts';
import '@/ai/flows/auto-categorize-note.ts';
