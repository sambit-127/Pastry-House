import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface DeliveryMethodSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelfPickupSelect?: () => void;
  onHomeDeleverySelect?: () => void;
}

const DeliveryMethodSelectionModal: React.FC<DeliveryMethodSelectionModalProps> = ({
  visible,
  onClose,
  onSelfPickupSelect,
  onHomeDeleverySelect,
}) => {

  const handleDeliveryMethodSelect = (method: 'self-pickup' | 'home-delivery') => {
    onClose();
    setTimeout(() => {
      if (method === 'self-pickup') {
        onSelfPickupSelect?.();
      } else {
        onHomeDeleverySelect?.();
      }
    }, 300);
  };

  const renderDeliveryOption = (
    icon: string,
    title: string,
    subtitle: string,
    method: 'self-pickup' | 'home-delivery',
    gradientColors: [string, string]
  ) => (
    <TouchableOpacity
      style={styles.deliveryOption}
      onPress={() => handleDeliveryMethodSelect(method)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.optionGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.optionContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon as any} size={24} color="#fff" />
          </View>
          <View style={styles.optionTextContainer}>
            <Text style={styles.optionTitle}>{title}</Text>
            <Text style={styles.optionSubtitle}>{subtitle}</Text>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={styles.bottomSheet}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.handleBarContainer}>
              <View style={styles.handleBar} />
            </View>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Select Delivery Method</Text>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <View style={styles.content}>
              <Text style={styles.contentSubtitle}>Choose how you'd like to receive your order</Text>
              <View style={styles.optionsContainer}>
                {renderDeliveryOption(
                  'storefront',
                  'Self Pickup',
                  'Visit store and collect your order',
                  'self-pickup',
                  ['#FF512F', '#FE5200']
                )}
                {renderDeliveryOption(
                  'car',
                  'Home Delivery',
                  'Get your order delivered to your doorstep',
                  'home-delivery',
                  ['#FF512F', '#FE5200']
                )}
              </View>
            </View>
          </SafeAreaView>
        </View>
      </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  bottomSheet: {
    backgroundColor: '#000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.7,
    minHeight: height * 0.55,
    borderWidth: 1,
    borderColor: '#333',
  },
  safeArea: {
    flex: 1,
  },
  handleBarContainer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
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
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  contentSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 16,
  },
  deliveryOption: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  optionGradient: {
    padding: 20,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DeliveryMethodSelectionModal;