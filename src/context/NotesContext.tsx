import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Note, NoteFormData, LayoutMode, NotesContextType } from '../types';
import { storage } from '../utils/storage';
import { generateUuidV4 } from '../utils/uuid';

interface NotesState {
  notes: Note[];
  searchQuery: string;
  layoutMode: LayoutMode;
}

type NotesAction =
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: { id: string; updates: Partial<Note> } }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_LAYOUT_MODE'; payload: LayoutMode };

const initialState: NotesState = {
  notes: [],
  searchQuery: '',
  layoutMode: 'grid',
};

function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'SET_NOTES':
      return { ...state, notes: action.payload };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE': {
      const { id, updates } = action.payload;
      const updatedNotes = state.notes.map(n =>
        n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
      );
      return { ...state, notes: updatedNotes };
    }
    case 'DELETE_NOTE': {
      const filteredNotes = state.notes.filter(note => note.id !== action.payload);
      return { ...state, notes: filteredNotes };
    }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_LAYOUT_MODE':
      return { ...state, layoutMode: action.payload };
    default:
      return state;
  }
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [notes, settings] = await Promise.all([
        storage.getNotes(),
        storage.getSettings(),
      ]);

      dispatch({ type: 'SET_NOTES', payload: notes });
      dispatch({ type: 'SET_LAYOUT_MODE', payload: settings.layoutMode });
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const addNote = async (noteData: NoteFormData): Promise<Note> => {
    const now = Date.now();
    const newNote: Note = {
      id: generateUuidV4(),
      note: noteData.note,
      imageUris: noteData.imageUris ?? [],
      createdAt: now,
      updatedAt: now,
    };

    const newNotes = [newNote, ...state.notes];
    // Update local state and persist computed list
    dispatch({ type: 'SET_NOTES', payload: newNotes });
    try {
      await storage.saveNotes(newNotes);
    } catch (error) {
      console.error('Failed to save notes after add:', error);
    }

    return newNote;
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const updatedNotes = state.notes.map(note =>
      note.id === id ? { ...note, ...updates, updatedAt: Date.now() } : note
    );
    dispatch({ type: 'SET_NOTES', payload: updatedNotes });
    try {
      await storage.saveNotes(updatedNotes);
    } catch (error) {
      console.error('Failed to save notes after update:', error);
    }
  };

  const deleteNote = async (id: string) => {
    const filteredNotes = state.notes.filter(note => note.id !== id);
    dispatch({ type: 'SET_NOTES', payload: filteredNotes });
    try {
      await storage.saveNotes(filteredNotes);
    } catch (error) {
      console.error('Failed to save notes after delete:', error);
    }
  };


  const setSearchQuery = (query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setLayoutMode = async (mode: LayoutMode) => {
    dispatch({ type: 'SET_LAYOUT_MODE', payload: mode });
    await storage.saveSettings({ layoutMode: mode });
  };

  const getFilteredNotes = () => {
    let filtered = state.notes;

    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(note => note.note.toLowerCase().includes(query));
    }

    // Sort by updatedAt desc
    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  };

  const value: NotesContextType = {
    notes: state.notes,
    searchQuery: state.searchQuery,
    layoutMode: state.layoutMode,
    addNote,
    updateNote,
    deleteNote,
    setSearchQuery,
    setLayoutMode,
    getFilteredNotes,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}; 