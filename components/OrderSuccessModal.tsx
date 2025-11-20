import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { Animated, BackHandler, Dimensions, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const { width, height } = Dimensions.get('window');

interface OrderSuccessModalProps {
  visible: boolean;
  onClose?: () => void;
  onContinue?: () => void;
  onDownload?: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ visible, onClose, onContinue, onDownload }) => {
  const bgScale = useRef(new Animated.Value(0)).current;
  const tickScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const router = useRouter();

  useLayoutEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(bgScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.spring(tickScale, {
            toValue: 1,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    } else {
      bgScale.setValue(0);
      tickScale.setValue(0);
      contentOpacity.setValue(0);
    }
  }, [visible]);

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        router.push("/home");
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [visible, router]);

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent >
      <View style={styles.overlay}>
        <Animated.View style={[styles.homeButton, { opacity: contentOpacity }]}>
          <TouchableOpacity style={{ flex: 1 }} onPress={onContinue}>
            <MaterialCommunityIcons name="home" size={28} color="#FE5200" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={[
            styles.animatedBg,
            {
              transform: [
                { scale: bgScale.interpolate({ inputRange: [0, 1], outputRange: [0, 3.2] }) }
              ]
            }
          ]}
        />
        <View style={styles.centerContent}>
          <Animated.View
            style={[
              styles.tickContainer,
              {
                transform: [
                  {
                    scale: tickScale.interpolate({
                      inputRange: [0, 0.7, 1],
                      outputRange: [0, 1.15, 1]
                    })
                  }
                ],
                opacity: tickScale
              }
            ]}
          >
            <View style={styles.tickCircle}>
              <Image style={{ height: 50, width: 50 }} contentFit='contain' source={require('@/assets/images/check.png')} />
            </View>
          </Animated.View>
          <Animated.View style={{ opacity: contentOpacity, alignItems: 'center', width: '100%' }}>
            <Text style={styles.title}>Order Confirmed</Text>
            <Text style={styles.desc}>Thank you for your order from our bakery!</Text>
            <Text style={styles.desc2}>Your delicious treats are being prepared with love.</Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={onContinue}>
              <Text style={styles.primaryBtnText}>Continue Shopping</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedBg: {
    position: 'absolute',
    top: height / 2 - 200,
    left: width / 2 - 200,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#FE5200',
    zIndex: 1,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    zIndex: 2,
  },
  tickContainer: {
    marginBottom: 32,
  },
  tickCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FE5200',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
  },
  desc: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 6,
  },
  desc2: {
    color: '#ffe6d5',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  primaryBtn: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
    width: 220,
  },
  primaryBtnText: {
    color: '#FE5200',
    fontWeight: 'bold',
    fontSize: 16,
  },
  homeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
});

export default OrderSuccessModal;