import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const CommunityPlaceholder = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Feather name="users" size={40} color={colors.textPrimary} />
        </View>
        <Text style={styles.title}>The Community Hub</Text>
        <Text style={styles.description}>
          We are crafting a space to bridge traditional Nepalese art forms with contemporary digital creators. 
          Location-based events, artist groups, and interactive discussions are launching in Phase 2.
        </Text>
        
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Feather name="map-pin" size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
            <Text style={styles.featureText}>Local Exhibitions & Workshops</Text>
          </View>
          <View style={styles.featureItem}>
            <Feather name="message-square" size={20} color={colors.textSecondary} style={{ marginRight: 12 }} />
            <Text style={styles.featureText}>Creator Guilds & Chats</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundPrimary },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.surfaceSecondary, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  description: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  featureList: { width: '100%', backgroundColor: colors.surfaceSecondary, padding: 20, borderRadius: 8 },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  featureText: { fontSize: 15, color: colors.textPrimary, fontWeight: '500' },
});