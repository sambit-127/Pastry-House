import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
    Animated,
    BackHandler,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

interface OrderSuccessModalProps {
  visible: boolean;
  cakeName?: string;
  price?: string;
  orderNumber?: string;
  estimatedTime?: string;
  onClose?: () => void;
  onContinue?: () => void;
}

const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  visible,
  onContinue,
  onClose,
  cakeName = "Chocolate Fudge Cake",
  price = "$24.99",
  orderNumber = "#CAKE-2837",
  estimatedTime = "20-30 minutes",
}) => {
  const router = useRouter();

  const bgScale = useRef(new Animated.Value(0)).current;
  const tickScale = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(bgScale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.spring(tickScale, {
            toValue: 1,
            friction: 6,
            tension: 120,
            useNativeDriver: true,
          }),
          Animated.timing(contentOpacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(ringScale, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(ringScale, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }, 300);
    } else {
      bgScale.setValue(0);
      tickScale.setValue(0);
      ringScale.setValue(0);
      contentOpacity.setValue(0);
    }
  }, [visible]);

  useEffect(() => {
    const backAction = () => {
      if (visible) {
        onClose?.();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [visible, onClose]);

  const handleContinue = () => {
    onContinue?.() || onClose?.();
  };

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent>
      <View style={styles.overlay}>
        {/* Expanding gradient background - Changed to warm bakery colors */}
        <Animated.View
          style={[
            styles.gradientBg,
            {
              transform: [
                {
                  scale: bgScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 3],
                  }),
                },
              ],
            },
          ]}
        >
          <LinearGradient
            colors={["#FF9A8B", "#FF6B6B", "#FF8E53"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        {/* Main content */}
        <View style={styles.centerContent}>
          <Animated.View
            style={[
              styles.tickWrapper,
              { transform: [{ scale: tickScale }], opacity: tickScale },
            ]}
          >
            {/* Pulse ring */}
            <Animated.View
              style={[
                styles.ring,
                {
                  transform: [
                    {
                      scale: ringScale.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 2],
                      }),
                    },
                  ],
                  opacity: ringScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.6, 0],
                  }),
                },
              ]}
            />
            <View style={styles.tickCircle}>
              <MaterialCommunityIcons name="cake-variant" size={46} color="#FF6B6B" />
            </View>
          </Animated.View>

          <Animated.View
            style={[{ opacity: contentOpacity, alignItems: "center", width: "90%" }]}
          >
            <Text style={styles.title}>Order Confirmed!</Text>
            <Text style={styles.subtitle}>
              Your delicious cake is being prepared with love
            </Text>

            {/* Order Summary Card */}
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <MaterialCommunityIcons name="cake" size={24} color="#FF6B6B" />
                <Text style={styles.orderTitle}>{cakeName}</Text>
              </View>
              
              <View style={styles.orderDetails}>
                <MaterialCommunityIcons
                  name="receipt-outline"
                  size={18}
                  color="#FF6B6B"
                />
                <Text style={styles.orderNumber}>Order {orderNumber}</Text>
              </View>

              <View style={styles.orderDetails}>
                <MaterialCommunityIcons
                  name="currency-usd"
                  size={18}
                  color="#4CAF50"
                />
                <Text style={styles.orderPrice}>{price}</Text>
              </View>

              <View style={styles.orderFooter}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={18}
                  color="#FFA726"
                />
                <Text style={styles.orderFooterText}>
                  Ready in {estimatedTime}
                </Text>
              </View>

              {/* Preparation Badge */}
              <View style={styles.preparationBadge}>
                <MaterialCommunityIcons
                  name="chef-hat"
                  size={16}
                  color="#FF6B6B"
                />
                <Text style={styles.preparationText}>
                  Our bakers are working on it!
                </Text>
              </View>
            </View>

            {/* Additional Order Info */}
            <View style={styles.additionalInfo}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="truck-delivery" size={20} color="#FF6B6B" />
                <Text style={styles.infoText}>Free delivery to your location</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="bell-ring" size={20} color="#FF6B6B" />
                <Text style={styles.infoText}>We'll notify you when ready</Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.primaryBtn} onPress={handleContinue}>
                <LinearGradient
                  colors={["#FF6B6B", "#FF8E53"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.primaryBtnBg}
                >
                  <Text style={styles.primaryBtnText}>Track My Order</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.secondaryBtn} onPress={onClose}>
                <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientBg: {
    position: "absolute",
    top: height / 2 - 200,
    left: width / 2 - 200,
    width: 400,
    height: 400,
    borderRadius: 200,
    overflow: "hidden",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
  },
  tickWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  tickCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#FF6B6B",
    shadowOpacity: 0.5,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  ring: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FF6B6B",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    color: "#FFFFFF",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.9,
  },
  orderCard: {
    width: "100%",
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  orderTitle: {
    color: "#333333",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  orderDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  orderNumber: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  orderPrice: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  orderFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  orderFooterText: {
    color: "#FFA726",
    marginLeft: 8,
    fontSize: 13,
    fontWeight: "500",
  },
  preparationBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 12,
    backgroundColor: "rgba(255,107,107,0.1)",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.2)",
  },
  preparationText: {
    color: "#FF6B6B",
    fontWeight: "500",
    fontSize: 12,
    marginLeft: 6,
  },
  additionalInfo: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    color: "#FFFFFF",
    fontSize: 13,
    marginLeft: 10,
    fontWeight: "500",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  primaryBtn: {
    borderRadius: 25,
    overflow: "hidden",
    width: "100%",
    shadowColor: "#FF6B6B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryBtnBg: {
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  secondaryBtn: {
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  secondaryBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default OrderSuccessModal;