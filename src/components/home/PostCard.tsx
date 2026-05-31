import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Share,
  Animated,
  Modal,
  Alert,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { darkColors } from '../../theme/colors';
import { Post, postService } from '../../services/post.service';

const REPORT_REASONS = [
  'Nudity',
  'Fake/Misleading',
  'Unmarked AI Content',
  'Illegal Items',
  'Spam',
];

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLikedByMe || false);
  const [isSaved, setIsSaved] = useState(post.isSavedByMe || false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Double-tap detection
  const lastTap = useRef<number>(0);

  // Heart animation values
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;

  const triggerHeartAnimation = () => {
    heartScale.setValue(0);
    heartOpacity.setValue(1);

    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.2,
        useNativeAnimation: true,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeAnimation: true,
      }),
      Animated.delay(400),
      Animated.timing(heartOpacity, {
        toValue: 0,
        duration: 300,
        useNativeAnimation: true,
      }),
    ]).start();
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const delta = now - lastTap.current;
    lastTap.current = now;

    if (delta < 300) {
      // Double-tap detected
      if (!isLiked) {
        setIsLiked(true);
        postService.likePost(post._id).catch(() => setIsLiked(false));
      }
      triggerHeartAnimation();
    }
  };

  const handleLike = async () => {
    const newValue = !isLiked;
    setIsLiked(newValue);
    try {
      if (newValue) {
        await postService.likePost(post._id);
      } else {
        await postService.unlikePost(post._id);
      }
    } catch {
      setIsLiked(!newValue);
    }
  };

  const handleSave = async () => {
    const newValue = !isSaved;
    setIsSaved(newValue);
    try {
      if (newValue) {
        await postService.savePost(post._id);
      } else {
        await postService.unsavePost(post._id);
      }
    } catch {
      setIsSaved(!newValue);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this artwork by ${post.authorId.username} on Artnepalaya!`,
      });
    } catch (error) {
      // Silently handle share cancellation
    }
  };

  const handleReport = async (reason: string) => {
    setShowReportModal(false);
    try {
      await postService.reportPost(post._id, reason);
      Alert.alert('Report Submitted', 'Thank you for helping keep the community safe.');
    } catch (_e) {
      Alert.alert('Error', 'Failed to submit report. Please try again.');
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {post.authorId.avatarUrl ? (
            <Image source={{ uri: post.authorId.avatarUrl }} style={styles.avatar} />
          ) : (
            <Feather name="user" size={16} color={darkColors.textSecondary} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{post.authorId.username}</Text>
          <Text style={styles.timestamp}>
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowReportModal(true)} style={styles.moreBtn}>
          <Feather name="more-horizontal" size={20} color={darkColors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Image with double-tap */}
      <TouchableWithoutFeedback onPress={handleDoubleTap}>
        <View style={styles.imageWrapper}>
          {post.media[0] && (
            <Image
              source={{ uri: post.media[0].url }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          {/* Heart animation overlay */}
          <Animated.View
            style={[
              styles.heartOverlay,
              {
                transform: [{ scale: heartScale }],
                opacity: heartOpacity,
              },
            ]}
          >
            <Ionicons name="heart" size={80} color="#FFFFFF" />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? '#FF3B30' : '#FFFFFF'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
          <Feather name="send" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleSave} style={styles.actionBtn}>
          <Ionicons
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? '#FFFFFF' : '#FFFFFF'}
          />
        </TouchableOpacity>
      </View>

      {/* Description and Tags */}
      <View style={styles.content}>
        {post.description && (
          <Text style={styles.description}>
            <Text style={styles.boldUsername}>{post.authorId.username} </Text>
            {post.description}
          </Text>
        )}
        {post.tags.length > 0 && (
          <View style={styles.tagContainer}>
            {post.tags.map((tag: any, index: number) => (
              <Text key={typeof tag === 'string' ? tag : (tag._id || index.toString())} style={styles.tag}>
                #{typeof tag === 'string' ? tag : tag.name}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Report Modal */}
      <Modal
        visible={showReportModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowReportModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowReportModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report Post</Text>
            <Text style={styles.modalSubtitle}>Why are you reporting this?</Text>
            {REPORT_REASONS.map((reason) => (
              <TouchableOpacity
                key={reason}
                style={styles.reportOption}
                onPress={() => handleReport(reason)}
              >
                <Text style={styles.reportOptionText}>{reason}</Text>
                <Feather name="chevron-right" size={18} color={darkColors.textSecondary} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowReportModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#000000',
    paddingBottom: 16,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: darkColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    color: darkColors.textSecondary,
    marginTop: 2,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 4 / 5,
    backgroundColor: darkColors.surface,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  actionBtn: {
    marginRight: 16,
  },
  content: {
    paddingHorizontal: 12,
  },
  boldUsername: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    fontSize: 12,
    color: darkColors.textSecondary,
    marginRight: 8,
  },
  moreBtn: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: darkColors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: darkColors.textSecondary,
    marginBottom: 16,
  },
  reportOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.border,
  },
  reportOptionText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  cancelBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: darkColors.accent,
  },
});
