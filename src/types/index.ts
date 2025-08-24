export interface Note {
  id: string;
  note: string;
  imageUri?: string;
  createdAt: number;
  updatedAt: number;
}

export interface NoteFormData {
  note: string;
  imageUri?: string;
}

export type LayoutMode = 'grid' | 'list';

export interface NotesContextType {
  notes: Note[];
  searchQuery: string;
  layoutMode: LayoutMode;
  addNote: (note: NoteFormData) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setLayoutMode: (mode: LayoutMode) => void;
  getFilteredNotes: () => Note[];
} 