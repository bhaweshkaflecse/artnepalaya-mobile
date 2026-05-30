import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { PostCard } from '../../components/home/PostCard';
import { FeaturedSection } from '../../components/home/FeaturedSection';
import { Post, postService } from '../../services/post.service';

export const HomeScreen = () => {
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHomeData = async () => {
    try {
      const [featuredRes, feedRes] = await Promise.all([
        postService.getFeatured(),
        postService.getFeed() // Hard limited to 20 by the service
      ]);
      setFeaturedPosts(featuredRes);
      setFeedPosts(feedRes);
    } catch (error) {
      console.error('Failed to fetch home data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
  };

  const renderHeader = () => (
    <>
      <View style={styles.topBar}>
        <Text style={styles.logo}>ARTNEPALAYA</Text>
        <View style={styles.topBarIcons}>
          <Feather name="search" size={24} color={colors.textPrimary} style={{ marginRight: 16 }} />
          <Feather name="bell" size={24} color={colors.textPrimary} />
        </View>
      </View>
      <FeaturedSection posts={featuredPosts} />
    </>
  );

  const renderFooter = () => (
    <View style={styles.caughtUpContainer}>
      <Feather name="check-circle" size={32} color={colors.textSecondary} />
      <Text style={styles.caughtUpText}>You are all caught up!</Text>
      <Text style={styles.caughtUpSubtext}>Check back later for more artworks.</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={feedPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={feedPosts.length > 0 ? renderFooter : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundPrimary },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.backgroundPrimary },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.backgroundPrimary,
  },
  logo: { fontSize: 18, fontWeight: '700', letterSpacing: 2, color: colors.textPrimary },
  topBarIcons: { flexDirection: 'row' },
  caughtUpContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caughtUpText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary, marginTop: 12 },
  caughtUpSubtext: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
});