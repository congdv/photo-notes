import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/styles';
import { Note } from '../types';

interface ContextualActionBarProps {
  visible: boolean;
  selectedNotes: Note[];
  onClose: () => void;
  onDelete: () => void;
}

export const ContextualActionBar: React.FC<ContextualActionBarProps> = ({
  visible,
  selectedNotes,
  onClose,
  onDelete,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current; // Start with scale 0
  const opacityAnim = useRef(new Animated.Value(0)).current; // Start with opacity 0

  useEffect(() => {
    if (visible) {
      // Grow animation when visible
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Shrink animation when hidden
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, scaleAnim, opacityAnim]);

  // Always render the component but animate its position
  return (
    <>

      <Animated.View
        style={[
          styles.actionBar,
          {
            opacity: opacityAnim,
            transform: [
              { scaleY: scaleAnim },
              { scaleX: scaleAnim }
            ]
          }
        ]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        {visible && selectedNotes.length > 0 && (
          <>
            {/* Left side - Close and title */}
            <View style={styles.leftSection}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.title}>
                {selectedNotes.length}
              </Text>
            </View>

            {/* Right side - Actions */}
            <View style={styles.rightSection}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={onDelete}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  actionBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  closeButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
});
