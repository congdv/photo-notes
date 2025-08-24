import React from "react";
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Text } from "react-native";
import { COLORS } from "../constants/colors";

interface EmptyNotesProps {

}

export const EmptyNotes: React.FC<EmptyNotesProps> = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="document-text-outline" size={64} color={COLORS.textSecondary} />
      <Text style={styles.title}>No notes yet</Text>
      <Text style={styles.subtitle}>
        Create your first note to get started
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 32,
  }
});
