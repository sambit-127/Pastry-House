// OrderDetails.tsx
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const theme = {
    bg: "#050506",
    surface: "#101012",
    card: "#18181B",
    border: "#262626",
    gold: '#FF6B6B',
    accent: '#FF6B6B',
    text: "#FFFFFF",
    muted: "#A1A1AA",
    success: "#4CAF50",
    softPink: '#FF6B6B',
    gradientStart:'#FF6B6B',
    gradientEnd: "#f7b4b4",
};

// Order tracking steps
const TRACK_STEPS = [
    {
        key: "confirmed",
        title: "Confirmed",
        subtitle: "Order received",
        icon: "checkmark-circle",
    },
    {
        key: "baked",
        title: "Baked with Love",
        subtitle: "Preparing your treats",
        icon: "cube",
    },
    {
        key: "delivery",
        title: "Out for Delivery",
        subtitle: "On the way to you",
        icon: "bus",
    },
    {
        key: "delivered",
        title: "Delivered",
        subtitle: "Enjoy your sweetness",
        icon: "heart",
    },
];

const CURRENT_STEP = 2; // index (0-3)

const ORDER_ITEMS = [
    {
        id: "1",
        title: "Chocolate Truffle Cake",
        qty: 1,
        price: 599,
        icon: "pizza",
    },
    {
        id: "2",
        title: "Assorted Cookie Box",
        qty: 1,
        price: 250,
        icon: "cookie",
    },
];

export default function OrderDetails() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* HEADER */}
                <View style={styles.headerRow}>
                 <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                       <Text style={styles.headerTitle}>Your treat is on its way 🍰🚚</Text>
                 </View>
                    <Text style={styles.orderId}>Order #ORD00125</Text>
                </View>

                {/* TIMELINE */}
                <View style={styles.timelineContainer}>
                    {TRACK_STEPS.map((step, index) => {
                        const active = index <= CURRENT_STEP;

                        return (
                            <View key={step.key}>
                                {/* ICON + TEXT */}
                                <View style={styles.stepRow}>
                                    <View
                                        style={[
                                            styles.stepIconCircle,
                                            active && { backgroundColor: theme.accent + "33" },
                                        ]}
                                    >
                                        <Ionicons
                                            name={step.icon as any}
                                            size={20}
                                            color={active ? theme.accent : theme.muted}
                                        />
                                    </View>

                                    <View>
                                        <Text
                                            style={[
                                                styles.stepTitle,
                                                active && { color: theme.accent  },
                                            ]}
                                        >
                                            {step.title}
                                        </Text>
                                        <Text style={styles.stepSub}>{step.subtitle}</Text>
                                    </View>
                                </View>

                                {/* Line separator */}
                                {index !== TRACK_STEPS.length - 1 && (
                                    <View
                                        style={[
                                            styles.timelineLine,
                                            active && { borderColor: theme.accent },
                                        ]}
                                    />
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* ORDER ITEMS SECTION */}
                <Text style={styles.sectionTitle}>Let's unwrap the sweetness 🍪</Text>

                <View style={styles.card}>
                    <Text style={styles.cardHeading}>Order Items</Text>

                    {ORDER_ITEMS.map((item) => (
                        <View key={item.id} style={styles.itemRow}>
                            <View style={styles.itemIconWrapper}>
                                <Ionicons name="fast-food" size={26} color={theme.gold} />
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.itemName}>{item.title}</Text>
                                <Text style={styles.itemQty}>Qty: {item.qty}</Text>
                            </View>

                            <Text style={styles.itemPrice}>₹{item.price}</Text>
                        </View>
                    ))}
                </View>

                {/* DELIVERY INFO */}
                <View style={styles.card}>
                    <View style={styles.infoRow}>
                        <Ionicons name="location" size={20} color={theme.gold} />
                        <View>
                            <Text style={styles.infoTitle}>Delivery Address</Text>
                            <Text style={styles.infoText}>
                                123 Sweet Street, Dessert District, Mumbai - 400001
                            </Text>
                        </View>
                    </View>

                    <View style={styles.line} />

                    <View style={styles.infoRow}>
                        <Ionicons name="calendar" size={20} color={theme.gold} />
                        <View>
                            <Text style={styles.infoTitle}>Delivery Date & Time</Text>
                            <Text style={styles.infoText}>Nov 12, 2025, 3:00 PM</Text>
                        </View>
                    </View>

                    <View style={styles.line} />

                    <View style={styles.infoRow}>
                        <MaterialIcons name="payments" size={20} color={theme.gold} />
                        <View>
                            <Text style={styles.infoTitle}>Payment Method</Text>
                            <Text style={styles.infoText}>UPI</Text>
                        </View>
                    </View>
                </View>

                {/* TOTAL SECTION */}
                <View style={styles.card}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Subtotal</Text>
                        <Text style={styles.totalAmount}>₹849</Text>
                    </View>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Delivery</Text>
                        <Text style={[styles.totalAmount, { color: theme.success }]}>
                            FREE
                        </Text>
                    </View>

                    <View style={styles.line} />

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabelBold}>Total</Text>
                        <Text style={styles.totalAmountBold}>₹849</Text>
                    </View>
                </View>

                {/* DOWNLOAD INVOICE BUTTON */}
                <Pressable style={styles.invoiceBtn}>
                    <MaterialIcons name="download" size={22} color="#fff" />
                    <Text style={styles.invoiceText}>Download Invoice</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ===========  STYLES  ================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
        paddingHorizontal: 16,
    },

    headerRow: {
        paddingTop: 12,
        paddingBottom: 6,
    },

    headerTitle: {
        color: theme.text,
        fontSize: 20,
        fontWeight: "700",
    },

    orderId: {
        color: theme.muted,
        marginTop: 4,
    },

    /* TIMELINE */
    timelineContainer: {
        marginTop: 18,
        marginBottom: 20,
        paddingLeft: 4,
    },

    stepRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },

    stepIconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: theme.card,
        alignItems: "center",
        justifyContent: "center",
    },

    stepTitle: {
        color: theme.muted,
        fontSize: 16,
        fontWeight: "700",
    },

    stepSub: {
        color: theme.muted,
        fontSize: 12,
        marginTop: 2,
    },

    timelineLine: {
        height: 22,
        borderLeftWidth: 2,
        marginLeft: 18,
        borderColor: theme.border,
    },

    /* ORDER ITEMS */
    sectionTitle: {
        color: theme.text,
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
    },

    card: {
        backgroundColor: theme.card,
        borderRadius: 14,
        padding: 16,
        marginBottom: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },

    cardHeading: {
        color: theme.text,
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 12,
    },

    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
    },

    itemIconWrapper: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: "#2A2A2A",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 14,
    },

    itemName: {
        color: theme.text,
        fontSize: 15,
        fontWeight: "700",
    },

    itemQty: {
        color: theme.muted,
        fontSize: 12,
        marginTop: 2,
    },

    itemPrice: {
        color: theme.gold,
        fontWeight: "700",
        fontSize: 16,
    },

    /* DELIVERY INFO */
    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 18,
    },

    infoTitle: {
        color: theme.text,
        fontWeight: "700",
    },

    infoText: {
        color: theme.muted,
        width: width * 0.75,
        marginTop: 3,
    },

    line: {
        height: 1,
        backgroundColor: theme.border,
        marginVertical: 10,
    },

    /* TOTAL SECTION */
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
    },

    totalLabel: {
        color: theme.muted,
    },

    totalAmount: {
        color: theme.text,
        fontWeight: "600",
    },

    totalLabelBold: {
        color: theme.text,
        fontWeight: "700",
        fontSize: 16,
    },

    totalAmountBold: {
        color: theme.gold,
        fontWeight: "800",
        fontSize: 18,
    },

    /* INVOICE BUTTON */
    invoiceBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.accent,
        paddingVertical: 16,
        borderRadius: 14,
        marginBottom: 40,
        gap: 10,
    },

    invoiceText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
});
