
'use client';

import type { Note } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, ArchiveRestore, Edit3, Pin, PinOff, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { enUS, bn } from 'date-fns/locale'; // Import locales
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/translations';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
  onToggleArchive: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit, onDelete, onTogglePin, onToggleArchive }) => {
  const { language } = useLanguage();
  const t = getTranslations(language);

  const dateLocale = language === 'bn' ? bn : enUS;
  const updatedAgo = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true, locale: dateLocale });

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="font-headline text-xl mb-1 break-words">{note.title || t.untitledNote}</CardTitle>
          {note.isPinned && <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">{t.pinnedBadge}</Badge>}
        </div>
        <CardDescription>{t.lastUpdated.replace('{timeAgo}', updatedAgo)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm prose dark:prose-invert max-w-none prose-sm line-clamp-4 mb-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {note.content}
          </ReactMarkdown>
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {note.tags.slice(0, 5).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
            ))}
            {note.tags.length > 5 && (
              <Badge variant="outline" className="text-xs">{t.moreTagsBadge.replace('{count}', (note.tags.length - 5).toString())}</Badge>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 pt-4 border-t">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onTogglePin(note.id)} aria-label={note.isPinned ? t.unpinNoteTooltip : t.pinNoteTooltip} title={note.isPinned ? t.unpinNoteTooltip : t.pinNoteTooltip} disabled={note.isArchived}>
            {note.isPinned ? <PinOff className="h-5 w-5 text-primary" /> : <Pin className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onToggleArchive(note.id)} aria-label={note.isArchived ? t.unarchiveNoteTooltip : t.archiveNoteTooltip} title={note.isArchived ? t.unarchiveNoteTooltip : t.archiveNoteTooltip}>
            {note.isArchived ? <ArchiveRestore className="h-5 w-5 text-primary" /> : <Archive className="h-5 w-5" />}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(note)}>
            <Edit3 className="h-4 w-4" /> {t.editButton}
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(note.id)}>
            <Trash2 className="h-4 w-4" /> {t.deleteButton}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;

    
