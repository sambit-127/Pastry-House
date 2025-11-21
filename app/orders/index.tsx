import { Ionicons } from "@expo/vector-icons";
import { Href, router } from "expo-router";
import React from "react";
import {
    Dimensions,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");

// ---- THEME ----
const theme = {
    bg: "#050506",
    surface: "#101012",
    card: "#18181B",
    border: "#262626",
    gold: '#FF6B6B',
    accent: "#FF8E53",
    text: "#FFFFFF",
    muted: "#A1A1AA",
    success: "#4CAF50",
    warning: "#FF8E53",
    danger: "#FF4D4D",
};

// ---- DUMMY ORDERS ----
type OrderStatus = "Delivered" | "Out for Delivery" | "Preparing" | "Cancelled";

interface OrderItem {
    id: string;
    title: string;
    date: string;
    price: number;
    status: OrderStatus;
}

const ORDERS: OrderItem[] = [
    {
        id: "1",
        title: "Chocolate Heaven Cake",
        date: "18 Nov 2025, 4:23 PM",
        price: 349,
        status: "Delivered",
    },
    {
        id: "2",
        title: "Cinnamon Swirl Roll (2 pcs)",
        date: "17 Nov 2025, 1:10 PM",
        price: 149,
        status: "Out for Delivery",
    },
    {
        id: "3",
        title: "Choco Chip Cookies Box",
        date: "16 Nov 2025, 11:41 AM",
        price: 129,
        status: "Preparing",
    },
    {
        id: "4",
        title: "Red Velvet Celebration Cake",
        date: "14 Nov 2025, 7:18 PM",
        price: 399,
        status: "Cancelled",
    },
];

// ---- GET STATUS COLOR ----
const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case "Delivered":
            return theme.success;
        case "Out for Delivery":
            return theme.warning;
        case "Preparing":
            return '#3585fe';
        case "Cancelled":
            return theme.danger;
        default:
            return theme.muted;
    }
};

const Orders = () => {
    const renderOrder = ({ item }: { item: OrderItem }) => {
        return (
            <Pressable style={styles.orderCard} onPress={() => router.push('/order-details' as Href)}>
                <View style={styles.orderLeft}>
                    <View style={styles.placeholderBox}>
                        <Ionicons name="cube" size={28} color={theme.gold} />
                    </View>
                </View>

                <View style={styles.orderDetails}>
                    <Text style={styles.orderTitle} numberOfLines={2}>
                        {item.title}
                    </Text>

                    <Text style={styles.orderDate}>{item.date}</Text>

                    <View style={styles.rowBetween}>
                        <Text style={styles.orderPrice}>₹{item.price}</Text>

                        <View
                            style={[
                                styles.statusBadge,
                                { backgroundColor: getStatusColor(item.status) + "20" },
                            ]}
                        >
                            <Text
                                style={[styles.statusText, { color: getStatusColor(item.status) }]}
                            >
                                {item.status}
                            </Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerRow}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Orders</Text>
                </View>
                <Ionicons name="receipt" size={22} color={theme.text} />
            </View>

            {ORDERS.length === 0 ? (
                <View style={styles.emptyBox}>
                    <Ionicons name="bag-outline" size={60} color={theme.muted} />
                    <Text style={styles.emptyTitle}>No Orders Yet</Text>
                    <Text style={styles.emptySubtitle}>Start adding your favorites.</Text>
                </View>
            ) : (
                <FlatList
                    data={ORDERS}
                    keyExtractor={(item) => item.id}
                    renderItem={renderOrder}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

export default Orders;

// ---- STYLES ----
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
        paddingHorizontal: 16,
    },

    headerRow: {
        paddingVertical: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerTitle: {
        color: theme.text,
        fontSize: 20,
        fontWeight: "700",
    },

    orderCard: {
        flexDirection: "row",
        backgroundColor: theme.card,
        marginBottom: 14,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },

    orderLeft: {
        marginRight: 14,
    },

    placeholderBox: {
        width: 60,
        height: 60,
        borderRadius: 14,
        backgroundColor: "#2A2A2A",
        justifyContent: "center",
        alignItems: "center",
    },

    orderDetails: {
        flex: 1,
    },

    orderTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: theme.text,
        marginBottom: 4,
    },

    orderDate: {
        fontSize: 12,
        color: theme.muted,
        marginBottom: 8,
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    orderPrice: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.gold,
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },

    statusText: {
        fontSize: 12,
        fontWeight: "700",
    },

    emptyBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    emptyTitle: {
        color: theme.text,
        fontSize: 18,
        fontWeight: "700",
    },

    emptySubtitle: {
        color: theme.muted,
        fontSize: 14,
    },
});
