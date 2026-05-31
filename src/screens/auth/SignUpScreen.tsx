// src/screens/auth/SignUpScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../store';
import { setGuest } from '../../store/slices/authSlice';

const { width, height } = Dimensions.get('window');

export const SignUpScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { authBackgroundMedia } = useAppSelector((state) => state.app);

  const imageItems = authBackgroundMedia.filter((item) => item.type === 'image');

  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim1 = useRef(new Animated.Value(1)).current;
  const fadeAnim2 = useRef(new Animated.Value(0)).current;
  const [showFirst, setShowFirst] = useState(true);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (imageItems.length <= 1) return;

    intervalRef.current = setInterval(() => {
      const nextIndex = (currentIndex + 1) % imageItems.length;
      setCurrentIndex(nextIndex);

      if (showFirst) {
        Animated.parallel([
          Animated.timing(fadeAnim1, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim2, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(fadeAnim2, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim1, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start();
      }

      setShowFirst(!showFirst);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, showFirst, imageItems.length]);

  const handleGoogleSignUp = () => {
    // TODO: Implement Google OAuth sign-up flow
  };

  const handleSkip = () => {
    dispatch(setGuest());
  };

  const handleSignIn = () => {
    navigation.navigate('Login');
  };

  const getImageUri = (index: number) => {
    if (imageItems.length === 0) return '';
    return imageItems[index % imageItems.length]?.url || '';
  };

  const renderBackground = () => {
    if (imageItems.length === 0) {
      return <View style={[styles.backgroundFill, { backgroundColor: '#1A1A1A' }]} />;
    }

    const firstImageIndex = showFirst ? currentIndex : (currentIndex + imageItems.length - 1) % imageItems.length;
    const secondImageIndex = showFirst ? (currentIndex + imageItems.length - 1) % imageItems.length : currentIndex;

    return (
      <View style={StyleSheet.absoluteFillObject}>
        <Animated.Image
          source={{ uri: getImageUri(firstImageIndex) }}
          style={[styles.backgroundImage, { opacity: fadeAnim1 }]}
          resizeMode="cover"
        />
        <Animated.Image
          source={{ uri: getImageUri(secondImageIndex) }}
          style={[styles.backgroundImage, { opacity: fadeAnim2 }]}
          resizeMode="cover"
        />
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {renderBackground()}
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Feather name="aperture" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.logoText}>ARTNEPALAYA</Text>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Create Account</Text>

          {/* Sign Up Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignUp}>
              <Feather name="mail" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Sign In Link */}
          <TouchableOpacity style={styles.signInLink} onPress={handleSignIn}>
            <Text style={styles.signInText}>
              Already have an account?{' '}
              <Text style={styles.signInHighlight}>Sign In</Text>
            </Text>
          </TouchableOpacity>

          {/* Skip */}
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backgroundFill: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoIcon: {
    marginBottom: 16,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#FFFFFF',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 32,
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
  signInLink: {
    paddingVertical: 12,
  },
  signInText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  signInHighlight: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
});
