import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Primary brand colors
const PRIMARY_START = '#FF8E53';
const PRIMARY_END = '#FF6B6B';
const DISABLED_PRIMARY = '#FF8E5366';

const ProfileSetup: React.FC = () => {
  const router = useRouter();

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Request permission for image library
  useEffect(() => {
    (async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Media library permission not granted');
        }
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  // Image Picker
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const uri = asset.uri as string;
        const filename = uri.split('/').pop() || `photo-${Date.now()}.jpg`;
        const type = (asset.type ? `${asset.type}/jpeg` : 'image/jpeg') as string;
        setProfilePhoto(uri);
        setImageFile({ uri, name: filename, type });
      } else if (!(result as any).canceled) {
        const uri = (result as any).uri;
        if (uri) {
          const filename = uri.split('/').pop() || `photo-${Date.now()}.jpg`;
          setProfilePhoto(uri);
          setImageFile({ uri, name: filename, type: 'image/jpeg' });
        }
      }
    } catch (err) {
      console.error('Image pick error', err);
      Alert.alert('Error', 'Unable to pick image.');
    }
  };

  // Basic validation
  const validate = () => {
    const e: Record<string, string> = {};

    if (!fullName.trim()) e.fullName = 'Full name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email format';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Save profile
  const handleSave = async () => {
    if (!validate()) {
      Alert.alert('Invalid Input', 'Please fix the highlighted fields.');
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setSaving(false);
        Alert.alert('Success', 'Profile saved successfully!');
        router.replace('/home');
      }, 700);
    } catch (err) {
      console.error(err);
      setSaving(false);
      Alert.alert('Error', 'Unable to save profile.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_START} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#000000', '#1a1a2e']} style={StyleSheet.absoluteFill}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.keyboardAvoid}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Complete Your Profile</Text>
              <Text style={styles.headerSubtitle}>
                Let's get to know you better
              </Text>
            </View>

            {/* Profile Photo Section */}
            <View style={styles.photoSection}>
              <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
                {profilePhoto ? (
                  <Image source={{ uri: profilePhoto }} style={styles.photo} />
                ) : (
                  <View style={styles.photoPlaceholder}>
                    <Feather name="camera" size={32} color={PRIMARY_START} />
                    <Text style={styles.photoText}>Add Photo</Text>
                  </View>
                )}
                <View style={styles.editBadge}>
                  <Feather name="edit-2" size={14} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Form Section */}
            <View style={styles.formCard}>
              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Feather name="user" size={18} color="#9CA3AF" />
                  <Text style={styles.label}>Full Name</Text>
                </View>
                <TextInput
                  style={[styles.input, errors.fullName && styles.inputError]}
                  placeholder="Enter your full name"
                  placeholderTextColor="#6B7280"
                  cursorColor={PRIMARY_START}
                  selectionColor={PRIMARY_START}
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  autoCapitalize="words"
                />
                {errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <View style={styles.labelContainer}>
                  <Feather name="mail" size={18} color="#9CA3AF" />
                  <Text style={styles.label}>Email Address</Text>
                </View>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="Enter your email"
                  placeholderTextColor="#6B7280"
                  value={email}
                  cursorColor={PRIMARY_START}
                  selectionColor={PRIMARY_START}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              {/* Save Button */}
              <TouchableOpacity 
                style={[
                  styles.saveButton, 
                  saving && styles.saveButtonDisabled
                ]} 
                onPress={handleSave} 
                disabled={saving}
                activeOpacity={0.9}
              >
                <LinearGradient 
                  colors={[PRIMARY_START, PRIMARY_END]} 
                  style={styles.saveButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Feather name="check" size={20} color="#fff" />
                      <Text style={styles.saveButtonText}>Complete Setup</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Skip for now option */}
            <TouchableOpacity 
              style={styles.skipButton}
              onPress={() => router.replace('/home')}
            >
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safe: { 
    flex: 1 
  },
  keyboardAvoid: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1, 
    padding: 24,
    paddingBottom: 40 
  },

  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#000'
  },
  loadingText: { 
    color: '#D1D5DB', 
    marginTop: 12, 
    fontSize: 16 
  },

  // Header
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 22,
  },

  // Photo Section
  photoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  photoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: PRIMARY_START,
  },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1F2937',
    borderWidth: 2,
    borderColor: PRIMARY_START,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    color: PRIMARY_START,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: PRIMARY_START,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },

  // Form Card
  formCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.6)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  // Input Groups
  inputGroup: {
    marginBottom: 24,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#F3F4F6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  input: {
    backgroundColor: 'rgba(17, 24, 39, 0.8)',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
  },

  // Save Button
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    shadowColor: PRIMARY_START,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },

  // Skip Button
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProfileSetup;