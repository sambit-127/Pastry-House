import appColors from "@/constants/Color";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Href, router } from "expo-router";
import React from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Profile() {
  const user = {
    name: "Sambit Shreeram",
    email: "sambit@example.com",
    image: require("@/assets/images/user.jpg"), // put your image
  };

  const menuItems = [
    { title: "Edit Profile", icon: "person-circle-outline", onPress: () => router.push("/edit-profile") },
    { title: "My Orders", icon: "receipt-outline", onPress: () => router.push("/orders" as Href) },
    { title: "Saved Addresses", icon: "location-outline", onPress: () => router.push("/saved-address") },
    { title: "Privacy-Policy", icon: "shield-checkmark-outline", onPress: () => router.push("/privacy-policy" as Href) },
    { title: "Help & Support", icon: "help-circle-outline", onPress: () => router.push("/contact-us" as Href) },
  ];
  // Logout Handler
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear all stored data (or specific keys like 'userToken', 'userData')
              await AsyncStorage.clear(); 
              // Or more selectively:
              // await AsyncStorage.multiRemove(['userToken', 'userData', 'isLoggedIn']);

              console.log("Logged out successfully & storage cleared");

              // Navigate to login screen (adjust path based on your auth flow)
              router.replace("/(auth)/login"); // or "/(auth)/login" depending on your folder structure
            } catch (error) {
              console.error("Error during logout:", error);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* --- Profile Header --- */}
        <View style={styles.header}>
          <Image source={user.image} style={styles.profilePic} />

          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        {/* --- Menu Options --- */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <Pressable key={index} style={[styles.menuItem, { borderBottomWidth: index === menuItems.length - 1 ? 0 : 1 }]} onPress={item.onPress}>
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={24} color={appColors.main.ButtonColor} />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={appColors.main.IconColor} />
            </Pressable>
          ))}
        </View>

        {/* --- Logout Button --- */}
        <Pressable style={styles.logoutBtn}onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color="#ffffffff" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.main.Background,
    paddingTop: 50,
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  profilePic: {
    width: 110,
    height: 110,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: appColors.main.ButtonColor,
  },

  name: {
    color: appColors.main.TextColor,
    fontSize: 24,
    fontWeight: "700",
    marginTop: 12,
  },

  email: {
    color: "#BFBFBF",
    fontSize: 15,
    marginTop: 4,
  },

  menuContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: appColors.main.Secondary,
    borderRadius: 20,
    paddingVertical: 10,
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  menuText: {
    color: appColors.main.TextColor,
    fontSize: 17,
    fontWeight: "500",
  },

  logoutBtn: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 40,
    backgroundColor:appColors.main.ButtonColor,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 16,
    alignItems: "center",
    gap: 10,
  },

  logoutText: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffffff",
  },
});
