import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { lightColors } from '../../theme/colors';
import { api } from '../../services/api';

const ARTWORK_TYPES = [
  'Painting',
  'Digital Art',
  'Photography',
  'Sculpture',
  'Mixed Media',
  'Other',
];

export const CreateScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [artworkType, setArtworkType] = useState<string>('');
  const [isHumanMade, setIsHumanMade] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (_e) {
      // Image picker not available - this is expected if expo-image-picker
      // is not in package.json dependencies
    }
  };

  const resetForm = () => {
    setImageUri(null);
    setDescription('');
    setTags('');
    setArtworkType('');
    setIsHumanMade(false);
  };

  const handlePublish = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select an artwork to upload.');
      return;
    }
    if (!isHumanMade) {
      Alert.alert(
        'Declaration Required',
        'You must confirm that this artwork contains no AI generation.'
      );
      return;
    }

    setIsPublishing(true);

    try {
      const formData = new FormData();

      // Append image file
      const filename = imageUri.split('/').pop() || 'artwork.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('media', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      if (description) {
        formData.append('description', description);
      }

      if (tags) {
        const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
        tagsArray.forEach((tag) => {
          formData.append('tags[]', tag);
        });
      }

      if (artworkType) {
        formData.append('artworkType', artworkType);
      }

      formData.append('isHumanMade', 'true');

      await api.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Success', 'Artwork published successfully!');
      resetForm();
    } catch (_e) {
      Alert.alert('Error', 'Failed to publish artwork. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  const canPublish = isHumanMade && imageUri && !isPublishing;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity
          onPress={handlePublish}
          disabled={!canPublish}
        >
          {isPublishing ? (
            <ActivityIndicator size="small" color={lightColors.accent} />
          ) : (
            <Text style={[styles.publishBtn, !canPublish && styles.disabledText]}>
              Publish
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Media Picker */}
        <TouchableOpacity style={styles.mediaContainer} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.placeholder}>
              <Feather name="image" size={32} color={lightColors.textSecondary} />
              <Text style={styles.placeholderText}>Tap to select artwork</Text>
              <Text style={styles.placeholderSubtext}>JPG, PNG up to 10MB</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Description */}
        <TextInput
          style={styles.input}
          placeholder="Write a description..."
          placeholderTextColor={lightColors.textSecondary}
          multiline
          maxLength={2000}
          value={description}
          onChangeText={setDescription}
        />

        {/* Tags */}
        <TextInput
          style={styles.input}
          placeholder="Add tags (comma separated)"
          placeholderTextColor={lightColors.textSecondary}
          value={tags}
          onChangeText={setTags}
        />

        {/* Artwork Type Selector */}
        <Text style={styles.sectionLabel}>Artwork Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {ARTWORK_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.chip,
                artworkType === type && styles.chipActive,
              ]}
              onPress={() =>
                setArtworkType(artworkType === type ? '' : type)
              }
            >
              <Text
                style={[
                  styles.chipText,
                  artworkType === type && styles.chipTextActive,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* AI Declaration */}
        <View style={styles.aiDeclarationContainer}>
          <TouchableOpacity
            onPress={() => setIsHumanMade(!isHumanMade)}
            style={styles.checkbox}
          >
            <Ionicons
              name={isHumanMade ? 'checkbox' : 'square-outline'}
              size={26}
              color={isHumanMade ? lightColors.accent : lightColors.textSecondary}
            />
          </TouchableOpacity>
          <Text style={styles.declarationText}>
            I declare that this artwork is 100% human-created. I understand that
            AI-generated content is strictly prohibited on Artnepalaya and violates
            the Terms of Service.
          </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: lightColors.textPrimary,
  },
  publishBtn: {
    fontSize: 16,
    fontWeight: '600',
    color: lightColors.accent,
  },
  disabledText: {
    color: '#CCC',
  },
  content: {
    padding: 16,
    paddingBottom: 48,
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: lightColors.surface,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: lightColors.border,
    borderStyle: 'dashed',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: lightColors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  placeholderSubtext: {
    marginTop: 4,
    color: lightColors.textSecondary,
    fontSize: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: lightColors.border,
    paddingVertical: 12,
    fontSize: 16,
    color: lightColors.textPrimary,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: lightColors.textPrimary,
    marginBottom: 10,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: lightColors.border,
    backgroundColor: lightColors.surface,
  },
  chipActive: {
    borderColor: lightColors.accent,
    backgroundColor: '#FFF0EF',
  },
  chipText: {
    fontSize: 13,
    color: lightColors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: lightColors.accent,
    fontWeight: '600',
  },
  aiDeclarationContainer: {
    flexDirection: 'row',
    backgroundColor: lightColors.surface,
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: lightColors.border,
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  declarationText: {
    flex: 1,
    fontSize: 13,
    color: lightColors.textPrimary,
    lineHeight: 20,
  },
});
