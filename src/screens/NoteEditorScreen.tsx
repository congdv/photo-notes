import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Modal, FlatList, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useNotes } from '../context/NotesContext';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigation';
import { COLORS } from '../constants/styles';
import type { RouteProp } from '@react-navigation/native';

type NoteEditorRouteProp = RouteProp<RootStackParamList, 'NoteEditor'>;

type Props = {
  route: NoteEditorRouteProp;
};

const NoteEditorScreen: React.FC<Props> = ({ route }) => {
  const routeNoteId = route.params?.noteId;
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const flatListRef = useRef<FlatList<string> | null>(null);
  const [noteText, setNoteText] = useState('');

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addNote, updateNote, notes } = useNotes();

  // Load existing note when editing
  useEffect(() => {
    if (routeNoteId) {
      const existing = notes.find(n => n.id === routeNoteId);
      if (existing) {
        setNoteText(existing.note || '');
        setImageUris(existing.imageUris ?? []);
        setImageUri(existing.imageUris?.[0]);
      }
    } else {
      // new note
      setNoteText('');
      setImageUris([]);
      setImageUri(undefined);
    }
  }, [routeNoteId, notes]);

  // Autosave: debounce changes and persist
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        const payload = { note: noteText.slice(0, 30) || '', imageUris: imageUris.length ? imageUris : imageUri ? [imageUri] : [] };
        if (routeNoteId) {
          await updateNote(routeNoteId, payload);
        } else {
          const created = await addNote(payload);
          // replace the route so future saves update the created note
          if (created?.id) {
            navigation.dispatch(StackActions.replace('NoteEditor', { noteId: created.id }));
          }
        }
      } catch (error) {
        console.error('Autosave failed:', error);
      }
    }, 800);

    return () => clearTimeout(t);
  }, [noteText, imageUri, routeNoteId]);

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
            <TouchableOpacity onPress={() => { setViewerIndex(0); setViewerVisible(true); }}>
              <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
            </TouchableOpacity>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>No image</Text>
            </View>
          )}

          <Modal visible={viewerVisible} animationType="slide" onRequestClose={() => setViewerVisible(false)}>
            <View style={styles.viewerContainer}>
              <TouchableOpacity style={styles.viewerClose} onPress={() => setViewerVisible(false)}>
                <Text style={{ color: '#fff', fontSize: 18 }}>Close</Text>
              </TouchableOpacity>
              <FlatList
                data={imageUris.length ? imageUris : (imageUri ? [imageUri] : [])}
                horizontal
                pagingEnabled
                ref={flatListRef}
                initialScrollIndex={viewerIndex}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <View style={{ width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: item }} style={styles.viewerImage} resizeMode="contain" />
                  </View>
                )}
              />
            </View>
          </Modal>

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

          {/* autosave enabled; Save button removed */}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },
  image: { width: '100%', height: 500, borderRadius: 12, backgroundColor: COLORS.surface },
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
  viewerContainer: { flex: 1, backgroundColor: '#000' },
  viewerClose: { position: 'absolute', top: 40, right: 20, zIndex: 2, padding: 8 },
  viewerImage: { width: '100%', height: '100%' },
});

export default NoteEditorScreen;