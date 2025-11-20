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

// Primary brand colors — same as ProfileSetup
const PRIMARY_START = '#FF8E53';
const PRIMARY_END = '#FF6B6B';
const DISABLED_PRIMARY = '#FF8E5366';

const EditProfile: React.FC = () => {
  const router = useRouter();

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state (pre-filled with current user data)
  const [profilePhoto, setProfilePhoto] = useState<string | null>('https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150');
  const [imageFile, setImageFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [fullName, setFullName] = useState('Sarah Johnson');
  const [email, setEmail] = useState('sarah.johnson@email.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [deliveryAddress, setDeliveryAddress] = useState('123 Sweet Street, Apt 4B');
  const [pincode, setPincode] = useState('751001');
  const [city, setCity] = useState('Bhubaneswar');
  
  // Additional bakery-specific fields
  const [favoriteItems, setFavoriteItems] = useState('Chocolate Croissants, Red Velvet Cake');
  const [dietaryPreferences, setDietaryPreferences] = useState('None');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(true);

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
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!phone.trim()) e.phone = 'Phone number is required';
    if (!deliveryAddress.trim()) e.deliveryAddress = 'Delivery address required';
    if (!pincode.trim() || !/^\d{4,6}$/.test(pincode)) e.pincode = 'Valid pincode required';
    if (!city.trim()) e.city = 'City required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Save profile updates
  const handleSave = async () => {
    if (!validate()) {
      Alert.alert('Invalid', 'Please fix highlighted fields.');
      return;
    }

    setSaving(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setSaving(false);
        Alert.alert('Success', 'Profile updated successfully!');
        router.back(); // Go back to previous screen
      }, 700);
    } catch (err) {
      console.error(err);
      setSaving(false);
      Alert.alert('Error', 'Unable to update profile.');
    }
  };

  // Reset form to original values
  const handleReset = () => {
    setFullName('Sarah Johnson');
    setEmail('sarah.johnson@email.com');
    setPhone('+1 (555) 123-4567');
    setDeliveryAddress('123 Sweet Street, Apt 4B');
    setPincode('751001');
    setCity('Bhubaneswar');
    setFavoriteItems('Chocolate Croissants, Red Velvet Cake');
    setDietaryPreferences('None');
    setNewsletterSubscribed(true);
    setErrors({});
    Alert.alert('Reset', 'All changes have been reset.');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PRIMARY_START} />
        <Text style={styles.loadingText}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#000000ff', '#030005ff']} style={StyleSheet.absoluteFill}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            {/* Header with Back Button */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Feather name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Profile</Text>
             
            </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            
          

            {/* Profile Photo Section */}
            <View style={styles.headerCard}>
              <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.avatarWrap} onPress={pickImage}>
                  {profilePhoto ? (
                    <Image source={{ uri: profilePhoto }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Feather name="user" size={36} color={PRIMARY_START} />
                    </View>
                  )}
                  <View style={styles.editPhotoBadge}>
                    <Feather name="camera" size={14} color="#fff" />
                  </View>
                </TouchableOpacity>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.title}>Update Your Profile</Text>
                  <Text style={styles.sub}>Keep your bakery preferences fresh</Text>
                </View>
              </View>
            </View>

            {/* Personal Information Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Information</Text>

              <View style={{ marginTop: 6 }}>
                <Text style={styles.label}>Full name *</Text>
                <TextInput
                  style={[styles.input, errors.fullName && styles.inputError]}
                  placeholder="Full name"
                  placeholderTextColor="#6B7280"
                  cursorColor={PRIMARY_START}
                  selectionColor={PRIMARY_START}
                  value={fullName}
                  onChangeText={(t) => {
                    setFullName(t);
                    if (errors.fullName) setErrors((s) => ({ ...s, fullName: '' }));
                  }}
                />
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="you@domain.com"
                  placeholderTextColor="#6B7280"
                  value={email}
                  cursorColor={PRIMARY_START}
                  selectionColor={PRIMARY_START}
                  onChangeText={(t) => {
                    setEmail(t);
                    if (errors.email) setErrors((s) => ({ ...s, email: '' }));
                  }}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Phone number *</Text>
                <TextInput
                  style={[styles.input, errors.phone && styles.inputError]}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor="#6B7280"
                  value={phone}
                  cursorColor={PRIMARY_START}
                  selectionColor={PRIMARY_START}
                  onChangeText={(t) => {
                    setPhone(t);
                    if (errors.phone) setErrors((s) => ({ ...s, phone: '' }));
                  }}
                  keyboardType="phone-pad"
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>
            </View>

            {/* Delivery Information Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Delivery Information</Text>

              <View style={{ marginTop: 6 }}>
                <Text style={styles.label}>Delivery address *</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput, errors.deliveryAddress && styles.inputError]}
                  placeholder="Apartment, building, street, landmark..."
                  placeholderTextColor="#6B7280"
                  cursorColor={PRIMARY_START}
                  selectionColor={PRIMARY_START}
                  value={deliveryAddress}
                  onChangeText={(t) => {
                    setDeliveryAddress(t);
                    if (errors.deliveryAddress) setErrors((s) => ({ ...s, deliveryAddress: '' }));
                  }}
                  multiline
                />
                {errors.deliveryAddress && <Text style={styles.errorText}>{errors.deliveryAddress}</Text>}
              </View>

              <View style={{ marginTop: 12, flexDirection: 'row' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Pincode *</Text>
                  <TextInput
                    style={[styles.input, errors.pincode && styles.inputError]}
                    placeholder="e.g. 751001"
                    placeholderTextColor="#6B7280"
                    cursorColor={PRIMARY_START}
                    selectionColor={PRIMARY_START}
                    value={pincode}
                    onChangeText={(t) => {
                      const v = t.replace(/\D/g, '');
                      setPincode(v);
                      if (errors.pincode) setErrors((s) => ({ ...s, pincode: '' }));
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                  {errors.pincode && <Text style={styles.errorText}>{errors.pincode}</Text>}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>City *</Text>
                  <TextInput
                    style={[styles.input, errors.city && styles.inputError]}
                    placeholder="e.g. Bhubaneswar"
                    placeholderTextColor="#6B7280"
                    cursorColor={PRIMARY_START}
                    selectionColor={PRIMARY_START}
                    value={city}
                    onChangeText={(t) => {
                      setCity(t);
                      if (errors.city) setErrors((s) => ({ ...s, city: '' }));
                    }}
                  />
                  {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
                </View>
              </View>
            </View>

            {/* Bakery Preferences Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Bakery Preferences</Text>

              <View style={{ marginTop: 6 }}>
                <Text style={styles.label}>Favorite Items</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  placeholder="What treats do you love most?"
                  placeholderTextColor="#6B7280"
                  cursorColor={PRIMARY_START}
                  selectionColor={PRIMARY_START}
                  value={favoriteItems}
                  onChangeText={setFavoriteItems}
                  multiline
                />
                <Text style={styles.helperText}>Separate items with commas</Text>
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Dietary Preferences</Text>
                <View style={styles.dietaryOptions}>
                  {['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dietaryOption,
                        dietaryPreferences === option && styles.dietaryOptionSelected
                      ]}
                      onPress={() => setDietaryPreferences(option)}
                    >
                      <Text style={[
                        styles.dietaryOptionText,
                        dietaryPreferences === option && styles.dietaryOptionTextSelected
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ marginTop: 16 }}>
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setNewsletterSubscribed(!newsletterSubscribed)}
                >
                  <View style={[
                    styles.checkbox,
                    newsletterSubscribed && styles.checkboxSelected
                  ]}>
                    {newsletterSubscribed && <Feather name="check" size={14} color="#fff" />}
                  </View>
                  <Text style={styles.checkboxLabel}>
                    Subscribe to bakery newsletter & special offers
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.resetButton} 
                onPress={handleReset}
                disabled={saving}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={handleSave} 
                disabled={saving}
                activeOpacity={0.9}
              >
                {saving ? (
                  <View style={styles.saveInner}>
                    <ActivityIndicator color="#fff" />
                    <Text style={[styles.saveText, { marginLeft: 12 }]}>Updating…</Text>
                  </View>
                ) : (
                  <LinearGradient 
                    start={{ x: 0, y: 0 }} 
                    end={{ x: 1, y: 0 }} 
                    colors={['#be4b12ff', '#f4813fff']} 
                    style={styles.saveInner}
                  >
                    <Feather name="save" size={18} color="#fff" />
                    <Text style={styles.saveText}>Update Profile</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 30 },

  // Header
  header: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  gap:15,
    marginBottom: 16,
  },
  backButton: {
   
   
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
 
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#D1D5DB', marginTop: 12, fontSize: 16 },

  headerCard: {
    backgroundColor: '#0F0F13',
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#1B1B22',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarWrap: {
    width: 76,
    height: 76,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#a38888ff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
    position: 'relative',
  },
  avatar: { width: 76, height: 76, borderRadius: 12 },
  avatarPlaceholder: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center' },
  editPhotoBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: PRIMARY_START,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0A0A0A',
  },

  title: { fontSize: 18, fontWeight: '800', color: '#fff' },
  sub: { color: '#9AA0B8', marginTop: 2 },

  card: {
    backgroundColor: '#08080A',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1B1B22',
  },
  cardTitle: { color: '#CFCFF6', fontWeight: '800', fontSize: 14, marginBottom: 8 },

  label: { color: '#D1D5DB', marginBottom: 6, fontWeight: '700' },
  helperText: { color: '#6B7280', fontSize: 12, marginTop: 4 },

  input: {
    backgroundColor: '#0F1114',
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#23242A',
  },
  multilineInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },

  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', marginTop: 6, fontSize: 12 },

  // Dietary Preferences
  dietaryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  dietaryOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#23242A',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#0F1114',
  },
  dietaryOptionSelected: {
    borderColor: PRIMARY_START,
    backgroundColor: PRIMARY_START + '20',
  },
  dietaryOptionText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  dietaryOptionTextSelected: {
    color: PRIMARY_START,
  },

  // Checkbox
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#374151',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: PRIMARY_START,
    backgroundColor: PRIMARY_START,
  },
  checkboxLabel: {
    color: '#D1D5DB',
    fontSize: 14,
    flex: 1,
  },

  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
   
   
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '700',
  },
  saveBtn: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveInner: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default EditProfile;