import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1A1A1A' }}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

     <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12, }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 3, }}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
         <Text style={styles.heading}>Privacy Policy</Text>
     </View>
      <Text style={styles.subHeading}>Your trust is the sweetest ingredient. We bake privacy into every layer of our service. 🍰🔒</Text>
      <Text style={styles.updated}>Last updated: November 20, 2025</Text>

      {/* Section Component */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={20} color='#ff5050ff' />
          <Text style={styles.cardTitle}>Introduction</Text>
        </View>
        <Text style={styles.cardText}>
          Welcome to our cake shop! We're delighted you're here. At our little bakery, we cherish your privacy as much as we do our secret frosting recipe.
          This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website, place an order, or interact with our sweet services.
          By using our site, you agree to these practices. If you have any questions, just drop us a line— we're always happy to chat!
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="list" size={20} color='#ff5050ff'/>
          <Text style={styles.cardTitle}>Information We Collect</Text>
        </View>
        <Text style={styles.cardText}>We only gather what we need to make your experience deliciously smooth:</Text>
        <Text style={styles.listItem}>• Personal Details: Name, email, phone, shipping address.</Text>
        <Text style={styles.listItem}>• Payment Info: Processed securely by our trusted partners.</Text>
        <Text style={styles.listItem}>• Usage Data: Cookies + analytics to help us serve you better.</Text>
        <Text style={styles.listItem}>• Communication: Messages from contact forms or chat.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="cafe" size={20} color='#ff5050ff' />
          <Text style={styles.cardTitle}>How We Use Your Information</Text>
        </View>
        <Text style={styles.listItem}>• Fulfill cake + pastry orders on time.</Text>
        <Text style={styles.listItem}>• Send reminders, updates, or promotions (if you opt in).</Text>
        <Text style={styles.listItem}>• Improve our shop based on your feedback + browsing.</Text>
        <Text style={styles.listItem}>• Prevent fraud + maintain security.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="share-social" size={20} color='#ff5050ff'/>
          <Text style={styles.cardTitle}>Sharing Your Information</Text>
        </View>
        <Text style={styles.cardText}>We don’t sell your data—ever. We only share when necessary:</Text>
        <Text style={styles.listItem}>• With shipping or delivery partners.</Text>
        <Text style={styles.listItem}>• With payment processors.</Text>
        <Text style={styles.listItem}>• When required by law.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="cookie" size={20} color='#ff5050ff' />
          <Text style={styles.cardTitle}>Cookies & Tracking</Text>
        </View>
        <Text style={styles.cardText}>
          We use cookies to remember your favorite flavors and make your visit sweeter.
          You can manage cookies from your browser settings.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="shield-checkmark" size={20} color='#ff5050ff'/>
          <Text style={styles.cardTitle}>Data Security</Text>
        </View>
        <Text style={styles.cardText}>
          We take security seriously with strong SSL encryption, regular audits, and secure servers. While no system is 100% foolproof, we treat your data like our most prized possession.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="key" size={20} color='#ff5050ff' />
          <Text style={styles.cardTitle}>Your Rights</Text>
        </View>
        <Text style={styles.listItem}>• Access, update, or delete your info.</Text>
        <Text style={styles.listItem}>• Opt out of marketing messages.</Text>
        <Text style={styles.listItem}>• File complaints with data authorities.</Text>
        <Text style={styles.cardText}>Contact us at [email@example.com] to exercise these rights.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="happy" size={20} color='#ff5050ff' />
          <Text style={styles.cardTitle}>Children's Privacy</Text>
        </View>
        <Text style={styles.cardText}>
          Our site is for adults (or supervised little ones). We don’t knowingly collect data from children under 13.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="refresh" size={20} color='#ff5050ff' />
          <Text style={styles.cardTitle}>Changes to This Policy</Text>
        </View>
        <Text style={styles.cardText}>
          We may update this policy as our bakery grows. Continued use means you agree to the changes.
        </Text>
      </View>

      {/* Footer */}
      <Text style={styles.footerHeading}>Got Questions? We're Here!</Text>
      <Text style={styles.footerText}>Reach out at [pastry@house.com] or call us at [phone].</Text>

      <View style={{ height: 40 }} />

    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  heading: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 14,
    color: '#ffffffff',
    textAlign: 'center',
    marginTop: 6,
  },
  updated: {
    color: '#fff1f2ff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#2A2A2A',
    padding: 16,
    borderRadius: 16,
    marginBottom: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  cardText: {
    color: '#ffffffff',
    lineHeight: 20,
    fontSize: 14,
  },
  listItem: {
    color: '#ffffffff',
    marginTop: 6,
    fontSize: 14,
  },
  footerHeading: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#abababff',
    marginTop: 6,
    marginBottom: 16,
  },
});

export default PrivacyPolicy;
