import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, StackActions } from '@react-navigation/native';
import { useNotes } from '../context/NotesContext';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigation';
import { COLORS } from '../constants/styles';
import type { RouteProp } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ImageGrid from '../components/ImageGrid';
import ImageViewer from '../components/ImageViewer';

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
  const [noteText, setNoteText] = useState('');

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addNote, updateNote, notes } = useNotes();

  const addPhoto = async () => {
    try {
      const currentPerm = await ImagePicker.getCameraPermissionsAsync();
      let status = currentPerm.status;
      if (status !== 'granted') {
        const requestPerm = await ImagePicker.requestCameraPermissionsAsync();
        status = requestPerm.status;
      }

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ allowsEditing: false, quality: 0.8 });
      const assetUri = (result as any)?.assets?.[0]?.uri ?? (result as any)?.uri;
      if (assetUri) {
        setImageUris(prev => [assetUri, ...prev]);
        setImageUri(assetUri);
      }
    } catch (error) {
      console.error('Failed to add photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

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
  }, [noteText, imageUri, imageUris, routeNoteId]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        {/* Fixed Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => addPhoto()} style={styles.backButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <MaterialCommunityIcons name="camera-plus" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ImageGrid
            images={imageUris.length ? imageUris : (imageUri ? [imageUri] : [])}
            onImagePress={(index) => { setViewerIndex(index); setViewerVisible(true); }}
          />

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
        </ScrollView>

        <ImageViewer
          images={imageUris.length ? imageUris : (imageUri ? [imageUri] : [])}
          visible={viewerVisible}
          initialIndex={viewerIndex}
          onClose={() => setViewerVisible(false)}
        />
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: { marginLeft: -4, padding: 4 },
});

export default NoteEditorScreen;