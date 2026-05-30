import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, ScrollView, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

// Mock Data for MVP structure
const CATEGORIES = ['All', 'Paubha', 'Thangka', 'Digital Art', 'Wood Carving', 'Illustration'];
const MOCK_EXPLORE_DATA = Array.from({ length: 10 }).map((_, i) => ({
  id: `exp-${i}`,
  url: `https://picsum.photos/seed/${i}/200/300`,
  title: `Artwork ${i}`,
}));

export const ExploreScreen = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Feather name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search artworks, tags, or artists..."
            placeholderTextColor={colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories (Horizontal Scroll) */}
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 2-Column Grid */}
      <FlatList
        data={MOCK_EXPLORE_DATA}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.gridItem}>
            <Image source={{ uri: item.url }} style={styles.gridImage} />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundPrimary },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 12 },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: { flex: 1, marginLeft: 8, color: colors.textPrimary, fontSize: 14 },
  categoryContainer: { borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingBottom: 12 },
  categoryScroll: { paddingHorizontal: 16, gap: 8 },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceSecondary,
  },
  categoryPillActive: { backgroundColor: colors.textPrimary },
  categoryText: { color: colors.textPrimary, fontSize: 14, fontWeight: '500' },
  categoryTextActive: { color: colors.backgroundPrimary },
  gridContainer: { padding: 8 },
  row: { justifyContent: 'space-between', paddingBottom: 8 },
  gridItem: { width: '48.5%', aspectRatio: 4 / 5, backgroundColor: colors.surfaceSecondary, borderRadius: 4, overflow: 'hidden' },
  gridImage: { width: '100%', height: '100%' },
});