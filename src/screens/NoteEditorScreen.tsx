import React, { useState } from 'react';
import { View, TextInput, Image, StyleSheet, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigation';

type NoteEditorRouteProp = RouteProp<RootStackParamList, 'NoteEditor'>;

type Props = {
  route: NoteEditorRouteProp;
};

const NoteEditorScreen: React.FC<Props> = ({ route }) => {
  const imageUri = route.params?.imageUri;
  const [noteText, setNoteText] = useState('');

  const onSave = () => {
    // TODO: persist note with imageUri and noteText
    console.log('Saved note', { imageUri, noteText });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
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
});

export default NoteEditorScreen;