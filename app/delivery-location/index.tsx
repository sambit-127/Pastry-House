import OrderSuccessModal from '@/components/OrderSuccessModal';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface DeliveryAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other' | 'hotel';
}

interface Seller {
  store_name: string;
  slug: string;
  business_mobile: string;
  city: string | null;
  state: string | null;
  logo_id: string | null;
  pincode: number | null;
  delivery_location_id: string | null;
}

const DeliveryLocation = () => {
  const router = useRouter();
  const { seller } = useLocalSearchParams<{ seller: string }>();
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
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [callModalVisible, setCallModalVisible] = useState(false);

  // Parse seller data
  const sellerData: Seller | null = seller ? JSON.parse(decodeURIComponent(seller)) : null;

  useEffect(() => {
    // Automatically select the default address if one exists
    const defaultAddress = deliveryAddresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    }
  }, []);

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleContinue = async () => {
    if (!selectedAddressId) {
      Alert.alert('Error', 'Please select a delivery address');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Directly show success modal after processing
      setShowSuccess(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to process order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddNewAddress = () => {
    router.replace(`/add-address?seller=${seller}`);
  };

  const CallSellerModal = ({ visible, onClose, sellerPhone }: { visible: boolean; onClose: () => void; sellerPhone: string }) => {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.callModalContainer}>
            <Text style={styles.callModalTitle}>Contact Seller</Text>
            <Text style={styles.callModalText}>
              Delivery location is not set by the seller. Please contact the seller directly to arrange delivery.
            </Text>
            <Text style={styles.callModalPhone}>{sellerPhone}</Text>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => {
                Linking.openURL(`tel:${sellerPhone}`);
                onClose();
              }}
            >
              <Text style={styles.callButtonText}>Call Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
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
        return '#FF6B6B';
      case 'work':
        return '#FF6B6B';
      case 'hotel':
        return '#FF6B6B';
      default:
        return '#FF6B6B';
    }
  };

  const renderAddressCard = (address: DeliveryAddress) => {
    const isSelected = selectedAddressId === address.id;

    return (
      <TouchableOpacity
        key={address.id}
        style={[styles.addressCard, isSelected && styles.selectedAddressCard]}
        onPress={() => handleAddressSelect(address.id)}
        activeOpacity={0.8}
      >
        <View style={styles.addressHeader}>
          <View style={styles.addressTypeContainer}>
            <View
              style={[styles.addressTypeIcon, { backgroundColor: getAddressTypeColor(address.type) }]}
            >
              <Ionicons name={getAddressTypeIcon(address.type) as any} size={16} color="#fff" />
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

          {isSelected && (
            <View style={styles.selectedIndicator}>
              <Ionicons name="checkmark-circle" size={24} color='#FF6B6B' />
            </View>
          )}
        </View>

        <View style={styles.addressDetails}>
          <Text style={styles.addressName}>{address.name}</Text>
          {address.phone && <Text style={styles.addressPhone}>{address.phone}</Text>}
          <Text style={styles.addressText}>
            {address.address}, {address.city}, {address.state} - {address.pincode}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Delivery Address</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Addresses List */}
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

        {/* Add New Address Button */}
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
                <Ionicons name="add" size={24} color='#FF6B6B' />
              </View>
              <Text style={styles.addAddressText}>Add New Address</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.continueButton, !selectedAddressId && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={!selectedAddressId}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={selectedAddressId ? ['#ff5050ff', '#ff5050ff'] : ['#333', '#222']}
            style={styles.continueGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text
              style={[styles.continueButtonText, !selectedAddressId && styles.continueButtonTextDisabled]}
            >
              Continue
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <CallSellerModal
        visible={callModalVisible}
        onClose={() => setCallModalVisible(false)}
        sellerPhone={sellerData?.business_mobile || '9876543210'}
      />

      <Modal
        visible={isProcessing}
        transparent
        animationType="fade"
      >
        <View style={styles.loadingModalContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="large" color='#ff5050ff' />
            <Text style={styles.loadingText}>Processing your order...</Text>
          </View>
        </View>
      </Modal>

      <OrderSuccessModal
        visible={showSuccess}
        cakeName="Red Velvet Cake"
        price="32.99"
        orderNumber="#CAKE-4821"
        estimatedTime="25-35 minutes"
        onClose={() => {
          setShowSuccess(false);
          router.push('/home');
        }}
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
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  addressesContainer: {
    gap: 12,
  },
  addressCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedAddressCard: {
    borderColor: '#FF6B6B',
    backgroundColor: '#050505ff',
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
    backgroundColor: '#FF6B6B',
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
  selectedIndicator: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
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
  addAddressButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
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
    color: '#FF6B6B',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.6,
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
  continueButtonTextDisabled: {
    color: '#999',
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
    color: '#FF6B6B',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callModalContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: width * 0.8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  callModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  callModalText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 16,
  },
  callModalPhone: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 20,
  },
  callButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  callButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  loadingModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
});

export default DeliveryLocation;