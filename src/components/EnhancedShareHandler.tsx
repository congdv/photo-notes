import React, { useEffect, useState } from 'react';
import { Platform, Linking, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/AppNavigation';

export const EnhancedShareHandler: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setupShareHandling();
  }, []);

  const setupShareHandling = async () => {
    try {
      // Handle initial URL if app was opened from share
      const initialURL = await Linking.getInitialURL();
      if (initialURL && !isProcessing) {
        await handleSharedURL(initialURL);
      }

      // Listen for subsequent URL events
      const subscription = Linking.addEventListener('url', (event) => {
        if (!isProcessing) {
          handleSharedURL(event.url);
        }
      });

      return () => {
        subscription?.remove();
      };
    } catch (error) {
      console.error('Error setting up share handling:', error);
    }
  };

  const handleSharedURL = async (url: string) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      console.log('Received URL:', url);

      // For Android intents, the shared file might be in the URL
      if (Platform.OS === 'android') {
        await handleAndroidShare(url);
      } else {
        // iOS URL scheme handling
        await handleIOSShare(url);
      }
    } catch (error) {
      console.error('Error handling shared URL:', error);
      Alert.alert('Error', 'Failed to process shared content');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAndroidShare = async (url: string) => {
    // Android intent handling - this is a simplified version
    // In production, you might need a native module for proper intent handling

    // Check if URL contains file path or content
    if (url.includes('content://') || url.includes('file://')) {
      await processSharedFile(url);
    } else {
      // Parse custom URL scheme
      try {
        const urlObj = new URL(url);
        const queryParams = Object.fromEntries(urlObj.searchParams);

        if (queryParams.images) {
          const imageUris = JSON.parse(queryParams.images);
          await processMultipleImages(imageUris);
        } else if (queryParams.image) {
          await processSingleImage(queryParams.image);
        }
      } catch (parseError) {
        console.log('Could not parse URL as standard URL, trying simple extraction:', parseError);
        // Fallback for simple parameter extraction
        const imageMatch = url.match(/[?&]image=([^&]+)/);
        if (imageMatch) {
          await processSingleImage(decodeURIComponent(imageMatch[1]));
        }
      }
    }
  };

  const handleIOSShare = async (url: string) => {
    try {
      const urlObj = new URL(url);
      const queryParams = Object.fromEntries(urlObj.searchParams);

      if (queryParams.images) {
        const imageUris = JSON.parse(queryParams.images);
        await processMultipleImages(imageUris);
      } else if (queryParams.image) {
        await processSingleImage(queryParams.image);
      }
    } catch (parseError) {
      console.log('Could not parse URL as standard URL, trying simple extraction:', parseError);
      // Fallback for simple parameter extraction
      const imageMatch = url.match(/[?&]image=([^&]+)/);
      if (imageMatch) {
        await processSingleImage(decodeURIComponent(imageMatch[1]));
      }
    }
  };

  const processSharedFile = async (fileUri: string) => {
    try {
      // Validate file exists and is an image
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (!fileInfo.exists) {
        throw new Error('Shared file does not exist');
      }

      // Check if it's likely an image (basic check)
      const isImage = fileUri.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
      if (!isImage) {
        Alert.alert('Invalid File', 'Please share an image file.');
        return;
      }

      await processSingleImage(fileUri);
    } catch (error) {
      console.error('Error processing shared file:', error);
      throw error;
    }
  };

  const processSingleImage = async (imageUri: string) => {
    try {
      const localUri = await copyToAppStorage(imageUri);

      navigation.navigate('NoteEditor', {
        sharedImages: [localUri],
        isSharedContent: true,
      });
    } catch (error) {
      console.error('Error processing single image:', error);
      throw error;
    }
  };

  const processMultipleImages = async (imageUris: string[]) => {
    try {
      const localUris = await Promise.all(
        imageUris.map(uri => copyToAppStorage(uri))
      );

      navigation.navigate('NoteEditor', {
        sharedImages: localUris.filter(Boolean), // Remove any failed copies
        isSharedContent: true,
      });
    } catch (error) {
      console.error('Error processing multiple images:', error);
      throw error;
    }
  };

  const copyToAppStorage = async (sourceUri: string): Promise<string> => {
    try {
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      const extension = sourceUri.split('.').pop() || 'jpg';
      const filename = `shared_${timestamp}_${randomId}.${extension}`;
      const localUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.copyAsync({
        from: sourceUri,
        to: localUri,
      });

      // Verify the copy was successful
      const info = await FileSystem.getInfoAsync(localUri);
      if (!info.exists || (info.size || 0) === 0) {
        throw new Error('Failed to copy shared file');
      }

      return localUri;
    } catch (error) {
      console.error('Error copying to app storage:', error);
      throw error;
    }
  };

  return null;
};
