import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface ImageGridProps {
  images: string[];
  onImagePress: (index: number) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, onImagePress }) => {
  if (!images.length) return null;

  // Calculate how many complete 3-column rows we can make
  const completeRows = Math.floor(images.length / 3);
  const remainingImages = images.length % 3;

  // Split images into complete rows and remaining
  const completeRowImages = images.slice(0, completeRows * 3);
  const remainingRowImages = images.slice(completeRows * 3);

  return (
    <View style={styles.gridContainer}>
      {/* Render complete 3-column rows */}
      <View style={styles.completeRowsContainer}>
        {completeRowImages.map((item, index) => (
          <TouchableOpacity
            key={item}
            onPress={() => onImagePress(index)}
            style={styles.gridItem}
          >
            <Image source={{ uri: item }} style={styles.gridImage} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </View>

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
  },
  completeRowsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginRight: -8,
  },
  remainingRowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  singleImageContainer: {
    justifyContent: 'center',
  },
  gridItem: {
    width: (Dimensions.get('window').width - 32 - 16) / 3,
    marginRight: 8,
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },
  remainingImageItem: {
    width: (Dimensions.get('window').width - 32 - 8) / 2, // width for 2 items
    marginHorizontal: 4,
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },
  singleImageItem: {
    width: '100%',
    marginBottom: 8,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden'
  },
  gridImage: { width: '100%', height: '100%' },
});

export default ImageGrid;
