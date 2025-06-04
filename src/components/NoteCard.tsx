'use client';

import type { Note } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, ArchiveRestore, Edit3, Pin, PinOff, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onToggleArchive: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onTogglePin, onToggleArchive }) => {
  const contentPreview = note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content;
  const updatedAgo = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl mb-1 break-words">{note.title || 'Untitled Note'}</CardTitle>
          {note.isPinned && <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">Pinned</Badge>}
        </div>
        <CardDescription>Last updated {updatedAgo}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm break-words whitespace-pre-wrap">{contentPreview}</p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onTogglePin(note.id)} aria-label={note.isPinned ? "Unpin note" : "Pin note"}>
            {note.isPinned ? <PinOff className="h-5 w-5 text-primary" /> : <Pin className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onToggleArchive(note.id)} aria-label={note.isArchived ? "Unarchive note" : "Archive note"}>
            {note.isArchived ? <ArchiveRestore className="h-5 w-5 text-primary" /> : <Archive className="h-5 w-5" />}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(note)}>
            <Edit3 className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(note.id)}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
