import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ContactUs = () => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#1A1A1A' }}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* Send Message Section */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12, }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 3, }}>
                        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.heading}>Contact Us
                    </Text>
                </View>
                <Text style={styles.subHeading}>Tell us your issue, feedback, or query 💬</Text>

                <View style={styles.formBox}>
                    <TextInput placeholder="Full Name" placeholderTextColor="#AFAFAF" style={styles.input} />
                    <TextInput placeholder="Email Address" placeholderTextColor="#AFAFAF" style={styles.input} />
                    <TextInput placeholder="Phone Number" placeholderTextColor="#AFAFAF" style={styles.input} />
                    <TextInput placeholder="Subject" placeholderTextColor="#AFAFAF" style={styles.input} />
                    <TextInput placeholder="Message" placeholderTextColor="#AFAFAF" style={[styles.input, styles.textArea]} multiline />

                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonText}>Send Message 🍰</Text>
                    </TouchableOpacity>
                </View>

                {/* Contact Info Section */}
                <Text style={styles.sectionTitle}>Or Reach Us</Text>

                <View style={styles.card}>
                    <Ionicons name="location-sharp" size={22} color="#FF6B81" />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Address</Text>
                        <Text style={styles.cardText}>123 Dessert Lane, Bhubaneswar, Odisha, India</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Ionicons name="call" size={22} color='#FF6B6B' />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Phone</Text>
                        <Text style={styles.cardText}>+91 98765 43210</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <MaterialCommunityIcons name="email" size={22} color='#FF6B6B' />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Email</Text>
                        <Text style={styles.cardText}>hello@sweetbite.com</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <MaterialCommunityIcons name="clock-time-four" size={22} color='#FF6B6B' />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>Timings</Text>
                        <Text style={styles.cardText}>Mon - Sun, 9:00 AM to 9:00 PM</Text>
                    </View>
                </View>

                {/* Social Section */}
                <Text style={styles.sectionTitle}>Stay Connected</Text>

                <View style={styles.socialRow}>
                    <View style={styles.socialCard}>
                        <Ionicons name="logo-instagram" size={24} color='#FF6B6B' />
                        <Text style={styles.socialText}>Instagram</Text>
                    </View>
                    <View style={styles.socialCard}>
                        <Ionicons name="logo-facebook" size={24} color='#FF6B6B' />
                        <Text style={styles.socialText}>Facebook</Text>
                    </View>
                </View>

                <View style={styles.socialRow}>
                    <View style={styles.socialCard}>
                        <Ionicons name="logo-whatsapp" size={24} color='#FF6B6B'/>
                        <Text style={styles.socialText}>WhatsApp</Text>
                    </View>
                    <View style={styles.socialCard}>
                        <Ionicons name="logo-youtube" size={24} color='#FF6B6B' />
                        <Text style={styles.socialText}>YouTube</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1A1A1A',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    heading: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    subHeading: {
        fontSize: 14,
        color: '#FFDDE1',
        textAlign: 'center',
        marginBottom: 18,
        marginTop: 4,
    },
    formBox: {
        backgroundColor: '#2A2A2A',
        padding: 18,
        borderRadius: 18,
        marginBottom: 30,
    },
    input: {
        backgroundColor: '#1F1F1F',
        paddingHorizontal: 14,
        paddingVertical: 12,
        borderRadius: 12,
        color: '#FFF',
        marginBottom: 12,
        fontSize: 14,
    },
    textArea: {
        height: 100,
    },
    button: {
        backgroundColor: '#FF6B6B',
        paddingVertical: 14,
        borderRadius: 14,
        marginTop: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '700',
        marginTop: 10,
        marginBottom: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#2A2A2A',
        padding: 14,
        borderRadius: 16,
        marginBottom: 14,
    },
    cardContent: {
        marginLeft: 10,
        flex: 1,
    },
    cardTitle: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    cardText: {
        color: '#FFDDE1',
        fontSize: 13,
        marginTop: 3,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
        marginBottom: 20,
    },
    socialCard: {
        alignItems: 'center',
    },
    socialText: {
        color: '#FFDDE1',
        marginTop: 6,
    },
});

export default ContactUs;
