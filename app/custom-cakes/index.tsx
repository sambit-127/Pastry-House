import * as ImagePicker from 'expo-image-picker'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const CustomCakePage = () => {
  const router = useRouter()
  const [selectedFlavor, setSelectedFlavor] = useState('')
  const [selectedWeight, setSelectedWeight] = useState('')
  const [selectedShape, setSelectedShape] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [message, setMessage] = useState('Happy Birthday!')
  const [additionalDescription, setAdditionalDescription] = useState('')
  const [customShapeText, setCustomShapeText] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('')
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  
  // Modal states
  const [showFlavorModal, setShowFlavorModal] = useState(false)
  const [showWeightModal, setShowWeightModal] = useState(false)
  const [showShapeModal, setShowShapeModal] = useState(false)
  const [showColorModal, setShowColorModal] = useState(false)

  // Animation values
  const [modalAnimation] = useState(new Animated.Value(0))

  const colors = [
    { name: 'Pink', value: '#f18d9cff' },
    { name: 'Mint', value: '#98FB98' },
    { name: 'Lavender', value: '#E6E6FA' },
    { name: 'Buttercream', value: '#FFF8DC' },
    { name: 'Blue', value: '#8bcee4ff' },
    { name: 'Yellow', value: '#f0ea36ff' },
    { name: 'Red', value: '#eb250bff' },
    { name: 'Brown', value: '#4E3524' },
    { name: 'Purple', value: '#6f217fff' },
  
  ]

  const weights = [
    { label: '0.5 kg', serves: '2-4 people', price: 1125 },
    { label: '1 kg', serves: '6-8 people', price: 1875 },
    { label: '1.5 kg', serves: '10-12 people', price: 2625 },
    { label: '2 kg', serves: '12-16 people', price: 3375 },
    { label: '3 kg', serves: '20-24 people', price: 4875 },
    { label: '5 kg', serves: '30-35 people', price: 7125 }
  ]

  const flavors = [
    { name: 'Chocolate', emoji: '🍫', popular: true, description: 'Rich chocolate flavor' },
    { name: 'Vanilla', emoji: '🍦', popular: true, description: 'Classic vanilla taste' },
    { name: 'Red Velvet', emoji: '❤️', popular: true, description: 'Creamy red velvet' },
    { name: 'Strawberry', emoji: '🍓', popular: false, description: 'Fresh strawberry' },
    { name: 'Coffee', emoji: '☕', popular: false, description: 'Bold coffee flavor' },
    { name: 'Lemon', emoji: '🍋', popular: false, description: 'Zesty lemon' },
    { name: 'Carrot', emoji: '🥕', popular: false, description: 'Spiced carrot cake' },
    { name: 'Cheesecake', emoji: '🍰', popular: true, description: 'Creamy cheesecake' }
  ]

  const shapes = [
    { name: 'Round', emoji: '🔵', description: 'Classic round shape' },
    { name: 'Square', emoji: '⬛', description: 'Modern square shape' },
    { name: 'Heart', emoji: '💖', description: 'Romantic heart shape' },
    { name: 'Rectangle', emoji: '🟫', description: 'Elegant rectangle' },
    { name: 'Star', emoji: '🌟', description: 'Fun star shape' },
    { name: 'Custom', emoji: '✨', description: 'Fully custom design' }
  ]

  const openModal = (modalType: string) => {
    switch(modalType) {
      case 'flavor': setShowFlavorModal(true); break;
      case 'weight': setShowWeightModal(true); break;
      case 'shape': setShowShapeModal(true); break;
      case 'color': setShowColorModal(true); break;
    }
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowFlavorModal(false)
      setShowWeightModal(false)
      setShowShapeModal(false)
      setShowColorModal(false)
    })
  }

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setReferenceImage(result.assets[0].uri)
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image')
    }
  }

  const calculateTotal = () => {
    const basePrice = selectedWeight ? weights.find(w => w.label === selectedWeight)?.price || 0 : 0
    const customization = selectedFlavor && selectedShape && selectedColor ? 600 : 0
    const delivery = 225
    return basePrice + customization + delivery
  }

  const formatIndianRupees = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`
  }

  const handleAddToCart = () => {
    if (!selectedFlavor || !selectedWeight || !selectedShape || !selectedColor) {
      Alert.alert('Incomplete Order', 'Please select flavor, size, shape, and color to continue.')
      return
    }
    console.log('Added to cart')
  }

  const handleBuyNow = () => {
    if (!selectedFlavor || !selectedWeight || !selectedShape || !selectedColor) {
      Alert.alert('Incomplete Order', 'Please select flavor, size, shape, and color to continue.')
      return
    }
    console.log('Buy now')
  }

  // Get selected flavor emoji
  const getSelectedFlavorEmoji = () => {
    if (!selectedFlavor) return '🍰'
    const flavor = flavors.find(f => f.name === selectedFlavor)
    return flavor ? flavor.emoji : '🍰'
  }

  // Get selected shape emoji
  const getSelectedShapeEmoji = () => {
    if (!selectedShape) return '🔷'
    const shape = shapes.find(s => s.name === selectedShape)
    return shape ? shape.emoji : '🔷'
  }

  // Get selected color display - CORRECTED VERSION
  const getSelectedColorDisplay = () => {
    if (!selectedColor) {
      return <Text style={styles.selectionCardEmoji}>🎨</Text>
    }
    return (
      <View style={[styles.colorIcon, { backgroundColor: selectedColor }]} />
    )
  }

  // Get shape display value
  const getShapeDisplayValue = () => {
    if (!selectedShape) return ''
    if (selectedShape === 'Custom' && customShapeText) {
      return customShapeText
    }
    return selectedShape
  }

  // Modern Selection Card Component - Updated to show selected values and dynamic icons
  const SelectionCard = ({ title, value, onPress, icon, customIcon }: any) => (
    <TouchableOpacity 
      style={[
        styles.selectionCard,
        value && styles.selectedCard,
        title === 'Color' && value && { borderColor: selectedColor }
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.selectionCardContent}>
        <View style={[
          styles.selectionCardIcon,
          value && styles.selectedIcon,
          title === 'Color' && value && { backgroundColor: 'transparent' }
        ]}>
          {customIcon || <Text style={styles.selectionCardEmoji}>{icon}</Text>}
        </View>
        <View style={styles.selectionCardText}>
          <Text style={styles.selectionCardTitle}>{title}</Text>
          <Text 
            style={[
              styles.selectionCardValue,
              value ? styles.selectedValue : styles.placeholderValue
            ]}
            numberOfLines={1}
          >
            {value || `Select ${title}`}
          </Text>
        </View>
        <View style={styles.selectionCardArrow}>
          <Text style={[
            styles.chevron,
            value && styles.selectedChevron
          ]}>›</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  // Bottom Sheet Modal Component
  const BottomSheetModal = ({ visible, onClose, title, children }: any) => {
    const translateY = modalAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight, 0],
    })

    if (!visible) return null

    return (
      <Modal visible={visible} transparent animationType="none">
        <View style={styles.bottomSheetOverlay}>
          <TouchableOpacity style={styles.overlayTouchable} onPress={closeModal} />
          <Animated.View 
            style={[
              styles.bottomSheetContainer,
              { transform: [{ translateY }] }
            ]}
          >
            <View style={styles.bottomSheetHeader}>
              <View style={styles.bottomSheetHandle} />
              <View style={styles.bottomSheetTitleRow}>
                <Text style={styles.bottomSheetTitle}>{title}</Text>
                <TouchableOpacity onPress={closeModal} style={styles.bottomSheetClose}>
                  <Text style={styles.bottomSheetCloseText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.bottomSheetContent}>
              {children}
            </View>
          </Animated.View>
        </View>
      </Modal>
    )
  }

  // Modal Content Components
  const FlavorModalContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.modalGrid}>
        {flavors.map((flavor, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedFlavor(flavor.name)
              closeModal()
            }}
            style={[
              styles.modalOptionCard,
              selectedFlavor === flavor.name && styles.selectedModalOptionCard
            ]}
            activeOpacity={0.8}
          >
            {flavor.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Popular</Text>
              </View>
            )}
            <Text style={styles.modalEmoji}>{flavor.emoji}</Text>
            <Text style={styles.modalOptionName}>{flavor.name}</Text>
            <Text style={styles.modalOptionDesc}>{flavor.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )

  const WeightModalContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.modalGrid}>
        {weights.map((weight, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedWeight(weight.label)
              closeModal()
            }}
            style={[
              styles.modalOptionCard,
              selectedWeight === weight.label && styles.selectedModalOptionCard
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.weightLabel}>{weight.label}</Text>
            <Text style={styles.weightServes}>{weight.serves}</Text>
            <Text style={styles.weightPrice}>{formatIndianRupees(weight.price)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )

  const ShapeModalContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.modalGrid}>
        {shapes.map((shape, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedShape(shape.name)
              closeModal()
            }}
            style={[
              styles.modalOptionCard,
              selectedShape === shape.name && styles.selectedModalOptionCard
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.modalEmoji}>{shape.emoji}</Text>
            <Text style={styles.modalOptionName}>{shape.name}</Text>
            <Text style={styles.modalOptionDesc}>{shape.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )

  const ColorModalContent = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.modalGrid}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              setSelectedColor(color.value)
              closeModal()
            }}
            style={[
              styles.modalOptionCard,
              selectedColor === color.value && [styles.selectedModalOptionCard, { borderColor: color.value }]
            ]}
            activeOpacity={0.8}
          >
            <View style={[
              styles.colorCircle,
              { backgroundColor: color.value },
              selectedColor === color.value && [styles.selectedColorCircle, { borderColor: color.value }]
            ]}>
              {selectedColor === color.value && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </View>
            <Text style={styles.modalOptionName}>{color.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  )

  // Auto-format Date → DD/MM/YYYY
  const handleDateChange = (text: string) => {
    let formatted = text.replace(/\D/g, '') // remove everything except numbers
    if (formatted.length > 8) formatted = formatted.slice(0, 8)

    if (formatted.length > 4) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}/${formatted.slice(4)}`
    } else if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}/${formatted.slice(2)}`
    }

    setDeliveryDate(formatted)
  }

  // Auto-format Time → HH:MM
  const handleTimeChange = (text: string) => {
    let formatted = text.replace(/\D/g, '')
    if (formatted.length > 4) formatted = formatted.slice(0, 4)

    if (formatted.length > 2) {
      formatted = `${formatted.slice(0, 2)}:${formatted.slice(2)}`
    }

    setDeliveryTime(formatted)
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#000000" barStyle="light-content" />
      
      {/* Modern Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Custom Cake</Text>
          <Text style={styles.headerSubtitle}>Design your masterpiece</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        

        {/* Customization Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Cake Details</Text>
            <Text style={styles.sectionSubtitle}>Choose your preferences</Text>
          </View>
          
          <View style={styles.gridContainer}>
            <SelectionCard
              title="Flavor"
              value={selectedFlavor}
              onPress={() => openModal('flavor')}
              icon={getSelectedFlavorEmoji()}
            />
            
            <SelectionCard
              title="Size"
              value={selectedWeight}
              onPress={() => openModal('weight')}
              icon="📏"
            />
            
            <SelectionCard
              title="Shape"
              value={getShapeDisplayValue()}
              onPress={() => openModal('shape')}
              icon={getSelectedShapeEmoji()}
            />
            
            <SelectionCard
              title="Color"
              value={colors.find(c => c.value === selectedColor)?.name}
              onPress={() => openModal('color')}
              icon="🎨"
              customIcon={getSelectedColorDisplay()}
            />
          </View>

          {/* Custom Shape Input - Shows on main page when Custom shape is selected */}
          {selectedShape === 'Custom' && (
            <View style={styles.customShapeContainer}>
              <Text style={styles.customShapeLabel}>Describe your custom shape</Text>
              <TextInput
                value={customShapeText}
                onChangeText={setCustomShapeText}
                placeholder="e.g., Number, Character, Animal shape, etc."
                placeholderTextColor="#888"
                style={styles.customShapeInput}
                multiline
                numberOfLines={3}
              />
            </View>
          )}
        </View>

        {/* Message Input */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personalized Message</Text>
            <Text style={styles.sectionSubtitle}>Add a special touch</Text>
          </View>
          <View style={styles.messageContainer}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Enter your message here..."
              placeholderTextColor="#888"
              style={styles.textInput}
              multiline
              numberOfLines={3}
            />
            <View style={styles.messageIcon}>
              <Text style={styles.messageEmoji}>💌</Text>
            </View>
          </View>
        </View>

        {/* Additional Description Input */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Design Details</Text>
            <Text style={styles.sectionSubtitle}>Complete your cake vision</Text>
          </View>
          <View style={styles.additionalDescriptionContainer}>
            <TextInput
              value={additionalDescription}
              onChangeText={setAdditionalDescription}
              placeholder="Describe your cake design..."
              placeholderTextColor="#888"
              style={styles.additionalDescriptionInput}
              multiline
              numberOfLines={3}
            />
            <View style={styles.additionalDescriptionIcon}>
              <Text style={styles.additionalDescriptionEmoji}>📝</Text>
            </View>
          </View>
        </View>

        {/* Reference Upload */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reference Photo</Text>
            <Text style={styles.sectionSubtitle}>Show us your inspiration</Text>
          </View>
          <TouchableOpacity style={styles.uploadCard} onPress={pickImage} activeOpacity={0.8}>
            {referenceImage ? (
              <View style={styles.uploadedImageContainer}>
                <Image source={{ uri: referenceImage }} style={styles.uploadedImage} />
                <View style={styles.uploadOverlay}>
                  <Text style={styles.uploadChangeText}>Change Photo</Text>
                </View>
              </View>
            ) : (
              <View style={styles.uploadContent}>
                <View style={styles.uploadIconCircle}>
                  <Text style={styles.uploadIcon}>📷</Text>
                </View>
                <Text style={styles.uploadText}>Upload Reference Photo</Text>
                <Text style={styles.uploadSubtext}>Tap to select from gallery</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Delivery Information */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <Text style={styles.sectionSubtitle}>When should we deliver?</Text>
          </View>
          <View style={styles.deliveryCards}>
            <View style={styles.deliveryCard}>
              <Text style={styles.deliveryLabel}>Delivery Date</Text>
              <TextInput
                value={deliveryDate}
                onChangeText={handleDateChange}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#888"
                keyboardType="numeric"                
                maxLength={10}
                style={styles.deliveryInput}
              />
            </View>
            
            <View style={styles.deliveryCard}>
              <Text style={styles.deliveryLabel}>Delivery Time</Text>
              <TextInput
                value={deliveryTime}
                onChangeText={handleTimeChange}
                placeholder="HH:MM"
                placeholderTextColor="#888"
                style={styles.deliveryInput}
                keyboardType="numeric"                
                maxLength={5}
              />
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <Text style={styles.summaryAmount}>{formatIndianRupees(calculateTotal())}</Text>
          </View>
          
          <View style={styles.summaryBreakdown}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Base Price</Text>
              <Text style={styles.summaryValue}>
                {formatIndianRupees(selectedWeight ? weights.find(w => w.label === selectedWeight)?.price || 0 : 0)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Customization</Text>
              <Text style={styles.summaryValue}>
                {formatIndianRupees((selectedFlavor && selectedShape && selectedColor) ? 600 : 0)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery</Text>
              <Text style={styles.summaryValue}>{formatIndianRupees(225)}</Text>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Add to Cart</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleBuyNow}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#FF6B35', '#FF8E53']}
                style={styles.primaryButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryButtonText}>Order Now</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sheet Modals */}
      <BottomSheetModal
        visible={showFlavorModal}
        onClose={closeModal}
        title="Choose Flavor"
      >
        <FlavorModalContent />
      </BottomSheetModal>

      <BottomSheetModal
        visible={showWeightModal}
        onClose={closeModal}
        title="Choose Size"
      >
        <WeightModalContent />
      </BottomSheetModal>

      <BottomSheetModal
        visible={showShapeModal}
        onClose={closeModal}
        title="Choose Shape"
      >
        <ShapeModalContent />
      </BottomSheetModal>

      <BottomSheetModal
        visible={showColorModal}
        onClose={closeModal}
        title="Choose Color"
      >
        <ColorModalContent />
      </BottomSheetModal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
    backgroundColor: '#000000',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  // Hero Section
  heroSection: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  heroGradient: {
    padding: 24,
    borderRadius: 20,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  heroDecoration: {
    marginTop: 8,
  },
  heroEmoji: {
    fontSize: 24,
  },
  // Progress Indicator
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 12,
    color: '#888888',
    fontWeight: '500',
  },
  // Section Styles
  section: {
    marginHorizontal: 16,
    marginBottom: 18,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#888888',
  },
  // Grid Layout
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  // Selection Card
  selectionCard: {
    width: '48%',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333333',
  },
  selectedCard: {
    borderColor: '#f97008ff',
    backgroundColor: '#1A1A1A',
  },
  selectionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectionCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedIcon: {
    backgroundColor: '#333333',
  },
  selectionCardEmoji: {
    fontSize: 20,
  },
  colorIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  selectionCardText: {
    flex: 1,
  },
  selectionCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  selectionCardValue: {
    fontSize: 12,
    marginTop: 2,
  },
  selectedValue: {
    color: '#f97008ff',
    fontWeight: '600',
  },
  placeholderValue: {
    color: '#888888',
    fontStyle: 'italic',
  },
  selectionCardArrow: {
    marginLeft: 8,
  },
  chevron: {
    fontSize: 18,
    color: '#888888',
    fontWeight: 'bold',
  },
  selectedChevron: {
    color: '#f97008ff',
  },
  // Message Input
  messageContainer: {
    position: 'relative',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 16,
    padding: 16,
    paddingRight: 50,
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 40,
  },
  messageIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  messageEmoji: {
    fontSize: 20,
  },
  // Additional Description
  additionalDescriptionContainer: {
    position: 'relative',
  },
  additionalDescriptionInput: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 16,
    padding: 16,
    paddingRight: 50,
    color: '#FFFFFF',
    backgroundColor: '#1A1A1A',
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  additionalDescriptionIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  additionalDescriptionEmoji: {
    fontSize: 20,
  },
  // Upload Styles
  uploadCard: {
    borderWidth: 2,
    borderColor: '#333333',
    borderStyle: 'dashed',
    borderRadius: 16,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1A1A',
    overflow: 'hidden',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadIcon: {
    fontSize: 20,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  uploadSubtext: {
    color: '#888888',
    fontSize: 12,
  },
  uploadedImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  uploadChangeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  // Delivery Styles
  deliveryCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deliveryCard: {
    width: '46%',
  },
  deliveryLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  deliveryInput: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  // Summary Section
  summarySection: {
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  summaryBreakdown: {
    borderTopWidth: 1,
    borderTopColor: '#333333',
    paddingTop: 16,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  summaryLabel: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#333333',
    borderRadius: 14,
    padding: 14,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Bottom Sheet Styles
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  overlayTouchable: {
    flex: 1,
  },
  bottomSheetContainer: {
    backgroundColor: '#141111',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: screenHeight * 0.85,
    minHeight: screenHeight * 0.6,
  },
  bottomSheetHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  bottomSheetTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bottomSheetClose: {
    padding: 4,
  },
  bottomSheetCloseText: {
    fontSize: 20,
    color: '#888888',
    fontWeight: '300',
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
  },
  // Modal Content Styles
  modalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modalOptionCard: {
    width: '48%',
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#0c0909',
    alignItems: 'center',
    position: 'relative',
  },
  selectedModalOptionCard: {
    borderColor: '#FF6B35',
    backgroundColor: '#130909',
  },
  modalEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  modalOptionName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  modalOptionDesc: {
    color: '#CCCCCC',
    fontSize: 12,
    textAlign: 'center',
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColorCircle: {
    borderColor: '#FF6B35',
    transform: [{ scale: 1.1 }],
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  weightLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  weightServes: {
    fontSize: 12,
    color: '#CCCCCC',
    marginBottom: 4,
  },
  weightPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  // Custom Shape Input on Main Page
  customShapeContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  customShapeLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  customShapeInput: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 12,
    padding: 16,
    color: '#FFFFFF',
    backgroundColor: '#0c0909',
    fontSize: 14,
    textAlignVertical: 'top',
    minHeight: 80,
  },
})

export default CustomCakePage