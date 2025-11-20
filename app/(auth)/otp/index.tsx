import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
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

const OTP = () => {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const router = useRouter();
  
  // Properly type the refs array
  const otpRefs = useRef<Array<TextInput | null>>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Initialize refs array
    otpRefs.current = otpRefs.current.slice(0, 4);
    
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

    // Focus first OTP input
    const timer = setTimeout(() => {
      otpRefs.current[0]?.focus();
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (value: string, index: number) => {
    value = value.replace(/\D/g, '');
    const newOtp = [...otp];
    
    if (value.length > 1) {
      // Handle paste
      const digits = value.slice(0, 4 - index);
      for (let i = 0; i < digits.length && index + i < 4; i++) {
        newOtp[index + i] = digits[i];
      }
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 3);
      otpRefs.current[nextIndex]?.focus();
    } else {
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 3) {
        otpRefs.current[index + 1]?.focus();
      }
    }
    
    setError('');
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 4) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (code === '1234') { // Demo OTP
      
        // Navigate to next screen
       router.replace('/(auth)/profile-setup');
      } else {
        setError('Invalid OTP. Please try again.');
        // Shake animation for error
        Animated.sequence([
          Animated.timing(slideAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
          Animated.timing(slideAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
        ]).start();
      }
    }, 1500);
  };

  const handleResend = () => {
    setOtp(['', '', '', '']);
    setError('');
    setCountdown(30);
    otpRefs.current[0]?.focus();
    
    // Show success message
    Alert.alert('OTP Sent', 'New OTP has been sent to your mobile number.');
  };

  const isOtpComplete = otp.join('').length === 4;
  const maskedPhone = phone?.toString().replace(/(\d{2})(\d{4})(\d{4})/, '$1 **** $3');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FC8019" barStyle="light-content" />
      
      {/* Header with Back Button */}
      <View style={styles.header}>
        
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>
          
         
      </View>

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
            Verify OTP
          </Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to
          </Text>
          <Text style={styles.phoneNumber}>
            +91 {maskedPhone}
          </Text>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  otpRefs.current[index] = ref;
                }}
                style={[
                  styles.otpBox,
                  otp[index] ? styles.otpBoxFilled : {},
                  error ? styles.otpBoxError : {},
                ]}
                value={otp[index]}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                selectionColor="#e55027ff"
                editable={!loading}
              />
            ))}
          </View>

          {/* Error Message */}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : null}

          {/* Verify Button */}
          <TouchableOpacity
            style={[
              styles.verifyButton,
              isOtpComplete ? styles.buttonActive : styles.buttonDisabled
            ]}
            onPress={handleVerify}
            disabled={!isOtpComplete || loading}
          >
            {loading ? (
              <Text style={styles.buttonText}>Verifying...</Text>
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          {/* Resend OTP */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Didn't receive the code?{' '}
            </Text>
            <TouchableOpacity 
              onPress={handleResend}
              disabled={countdown > 0 || loading}
            >
              <Text style={[
                styles.resendButton,
                (countdown > 0 || loading) && styles.resendDisabled
              ]}>
                {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          </View>

          
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
   paddingTop:10,
   paddingHorizontal:16,
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(87, 86, 86, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    marginTop: -2,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 35,
    height: 35,
    borderRadius: 8,
    marginRight: 10,
  },
  brandName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 40,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 10,
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
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e55027ff',
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  otpBox: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    borderRadius: 12,
    backgroundColor: '#F8F8F8',
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  otpBoxFilled: {
    borderColor: '#e55027ff',
    backgroundColor: '#FFF5F0',
  },
  otpBoxError: {
    borderColor: '#FF4444',
    backgroundColor: '#FFF0F0',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  verifyButton: {
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 30,
  },
  buttonActive: {
    backgroundColor: '#e55027ff',
  },
  buttonDisabled: {
    backgroundColor: '#e55027ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendButton: {
    fontSize: 14,
    color: '#e55027ff',
    fontWeight: '600',
  },
  resendDisabled: {
    color: '#999',
  },
  supportText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  supportLink: {
    color: '#e55027ff',
    fontWeight: '600',
  },
});

export default OTP;