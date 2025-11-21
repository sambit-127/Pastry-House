import CreateNewAddressModal from '@/components/CreateNewAddressModal';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
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

const AddAddress = () => {
  const router = useRouter();
  const { seller } = useLocalSearchParams<{ seller: string }>();
  const mapRef = useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Default location (Bhubaneswar)
  const defaultLocation = {
    latitude: 20.2961,
    longitude: 85.8245,
    address: 'Saheed Nagar',
    city: 'Bhubaneswar',
    state: 'Odisha',
    pincode: '751007',
    district: 'Khordha',
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to get your current location.');
        setSelectedLocation(defaultLocation);
        setCurrentLocation(defaultLocation);
        setLoading(false);
        return;
      }

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode to get address details
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        const locationData: LocationData = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: address.street || 'Unknown Street',
          city: address.city || 'Unknown City',
          state: address.region || 'Unknown State',
          pincode: address.postalCode || '000000',
          district: address.district || address.city || 'Unknown District',
        };

        setCurrentLocation(locationData);
        setSelectedLocation(locationData);
        
        // Animate map to current location
        mapRef.current?.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      setSelectedLocation(defaultLocation);
      setCurrentLocation(defaultLocation);
    } finally {
      setLoading(false);
    }
  };

  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    
    try {
      // Reverse geocode to get address details
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        const locationData: LocationData = {
          latitude,
          longitude,
          address: address.street || 'Unknown Street',
          city: address.city || 'Unknown City',
          state: address.region || 'Unknown State',
          pincode: address.postalCode || '000000',
          district: address.district || address.city || 'Unknown District',
        };

        setSelectedLocation(locationData);
      }
    } catch (error) {
      // Handle error silently
    }
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
      mapRef.current?.animateToRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  const handleAddMoreDetails = () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location on the map first.');
      return;
    }
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSaveAddress = (addressDetails: any) => {
    // Combine location data with user input
    const completeAddress = {
      ...selectedLocation,
      ...addressDetails,
    };
    
    console.log('Complete address:', completeAddress);
    
    let sellerData;
    try {
      sellerData = JSON.parse(seller || '{}');
    } catch (error) {
      return;
    }

    // Close modal and navigate back to delivery location
    setModalVisible(false);
    setTimeout(() => {
      router.replace({
        pathname: '/delivery-location',
        params: {
          seller: encodeURIComponent(JSON.stringify(sellerData)),
        },
      });
    }, 300);
  };

  const handleMapError = () => {
    setMapError(true);
  };

  const renderMapView = () => {
    if (mapError) {
      return (
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color="#333" />
          <Text style={styles.mapPlaceholderText}>Map Unavailable</Text>
          <Text style={styles.mapPlaceholderSubtext}>
            Please check your internet connection and try again
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => setMapError(false)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: defaultLocation.latitude,
          longitude: defaultLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        loadingEnabled={true}
        loadingIndicatorColor='#FF6B6B' 
        loadingBackgroundColor="#000"
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title="Selected Location"
            description={selectedLocation.address}
            pinColor='#FF6B6B' 
          />
        )}
      </MapView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Address</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        {renderMapView()}

        {/* Use Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={handleUseCurrentLocation}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#ff5050ff' , '#ff5050ff' ]}
            style={styles.currentLocationGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="locate" size={20} color="#fff" />
            <Text style={styles.currentLocationText}>Use current location</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Location Confirmation Section */}
      {selectedLocation && (
        <View style={styles.locationConfirmation}>
          <Text style={styles.confirmationTitle}>Delivering your order to</Text>
          
          <View style={styles.locationCard}>
            <View style={styles.locationIcon}>
              <Ionicons name="location" size={20} color='#FF6B6B'  />
            </View>
            <View style={styles.locationDetails}>
              <Text style={styles.locationAddress}>{selectedLocation.address}</Text>
              <Text style={styles.locationCity}>{selectedLocation.city}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Add More Details Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.addDetailsButton,
            !selectedLocation && styles.addDetailsButtonDisabled,
          ]}
          onPress={handleAddMoreDetails}
          disabled={!selectedLocation}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={selectedLocation ? ['#ff5050ff' , '#ff5050ff' ] : ['#333', '#222']}
            style={styles.addDetailsGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={[
              styles.addDetailsText,
              !selectedLocation && styles.addDetailsTextDisabled,
            ]}>
              Add more address details ►
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Address Details Modal */}
      <CreateNewAddressModal
        visible={modalVisible}
        onClose={handleModalClose}
        onSave={handleSaveAddress}
        locationData={selectedLocation}
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FF6B6B' ,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  currentLocationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  currentLocationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currentLocationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  locationConfirmation: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  confirmationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#333"
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a1a0f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  locationDetails: {
    flex: 1,
  },
  locationAddress: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  locationCity: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  addDetailsButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addDetailsButtonDisabled: {
    opacity: 0.6,
  },
  addDetailsGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  addDetailsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  addDetailsTextDisabled: {
    color: '#999',
  },
});

export default AddAddress;