import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const MarketplacePlaceholder = () => {
  const handleWhatsAppRedirect = () => {
    // Note: In production, this would route to a specific artist's number from a post
    // For the placeholder, we explain the concept.
    Linking.openURL('whatsapp://send?text=Hello Artnepalaya!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Feather name="shopping-bag" size={40} color={colors.accent} />
        </View>
        <Text style={styles.title}>Marketplace Coming Soon</Text>
        <Text style={styles.description}>
          Artnepalaya is building a dedicated space for artists and collectors to trade directly. 
          Currently, if an artwork is marked "For Sale", you can contact the artist directly via WhatsApp.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleWhatsAppRedirect}>
          <Feather name="message-circle" size={20} color={colors.backgroundPrimary} style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Test WhatsApp Inquiry</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundPrimary },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.accentLight, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, textAlign: 'center' },
  description: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  button: { flexDirection: 'row', backgroundColor: colors.accent, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: colors.backgroundPrimary, fontSize: 16, fontWeight: '600' },
});