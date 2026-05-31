import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { lightColors } from '../../theme/colors';
import { useAppSelector } from '../../store';
import { userService } from '../../services/user.service';

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const authUser = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.user.profile);

  const displayUser = profile || authUser;

  const [fullName, setFullName] = useState(displayUser?.fullName || '');
  const [username, setUsername] = useState(displayUser?.username || '');
  const [bio, setBio] = useState((profile as any)?.bio || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required.');
      return;
    }
    if (!username.trim()) {
      Alert.alert('Error', 'Username is required.');
      return;
    }

    setIsSaving(true);
    try {
      await userService.updateProfile({
        fullName: fullName.trim(),
        username: username.trim(),
        bio: bio.trim(),
      } as any);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (_e) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={lightColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={isSaving}>
          {isSaving ? (
            <ActivityIndicator size="small" color={lightColors.accent} />
          ) : (
            <Text style={styles.saveBtn}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar Preview */}
        <View style={styles.avatarSection}>
          {displayUser?.avatarUrl ? (
            <Image source={{ uri: displayUser.avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Feather name="user" size={36} color={lightColors.textSecondary} />
            </View>
          )}
        </View>

        {/* Form Fields */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Enter full name"
            placeholderTextColor={lightColors.textSecondary}
            maxLength={100}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
            placeholderTextColor={lightColors.textSecondary}
            autoCapitalize="none"
            maxLength={50}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself..."
            placeholderTextColor={lightColors.textSecondary}
            multiline
            maxLength={300}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{bio.length}/300</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: lightColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: lightColors.textPrimary,
  },
  saveBtn: {
    fontSize: 16,
    fontWeight: '600',
    color: lightColors.accent,
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: lightColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: lightColors.textPrimary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: lightColors.surface,
    borderWidth: 1,
    borderColor: lightColors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: lightColors.textPrimary,
  },
  bioInput: {
    height: 100,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: lightColors.textSecondary,
    marginTop: 4,
    textAlign: 'right',
  },
});
