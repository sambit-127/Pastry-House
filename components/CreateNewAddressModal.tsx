import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  district: string;
}

interface CreateNewAddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (addressDetails: any) => void;
  locationData: LocationData | null;
}

type AddressType = 'home' | 'work' | 'hotel' | 'others';

const CreateNewAddressModal: React.FC<CreateNewAddressModalProps> = ({
  visible,
  onClose,
  onSave,
  locationData,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const panRef = useRef(null);

  // Form state
  const [addressType, setAddressType] = useState<AddressType>('home');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [landmark, setLandmark] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showGSTFields, setShowGSTFields] = useState(false);
  const [gstin, setGstin] = useState('');
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    if (visible) {
      // Set default name and phone
      setName('John Doe');
      setPhone('9876543210');

      // Slide up animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Slide down animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  useEffect(() => {
    if (locationData) {
      setAddressLine1(locationData.address);
      setAddressLine2(locationData.district);
      setCity(locationData.city);
      setState(locationData.state);
      setPincode(locationData.pincode);
      setLatitude(locationData.latitude.toString());
      setLongitude(locationData.longitude.toString());
    }
  }, [locationData]);

  
  const handleSaveAddress = async () => {
    // Validate mandatory fields
    if (!addressLine1.trim()) {
      Alert.alert('Error', 'Please enter Address Line 1');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter city');
      return;
    }
    if (!state.trim()) {
      Alert.alert('Error', 'Please enter state');
      return;
    }
    if (!pincode.trim()) {
      Alert.alert('Error', 'Please enter pincode');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    const addressDetails = {
      address_type: addressType.charAt(0).toUpperCase() + addressType.slice(1),
      address_line_1: addressLine1.trim(),
      address_line_2: addressLine2.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      latitude: parseFloat(latitude) || 0,
      longitude: parseFloat(longitude) || 0,
      landmark: landmark.trim(),
      delivery_name: name.trim(),
      mobile_number: phone.trim(),
      is_default: true,
      ...(showGSTFields && {
        gstin: gstin.trim(),
        business_name: businessName.trim(),
      }),
    };

    onSave(addressDetails);
    router.push("/delivery-location")
  };

  const getAddressTypeIcon = (type: AddressType) => {
    switch (type) {
      case 'home':
        return 'home';
      case 'work':
        return 'business';
      case 'hotel':
        return 'bed';
      default:
        return 'location';
    }
  };

  const renderAddressTypeButton = (type: AddressType, label: string) => {
    const isSelected = addressType === type;

    return (
      <TouchableOpacity
        key={type}
        style={[
          styles.addressTypeButton,
          isSelected && styles.addressTypeButtonSelected,
        ]}
        onPress={() => setAddressType(type)}
        activeOpacity={0.8}
      >
        <Ionicons
          name={getAddressTypeIcon(type) as any}
          size={16}
          color={isSelected ? '#FE5200' : '#999'}
        />
        <Text style={[
          styles.addressTypeText,
          isSelected && styles.addressTypeTextSelected,
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.backdrop,
              { opacity: backdropOpacity },
            ]}
          >
            <TouchableOpacity
              style={styles.backdropTouchable}
              onPress={onClose}
              activeOpacity={1}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.bottomSheet,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <SafeAreaView style={styles.safeArea}>
              <View style={styles.handleBar} />
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Enter Complete Address</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={onClose}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 100 }}
                automaticallyAdjustKeyboardInsets={true}
              >
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Save address as *</Text>
                  <ScrollView horizontal style={styles.addressTypeContainer}
                  contentContainerStyle={{gap:10,paddingHorizontal:5,paddingVertical:10}}
                  >
                    {renderAddressTypeButton('home', 'Home')}
                    {renderAddressTypeButton('work', 'Work')}
                    {renderAddressTypeButton('hotel', 'Hotel')}
                    {renderAddressTypeButton('others', 'Others')}
                  </ScrollView>
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>Address Line 1 *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={addressLine1}
                    onChangeText={setAddressLine1}
                    placeholder="Enter address line 1"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>Address Line 2</Text>
                  <TextInput
                    style={styles.textInput}
                    value={addressLine2}
                    onChangeText={setAddressLine2}
                    placeholder="Enter address line 2"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>City *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={city}
                    onChangeText={setCity}
                    placeholder="Enter city"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>State *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={state}
                    onChangeText={setState}
                    placeholder="Enter state"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>Pincode *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={pincode}
                    onChangeText={setPincode}
                    placeholder="Enter pincode"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>Latitude</Text>
                  <TextInput
                    style={styles.textInput}
                    value={latitude}
                    onChangeText={setLatitude}
                    placeholder="Enter latitude"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>Longitude</Text>
                  <TextInput
                    style={styles.textInput}
                    value={longitude}
                    onChangeText={setLongitude}
                    placeholder="Enter longitude"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>Nearby landmark</Text>
                  <TextInput
                    style={styles.textInput}
                    value={landmark}
                    onChangeText={setLandmark}
                    placeholder="Enter nearby landmark"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>Your phone number</Text>
                  <View style={styles.phoneContainer}>
                    <TextInput
                      style={[styles.textInput, styles.phoneInput]}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Enter phone number"
                      placeholderTextColor="#666"
                      keyboardType="phone-pad"
                    />
                    {phone && (
                      <TouchableOpacity
                        style={styles.clearButton}
                        onPress={() => setPhone('')}
                      >
                        <Ionicons name="close" size={16} color="#999" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.fieldLabel}>Your name *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={styles.section}>
                  <View style={styles.checkboxContainer}>
                    <Switch
                      value={showGSTFields}
                      onValueChange={setShowGSTFields}
                      trackColor={{ false: '#333', true: '#FE5200' }}
                      thumbColor={showGSTFields ? '#fff' : '#f4f3f4'}
                    />
                    <Text style={styles.checkboxLabel}>Add GSTIN Details</Text>
                  </View>
                </View>

                {showGSTFields && (
                  <>
                    <View style={styles.section}>
                      <Text style={styles.fieldLabel}>GSTIN Number</Text>
                      <TextInput
                        style={styles.textInput}
                        value={gstin}
                        onChangeText={setGstin}
                        placeholder="Enter GSTIN number"
                        placeholderTextColor="#666"
                      />
                    </View>

                    <View style={styles.section}>
                      <Text style={styles.fieldLabel}>Business Name</Text>
                      <TextInput
                        style={styles.textInput}
                        value={businessName}
                        onChangeText={setBusinessName}
                        placeholder="Enter business name"
                        placeholderTextColor="#666"
                      />
                    </View>
                  </>
                )}

                <Text style={styles.infoText}>
                  Enter your details for seamless delivery experience
                </Text>
              </ScrollView>

              <View style={styles.bottomContainer}>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveAddress}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FF512F', '#FE5200']}
                    style={styles.saveGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.saveButtonText}>Save Address</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  backdropTouchable: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.95,
    minHeight: height * 0.7,
  },
  safeArea: {
    flex: 1,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  addressTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
    gap: 6,
  },
  addressTypeButtonSelected: {
    borderColor: '#FE5200',
    backgroundColor: '#2a1a0f',
  },
  addressTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  addressTypeTextSelected: {
    color: '#FE5200',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '400',
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneInput: {
    flex: 1,
  },
  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ccc',
  },
  infoText: {
    fontSize: 12,
    fontWeight: '400',
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  bottomContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

export default CreateNewAddressModal;