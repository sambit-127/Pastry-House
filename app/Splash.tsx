import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';

// Assuming you're using React Navigation for navigation. If not, adjust accordingly.
import { useNavigation } from '@react-navigation/native'; // Uncomment if using React Navigation
import { router } from 'expo-router';

const Splash = () => {
  const navigation = useNavigation(); // Uncomment if using React Navigation
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in animation

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500, // 1.5 seconds fade-in
      useNativeDriver: true,
    }).start();

    // Simulate navigation after 3 seconds (replace with real auth check or loading)
    const timer = setTimeout(() => {
      const token = '123r'
      if (token) {
        router.push('/home')
      }
      else {
        router.push('/login')
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image source={require('@/assets/images/pastry/pastry2.png')} style={{ height: 250, width: 250 }} />

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff', // White background for clean theme
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007BFF', // Primary blue
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#28A745', // Accent green for health/fitness
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});

export default Splash;