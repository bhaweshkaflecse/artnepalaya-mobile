import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const MOCK_GRID = Array.from({ length: 9 }).map((_, i) => ({ id: `p-${i}`, url: `https://picsum.photos/seed/p${i}/150/150` }));

export const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saves'>('posts');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Feather name="settings" size={24} color={colors.textPrimary} style={styles.iconRight} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileInfo}>
        <View style={styles.avatarPlaceholder}>
          <Feather name="user" size={40} color={colors.textSecondary} />
        </View>
        <Text style={styles.fullName}>Siddhartha Shakya</Text>
        <Text style={styles.username}>@sid_art</Text>
        <Text style={styles.bio}>Traditional Paubha Painter based in Patan. Blending history with modern lines.</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statBox}><Text style={styles.statNum}>1.2K</Text><Text style={styles.statLabel}>Followers</Text></View>
          <View style={styles.statBox}><Text style={styles.statNum}>340</Text><Text style={styles.statLabel}>Following</Text></View>
        </View>
        
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, activeTab === 'posts' && styles.activeTab]} onPress={() => setActiveTab('posts')}>
          <Feather name="grid" size={20} color={activeTab === 'posts' ? colors.textPrimary : colors.textTertiary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'saves' && styles.activeTab]} onPress={() => setActiveTab('saves')}>
          <Feather name="bookmark" size={20} color={activeTab === 'saves' ? colors.textPrimary : colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* 3-Column Grid */}
      <FlatList
        data={MOCK_GRID}
        keyExtractor={item => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={{ uri: item.url }} style={styles.gridImage} />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundPrimary },
  header: { padding: 16, alignItems: 'flex-end' },
  iconRight: { padding: 4 },
  profileInfo: { alignItems: 'center', paddingHorizontal: 16 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.surfaceSecondary, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  fullName: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  username: { fontSize: 14, color: colors.textSecondary, marginBottom: 8 },
  bio: { textAlign: 'center', fontSize: 14, color: colors.textPrimary, marginHorizontal: 24, lineHeight: 20 },
  statsContainer: { flexDirection: 'row', marginTop: 16, marginBottom: 16, gap: 32 },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 12, color: colors.textSecondary },
  editBtn: { borderWidth: 1, borderColor: colors.borderLight, paddingHorizontal: 24, paddingVertical: 8, borderRadius: 4, width: '100%', alignItems: 'center' },
  editBtnText: { color: colors.textPrimary, fontWeight: '600' },
  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.borderLight, marginTop: 16 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.textPrimary },
  gridImage: { width: '33.33%', aspectRatio: 1, borderWidth: 0.5, borderColor: colors.backgroundPrimary },
});