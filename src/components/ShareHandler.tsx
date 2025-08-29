import React, { useEffect } from 'react';
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigation';

interface ShareData {
  type: string;
  data: string | string[];
}

export const ShareHandler: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    // Handle incoming share intents (Android)
    const handleInitialShare = async () => {
      try {
        const initialURL = await Linking.getInitialURL();
        if (initialURL) {
          await processSharedContent(initialURL);
        }
      } catch (error) {
        console.error('Error handling initial share:', error);
      }
    };

    // Handle URL scheme opens (iOS and subsequent Android shares)
    const handleURLOpen = (event: { url: string }) => {
      processSharedContent(event.url);
    };

    // Set up listeners
    handleInitialShare();
    const subscription = Linking.addEventListener('url', handleURLOpen);

    return () => {
      subscription?.remove();
    };
  }, []);

  const processSharedContent = async (url: string) => {
    try {
      console.log('Processing shared URL:', url);

      // Parse shared content from URL
      const { queryParams } = Linking.parse(url);

      if (queryParams?.image) {
        // Handle single image share
        await handleSharedImage(queryParams.image as string);
      } else if (queryParams?.images) {
        // Handle multiple images share
        const images = JSON.parse(queryParams.images as string);
        await handleSharedImages(images);
      } else {
        // For Android intent sharing, the URL might contain the image data differently
        // This is a fallback for direct image sharing
        console.log('No specific image params found, checking URL structure');
      }
    } catch (error) {
      console.error('Error processing shared content:', error);
      Alert.alert('Error', 'Failed to process shared content');
    }
  };

  const handleSharedImage = async (imageUri: string) => {
    try {
      // Validate the image URI
      const fileInfo = await FileSystem.getInfoAsync(imageUri);
      if (!fileInfo.exists) {
        throw new Error('Shared image does not exist');
      }

      // Copy shared image to app's document directory for persistence
      const filename = `shared_${Date.now()}.jpg`;
      const localUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.copyAsync({
        from: imageUri,
        to: localUri,
      });

      // Navigate to note editor with the shared image
      navigation.navigate('NoteEditor', {
        sharedImages: [localUri],
        isSharedContent: true
      });

      console.log('Successfully processed shared image:', localUri);
    } catch (error) {
      console.error('Error handling shared image:', error);
      Alert.alert('Error', 'Failed to process shared image');
    }
  };

  const handleSharedImages = async (imageUris: string[]) => {
    try {
      const localUris: string[] = [];

      for (let i = 0; i < imageUris.length; i++) {
        const imageUri = imageUris[i];

        // Validate each image
        const fileInfo = await FileSystem.getInfoAsync(imageUri);
        if (!fileInfo.exists) {
          console.warn(`Shared image ${i} does not exist:`, imageUri);
          continue;
        }

        const filename = `shared_${Date.now()}_${i}.jpg`;
        const localUri = `${FileSystem.documentDirectory}${filename}`;

        await FileSystem.copyAsync({
          from: imageUri,
          to: localUri,
        });

        localUris.push(localUri);
      }

      if (localUris.length === 0) {
        throw new Error('No valid images found in shared content');
      }

      // Navigate to note editor with shared images
      navigation.navigate('NoteEditor', {
        sharedImages: localUris,
        isSharedContent: true
      });

      console.log('Successfully processed shared images:', localUris.length);
    } catch (error) {
      console.error('Error handling shared images:', error);
      Alert.alert('Error', 'Failed to process shared images');
    }
  };

  return null; // This component doesn't render anything
};
