import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface ImageGridProps {
  images: string[];
  onImagePress: (index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImagePress }) => {
  if (!images.length) return null;

  // Calculate how many complete 3-column rows we can make
  const completeRows = Math.floor(images.length / 3);
  const remainingCount = images.length % 3;

  // Create array of subarrays, each containing 3 items for complete rows
  const completeRowImages: string[][] = [];
  for (let i = 0; i < completeRows; i++) {
    completeRowImages.push(images.slice(i * 3, (i + 1) * 3));
  }

  // Get remaining images (less than 3 items)
  const remainingRowImages = remainingCount > 0 ? images.slice(completeRows * 3) : [];

  return (
    <View style={styles.gridContainer}>
      {/* Render complete 3-column rows */}
      {completeRowImages.map((rowImages, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.completeRowContainer}>
          {rowImages.map((item, itemIndex) => {
            const globalIndex = rowIndex * 3 + itemIndex;
            return (
              <TouchableOpacity
                key={item}
                onPress={() => onImagePress(globalIndex)}
                style={styles.gridItem}
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
              onPress={() => onImagePress(completeRows * 3 + index)}
              style={[
                remainingRowImages.length === 1 ? styles.singleImageItem : styles.remainingImageItem
              ]}
            >
              <Image source={{ uri: item }} style={styles.gridImage} resizeMode="cover" />
            </TouchableOpacity>
          ))}
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

  remainingImageItem: {
    width: '48.5%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },

  singleImageItem: {
    width: '98%', // Centered single item takes half width
    alignSelf: 'center',
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },
  gridImage: { width: '100%', height: '100%' },
});

export default ImageGrid;
