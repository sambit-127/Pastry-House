import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

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
    { title: "Help & Support", icon: "help-circle-outline", onPress: () => router.push("/help-support" as Href) },
  ];

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
                <Ionicons name={item.icon as any} size={24} color="#FF8E53" />
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777" />
            </Pressable>
          ))}
        </View>

        {/* --- Logout Button --- */}
        <Pressable style={styles.logoutBtn}>
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
    backgroundColor: "#0D0D0D",
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
    borderColor: "#FF8E53",
  },

  name: {
    color: "#fff",
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
    backgroundColor: "#121212",
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
    color: "#fff",
    fontSize: 17,
    fontWeight: "500",
  },

  logoutBtn: {
    flexDirection: "row",
    width: "90%",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 40,
    backgroundColor: "#C25A2C",
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
