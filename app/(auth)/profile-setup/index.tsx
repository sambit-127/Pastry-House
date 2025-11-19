
import Calendar from '@/components/Calander';
import { ServerData } from '@/constants/serverData';
import { UserData } from '@/constants/Types';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
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

const GENDERS = ['Male', 'Female', 'Other'] as const;

const GOALS = [
  { value: 'WeightLoss', label: 'Weight Loss' },
  { value: 'WeightGain', label: 'Weight Gain' },
  { value: 'StayFit', label: 'Stay Fit' },
] as const;

type GoalValue = typeof GOALS[number]['value'];

const ProfileSetup: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Form state
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<typeof GENDERS[number]>('Male');
  const [dob, setDob] = useState(''); // dd-mm-yyyy
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [target, setTarget] = useState<GoalValue>('StayFit');
  const [targetWeight, setTargetWeight] = useState('');
  const [targetBMI, setTargetBMI] = useState('');
  const [dailyWater, setDailyWater] = useState('');
  const [waterReminder, setWaterReminder] = useState(true);
  const [calendarVisible, setCalendarVisible] = useState(false);
  // Gym specific
  const [gymName, setGymName] = useState('');
  const [gymLocation, setGymLocation] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load stored data
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (!stored) {
          setLoading(false);
          return;
        }

        const data: UserData = JSON.parse(stored);
        setUserData(data);

        setFirstName(data.first_name ?? '');
        setLastName(data.last_name ?? '');
        setEmail(data.email ?? '');
        setGender((data.gender as typeof GENDERS[number]) ?? 'Male');
        setHeight(data.height?.toString() ?? '');
        setWeight(data.weight?.toString() ?? '');
        setTarget((data.target as GoalValue) ?? 'StayFit');
        setTargetWeight(data.target_weight?.toString() ?? '');
        setTargetBMI(data.target_bmi?.toString() ?? '');
        setDailyWater((data.daily_water_goal ?? '').toString());
        setWaterReminder(data.water_reminder ?? true);

        // additional gym fields if present
        // @ts-ignore - safe guard if backend stores these
        setGymName(data.gym_name ?? '');
        // @ts-ignore
        setGymLocation(data.gym_location ?? '');

        // Format DOB as dd-mm-yyyy if server uses yyyy-mm-dd
        if (data.date_of_birth) {
          const parts = (data.date_of_birth as string).split('-');
          if (parts.length >= 3) {
            const [y, m, d] = parts;
            setDob(`${d}-${m}-${y}`);
          }
        }

        if (data.profile_photo) {
          setProfilePhoto(`${ServerData}${data.profile_photo}`);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // request permission for image library
  useEffect(() => {
    (async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          // user may still be able to pick via OS UI, but warn once
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

      // types handled for Expo SDK 48+
      // @ts-ignore
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // @ts-ignore
        const asset = result.assets[0];
        const uri = asset.uri as string;
        const filename = uri.split('/').pop() || `photo-${Date.now()}.jpg`;
        // best-effort mime — expo asset may not provide mime; default to jpeg
        const type = (asset.type ? `${asset.type}/jpeg` : 'image/jpeg') as string;

        setProfilePhoto(uri);
        setImageFile({ uri, name: filename, type });
      } else if (!(result as any).canceled) {
        // older sdk variant where result.uri exists
        // @ts-ignore
        const uri = (result as any).uri;
        if (uri) {
          const filename = uri.split('/').pop() || `photo-${Date.now()}.jpg`;
          setProfilePhoto(uri);
          setImageFile({ uri, name: filename, type: 'image/jpeg' });
        }
      }
    } catch (err) {
      console.error('Image pick error', err);
    }
  };

  // DOB Formatting: dd-mm-yyyy
  const formatDOB = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    let f = '';
    if (cleaned.length > 0) f += cleaned.slice(0, 2);
    if (cleaned.length >= 3) f += '-' + cleaned.slice(2, 4);
    if (cleaned.length >= 5) f += '-' + cleaned.slice(4, 8);
    return f.slice(0, 10);
  };

  const handleDOBChange = (text: string) => setDob(formatDOB(text));

  // Validation
  const validate = () => {
    const e: Record<string, string> = {};

    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email';
    if (!gender) e.gender = 'Gender is required';
    if (!dob || dob.length !== 10 || !/^\d{2}-\d{2}-\d{4}$/.test(dob)) {
      e.dob = 'Valid DOB (dd-mm-yyyy) required';
    }
    if (!height || isNaN(+height)) e.height = 'Valid height required';
    if (!weight || isNaN(+weight)) e.weight = 'Valid weight required';
    if (!gymName.trim()) e.gymName = 'Gym name is recommended';
    if (!gymLocation.trim()) e.gymLocation = 'Gym location is recommended';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Save to API
  const handleSave = async () => {
    if (!validate()) {
      Alert.alert('Invalid', 'Please fix highlighted fields.');
      return;
    }

    const token = await AsyncStorage.getItem('token');
    if (!token) {
      Alert.alert('Error', 'Please log in again.');
      return;
    }

    setSaving(true);
    const form = new FormData();

    form.append('first_name', firstName.trim());
    form.append('last_name', lastName.trim());
    form.append('email', email.trim());
    form.append('gender', gender);
    form.append('weight', weight);
    form.append('height', String(parseInt(height, 10) || 0));
    form.append('target', target);
    if (targetWeight) form.append('target_weight', targetWeight);
    if (targetBMI) form.append('target_bmi', targetBMI);
    if (dailyWater) form.append('daily_water_goal', dailyWater);
    form.append('water_reminder', waterReminder ? 'true' : 'false');

    // gym info (custom fields - backend must accept)
    form.append('gym_name', gymName);
    form.append('gym_location', gymLocation);

    // Convert dd-mm-yyyy → yyyy-mm-dd for API
    const [d, m, y] = dob.split('-');
    form.append('date_of_birth', `${y}-${m}-${d}`);

    if (imageFile) {
      // React Native FormData file shape
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      form.append('profile_image', {
        uri: imageFile.uri,
        name: imageFile.name,
        type: imageFile.type,
      } as any);
    }

    try {
      const res = await axios.put(`${ServerData}customer/`, form, {
        headers: {
          Authorization: `Token ${token}`,
          accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        timeout: 20000,
      });

      const updated: UserData = res.data;
      await AsyncStorage.setItem('userData', JSON.stringify(updated));
      setUserData(updated);
      if (updated.profile_photo) {
        setProfilePhoto(`${ServerData}${updated.profile_photo}`);
      }
      Alert.alert('Success', 'Profile updated');
      router.replace('/home');
    } catch (err: any) {
      console.error('API Error:', err.response?.data || err.message);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        'Failed to update profile.';
      Alert.alert('Error', String(msg));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading profile…</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#000000ff', '#030005ff']} style={StyleSheet.absoluteFill}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerCard}>
              <View style={styles.headerLeft}>
                <TouchableOpacity style={styles.avatarWrap} onPress={pickImage}>
                  {profilePhoto ? (
                    <Image source={{ uri: profilePhoto }} style={styles.avatar} />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Feather name="user" size={36} color="#8B5CF6" />
                    </View>
                  )}
                </TouchableOpacity>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.title}>Welcome, {firstName || 'Coach'}</Text>
                  <Text style={styles.sub}>Tell us about yourself & your gym</Text>
                </View>
              </View>

            </View>

            {/* compact two-column form */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Owner Details</Text>

              <View style={styles.row}>
                <View style={styles.inputCol}>
                  <Text style={styles.label}>First name *</Text>
                  <TextInput
                    style={[styles.input, errors.firstName && styles.inputError]}
                    placeholder="First"
                    placeholderTextColor="#6B7280"
                    cursorColor="#fff"
                    value={firstName}
                    onChangeText={(t) => {
                      setFirstName(t);
                      if (errors.firstName) setErrors((s) => ({ ...s, firstName: '' }));
                    }}
                  />
                  {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
                </View>

                <View style={[styles.inputCol, { marginLeft: 10 }]}>
                  <Text style={styles.label}>Last name *</Text>
                  <TextInput
                    style={[styles.input, errors.lastName && styles.inputError]}
                    placeholder="Last"
                    placeholderTextColor="#6B7280"
                    cursorColor="#fff"
                    value={lastName}
                    onChangeText={(t) => {
                      setLastName(t);
                      if (errors.lastName) setErrors((s) => ({ ...s, lastName: '' }));
                    }}
                  />
                  {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
                </View>
              </View>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="you@studio.com"
                  placeholderTextColor="#6B7280"
                  cursorColor="#fff"
                  value={email}
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
                <Text style={styles.label}>Gender</Text>
                <View style={styles.rowWrap}>
                  {GENDERS.map((g) => (
                    <TouchableOpacity
                      key={g}
                      style={[styles.chip, gender === g && styles.chipActive]}
                      onPress={() => setGender(g)}
                    >
                      <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Date of Birth</Text>
                <View style={styles.dateRow}>
                  <TextInput
                    style={[styles.input, styles.inputFlex, errors.dob && styles.inputError]}
                    placeholder="dd-mm-yyyy"
                    placeholderTextColor="#6B7280"
                    value={dob}
                    cursorColor="#fff"
                    onChangeText={handleDOBChange}
                    keyboardType="numeric"
                  />
                  <TouchableOpacity
                    style={styles.dateBtn}
                    onPress={() => setCalendarVisible(true)}
                  >
                    <Feather name="calendar" size={18} color="#D1D5DB" />
                  </TouchableOpacity>
                </View>
                {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
              </View>
            </View>

            {/* Gym info card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Gym Details</Text>

              <View style={{ marginTop: 6 }}>
                <Text style={styles.label}>Gym name</Text>
                <TextInput
                  style={[styles.input, errors.gymName && styles.inputError]}
                  placeholder="e.g. Iron Core Gym"
                  placeholderTextColor="#6B7280"
                  cursorColor="#fff"
                  value={gymName}
                  onChangeText={(t) => {
                    setGymName(t);
                    if (errors.gymName) setErrors((s) => ({ ...s, gymName: '' }));
                  }}
                />
                {errors.gymName && <Text style={styles.errorText}>{errors.gymName}</Text>}
              </View>

              <View style={{ marginTop: 12 }}>
                <Text style={styles.label}>Location (city / area)</Text>
                <TextInput
                  style={[styles.input, errors.gymLocation && styles.inputError]}
                  placeholder="e.g. Bhubaneswar, Odisha"
                  placeholderTextColor="#6B7280"
                  cursorColor="#fff"
                  value={gymLocation}
                  onChangeText={(t) => {
                    setGymLocation(t);
                    if (errors.gymLocation) setErrors((s) => ({ ...s, gymLocation: '' }));
                  }}
                />
                {errors.gymLocation && <Text style={styles.errorText}>{errors.gymLocation}</Text>}
              </View>
            </View>

            {/* Save */}
            <TouchableOpacity
              style={styles.saveBtn}
              // onPress={handleSave}
              onPress={() => router.push('/home')}
              disabled={saving}
              activeOpacity={0.9}
            >
              {saving ? (
                <View style={styles.saveInner}>
                  <ActivityIndicator color="#fff" />
                  <Text style={[styles.saveText, { marginLeft: 12 }]}>Saving…</Text>
                </View>
              ) : (
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={['#8B5CF6', '#8B5CF6']}
                  style={styles.saveInner}
                >
                  <Text style={styles.saveText}>Save & Continue</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>

            {/* <View style={{ height: 36 }} /> */}
            <Calendar
              visible={calendarVisible}
              initialDate={
                dob
                  ? new Date(
                    Number(dob.split('-')[2]),
                    Number(dob.split('-')[1]) - 1,
                    Number(dob.split('-')[0])
                  )
                  : new Date()
              }
              onCancel={() => setCalendarVisible(false)}
              onConfirm={(date) => {
                const d = String(date.getDate()).padStart(2, '0');
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const y = date.getFullYear();

                const formatted = `${d}-${m}-${y}`;
                setDob(formatted);
                setCalendarVisible(false);
              }}
              restrictFutureDates={true}
            />

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 60 },

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
    borderWidth: 1,
    borderColor: '#361A66',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  avatar: { width: 76, height: 76, borderRadius: 12 },
  avatarPlaceholder: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center' },

  title: { fontSize: 18, fontWeight: '800', color: '#fff' },
  sub: { color: '#9AA0B8', marginTop: 2 },

  uploadBtn: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A1A4F',
  },
  uploadText: { color: '#C8B8FF', fontWeight: '700' },

  card: {
    backgroundColor: '#08080A',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#1B1B22',
  },
  cardTitle: { color: '#CFCFF6', fontWeight: '800', fontSize: 14, marginBottom: 8 },

  row: { flexDirection: 'row', alignItems: 'flex-start' },
  rowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },

  inputCol: { flex: 1 },

  label: { color: '#D1D5DB', marginBottom: 6, fontWeight: '700' },
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
  inputFlex: { flex: 1 },

  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', marginTop: 6, fontSize: 12 },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#0F0F12',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#27272A',
    marginRight: 8,
    marginTop: 6,
  },
  chipActive: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  chipText: { color: '#D1D5DB', fontWeight: '600' },
  chipTextActive: { color: '#fff' },

  dateRow: { flexDirection: 'row', alignItems: 'center' },
  dateBtn: {
    marginLeft: 8,
    backgroundColor: '#0F0F13',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2B2B33',
  },

  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#364153',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveBtn: {
    marginTop: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveInner: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});

export default ProfileSetup;
