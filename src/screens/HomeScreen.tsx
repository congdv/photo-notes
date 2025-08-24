import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { COLORS } from "../constants/colors"
import { SearchBar } from "../components/SearchBar"
import { useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { EmptyNotes } from "../components/EmptyNotes"
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('')
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </View>
      <FlatList
        data={[]}
        renderItem={() => null}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyNotes}
      />
      <TouchableOpacity style={styles.fab} onPress={() => { }}>
        <Ionicons name="add" size={24} color={COLORS.surface} />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  header: {
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
})

export default HomeScreen