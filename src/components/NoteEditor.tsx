'use client';

import React, { useState, useEffect } from 'react';
import type { Note } from '@/lib/types';
import { suggestTitleAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NoteEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Note) => void;
  noteToEdit?: Note | null;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ isOpen, onClose, onSave, noteToEdit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSuggestingTitle, setIsSuggestingTitle] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [noteToEdit, isOpen]);

  const handleSave = () => {
    if (!title && !content) {
      toast({
        title: "Empty Note",
        description: "Cannot save an empty note. Please add a title or content.",
        variant: "destructive",
      });
      return;
    }
    const now = new Date().toISOString();
    const noteData: Note = {
      id: noteToEdit?.id || crypto.randomUUID(),
      title: title.trim() || (noteToEdit?.title && !content ? noteToEdit.title : 'Untitled Note'),
      content: content.trim(),
      createdAt: noteToEdit?.createdAt || now,
      updatedAt: now,
      isPinned: noteToEdit?.isPinned || false,
      isArchived: noteToEdit?.isArchived || false,
    };
    onSave(noteData);
    onClose();
  };

  const handleSuggestTitle = async () => {
    if (!content) {
      toast({
        title: "Cannot Suggest Title",
        description: "Please write some content before suggesting a title.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggestingTitle(true);
    try {
      const suggestedTitle = await suggestTitleAction({ noteContent: content });
      setTitle(suggestedTitle);
      toast({
        title: "Title Suggested!",
        description: `AI suggested: "${suggestedTitle}"`,
      });
    } catch (error) {
      console.error('Failed to suggest title:', error);
      toast({
        title: "Error",
        description: "Could not suggest a title. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSuggestingTitle(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-card text-card-foreground shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            {noteToEdit ? 'Edit Note' : 'Create New Note'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-left font-semibold">
              Title
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="col-span-3"
              />
              <Button
                onClick={handleSuggestTitle}
                variant="outline"
                size="icon"
                disabled={isSuggestingTitle || !content}
                aria-label="Suggest Title"
                title="Suggest Title (requires content)"
              >
                {isSuggestingTitle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content" className="text-left font-semibold">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
              className="col-span-3 min-h-[200px] resize-y"
            />
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditor;
