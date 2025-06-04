
'use client';

import React, { useState, useEffect, KeyboardEvent, useRef } from 'react';
import type { Note } from '@/lib/types';
import { suggestTitleAction, autoCategorizeNoteAction, summarizeNoteAction, voiceToTextAction, translateNoteAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2, TagsIcon, XIcon, Lightbulb, FileText, Bold, Italic, Code, Strikethrough, List, ListOrdered, Quote, Minus, Mic, MicOff, AlertCircle, Languages } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/translations';

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
  const { language } = useLanguage();
  const t = getTranslations(language);

  // Voice-to-text state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  // Translation state
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState(language === 'bn' ? 'en' : 'bn'); // Default to opposite of current UI lang

  const availableLanguages = [
    { value: 'bn', label: t.language === 'bn' ? 'বাংলা' : 'Bangla (Bengali)' },
    { value: 'en', label: t.language === 'bn' ? 'ইংরেজি' : 'English' },
    { value: 'es', label: t.language === 'bn' ? 'স্প্যানিশ' : 'Spanish' },
    { value: 'fr', label: t.language === 'bn' ? 'ফরাসি' : 'French' },
    { value: 'de', label: t.language === 'bn' ? 'জার্মান' : 'German' },
    { value: 'hi', label: t.language === 'bn' ? 'হিন্দি' : 'Hindi' },
    { value: 'ja', label: t.language === 'bn' ? 'জাপানি' : 'Japanese' },
    { value: 'pt', label: t.language === 'bn' ? 'পর্তুগিজ' : 'Portuguese' },
    { value: 'ru', label: t.language === 'bn' ? 'রাশিয়ান' : 'Russian' },
    { value: 'zh', label: t.language === 'bn' ? 'চীনা (সরলীকৃত)' : 'Chinese (Simplified)' },
  ];


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
    setIsTranslating(false);
    setTargetLanguage(language === 'bn' ? 'en' : 'bn'); // Reset target language based on current UI lang
  }, [noteToEdit, isOpen, language]);

  const handleSave = () => {
    if (!title && !content && currentTags.length === 0) {
      toast({
        title: t.emptyNoteErrorTitle,
        description: t.emptyNoteErrorDesc,
        variant: "destructive",
      });
      return;
    }
    const now = new Date().toISOString();
    const noteData: Note = {
      id: noteToEdit?.id || crypto.randomUUID(),
      title: title.trim() || (noteToEdit?.title && !content && currentTags.length === 0 ? noteToEdit.title : t.untitledNote),
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
        title: t.suggestTitleErrorTitle,
        description: t.suggestTitleErrorDesc,
        variant: "destructive",
      });
      return;
    }
    setIsSuggestingTitle(true);
    try {
      const suggestedTitle = await suggestTitleAction({ noteContent: content });
      setTitle(suggestedTitle);
      toast({
        title: t.titleSuggestedToastTitle,
        description: t.titleSuggestedToastDesc.replace('{title}', suggestedTitle),
      });
    } catch (error) {
      console.error('Failed to suggest title:', error);
      toast({
        title: t.suggestTitleFailToastTitle,
        description: t.suggestTitleFailToastDesc,
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
        title: t.suggestTagsErrorTitle,
        description: t.suggestTagsErrorDesc,
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
        title: t.tagsSuggestedToastTitle,
        description: t.tagsSuggestedToastDesc.replace('{count}', suggested.length.toString()),
      });
    } catch (error) {
      console.error('Failed to suggest tags:', error);
      toast({
        title: t.suggestTagsFailToastTitle,
        description: t.suggestTagsFailToastDesc,
        variant: "destructive",
      });
    } finally {
      setIsSuggestingTags(false);
    }
  };

  const handleSummarizeNote = async () => {
    if (!content) {
      toast({
        title: t.summarizeErrorTitle,
        description: t.summarizeErrorDesc,
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
        title: t.summaryGeneratedToastTitle,
        description: t.summaryGeneratedToastDesc,
      });
    } catch (error) {
      console.error('Failed to summarize note:', error);
      toast({
        title: t.summarizeFailToastTitle,
        description: t.summarizeFailToastDesc,
        variant: "destructive",
      });
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleInsertSummary = () => {
    if (generatedSummary) {
      setContent(prevContent => `${prevContent}\n\n## ${t.aiSummaryLabel}\n${generatedSummary}`);
      setGeneratedSummary(null);
      toast({ title: t.summaryInsertedToastTitle, description: t.summaryInsertedToastDesc });
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
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            setIsTranscribing(true);
            try {
              const transcribedText = await voiceToTextAction({ audioDataUri: base64Audio });
              setContent(prev => `${prev}${prev ? '\n' : ''}${transcribedText}`);
              toast({ title: t.transcribedToastTitle, description: t.transcribedToastDesc });
            } catch (error) {
              console.error('Failed to transcribe audio:', error);
              toast({ title: t.transcriptionErrorToastTitle, description: t.transcriptionErrorToastDesc, variant: "destructive" });
            } finally {
              setIsTranscribing(false);
              stream.getTracks().forEach(track => track.stop());
            }
          };
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
        toast({ title: t.recordingStartedToastTitle, description: t.recordingStartedToastDesc});
      } catch (err) {
        console.error("Error accessing microphone:", err);
        if (err instanceof DOMException && err.name === "NotAllowedError") {
            setPermissionError(t.microphonePermissionError);
        } else {
            setPermissionError(t.microphoneAccessError);
        }
        toast({ title: t.microphoneErrorToastTitle, description: t.microphoneErrorToastDesc, variant: "destructive" });
      }
    }
  };

  const handleTranslateNote = async () => {
    if (!content) {
      toast({
        title: t.translateErrorTitle,
        description: t.translateErrorDesc,
        variant: "destructive",
      });
      return;
    }
    setIsTranslating(true);
    try {
      const translatedContent = await translateNoteAction({ content, targetLanguage });
      setContent(translatedContent);
      const languageLabel = availableLanguages.find(lang => lang.value === targetLanguage)?.label || targetLanguage;
      toast({
        title: t.translationDoneToastTitle,
        description: t.translationDoneToastDesc.replace('{language}', languageLabel),
      });
    } catch (error) {
      console.error('Failed to translate note:', error);
      toast({
        title: t.translateFailToastTitle,
        description: t.translateFailToastDesc,
        variant: "destructive",
      });
    } finally {
      setIsTranslating(false);
    }
  };


  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { mediaRecorderRef.current?.stream?.getTracks().forEach(track => track.stop()); setIsRecording(false); onClose(); } }}>
      <DialogContent className="sm:max-w-[700px] md:max-w-[800px] lg:max-w-[900px] bg-card text-card-foreground shadow-xl rounded-lg">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            {noteToEdit ? t.dialogTitleEdit : t.dialogTitleCreate}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4 max-h-[75vh] overflow-y-auto pr-3 pl-1">
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-left font-semibold">
              {t.titleLabel}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.titlePlaceholder}
                className="flex-grow"
              />
              <Button
                onClick={handleSuggestTitle}
                variant="outline"
                size="icon"
                disabled={isSuggestingTitle || !content}
                aria-label={t.suggestTitleTooltip}
                title={t.suggestTitleTooltip}
              >
                {isSuggestingTitle ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content" className="text-left font-semibold">
              {t.contentLabel}
            </Label>
            <div className="flex items-center gap-1 mb-2 p-1 border rounded-md bg-muted/50 flex-wrap">
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('bold')} title={t.boldTooltip}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('italic')} title={t.italicTooltip}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('code')} title={t.codeTooltip}>
                <Code className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('strikethrough')} title={t.strikethroughTooltip}>
                <Strikethrough className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('ul')} title={t.ulTooltip}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('ol')} title={t.olTooltip}>
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('blockquote')} title={t.blockquoteTooltip}>
                <Quote className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => applyMarkdownFormatting('hr')} title={t.hrTooltip}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleRecording}
                disabled={isTranscribing}
                title={isRecording ? t.recordTooltipStop : t.recordTooltipStart}
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
              placeholder={t.contentPlaceholder}
              className="min-h-[250px] resize-y"
            />
          </div>

          <div className="flex items-center gap-2 mt-[-10px] mb-2 flex-wrap">
              <Button
                onClick={handleSummarizeNote}
                variant="outline"
                size="sm"
                disabled={isSummarizing || !content}
              >
                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
                {t.summarizeButton}
              </Button>
              <div className="flex items-center gap-2">
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-[180px] h-9 text-sm">
                    <SelectValue placeholder={t.selectLanguagePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLanguages.map(lang => (
                      <SelectItem key={lang.value} value={lang.value} className="text-sm">
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleTranslateNote}
                  variant="outline"
                  size="sm"
                  disabled={isTranslating || !content}
                >
                  {isTranslating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Languages className="mr-2 h-4 w-4" />}
                  {t.translateButton}
                </Button>
              </div>
          </div>

          {generatedSummary && (
            <div className="grid gap-2 p-4 border rounded-md bg-muted/50">
              <div className="flex justify-between items-center">
                <Label className="text-left font-semibold text-primary">{t.aiSummaryLabel}</Label>
                <Button onClick={handleInsertSummary} variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" /> {t.insertSummaryButton}
                </Button>
              </div>
              <div className="text-sm whitespace-pre-wrap p-2 bg-background rounded">{generatedSummary}</div>
            </div>
          )}

          <Separator />

          <div className="grid gap-2">
            <Label htmlFor="tags" className="text-left font-semibold">
              {t.tagsLabelEditor}
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder={t.addTagPlaceholder}
                className="flex-grow"
              />
              <Button onClick={handleAddTag} variant="outline" size="sm">{t.addTagButton}</Button>
              <Button
                onClick={handleSuggestTags}
                variant="outline"
                size="icon"
                disabled={isSuggestingTags || !content}
                aria-label={t.suggestTagsTooltip}
                title={t.suggestTagsTooltip}
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
                      aria-label={t.removeTagTooltip.replace('{tag}', tag)}
                       title={t.removeTagTooltip.replace('{tag}', tag)}
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
              {t.cancelButton}
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {t.saveButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoteEditor;

    