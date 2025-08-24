import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useNotes } from '../context/NotesContext';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigation';
import { COLORS } from '../constants/colors';
import type { RouteProp } from '@react-navigation/native';

type NoteEditorRouteProp = RouteProp<RootStackParamList, 'NoteEditor'>;

type Props = {
  route: NoteEditorRouteProp;
};

const NoteEditorScreen: React.FC<Props> = ({ route }) => {
  const routeImage = route.params?.imageUri;
  const routeNoteId = route.params?.noteId;

  const [imageUri, setImageUri] = useState<string | undefined>(routeImage);
  const [noteText, setNoteText] = useState('');

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addNote, updateNote, notes } = useNotes();

  // Load existing note when editing
  useEffect(() => {
    if (routeNoteId) {
      const existing = notes.find(n => n.id === routeNoteId);
      if (existing) {
        setNoteText(existing.body || '');
        // prefer a freshly passed image (from camera) otherwise keep existing
        setImageUri(routeImage ?? existing.imageUri);
      }
    } else {
      // new note, may have an image from route
      setNoteText('');
      setImageUri(routeImage);
    }
  }, [routeNoteId, notes, routeImage]);

  const onSave = async () => {
    try {
      const payload = { note: noteText.slice(0, 30) || 'Untitled', body: noteText, imageUri };
      if (routeNoteId) {
        await updateNote(routeNoteId, payload);
      } else {
        await addNote(payload);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No image</Text>
            </View>
          )}

          <View style={styles.noteBox}>
            <TextInput
              placeholder="Write a note..."
              placeholderTextColor={COLORS.textSecondary}
              multiline
              value={noteText}
              onChangeText={setNoteText}
              style={styles.textInput}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={onSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  image: { width: '100%', height: 300, borderRadius: 12, backgroundColor: COLORS.surface },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: { color: COLORS.textSecondary },
  noteBox: {
    marginTop: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  textInput: { color: COLORS.text, fontSize: 16, textAlignVertical: 'top' },
  saveButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: { color: COLORS.surface, fontWeight: '600' },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backButton: { marginLeft: -4, padding: 4 },
});

export default NoteEditorScreen;