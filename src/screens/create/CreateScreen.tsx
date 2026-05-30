import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';

export const CreateScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [isHumanMade, setIsHumanMade] = useState(false); // Strict AI check

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // MVP: Images only for simplicity
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePublish = () => {
    if (!imageUri) return Alert.alert('Error', 'Please select an artwork to upload.');
    if (!isHumanMade) return Alert.alert('Declaration Required', 'You must confirm that this artwork contains no AI generation.');
    
    // Proceed to upload via Cloudinary & backend API
    Alert.alert('Success', 'Artwork published successfully!');
    // Reset state...
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity onPress={handlePublish} disabled={!isHumanMade || !imageUri}>
          <Text style={[styles.publishBtn, (!isHumanMade || !imageUri) && styles.disabledText]}>Publish</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Media Picker */}
        <TouchableOpacity style={styles.mediaContainer} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholder}>
              <Feather name="image" size={32} color={colors.textSecondary} />
              <Text style={styles.placeholderText}>Tap to select artwork (Max 3)</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Write a description..."
          placeholderTextColor={colors.textTertiary}
          multiline
          maxLength={2000}
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Add tags (comma separated)"
          placeholderTextColor={colors.textTertiary}
          value={tags}
          onChangeText={setTags}
        />

        {/* AI Declaration Constraint */}
        <View style={styles.aiDeclarationContainer}>
          <TouchableOpacity onPress={() => setIsHumanMade(!isHumanMade)} style={styles.checkbox}>
            <Ionicons 
              name={isHumanMade ? "checkbox" : "square-outline"} 
              size={24} 
              color={isHumanMade ? colors.accent : colors.textSecondary} 
            />
          </TouchableOpacity>
          <Text style={styles.declarationText}>
            I declare that this artwork is 100% human-created. I understand that AI-generated content is strictly prohibited on Artnepalaya and violates the Terms of Service.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundPrimary },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  publishBtn: { fontSize: 16, fontWeight: '600', color: colors.accent },
  disabledText: { color: colors.accentLight },
  content: { padding: 16 },
  mediaContainer: { width: '100%', aspectRatio: 1, backgroundColor: colors.surfaceSecondary, borderRadius: 8, overflow: 'hidden', marginBottom: 16 },
  previewImage: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { marginTop: 8, color: colors.textSecondary, fontSize: 14 },
  input: { borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingVertical: 12, fontSize: 16, color: colors.textPrimary, marginBottom: 16 },
  aiDeclarationContainer: { flexDirection: 'row', backgroundColor: colors.surfaceSecondary, padding: 16, borderRadius: 8, marginTop: 16 },
  checkbox: { marginRight: 12, marginTop: 2 },
  declarationText: { flex: 1, fontSize: 13, color: colors.textPrimary, lineHeight: 20 },
});