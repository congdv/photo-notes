import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

import { SearchBar } from '../components/SearchBar';
import { NoteCard } from '../components/NoteCard';
import { EmptyNotes } from '../components/EmptyNotes';
import { ContextualActionBar } from '../components/ContextualActionBar';
import { ShareTestingPanel } from '../components/ShareTestingPanel';
import { useNotes } from '../context/NotesContext';
import { COLORS } from '../constants/styles';
import type { RootStackParamList } from '../navigation/AppNavigation';
import type { Note } from '../types';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cabVisible, setCabVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { getFilteredNotes, deleteNote, setSearchQuery: setGlobalSearch, layoutMode, addNote } = useNotes();

  // debounce updating global search to avoid excessive recomputation
  useEffect(() => {
    const t = setTimeout(() => {
      setGlobalSearch(searchQuery);
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const takePicture = async () => {
    try {
      // Ensure we have camera permission (handle current and legacy API shapes)
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

      // Use a minimal options object to avoid native-side type mismatches
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1.0,
      });

      // Log result for easier debugging in case shape differs across SDKs
      console.log('launchCameraAsync result:', result);

      // Support both new ({ canceled, assets: [{ uri }] }) and old ({ cancelled, uri }) shapes
      // New shape (recommended): result.canceled === false && result.assets?.[0]?.uri
      // Old shape (legacy): result.cancelled === false && result.uri
      const assetUri = (result as any)?.assets?.[0]?.uri ?? (result as any)?.uri;

      if (assetUri) {
        // create a new note with imageUri so it has an id, then navigate to editor to add text
        try {
          const created = await addNote({ note: '', imageUris: [assetUri] });
          if (created?.id) {
            navigation.navigate('NoteEditor', { noteId: created.id });
          }
        } catch (err) {
          console.error('Failed to create note before navigation:', err);
        }
      } else {
        // user cancelled or no uri available
        console.log('No image returned from camera (user cancelled or unsupported shape).', result);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const handleNoteLongPress = (note: Note) => {
    // Provide haptic feedback to indicate long press was detected
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedNote(note);
    setCabVisible(true);
  };

  const handleCloseCab = () => {
    setCabVisible(false);
    setSelectedNote(null);
  };

  const handleDeleteNote = async () => {
    if (!selectedNote) return;

    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteNote(selectedNote.id);
            handleCloseCab();
          }
        },
      ]
    );
  };

  const handleEditNote = () => {
    if (!selectedNote) return;
    navigation.navigate('NoteEditor', { noteId: selectedNote.id });
    handleCloseCab();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        {/* Contextual Action Bar - overlays on SearchBar */}
        <ContextualActionBar
          visible={cabVisible}
          selectedNote={selectedNote}
          onClose={handleCloseCab}
          onDelete={handleDeleteNote}
        />
      </View>

      <View style={{ flex: 1 }}>
        <FlashList
          data={getFilteredNotes()}
          masonry
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              layoutMode={layoutMode}
              onPress={() => navigation.navigate('NoteEditor', { noteId: item.id })}
              onLongPress={() => handleNoteLongPress(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyNotes}
          numColumns={layoutMode === 'grid' ? 2 : 1}
          contentContainerStyle={layoutMode === 'grid' ? { paddingTop: 12, paddingBottom: 24, paddingHorizontal: 16 } : { paddingBottom: 24 }}
        />
      </View>
      <TouchableOpacity style={styles.fab} onPress={takePicture}>
        <Ionicons name="add" size={24} color={COLORS.surface} />
      </TouchableOpacity>

      {/* Development Testing Panel */}
      <ShareTestingPanel />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    position: 'relative',
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
})

export default HomeScreen