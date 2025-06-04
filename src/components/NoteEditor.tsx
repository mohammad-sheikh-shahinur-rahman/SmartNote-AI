
'use client';

import React, { useState, useEffect, KeyboardEvent, useRef } from 'react';
import type { Note } from '@/lib/types';
import { suggestTitleAction, autoCategorizeNoteAction, summarizeNoteAction, voiceToTextAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, TagsIcon, XIcon, Lightbulb, FileText, Bold, Italic, Code, Strikethrough, List, ListOrdered, Quote, Minus, Mic, MicOff, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

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
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Voice-to-text state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);

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
    setTagInput('');
    setGeneratedSummary(null);
    setIsRecording(false);
    setIsTranscribing(false);
    setPermissionError(null);
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
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
    const newTag = tagInput.trim().toLowerCase();
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
      setCurrentTags(prevTags => {
        const newTags = [...prevTags];
        suggested.forEach(tag => {
          const lowerTag = tag.toLowerCase();
          if (!newTags.includes(lowerTag)) {
            newTags.push(lowerTag);
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

  const handleSummarizeNote = async () => {
    if (!content) {
      toast({
        title: "Cannot Summarize",
        description: "Please write some content before summarizing.",
        variant: "destructive",
      });
      return;
    }
    setIsSummarizing(true);
    setGeneratedSummary(null);
    try {
      const summary = await summarizeNoteAction({ noteContent: content });
      setGeneratedSummary(summary);
      toast({
        title: "Summary Generated!",
        description: "AI has generated a summary for your note.",
      });
    } catch (error) {
      console.error('Failed to summarize note:', error);
      toast({
        title: "Error Summarizing",
        description: "Could not generate a summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleInsertSummary = () => {
    if (generatedSummary) {
      setContent(prevContent => `${prevContent}\n\n## AI Summary\n${generatedSummary}`);
      setGeneratedSummary(null);
      toast({ title: "Summary Inserted", description: "The AI summary has been added to your note content." });
    }
  };

  const applyMarkdownFormatting = (type: 'bold' | 'italic' | 'code' | 'strikethrough' | 'ul' | 'ol' | 'blockquote' | 'hr') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let newContentValue = '';
    let newCursorPosStart = start;
    let newCursorPosEnd = end;
    const placeholderText = "text";

    switch (type) {
      case 'bold':
        newContentValue = textarea.value.substring(0, start) + '**' + (selectedText || placeholderText) + '**' + textarea.value.substring(end);
        newCursorPosStart = start + 2;
        newCursorPosEnd = newCursorPosStart + (selectedText || placeholderText).length;
        break;
      case 'italic':
        newContentValue = textarea.value.substring(0, start) + '*' + (selectedText || placeholderText) + '*' + textarea.value.substring(end);
        newCursorPosStart = start + 1;
        newCursorPosEnd = newCursorPosStart + (selectedText || placeholderText).length;
        break;
      case 'code':
        newContentValue = textarea.value.substring(0, start) + '`' + (selectedText || 'code') + '`' + textarea.value.substring(end);
        newCursorPosStart = start + 1;
        newCursorPosEnd = newCursorPosStart + (selectedText || 'code').length;
        break;
      case 'strikethrough':
        newContentValue = textarea.value.substring(0, start) + '~~' + (selectedText || placeholderText) + '~~' + textarea.value.substring(end);
        newCursorPosStart = start + 2;
        newCursorPosEnd = newCursorPosStart + (selectedText || placeholderText).length;
        break;
      case 'ul':
        if (selectedText) {
          const lines = selectedText.split('\n');
          const formattedLines = lines.map(line => '- ' + line).join('\n');
          newContentValue = textarea.value.substring(0, start) + formattedLines + textarea.value.substring(end);
        } else {
          newContentValue = textarea.value.substring(0, start) + '- List item' + textarea.value.substring(end);
          newCursorPosStart = start + 2; 
          newCursorPosEnd = newCursorPosStart + 'List item'.length;
        }
        break;
      case 'ol':
        if (selectedText) {
          const lines = selectedText.split('\n');
          const formattedLines = lines.map((line, index) => (index + 1) + '. ' + line).join('\n');
          newContentValue = textarea.value.substring(0, start) + formattedLines + textarea.value.substring(end);
        } else {
          newContentValue = textarea.value.substring(0, start) + '1. List item' + textarea.value.substring(end);
          newCursorPosStart = start + 3; 
          newCursorPosEnd = newCursorPosStart + 'List item'.length;
        }
        break;
      case 'blockquote':
        if (selectedText) {
          const lines = selectedText.split('\n');
          const formattedLines = lines.map(line => '> ' + line).join('\n');
          newContentValue = textarea.value.substring(0, start) + formattedLines + textarea.value.substring(end);
        } else {
          newContentValue = textarea.value.substring(0, start) + '> Blockquote' + textarea.value.substring(end);
          newCursorPosStart = start + 2; 
          newCursorPosEnd = newCursorPosStart + 'Blockquote'.length;
        }
        break;
      case 'hr':
        const prevChar = textarea.value.substring(start - 1, start);
        const needsNewLinePrefix = start > 0 && prevChar !== '\n';
        const hrText = (needsNewLinePrefix ? '\n' : '') + '---\n';
        newContentValue = textarea.value.substring(0, start) + hrText + textarea.value.substring(end);
        newCursorPosStart = start + hrText.length;
        newCursorPosEnd = newCursorPosStart;
        break;
    }

    setContent(newContentValue);

    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        if (!selectedText && (type === 'bold' || type === 'italic' || type === 'code' || type === 'strikethrough' || type === 'ul' || type === 'ol' || type === 'blockquote')) {
             textarea.setSelectionRange(newCursorPosStart, newCursorPosEnd);
        } else {
            textarea.setSelectionRange(newCursorPosStart, newCursorPosEnd);
        }
      }
    }, 0);
  };

  const handleToggleRecording = async () => {
    setPermissionError(null);
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' }); // Adjust MIME type if needed
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            setIsTranscribing(true);
            try {
              const transcribedText = await voiceToTextAction({ audioDataUri: base64Audio });
              setContent(prev => `${prev}${prev ? '\n' : ''}${transcribedText}`);
              toast({ title: "Text Transcribed!", description: "Audio has been transcribed and added to your note." });
            } catch (error) {
              console.error('Failed to transcribe audio:', error);
              toast({ title: "Transcription Error", description: "Could not transcribe audio. Please try again.", variant: "destructive" });
            } finally {
              setIsTranscribing(false);
              // Clean up the stream tracks
              stream.getTracks().forEach(track => track.stop());
            }
          };
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({ title: "Recording Started", description: "Microphone is now active."});
      } catch (err) {
        console.error("Error accessing microphone:", err);
        if (err instanceof DOMException && err.name === "NotAllowedError") {
            setPermissionError("Microphone permission denied. Please allow access in your browser settings.");
        } else {
            setPermissionError("Could not access microphone. Please ensure it's connected and enabled.");
        }
        toast({ title: "Microphone Error", description: "Could not access microphone.", variant: "destructive" });
      }
    }
  };


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { mediaRecorderRef.current?.stream?.getTracks().forEach(track => track.stop()); setIsRecording(false); onClose(); } }}>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] bg-card text-card-foreground shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            {noteToEdit ? 'Edit Note' : 'Create New Note'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[75vh] overflow-y-auto pr-3 pl-1">
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
                className="flex-grow"
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
            <div className="flex items-center gap-1 mb-2 p-1 border rounded-md bg-muted/50 flex-wrap">
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('bold')} title="Bold">
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('italic')} title="Italic">
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('code')} title="Inline Code">
                <Code className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('strikethrough')} title="Strikethrough">
                <Strikethrough className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('ul')} title="Unordered List">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('ol')} title="Ordered List">
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('blockquote')} title="Blockquote">
                <Quote className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('hr')} title="Horizontal Rule">
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleRecording}
                disabled={isTranscribing}
                title={isRecording ? "Stop Recording" : "Start Recording"}
                className={isRecording ? "bg-red-500 hover:bg-red-600 text-white" : ""}
              >
                {isTranscribing ? <Loader2 className="h-4 w-4 animate-spin" /> : (isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />)}
              </Button>
            </div>
            {permissionError && (
              <div className="flex items-center p-2 mb-2 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
                <AlertCircle className="mr-2 h-4 w-4" />
                {permissionError}
              </div>
            )}
            <Textarea
              ref={textareaRef}
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here... (Markdown supported)"
              className="min-h-[250px] resize-y"
            />
          </div>

          <div className="flex items-center gap-2 mt-[-10px] mb-2">
              <Button
                onClick={handleSummarizeNote}
                variant="outline"
                size="sm"
                disabled={isSummarizing || !content}
              >
                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                Summarize
              </Button>
          </div>

          {generatedSummary && (
            <div className="grid gap-2 p-4 border rounded-md bg-muted/50">
              <div className="flex justify-between items-center">
                <Label className="text-left font-semibold text-primary">AI Generated Summary</Label>
                <Button onClick={handleInsertSummary} variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" /> Insert into Note
                </Button>
              </div>
              <div className="text-sm whitespace-pre-wrap p-2 bg-background rounded">{generatedSummary}</div>
            </div>
          )}

          <Separator />

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
            <Button type="button" variant="outline" onClick={() => { mediaRecorderRef.current?.stream?.getTracks().forEach(track => track.stop()); setIsRecording(false); }}>
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
