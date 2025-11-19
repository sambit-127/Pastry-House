import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  Image,
  Keyboard,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const MODAL_HEIGHT = width < 380 ? height * 0.43 : height * 0.37;

// NOTE: This screen is a frontend-only demo. There is no backend call.
// The flow simulates OTP send/verify locally. For production wire this to your API.

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const router = useRouter();
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(0);
  const shakeTranslateX = useSharedValue(0);
  const phoneRef = useRef<TextInput | null>(null);
  const otpRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

  // Android back handling when this screen is focused
  useFocusEffect(
    useCallback(() => {
      const handleBackPress = () => {
        if (showOtp) {
          setShowOtp(false);
          setOtp(['', '', '', '']);
          setError('');
          return true;
        }
        Alert.alert('Exit App', 'Are you sure you want to leave the app?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Exit', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      return () => backHandler.remove();
    }, [showOtp])
  );

  useEffect(() => {
    scale.value = withTiming(1, { duration: 700 });
    opacity.value = withTiming(1, { duration: 600 });
  }, []);

  const triggerShake = () => {
    shakeTranslateX.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 })
      ),
      -1,
      false
    );
    setShake(true);
    setTimeout(() => {
      shakeTranslateX.value = 0;
      setShake(false);
    }, 300);
  };

  // Mock send OTP (no backend). Simulates a network delay and opens local OTP UI.
  const sendOtp = async (mobile: string) => {
    if (!mobile.match(/^\d{10}$/)) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setError('');
    // simulate network delay
    setTimeout(() => {
      setLoading(false);
      setShowOtp(true);
      // focus first OTP box
      setTimeout(() => otpRefs.current[0]?.focus(), 250);
      // for demo, console show OTP (in real app never do this)
      // console.log('Demo OTP is: 1234');
    }, 900);
  };

  // Mock verify OTP (accepts 1234 as correct OTP in this demo)
  const verifyOtpApi = async (mobile: string, otpCode: string) => {
    setLoading(true);
    setError('');
    setTimeout(async () => {
      setLoading(false);
      if (otpCode === '1234') {
        // store demo token and go to home/profile
        await AsyncStorage.setItem('token', 'demo_token_abc');
        // navigate to home — replace with your real route
        router.replace('/home');
      } else {
        setError('Invalid otp');
        triggerShake();
      }
    }, 900);
  };

  const goToOtp = () => sendOtp(phone);

  const verifyOtp = () => {
    const code = otp.join('');
    if (code.length === 4) verifyOtpApi(phone, code);
    else Alert.alert('Invalid OTP', 'Enter the 4-digit OTP sent to your mobile.');
  };

  const resendOtp = () => {
    setOtp(['', '', '', '']);
    setError('');
    setShowOtp(false);
    setTimeout(() => sendOtp(phone), 300);
  };

  const handleOtpChange = (value: string, index: number) => {
    value = value.replace(/\D/g, '');
    const newOtp = [...otp];
    if (value.length > 1) {
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
      if (value && index < 3) otpRefs.current[index + 1]?.focus();
      else if (value === '' && index > 0) otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      phoneRef.current?.focus();
    }, 600);
    return () => clearTimeout(focusTimeout);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));
  const otpAnimatedStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeTranslateX.value }] }));

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <TouchableNativeFeedback onPress={() => Keyboard.dismiss()}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />

          {/* top-left brand mark */}
          <View style={styles.logoContainer}>
            <Image source={require('@/assets/images/pastry/pastry2.png')} style={styles.logo} />
            <Text style={styles.brandText}>Pastery House</Text>
          </View>

          <View style={styles.centeredContainer}>
            <Animated.View style={[styles.modalContainer, { height: showOtp ? error ? height * 0.47 : height * 0.4 : MODAL_HEIGHT }, animatedStyle]}>
              <LinearGradient colors={["#0F0F10", "#150E25"]} style={StyleSheet.absoluteFill} />

              {!showOtp ? (
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Welcome back</Text>
                  <Text style={styles.modalSubtitle}>Sign in quickly to order your favourites from Pastery House.</Text>

                  <View style={[styles.inputContainer, { borderColor: isPhoneFocused ? '#FF8E53' : '#364153' }]}>
                    <Text style={styles.countryCode}>+91</Text>
                    <TextInput
                      style={styles.phoneInput}
                      value={phone}
                      ref={phoneRef}
                      onChangeText={(v) => setPhone(v.replace(/\D/g, ''))}
                      placeholder="Enter mobile number"
                      placeholderTextColor="#94a3b8"
                      keyboardType="numeric"
                      maxLength={10}
                      cursorColor="#fff"
                      editable={!loading}
                      onFocus={() => setIsPhoneFocused(true)}
                      onBlur={() => setIsPhoneFocused(false)}
                    />
                  </View>

                  <View style={styles.counterContainer}>
                    <Text style={[styles.counter, { color: phone.length === 10 ? '#FF8E53' : '#94a3b8' }]}>{phone.length}/10 digits</Text>
                  </View>

                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size={"large"} color="#fff" />
                      <Text style={styles.loadingText}>Sending OTP…</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.continueBtn} onPress={goToOtp}>
                      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={phone.length !== 10 || loading ? ['#FF8E5366', '#FF6B6B66'] : ['#FF8E53', '#FF6B6B']} style={styles.gradientBtn}>
                        <Text style={styles.continueBtnText}>Continue</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  <Text style={styles.termsText}>By continuing you agree to our Terms & Privacy.</Text>
                </View>
              ) : (
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Enter OTP</Text>
                  <Text style={[styles.modalSubtitle, { textAlign: 'center' }]}>Sent to +91 {phone.replace(/(\d{2})(\d{4})(\d{4})/, '$1 **** $3')}</Text>

                  <Animated.View style={[styles.otpContainer, otpAnimatedStyle]}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => { otpRefs.current[index] = ref }}
                        style={[
                          styles.otpBox,
                          digit ? styles.otpBoxFilled : {},
                          error === 'Invalid otp' ? styles.otpBoxError : {},
                        ]}
                        value={digit}
                        onChangeText={(v) => handleOtpChange(v, index)}
                        keyboardType="numeric"
                        cursorColor="#fff"
                        autoFocus={index === 0}
                        maxLength={1}
                        textAlign="center"
                        editable={!loading}
                      />
                    ))}
                  </Animated.View>

                  {error ? <Text style={[styles.errorText, styles.errorRed]}>OTP mismatch</Text> : null}

                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size={"large"} color="#fff" />
                      <Text style={styles.loadingText}>Verifying…</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.continueBtn} onPress={verifyOtp}>
                      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={otp.join('').length !== 4 || loading ? ['#8B5CF680', '#8B5CF680'] : ['#8B5CF6', '#A78BFA']} style={styles.gradientBtn}>
                        <Text style={styles.continueBtnText}>Verify</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.resendContainer} onPress={resendOtp} disabled={loading}>
                    <Text style={styles.resendText}>Resend OTP</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </View>
        </SafeAreaView>
      </TouchableNativeFeedback>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  gestureContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: '#070707' },
  centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 14 },
  logoContainer: { position: 'absolute', top: 48, left: 20, zIndex: 20, flexDirection: 'row', alignItems: 'center' },
  logo: { width: 56, height: 56, borderRadius: 12, marginRight: 12 },
  brandText: { color: '#fff', fontWeight: '900', fontSize: 18, letterSpacing: -0.5 },
  modalContainer: {
    width: '100%',
    height: MODAL_HEIGHT,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  modalContent: { flex: 1, paddingHorizontal: 28, paddingTop: width * 0.04 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: width * 0.02 },
  modalSubtitle: { fontSize: 14, color: '#C7CAD1', textAlign: 'center', marginBottom: width * 0.04 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#364153',
    backgroundColor: '#0F1113',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: width * 0.02,
    marginBottom: 8,
  },
  counterContainer: { alignSelf: 'flex-end', marginBottom: width * 0.05, marginTop: width * 0.015 },
  counter: { fontSize: 13, fontWeight: '500' },
  countryCode: { color: '#fff', fontSize: width * 0.04, fontWeight: '600', marginRight: 10 },
  phoneInput: { flex: 1, fontSize: width * 0.05, fontWeight: '600', color: '#fff' },
  continueBtn: { height: width * 0.13, borderRadius: 14, marginBottom: 6, overflow: 'hidden' },
  gradientBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 14 },
  continueBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  termsText: { fontSize: 12, color: '#8A8F9A', textAlign: 'center', marginTop: 12 },
  otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  otpBox: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: 12,
    backgroundColor: '#0F1113',
    borderWidth: 2,
    borderColor: '#364153',
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: width * 0.05,
  },
  otpBoxFilled: { borderColor: '#fff', backgroundColor: '#15161A' },
  otpBoxError: { borderColor: '#EF4444', backgroundColor: 'rgba(239,68,68,0.06)' },
  errorText: { fontSize: 14, textAlign: 'center', marginBottom: 12, fontWeight: '600' },
  errorRed: { color: '#EF4444' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  loadingText: { color: '#fff', marginLeft: 12, fontSize: 15, fontWeight: '600' },
  resendContainer: { alignItems: 'center', marginTop: width * 0.03 },
  resendText: { color: '#A78BFA', fontWeight: '600', fontSize: 15 },
});

export default Login;
