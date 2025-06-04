
'use client';

import React, { useState, useEffect, KeyboardEvent } from 'react';
import type { Note } from '@/lib/types';
import { suggestTitleAction, autoCategorizeNoteAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, TagsIcon, XIcon } from 'lucide-react';
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
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSuggestingTitle, setIsSuggestingTitle] = useState(false);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setContent(noteToEdit.content);
      setCurrentTags(noteToEdit.tags || []);
    } else {
      setTitle('');
      setContent('');
      setCurrentTags([]);
    }
    setTagInput(''); // Reset tag input when editor opens or note changes
  }, [noteToEdit, isOpen]);

  const handleSave = () => {
    if (!title && !content && currentTags.length === 0) {
      toast({
        title: "Empty Note",
        description: "Cannot save an empty note. Please add a title, content, or tags.",
        variant: "destructive",
      });
      return;
    }
    const now = new Date().toISOString();
    const noteData: Note = {
      id: noteToEdit?.id || crypto.randomUUID(),
      title: title.trim() || (noteToEdit?.title && !content && currentTags.length === 0 ? noteToEdit.title : 'Untitled Note'),
      content: content.trim(),
      tags: currentTags,
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

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !currentTags.includes(newTag)) {
      setCurrentTags([...currentTags, newTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const handleSuggestTags = async () => {
    if (!content) {
      toast({
        title: "Cannot Suggest Tags",
        description: "Please write some content before suggesting tags.",
        variant: "destructive",
      });
      return;
    }
    setIsSuggestingTags(true);
    try {
      const suggested = await autoCategorizeNoteAction({ noteContent: content });
      // Merge suggested tags with existing ones, avoiding duplicates
      setCurrentTags(prevTags => {
        const newTags = [...prevTags];
        suggested.forEach(tag => {
          if (!newTags.includes(tag)) {
            newTags.push(tag);
          }
        });
        return newTags;
      });
      toast({
        title: "Tags Suggested!",
        description: `AI suggested ${suggested.length} new tag(s).`,
      });
    } catch (error) {
      console.error('Failed to suggest tags:', error);
      toast({
        title: "Error",
        description: "Could not suggest tags. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSuggestingTags(false);
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
        <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto pr-2">
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
          <div className="grid gap-2">
            <Label htmlFor="tags" className="text-left font-semibold">
              Tags
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder="Add a tag and press Enter"
                className="flex-grow"
              />
              <Button onClick={handleAddTag} variant="outline" size="sm">Add Tag</Button>
              <Button
                onClick={handleSuggestTags}
                variant="outline"
                size="icon"
                disabled={isSuggestingTags || !content}
                aria-label="Suggest Tags"
                title="Suggest Tags (requires content)"
              >
                {isSuggestingTags ? <Loader2 className="h-4 w-4 animate-spin" /> : <TagsIcon className="h-4 w-4" />}
              </Button>
            </div>
            {currentTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {currentTags.map(tag => (
                  <Badge key={tag} variant="secondary" className="py-1 px-2 text-sm">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1.5 p-0.5 rounded-full hover:bg-muted-foreground/20"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t">
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
