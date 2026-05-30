import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { Post } from '../../services/post.service';
import { Feather } from '@expo/vector-icons';

interface FeaturedProps {
  posts: Post[];
}

export const FeaturedSection: React.FC<FeaturedProps> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="award" size={16} color={colors.accent} />
        <Text style={styles.title}>Featured by Artnepalaya</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {posts.map((post) => (
          <View key={post._id} style={styles.featuredCard}>
            <Image source={{ uri: post.media[0]?.url }} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.artist} numberOfLines={1}>{post.authorId.username}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 16, backgroundColor: colors.backgroundPrimary },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  title: { fontSize: 14, fontWeight: '600', color: colors.accent, marginLeft: 8 },
  scrollContent: { paddingHorizontal: 16, gap: 12 },
  featuredCard: { width: 140, height: 180, borderRadius: 8, overflow: 'hidden', marginRight: 12 },
  image: { width: '100%', height: '100%', backgroundColor: colors.surfaceSecondary },
  overlay: {
    position: 'absolute',
    bottom: 0, width: '100%',
    backgroundColor: colors.overlayDark,
    padding: 8,
  },
  artist: { color: colors.backgroundPrimary, fontSize: 12, fontWeight: '500' },
});