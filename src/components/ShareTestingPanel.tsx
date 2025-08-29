import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigation';
import { COLORS } from '../constants/styles';

// This component is for testing share functionality during development
export const ShareTestingPanel: React.FC = () => {
  const [isVisible, setIsVisible] = useState(__DEV__); // Only show in development
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  if (!isVisible) {
    return null;
  }

  const testShareWithURL = async () => {
    try {
      // Pick an image to simulate sharing
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;

        Alert.alert(
          'Test Share Simulation',
          `Simulating share with image: ${imageUri.split('/').pop()}`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Simulate Share',
              onPress: () => {
                // Directly navigate to NoteEditor with shared content
                navigation.navigate('NoteEditor', {
                  sharedImages: [imageUri],
                  isSharedContent: true,
                });
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error testing share:', error);
      Alert.alert('Error', 'Failed to test share functionality');
    }
  };

  const testMultipleImages = async () => {
    try {
      // For testing multiple images, let's use multiple image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsMultipleSelection: true,
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUris = result.assets.map(asset => asset.uri);

        Alert.alert(
          'Test Multiple Images',
          `Simulating share with ${imageUris.length} images`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Simulate Share',
              onPress: () => {
                navigation.navigate('NoteEditor', {
                  sharedImages: imageUris,
                  isSharedContent: true,
                });
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error testing multiple images:', error);
      Alert.alert('Error', 'Failed to test multiple images');
    }
  };

  const checkShareSupport = async () => {
    try {
      const canOpen = await Linking.canOpenURL('photonotes://');
      Alert.alert(
        'Share Support',
        `Platform: ${Platform.OS}\nCan open URL scheme: ${canOpen}\n\nNote: This tests the URL scheme registration, actual share intents work differently.`
      );
    } catch (error) {
      Alert.alert(
        'Share Support Check',
        `Platform: ${Platform.OS}\nURL scheme check failed - this is normal in development.\n\nFor real testing, use the simulate buttons above.`
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Share Testing Panel</Text>
      <Text style={styles.subtitle}>Development Only</Text>

      <TouchableOpacity style={styles.button} onPress={testShareWithURL}>
        <Text style={styles.buttonText}>📸 Simulate Share (1 Image)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testMultipleImages}>
        <Text style={styles.buttonText}>🖼️ Simulate Share (Multiple)</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={checkShareSupport}>
        <Text style={styles.buttonText}>ℹ️ Check Platform Info</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.hideButton]}
        onPress={() => setIsVisible(false)}
      >
        <Text style={styles.buttonText}>Hide Panel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
    minWidth: 200,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  hideButton: {
    backgroundColor: COLORS.textSecondary,
  },
  buttonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});
