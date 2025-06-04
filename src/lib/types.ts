export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO string format
  updatedAt: string; // ISO string format
  isPinned: boolean;
  isArchived: boolean;
  tags?: string[]; // Optional for now
}
