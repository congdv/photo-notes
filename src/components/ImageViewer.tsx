import React, { useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity, Modal, FlatList, Dimensions } from 'react-native';

interface ImageViewerProps {
  images: string[];
  visible: boolean;
  initialIndex: number;
  onClose: () => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ images, visible, initialIndex, onClose }) => {
  const flatListRef = useRef<FlatList<string> | null>(null);
  const windowWidth = Dimensions.get('window').width;

  // Ensure the fullscreen FlatList scrolls to the right index when viewer opens
  useEffect(() => {
    if (visible) {
      // small delay to allow modal layout to complete
      const id = setTimeout(() => {
        try {
          flatListRef.current?.scrollToIndex({ index: initialIndex, animated: false });
        } catch (err) {
          // ignore; onScrollToIndexFailed will handle failures
        }
      }, 50);

      return () => clearTimeout(id);
    }
  }, [visible, initialIndex]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.viewerContainer}>
        <TouchableOpacity style={styles.viewerClose} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
        <FlatList
          data={images}
          horizontal
          pagingEnabled
          ref={flatListRef}
          initialScrollIndex={initialIndex}
          keyExtractor={(item) => item}
          getItemLayout={(_data, index) => ({ length: windowWidth, offset: windowWidth * index, index })}
          onScrollToIndexFailed={(info) => {
            // fallback: wait briefly and then try to scroll again
            setTimeout(() => {
              flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
            }, 100);
          }}
          renderItem={({ item }) => (
            <View style={[styles.imageContainer, { width: windowWidth }]}>
              <Image source={{ uri: item }} style={styles.viewerImage} resizeMode="contain" />
            </View>
          )}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  viewerContainer: {
    flex: 1,
    backgroundColor: '#000'
  },
  viewerClose: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
    padding: 8
  },
  closeText: {
    color: '#fff',
    fontSize: 18
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewerImage: {
    width: '100%',
    height: '100%'
  },
});

export default ImageViewer;
