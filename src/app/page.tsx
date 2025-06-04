
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import type { Note } from '@/lib/types';
import AppHeader from '@/components/AppHeader';
import NoteCard from '@/components/NoteCard';
import NoteEditor from '@/components/NoteEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilePlus, Search, ArchiveIcon, ArchiveXIcon, GripVertical, List } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"


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
    toast({ title: isUpdating ? "Note Updated" : "Note Created", description: `"${note.title}" has been saved.` });
    setEditingNote(null); // Clear editingNote after save
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = (noteId: string) => {
    const noteToDelete = notes.find(n => n.id === noteId);
    setNotes(prevNotes => prevNotes.filter(n => n.id !== noteId));
    toast({ title: "Note Deleted", description: `"${noteToDelete?.title || 'Untitled Note'}" has been deleted.`, variant: "destructive" });
  };

  const handleTogglePin = (noteId: string) => {
    setNotes(prevNotes =>
      prevNotes.map(n => (n.id === noteId ? { ...n, isPinned: !n.isPinned, isArchived: !n.isPinned ? false : n.isArchived } : n))
    );
    const note = notes.find(n => n.id === noteId);
    if (note) {
      toast({ title: note.isPinned ? "Note Unpinned" : "Note Pinned" });
    }
  };
  
  const handleToggleArchive = (noteId: string) => {
    setNotes(prevNotes =>
      prevNotes.map(n => (n.id === noteId ? { ...n, isArchived: !n.isArchived, isPinned: !n.isArchived ? false : n.isPinned } : n))
    );
    const note = notes.find(n => n.id === noteId);
    if (note) {
      toast({ title: note.isArchived ? "Note Unarchived" : "Note Archived" });
    }
  };

  const openNewNoteEditor = () => {
    setEditingNote(null);
    setIsEditorOpen(true);
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
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:max-w-xs">
            <Input
              type="search"
              placeholder="Search notes or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex gap-2 items-center">
             <ToggleGroup type="single" defaultValue="grid" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as 'grid' | 'list')}}>
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <GripVertical className="h-5 w-5" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-5 w-5" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button onClick={() => setShowArchived(!showArchived)} variant="outline">
              {showArchived ? <ArchiveXIcon className="mr-2 h-5 w-5" /> : <ArchiveIcon className="mr-2 h-5 w-5" />}
              {showArchived ? 'View Active' : 'View Archived'}
            </Button>
            <Button onClick={openNewNoteEditor} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <FilePlus className="mr-2 h-5 w-5" /> New Note
            </Button>
          </div>
        </div>

        {notesToDisplay.length === 0 && !showArchived && (
            <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">No active notes found.</p>
                <p className="text-muted-foreground">Try creating a new note or adjusting your search.</p>
            </div>
        )}
        {notesToDisplay.length === 0 && showArchived && (
            <div className="text-center py-10">
                <p className="text-xl text-muted-foreground">No archived notes found.</p>
                <p className="text-muted-foreground">Try adjusting your search or archiving some notes.</p>
            </div>
        )}

        {!showArchived && pinnedNotes.length > 0 && (
          <>
            <h2 className="text-2xl font-semibold font-headline mb-4 text-primary">Pinned Notes</h2>
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
            <h2 className="text-2xl font-semibold font-headline mb-4">{pinnedNotes.length > 0 ? 'Other Notes' : 'Your Notes'}</h2>
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
            <h2 className="text-2xl font-semibold font-headline mb-4 text-muted-foreground">Archived Notes</h2>
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
        SmartNote AI &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
