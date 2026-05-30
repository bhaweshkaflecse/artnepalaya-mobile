import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Post, postService } from '../../services/post.service';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Optimistic UI state
  const [isLiked, setIsLiked] = useState(post.isLikedByMe || false);
  const [isSaved, setIsSaved] = useState(post.isSavedByMe || false);

  const handleLike = async () => {
    setIsLiked(!isLiked); // Optimistic update
    try {
      await postService.toggleLike(post._id);
    } catch (error) {
      setIsLiked(isLiked); // Revert on failure
    }
  };

  const handleSave = async () => {
    setIsSaved(!isSaved); // Optimistic update
    try {
      await postService.toggleSave(post._id);
    } catch (error) {
      setIsSaved(isSaved); // Revert on failure
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this artwork by ${post.authorId.username} on Artnepalaya!`,
        // URL could be added here if deep linking is configured
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          {post.authorId.avatarUrl ? (
            <Image source={{ uri: post.authorId.avatarUrl }} style={styles.avatar} />
          ) : (
            <Feather name="user" size={16} color={colors.textSecondary} />
          )}
        </View>
        <View>
          <Text style={styles.username}>{post.authorId.username}</Text>
          <Text style={styles.timestamp}>{new Date(post.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      {/* Media (MVP: Displaying first media item) */}
      {post.media[0] && (
        <Image 
          source={{ uri: post.media[0].url }} 
          style={styles.image} 
          resizeMode="cover"
        />
      )}

      {/* Actions (Strictly NO Comments) */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
          <Ionicons 
            name={isLiked ? "heart" : "heart-outline"} 
            size={24} 
            color={isLiked ? colors.accent : colors.textPrimary} 
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
          <Feather name="send" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleSave} style={styles.actionBtn}>
          <Ionicons 
            name={isSaved ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={isSaved ? colors.accent : colors.textPrimary} 
          />
        </TouchableOpacity>
      </View>

      {/* Description & Tags */}
      <View style={styles.content}>
        {post.description && (
          <Text style={styles.description}>
            <Text style={styles.boldUsername}>{post.authorId.username} </Text>
            {post.description}
          </Text>
        )}
        <View style={styles.tagContainer}>
          {post.tags.map(tag => (
            <Text key={tag._id} style={styles.tag}>#{tag.name}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfacePrimary,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    paddingBottom: 16,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: colors.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: { width: 32, height: 32, borderRadius: 4 },
  username: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  timestamp: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  image: { width: '100%', aspectRatio: 4 / 5, backgroundColor: colors.surfaceSecondary },
  actions: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  actionBtn: { marginRight: 16 },
  content: { paddingHorizontal: 12 },
  boldUsername: { fontWeight: '600', color: colors.textPrimary },
  description: { fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  tag: { fontSize: 12, color: colors.textSecondary, marginRight: 8 },
});