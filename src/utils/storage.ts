import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from '../types';

const NOTES_STORAGE_KEY = '@notes';
const ARCHIVED_NOTES_STORAGE_KEY = '@archived_notes';
const SETTINGS_STORAGE_KEY = '@settings';

export const StorageKeys = {
  NOTES: NOTES_STORAGE_KEY,
  ARCHIVED_NOTES: ARCHIVED_NOTES_STORAGE_KEY,
  SETTINGS: SETTINGS_STORAGE_KEY,
};

export const storage = {
  // Notes
  async getNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('Error getting notes:', error);
      return [];
    }
  },

  async saveNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  },

  // Archived Notes
  async getArchivedNotes(): Promise<Note[]> {
    try {
      const notesJson = await AsyncStorage.getItem(ARCHIVED_NOTES_STORAGE_KEY);
      return notesJson ? JSON.parse(notesJson) : [];
    } catch (error) {
      console.error('Error getting archived notes:', error);
      return [];
    }
  },

  async saveArchivedNotes(notes: Note[]): Promise<void> {
    try {
      await AsyncStorage.setItem(ARCHIVED_NOTES_STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving archived notes:', error);
    }
  },

  // Settings
  async getSettings(): Promise<{ layoutMode: 'grid' | 'list' }> {
    try {
      const settingsJson = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      return settingsJson ? JSON.parse(settingsJson) : { layoutMode: 'grid' };
    } catch (error) {
      console.error('Error getting settings:', error);
      return { layoutMode: 'grid' };
    }
  },

  async saveSettings(settings: { layoutMode: 'grid' | 'list' }): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        NOTES_STORAGE_KEY,
        ARCHIVED_NOTES_STORAGE_KEY,
        SETTINGS_STORAGE_KEY,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
}; 