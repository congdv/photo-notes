import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface ImageGridProps {
  images: string[];
  onImagePress?: (index: number) => void;
  mode?: 'full' | 'preview';
  maxImages?: number;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImagePress, mode = 'full', maxImages }) => {
  if (!images.length) return null;

  // In preview mode, limit the number of images displayed
  const displayImages = mode === 'preview' && maxImages ? images.slice(0, maxImages) : images;
  const isPreviewMode = mode === 'preview';

  // Calculate how many complete 3-column rows we can make
  const completeRows = Math.floor(displayImages.length / 3);
  const remainingCount = displayImages.length % 3;

  // Create array of subarrays, each containing 3 items for complete rows
  const completeRowImages: string[][] = [];
  for (let i = 0; i < completeRows; i++) {
    completeRowImages.push(displayImages.slice(i * 3, (i + 1) * 3));
  }

  // Get remaining images (less than 3 items)
  const remainingRowImages = remainingCount > 0 ? displayImages.slice(completeRows * 3) : [];

  const handleImagePress = (index: number) => {
    if (onImagePress) {
      onImagePress(index);
    }
  };

  return (
    <View style={[styles.gridContainer, isPreviewMode && styles.previewContainer]}>
      {/* Render complete 3-column rows */}
      {completeRowImages.map((rowImages, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.completeRowContainer}>
          {rowImages.map((item, itemIndex) => {
            const globalIndex = rowIndex * 3 + itemIndex;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => handleImagePress(globalIndex)}
                style={[styles.gridItem, isPreviewMode && styles.previewGridItem]}
                disabled={!onImagePress}
              >
                <Image source={{ uri: item }} style={styles.gridImage} resizeMode="cover" />
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Render remaining images with special centering */}
      {remainingRowImages.length > 0 && (
        <View style={[styles.remainingRowContainer, remainingRowImages.length === 1 && styles.singleImageContainer]}>
          {remainingRowImages.map((item, index) => (
            <TouchableOpacity
              key={item}
              onPress={() => handleImagePress(completeRows * 3 + index)}
              style={[
                remainingRowImages.length === 1 ? styles.singleImageItem : styles.remainingImageItem,
                isPreviewMode && (remainingRowImages.length === 1 ? styles.previewSingleImageItem : styles.previewRemainingImageItem)
              ]}
              disabled={!onImagePress}
            >
              <Image source={{ uri: item }} style={styles.gridImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Show "more images" indicator if there are more images than displayed */}
      {mode === 'preview' && maxImages && images.length > maxImages && (
        <View style={styles.moreImagesIndicator}>
          <Text style={styles.moreImagesText}>+{images.length - maxImages} more</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    gap: 4
  },
  previewContainer: {
    marginVertical: 3
  },
  completeRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  remainingRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  singleImageContainer: {
    justifyContent: 'center',
  },
  gridItem: {
    width: '32%', // Approximately 1/3 with some margin space
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },
  previewGridItem: {
    width: '32%',
    borderRadius: 6,
  },
  remainingImageItem: {
    width: '48.5%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },
  previewRemainingImageItem: {
    width: '48.5%',
    borderRadius: 6,
  },
  singleImageItem: {
    width: '98%', // Centered single item takes half width
    alignSelf: 'center',
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },
  previewSingleImageItem: {
    width: '98%',
    marginBottom: 4,
    borderRadius: 6,
  },
  gridImage: { width: '100%', height: '100%' },
  moreImagesIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moreImagesText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ImageGrid;
