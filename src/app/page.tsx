
'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { Note } from '@/lib/types';
import AppHeader from '@/components/AppHeader';
import NoteCard from '@/components/NoteCard';
import NoteEditor from '@/components/NoteEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilePlus, Search, ArchiveIcon, ArchiveXIcon, GripVertical, List, User, SendHorizonal, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslations } from '@/lib/translations';
import Link from 'next/link';
import { chatWithAdvisorAction } from '@/lib/actions';


const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes - Project Alpha',
    content: 'Discussed project milestones. Q3 goals set. Action items: John to finalize budget, Sarah to draft proposal. Next meeting scheduled for next Tuesday.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    isPinned: true,
    isArchived: false,
    tags: ['project alpha', 'meeting', 'q3 goals']
  },
  {
    id: '2',
    title: 'Brainstorming Ideas for New App',
    content: 'Idea 1: AI-powered recipe generator. Idea 2: Local event discovery platform. Idea 3: Personalized fitness planner. Need to research market viability for each.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    isPinned: false,
    isArchived: false,
    tags: ['ideas', 'app development', 'brainstorming']
  },
  {
    id: '3',
    title: 'Grocery List',
    content: '- Milk\n- Eggs\n- Bread\n- Apples\n- Chicken Breast\n- Spinach',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    isPinned: false,
    isArchived: false,
    tags: ['shopping', 'urgent']
  },
    {
    id: '4',
    title: 'Old Project Ideas',
    content: 'Some ideas from last year that were never pursued. Might be worth revisiting.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300).toISOString(), // 300 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 250).toISOString(), // 250 days ago
    isPinned: false,
    isArchived: true,
    tags: ['archive', 'old ideas']
  },
];


export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { toast } = useToast();
  const { language } = useLanguage();
  const t = getTranslations(language);

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isChatAccordionOpen, setIsChatAccordionOpen] = useState(false);

  useEffect(() => {
    const storedNotes = localStorage.getItem('smartnote-ai-notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    } else {
      setNotes(initialNotes);
    }
  }, []);

  useEffect(() => {
    if (notes.length > 0 || localStorage.getItem('smartnote-ai-notes')) {
        localStorage.setItem('smartnote-ai-notes', JSON.stringify(notes));
    }
  }, [notes]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);
  
  useEffect(() => {
    // Add initial AI welcome message if chat is open and messages are empty
    if (isChatAccordionOpen && chatMessages.length === 0 && !isLoadingChat) {
        setChatMessages([{ sender: 'ai', text: t.aiWelcomeMessage }]);
    }
  }, [isChatAccordionOpen, t.aiWelcomeMessage, isLoadingChat]);


  const handleSaveNote = (note: Note) => {
    const isUpdating = !!editingNote;
    setNotes(prevNotes => {
      const existingNoteIndex = prevNotes.findIndex(n => n.id === note.id);
      if (existingNoteIndex > -1) {
        const updatedNotes = [...prevNotes];
        updatedNotes[existingNoteIndex] = note;
        return updatedNotes;
      }
      return [note, ...prevNotes];
    });
    toast({ 
      title: isUpdating ? t.noteUpdated : t.noteCreated, 
      description: t.noteSavedMessage.replace('{title}', note.title || t.untitledNote) 
    });
    setEditingNote(null); 
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    const noteToDelete = notes.find(n => n.id === noteId);
    setNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
    toast({ 
      title: t.noteDeleted, 
      description: t.noteDeletedMessage.replace('{title}', noteToDelete?.title || t.untitledNote), 
      variant: "destructive" 
    });
  };

  const handleTogglePin = (noteId: string) => {
    setNotes(prevNotes =>
      prevNotes.map(n => (n.id === noteId ? { ...n, isPinned: !n.isPinned, isArchived: !n.isPinned ? false : n.isArchived } : n))
    );
    const note = notes.find(n => n.id === noteId);
    if (note) {
      toast({ title: note.isPinned ? t.noteUnpinned : t.notePinned });
    }
  };
  
  const handleToggleArchive = (noteId: string) => {
    setNotes(prevNotes =>
      prevNotes.map(n => (n.id === noteId ? { ...n, isArchived: !n.isArchived, isPinned: !n.isArchived ? false : n.isPinned } : n))
    );
    const note = notes.find(n => n.id === noteId);
    if (note) {
      toast({ title: note.isArchived ? t.noteUnarchived : t.noteArchived });
    }
  };

  const openNewNoteEditor = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const newUserMessage = { sender: 'user' as const, text: userInput.trim() };
    setChatMessages(prev => [...prev, newUserMessage]);
    const currentMessageText = userInput.trim();
    setUserInput('');
    setIsLoadingChat(true);

    try {
      const aiResponseText = await chatWithAdvisorAction({ userMessage: currentMessageText });
      setChatMessages(prev => [...prev, { sender: 'ai' as const, text: aiResponseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages(prev => [...prev, { sender: 'ai' as const, text: t.chatError }]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = note.title.toLowerCase().includes(searchLower) ||
                           note.content.toLowerCase().includes(searchLower) ||
                           (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchLower)));
      const matchesArchiveStatus = showArchived ? note.isArchived : !note.isArchived;
      return matchesSearch && matchesArchiveStatus;
    });
  }, [notes, searchTerm, showArchived]);

  const pinnedNotes = filteredNotes.filter(note => note.isPinned && !note.isArchived);
  const activeNotes = filteredNotes.filter(note => !note.isPinned && !note.isArchived);
  const archivedNotes = filteredNotes.filter(note => note.isArchived);
  
  const notesToDisplay = showArchived ? archivedNotes : [...pinnedNotes, ...activeNotes];

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
         <Accordion 
            type="single" 
            collapsible 
            className="w-full mb-6 shadow-md rounded-lg bg-card"
            onValueChange={(value) => setIsChatAccordionOpen(value === "ai-chat")}
          >
            <AccordionItem value="ai-chat">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold text-primary">
                {t.chatWithAdvisorTitle}
              </AccordionTrigger>
              <AccordionContent className="px-6 pt-0 pb-4">
                <div className="flex flex-col h-[400px] border rounded-md">
                  <div ref={chatContainerRef} className="flex-grow p-4 space-y-4 overflow-y-auto bg-muted/50">
                    {chatMessages.map((msg, index) => (
                      <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'ai' && (
                          <Avatar className="h-8 w-8 self-start">
                            <AvatarImage src="https://placehold.co/40x40.png" alt="AI" data-ai-hint="robot avatar"/>
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`max-w-[70%] rounded-lg px-3 py-2 shadow-sm ${
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-background text-foreground border border-border rounded-bl-none'
                          }`}
                        >
                          {msg.text.split('\n').map((line, i, arr) => (
                            <span key={i}>{line}{i < arr.length - 1 && <br/>}</span>
                          ))}
                        </div>
                        {msg.sender === 'user' && (
                           <Avatar className="h-8 w-8 self-start">
                             <AvatarFallback><User className="h-5 w-5"/></AvatarFallback>
                           </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoadingChat && (
                      <div className="flex items-end gap-2 justify-start">
                         <Avatar className="h-8 w-8 self-start">
                            <AvatarImage src="https://placehold.co/40x40.png" alt="AI" data-ai-hint="robot avatar"/>
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        <div className="max-w-[70%] rounded-lg px-3 py-2 shadow-sm bg-background text-foreground border border-border rounded-bl-none">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4 border-t bg-card">
                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder={t.chatInputPlaceholder}
                        className="flex-grow"
                        disabled={isLoadingChat}
                        aria-label={t.chatInputPlaceholder}
                      />
                      <Button type="submit" disabled={isLoadingChat || !userInput.trim()} className="bg-primary hover:bg-primary/90 text-primary-foreground" aria-label={t.sendButtonLabel}>
                        {isLoadingChat ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizonal className="h-5 w-5" />}
                      </Button>
                    </form>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-xs">
            <Input
              type="search"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex gap-2 items-center">
             <ToggleGroup type="single" defaultValue="grid" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as 'grid' | 'list')}}>
              <ToggleGroupItem value="grid" aria-label={t.viewGridView}>
                <GripVertical className="h-5 w-5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label={t.viewListView}>
                <List className="h-5 w-5" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button onClick={() => setShowArchived(!showArchived)} variant="outline">
              {showArchived ? <ArchiveXIcon className="mr-2 h-5 w-5" /> : <ArchiveIcon className="mr-2 h-5 w-5" />}
              {showArchived ? t.viewActive : t.viewArchived}
            </Button>
            <Button onClick={openNewNoteEditor} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <FilePlus className="mr-2 h-5 w-5" /> {t.newNote}
            </Button>
          </div>
        </div>

        {notesToDisplay.length === 0 && !showArchived && (
            <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">{t.noActiveNotes}</p>
                <p className="text-muted-foreground">{t.noActiveNotesDesc}</p>
            </div>
        )}
        {notesToDisplay.length === 0 && showArchived && (
            <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">{t.noArchivedNotes}</p>
                <p className="text-muted-foreground">{t.noArchivedNotesDesc}</p>
            </div>
        )}

        {!showArchived && pinnedNotes.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold font-headline mb-4 text-primary">{t.pinnedNotes}</h2>
            <div className={`mb-8 grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {pinnedNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onTogglePin={handleTogglePin}
                  onToggleArchive={handleToggleArchive}
                />
              ))}
            </div>
            {activeNotes.length > 0 && <Separator className="my-8" />}
          </>
        )}

        {!showArchived && activeNotes.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold font-headline mb-4">{pinnedNotes.length > 0 ? t.otherNotes : t.yourNotes}</h2>
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {activeNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onTogglePin={handleTogglePin}
                  onToggleArchive={handleToggleArchive}
                />
              ))}
            </div>
          </>
        )}

        {showArchived && archivedNotes.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold font-headline mb-4 text-muted-foreground">{t.archivedNotes}</h2>
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {archivedNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                  onTogglePin={handleTogglePin}
                  onToggleArchive={handleToggleArchive}
                />
              ))}
            </div>
          </>
        )}

        <NoteEditor
          isOpen={isEditorOpen}
          onClose={() => { setIsEditorOpen(false); setEditingNote(null); }}
          onSave={handleSaveNote}
          noteToEdit={editingNote}
        />
      </main>
      <footer className="text-center py-4 border-t text-sm text-muted-foreground">
        {t.footerText} &copy; {new Date().getFullYear()}
        <span className="mx-2">|</span>
        <Link href="/about" className="hover:underline text-primary">
          {t.aboutDeveloper}
        </Link>
      </footer>
    </div>
  );
}

    

    