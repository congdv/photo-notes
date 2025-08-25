import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Note, LayoutMode } from '../types';
import { COLORS } from '../constants/styles';
import ImageGrid from './ImageGrid';

interface NoteCardProps {
  note: Note;
  onPress?: () => void;
  onDelete?: () => void;
  layoutMode: LayoutMode;
}

const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - 48) / 2; // 2 columns with margins

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPress, onDelete, layoutMode }) => {
  const isGrid = layoutMode === 'grid';

  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isGrid ? styles.gridCard : styles.listCard,
        { backgroundColor: COLORS.surface },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Image preview */}
      <ImageGrid
        images={note.imageUris}
        mode="preview"
        maxImages={6}
      />

      {/* Content */}
      <View style={styles.content}>
        {note.note?.trim() ? (
          <Text
            style={[styles.title, isGrid ? styles.gridTitle : styles.listTitle]}
            numberOfLines={isGrid ? 2 : 1}
          >
            {note.note}
          </Text>
        ) : null}

      </View>

      {/* Action buttons (only delete for now) */}
      <View style={styles.actions}>
        {/* Timestamp */}
        <Text style={styles.timestamp}>{formatDate(note.updatedAt)}</Text>
        <TouchableOpacity
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  gridCard: {
    width: GRID_ITEM_WIDTH,
    marginRight: 12,
  },
  listCard: {
    width: '100%',
  },
  imageContainer: {
    marginBottom: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  gridImage: {
    height: 250,
  },
  listImage: {
    height: 60,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
    color: COLORS.text,
    paddingHorizontal: 12
  },
  gridTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  listTitle: {
    fontSize: 18,
    lineHeight: 22,
  },
  // body styles removed; note content is stored in `note` and displayed as title when present
  timestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    gap: 8,
  },

}); 