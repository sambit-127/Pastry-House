import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Login = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const phoneRef = useRef<TextInput>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Animation on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto focus input
    const timer = setTimeout(() => {
      phoneRef.current?.focus();
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/(auth)/otp',
        params: { phone }
      });
    }, 1500);
  };

  const isPhoneValid = phone.length === 10;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#e55027ff" barStyle="light-content" />
     
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image 
              source={require('@/assets/images/pastry/pastry2.png')} 
              style={styles.illustration}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Enter Your Mobile Number
          </Text>
          <Text style={styles.subtitle}>
            We'll send you an OTP to verify your number
          </Text>

          {/* Phone Input */}
          <View style={styles.inputContainer}>
            <View style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              ref={phoneRef}
              style={styles.phoneInput}
              placeholder="Enter mobile number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/\D/g, ''))}
              maxLength={10}
              selectionColor="#e55027ff"
            />
          </View>

          {/* Counter */}
          <View style={styles.counterContainer}>
            <Text style={[
              styles.counterText,
              { color: isPhoneValid ? '#e55027ff' : '#666' }
            ]}>
              {phone.length}/10
            </Text>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              isPhoneValid ? styles.buttonActive : styles.buttonDisabled
            ]}
            onPress={handleContinue}
            disabled={!isPhoneValid || loading}
          >
            {loading ? (
              <Text style={styles.buttonText}>Sending OTP...</Text>
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </TouchableOpacity>

          {/* Terms */}
          <Text style={styles.termsText}>
            By continuing, you agree to our{'\n'}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    height: height * 0.25,
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 10,
  },
  brandName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#cac2c2ff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    marginBottom: 8,
    overflow: 'hidden',
  },
  countryCode: {
    paddingHorizontal: 16,
    paddingVertical: 18,
    backgroundColor: '#F0F0F0',
    borderRightWidth: 1,
    borderRightColor: '#E8E8E8',
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  counterContainer: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '500',
  },
  continueButton: {
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonActive: {
    //backgroundColor: '#FE5200',
     backgroundColor: '#e55027ff',
  },
  buttonDisabled: {
    backgroundColor: '#e55027ff',
   // backgroundColor:"#FE5200"
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#e55027ff',
    fontWeight: '500',
  },
});

export default Login; 