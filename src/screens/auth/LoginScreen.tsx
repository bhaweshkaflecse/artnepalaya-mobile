// src/screens/auth/LoginScreen.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../store';
import { setGuest } from '../../store/slices/authSlice';
import { colors } from '../../theme/colors';

export const LoginScreen = () => {
  const dispatch = useAppDispatch();
  const { authBackgroundMedia } = useAppSelector((state) => state.app);

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth flow
    // For now this is a placeholder that will call authService.googleLogin
  };

  const handleSkip = () => {
    dispatch(setGuest());
  };

  const backgroundImage = authBackgroundMedia.find((item) => item.type === 'image');

  const content = (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <Feather name="aperture" size={48} color={backgroundImage ? '#FFFFFF' : colors.accent} />
        </View>
        <Text style={[styles.logoText, backgroundImage && styles.logoTextLight]}>
          ARTNEPALAYA
        </Text>
        <Text style={[styles.tagline, backgroundImage && styles.taglineLight]}>
          Discover Nepali Art
        </Text>
      </View>

      {/* Login Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Feather name="mail" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Skip */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={[styles.skipText, backgroundImage && styles.skipTextLight]}>
          Skip for now
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (backgroundImage) {
    return (
      <ImageBackground
        source={{ uri: backgroundImage.url }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeAreaTransparent}>
          {content}
        </SafeAreaView>
      </ImageBackground>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {content}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeAreaTransparent: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 64,
  },
  logoIcon: {
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 3,
    color: colors.textPrimary,
  },
  logoTextLight: {
    color: '#FFFFFF',
  },
  tagline: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  taglineLight: {
    color: 'rgba(255,255,255,0.8)',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF3B30',
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
  },
  buttonIcon: {
    marginRight: 12,
  },
  googleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  skipTextLight: {
    color: 'rgba(255,255,255,0.8)',
  },
});
