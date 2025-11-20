import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
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
    View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface DeliveryAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'others' | 'hotel';
  address_line_1?: string;
  address_line_2?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  business_name?: string;
  gstin?: string;
}

interface UpdateAddressModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (addressDetails: DeliveryAddress) => void;
  address: DeliveryAddress | null;
}

const UpdateAddressModal: React.FC<UpdateAddressModalProps> = ({
  visible,
  onClose,
  onSave,
  address,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Form state
  const [addressType, setAddressType] = useState<DeliveryAddress['type']>('home');
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
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (address) {
      setAddressType(address.type);
      setAddressLine1(address.address_line_1 || '');
      setAddressLine2(address.address_line_2 || '');
      setCity(address.city);
      setState(address.state);
      setPincode(address.pincode);
      setLatitude(address.latitude?.toString() || '');
      setLongitude(address.longitude?.toString() || '');
      setLandmark(address.landmark || '');
      setName(address.name);
      setPhone(address.phone);
      setShowGSTFields(!!address.gstin);
      setGstin(address.gstin || '');
      setBusinessName(address.business_name || '');
      setIsDefault(address.isDefault || false);
    }
  }, [address]);

  useEffect(() => {
    if (visible) {
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

  const handleMakePrimary = async () => {
    setIsDefault(true);
    await handleSaveAddress(true);
  };

  const handleSaveAddress = async (makePrimary = false) => {
    if (!addressLine1.trim() || !city.trim() || !state.trim() || !pincode.trim() || !name.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const addressDetails: DeliveryAddress = {
      id: address?.id || '',
      name: name.trim(),
      phone: phone.trim(),
      address: `${addressLine1.trim()}${addressLine2 ? ', ' + addressLine2.trim() : ''}${landmark ? ', ' + landmark.trim() : ''}`,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault: makePrimary ? true : isDefault,
      type: addressType,
      address_line_1: addressLine1.trim(),
      address_line_2: addressLine2.trim(),
      landmark: landmark.trim(),
      latitude: parseFloat(latitude) || 0,
      longitude: parseFloat(longitude) || 0,
      ...(showGSTFields && {
        gstin: gstin.trim(),
        business_name: businessName.trim(),
      }),
    };

    onSave(addressDetails);
    Alert.alert('Success', makePrimary ? 'Address set as primary successfully' : 'Address updated successfully');
  };

  const getAddressTypeIcon = (type: DeliveryAddress['type']) => {
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

  const renderAddressTypeButton = (type: DeliveryAddress['type'], label: string) => {
    const isSelected = addressType === type;

    return (
      <TouchableOpacity
        key={type}
        style={[
          modalStyles.addressTypeButton,
          isSelected && modalStyles.addressTypeButtonSelected,
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
          modalStyles.addressTypeText,
          isSelected && modalStyles.addressTypeTextSelected,
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
        <View style={modalStyles.modalContainer}>
          <Animated.View
            style={[
              modalStyles.backdrop,
              { opacity: backdropOpacity },
            ]}
          >
            <TouchableOpacity
              style={modalStyles.backdropTouchable}
              onPress={onClose}
              activeOpacity={1}
            />
          </Animated.View>

          <Animated.View
            style={[
              modalStyles.bottomSheet,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <SafeAreaView style={modalStyles.safeArea}>
              <View style={modalStyles.handleBar} />
              <View style={modalStyles.header}>
                <Text style={modalStyles.headerTitle}>Update Address</Text>
                <View style={modalStyles.headerRight}>
                  {isDefault ? (
                    <View style={modalStyles.primaryBadge}>
                      <Text style={modalStyles.primaryBadgeText}>Primary</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={modalStyles.makePrimaryButton}
                      onPress={handleMakePrimary}
                      activeOpacity={0.8}
                    >
                      <Text style={modalStyles.makePrimaryButtonText}>Make as Primary</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={modalStyles.closeButton}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close" size={24} color="#999" />
                  </TouchableOpacity>
                </View>
              </View>

              <ScrollView
                style={modalStyles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 100 }}
                automaticallyAdjustKeyboardInsets={true}
              >
                <View style={modalStyles.section}>
                  <Text style={modalStyles.sectionTitle}>Save address as *</Text>
                  <ScrollView horizontal style={modalStyles.addressTypeContainer}
                   contentContainerStyle={{gap:10,paddingHorizontal:5,paddingVertical:10}}>
                    {renderAddressTypeButton('home', 'Home')}
                    {renderAddressTypeButton('work', 'Work')}
                    {renderAddressTypeButton('hotel', 'Hotel')}
                    {renderAddressTypeButton('others', 'Others')}
                  </ScrollView>
                </View>

                <View style={modalStyles.section}>
                  <Text style={modalStyles.fieldLabel}>Address Line 1 *</Text>
                  <TextInput
                    style={modalStyles.textInput}
                    value={addressLine1}
                    onChangeText={setAddressLine1}
                    placeholder="Enter address line 1"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={modalStyles.section}>
                  <Text style={modalStyles.fieldLabel}>Address Line 2</Text>
                  <TextInput
                    style={modalStyles.textInput}
                    value={addressLine2}
                    onChangeText={setAddressLine2}
                    placeholder="Enter address line 2"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={modalStyles.section}>
                  <Text style={modalStyles.fieldLabel}>City *</Text>
                  <TextInput
                    style={modalStyles.textInput}
                    value={city}
                    onChangeText={setCity}
                    placeholder="Enter city"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={modalStyles.section}>
                  <Text style={modalStyles.fieldLabel}>State *</Text>
                  <TextInput
                    style={modalStyles.textInput}
                    value={state}
                    onChangeText={setState}
                    placeholder="Enter state"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={modalStyles.section}>
                  <Text style={modalStyles.fieldLabel}>Pincode *</Text>
                  <TextInput
                    style={modalStyles.textInput}
                    value={pincode}
                    onChangeText={setPincode}
                    placeholder="Enter pincode"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>

                <View style={modalStyles.section}>
                  <Text style={modalStyles.fieldLabel}>Latitude</Text>
                  <TextInput
                    style={modalStyles.textInput}
                    value={latitude}
                    onChangeText={setLatitude}
                    placeholder="Enter latitude"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>

                <View style={modalStyles.section}>
                  <Text style={modalStyles.fieldLabel}>Longitude</Text>
                  <TextInput
                    style={modalStyles.textInput}
                    value={longitude}
                    onChangeText={setLongitude}
                    placeholder="Enter longitude"
                    placeholderTextColor="#666"
                    keyboardType="numeric"
                  />
                </View>

                <View style={modalStyles.section}>
                  <Text style={modalStyles.fieldLabel}>Nearby landmark</Text>
                  <TextInput
                    style={modalStyles.textInput}
                    value={landmark}
                    onChangeText={setLandmark}
                    placeholder="Enter nearby landmark"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={modalStyles.section}>
                  <Text style={modalStyles.fieldLabel}>Your phone number</Text>
                  <View style={modalStyles.phoneContainer}>
                    <TextInput
                      style={[modalStyles.textInput, modalStyles.phoneInput]}
                      value={phone}
                      onChangeText={setPhone}
                      placeholder="Enter phone number"
                      placeholderTextColor="#666"
                      keyboardType="phone-pad"
                    />
                    {phone && (
                      <TouchableOpacity
                        style={modalStyles.clearButton}
                        onPress={() => setPhone('')}
                      >
                        <Ionicons name="close" size={16} color="#999" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View style={modalStyles.section}>
                  <Text style={modalStyles.fieldLabel}>Your name *</Text>
                  <TextInput
                    style={modalStyles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your name"
                    placeholderTextColor="#666"
                  />
                </View>

                <View style={modalStyles.section}>
                  <View style={modalStyles.checkboxContainer}>
                    <Switch
                      value={showGSTFields}
                      onValueChange={setShowGSTFields}
                      trackColor={{ false: '#333', true: '#FE5200' }}
                      thumbColor={showGSTFields ? '#fff' : '#f4f3f4'}
                    />
                    <Text style={modalStyles.checkboxLabel}>Add GSTIN Details</Text>
                  </View>
                </View>

                {showGSTFields && (
                  <>
                    <View style={modalStyles.section}>
                      <Text style={modalStyles.fieldLabel}>GSTIN Number</Text>
                      <TextInput
                        style={modalStyles.textInput}
                        value={gstin}
                        onChangeText={setGstin}
                        placeholder="Enter GSTIN number"
                        placeholderTextColor="#666"
                      />
                    </View>

                    <View style={modalStyles.section}>
                      <Text style={modalStyles.fieldLabel}>Business Name</Text>
                      <TextInput
                        style={modalStyles.textInput}
                        value={businessName}
                        onChangeText={setBusinessName}
                        placeholder="Enter business name"
                        placeholderTextColor="#666"
                      />
                    </View>
                  </>
                )}

                <Text style={modalStyles.infoText}>
                  Update your details for seamless delivery experience
                </Text>
              </ScrollView>

              <View style={modalStyles.bottomContainer}>
                <TouchableOpacity
                  style={modalStyles.saveButton}
                  onPress={() => handleSaveAddress()}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FF512F', '#FE5200']}
                    style={modalStyles.saveGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={modalStyles.saveButtonText}>Update address</Text>
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

const SavedAddress = () => {
  const router = useRouter();
  const { method } = useLocalSearchParams<{ method: string }>();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '9876543210',
      address: '123 Bakery Street, Near Central Park, Downtown',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      isDefault: true,
      type: 'home',
      address_line_1: '123 Bakery Street',
      address_line_2: 'Near Central Park',
      landmark: 'Downtown',
      latitude: 19.0760,
      longitude: 72.8777,
    },
    {
      id: '2',
      name: 'John Doe',
      phone: '9876543210',
      address: '456 Office Complex, Business District',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002',
      isDefault: false,
      type: 'work',
      address_line_1: '456 Office Complex',
      address_line_2: 'Business District',
      landmark: 'Near Metro Station',
      latitude: 19.0760,
      longitude: 72.8777,
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<DeliveryAddress | null>(null);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleContinue = () => {
    if (!selectedAddressId) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    const selectedAddress = deliveryAddresses.find(addr => addr.id === selectedAddressId);
    if (selectedAddress) {
      console.log('Selected address:', selectedAddress);
      console.log('Delivery method:', method);
      router.push('/');
    }
  };

  const handleAddNewAddress = () => {
    router.push('/add-address' as Href);
  };

  const handleUpdateAddress = (address: DeliveryAddress) => {
    setSelectedAddress(address);
    setModalVisible(true);
  };

  const handleDeleteAddress = async (addressId: string) => {
    Alert.alert(
      'Delete Address',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeliveryAddresses(prev => prev.filter(addr => addr.id !== addressId));
            if (selectedAddressId === addressId) {
              setSelectedAddressId('');
            }
            Alert.alert('Success', 'Address deleted successfully');
          },
        },
      ]
    );
  };

  const handleSaveAddress = (updatedAddress: DeliveryAddress) => {
    setDeliveryAddresses(prev =>
      prev.map(addr =>
        addr.id === updatedAddress.id
          ? { ...updatedAddress, address: `${updatedAddress.address_line_1}${updatedAddress.address_line_2 ? ', ' + updatedAddress.address_line_2 : ''}${updatedAddress.landmark ? ', ' + updatedAddress.landmark : ''}` }
          : { ...addr, isDefault: updatedAddress.isDefault ? false : addr.isDefault }
      )
    );
    setModalVisible(false);
    setSelectedAddress(null);
  };

  const getAddressTypeIcon = (type: string) => {
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

  const getAddressTypeColor = (type: string) => {
    switch (type) {
      case 'home':
        return '#FE5200';
      case 'work':
        return '#FE5200';
      case 'hotel':
        return '#FE5200';
      default:
        return '#FE5200';
    }
  };

  const renderAddressCard = (address: DeliveryAddress) => {
    const isSelected = selectedAddressId === address.id;

    return (
      <View key={address.id} style={[styles.addressCardContainer]}>
        <TouchableOpacity
          style={[
            styles.addressCard,
            address.isDefault && styles.selectedAddressCard,
          ]}
          onPress={() =>{
            handleUpdateAddress(address)
             handleAddressSelect(address.id)
            }}
          activeOpacity={0.8}
        >
          <View style={styles.addressHeader}>
            <View style={styles.addressTypeContainer}>
              <View style={[
                styles.addressTypeIcon,
                { backgroundColor: getAddressTypeColor(address.type) }
              ]}>
                <Ionicons
                  name={getAddressTypeIcon(address.type) as any}
                  size={16}
                  color="#fff"
                />
              </View>
              <Text style={styles.addressTypeText}>
                {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
              </Text>
              {address.isDefault && (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>Default</Text>
                </View>
              )}
            </View>
            <View style={styles.addressActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleUpdateAddress(address)}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={20} color="#FE5200" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteAddress(address.id)}
                activeOpacity={0.7}
              >
                <Ionicons name="trash" size={20} color="#EF4444" />
                <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.addressDetails}>
            <Text style={styles.addressName}>{address.name}</Text>
            {address.phone && <Text style={styles.addressPhone}>{address.phone}</Text>}
            <Text style={styles.addressText}>
              {address.address}, {address.city}, {address.state} - {address.pincode}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Address</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Your Addresses</Text>

        {loading ? (
          <Text style={styles.loadingText}>Loading addresses...</Text>
        ) : deliveryAddresses.length === 0 ? (
          <Text style={styles.emptyText}>No addresses found</Text>
        ) : (
          <View style={styles.addressesContainer}>
            {deliveryAddresses.map(renderAddressCard)}
          </View>
        )}

        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={handleAddNewAddress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#333', '#222']}
            style={styles.addAddressGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.addAddressContent}>
              <View style={styles.addAddressIcon}>
                <Ionicons name="add" size={24} color="#FE5200" />
              </View>
              <Text style={styles.addAddressText}>Add New Address</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF512F', '#FE5200']}
            style={styles.continueGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.continueButtonText}>Continue to Payment</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      <UpdateAddressModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedAddress(null);
        }}
        onSave={handleSaveAddress}
        address={selectedAddress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerRight: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 20,
  },
  addressesContainer: {
    gap: 16,
  },
  addressCardContainer: {
    marginBottom: 12,
  },
  addressCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAddressCard: {
    borderColor: '#FE5200',
    backgroundColor: '#2a1a0f',
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTypeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  addressTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
  },
  defaultBadge: {
    backgroundColor: '#FE5200',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  addressDetails: {
    gap: 6,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  addressPhone: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#ccc',
    lineHeight: 20,
  },
  addressActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FE5200',
  },
  addAddressButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  addAddressGradient: {
    padding: 16,
  },
  addAddressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAddressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addAddressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FE5200',
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#EF4444',
    textAlign: 'center',
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#999',
    textAlign: 'center',
    marginVertical: 20,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
  continueGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});

const modalStyles = StyleSheet.create({
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryBadge: {
    backgroundColor: '#FE5200',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  primaryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  makePrimaryButton: {
    backgroundColor: '#2a1a0f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FE5200',
  },
  makePrimaryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FE5200',
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

export default SavedAddress;