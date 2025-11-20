import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function ProductDetails() {
    const [selectedWeight, setSelectedWeight] = React.useState("1kg");
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    const product = {
        title: "Chocolate Heaven Cake",
        category: "Cake",
        rating: 4.7,
        price: 349,
        galleryImages: [
            require("@/assets/images/pastry/cake8.jpg"),
            require("@/assets/images/pastry/cake5.jpg"),
            require("@/assets/images/pastry/cake6.jpg"),
        ],
        weights: ["500g", "1kg", "1.5kg", "2kg"],
        ingredients: ["Chocolate", "Cream", "Cocoa", "Sugar", "Vanilla"],
        highlights: [
            "100% Freshly Baked",
            "Premium Cocoa",
            "No Artificial Colors",
            "Perfect for celebrations",
        ],
        desc: "A rich and moist dark chocolate cake layered with creamy chocolate ganache. Perfectly baked for celebrations and sweet cravings.",
    };

    const handleScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentImageIndex(index);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={22}
                        color={'#fff'}
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cake Details</Text>
            </View>
            <ScrollView
                style={styles.contentArea}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Hero Gallery with Smooth Overlay */}
                <View style={styles.galleryContainer}>
                    <ScrollView
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {product.galleryImages.map((img, i) => (
                            <View key={i} style={styles.imageWrapper}>
                                <Image source={img} style={styles.galleryImage} />
                                {/* Subtle gradient overlay for smoother transition - dark fade */}
                                <View style={styles.imageOverlay} />
                            </View>
                        ))}
                    </ScrollView>
                    {/* Pagination Dots */}
                    <View style={styles.paginationContainer}>
                        {product.galleryImages.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.paginationDot,
                                    { opacity: currentImageIndex === i ? 1 : 0.35 },
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.infoBox}>
                    {/* Category Badge */}
                    <View style={styles.categoryContainer}>
                        <Text style={styles.category}>{product.category}</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{product.title}</Text>

                    {/* Rating */}
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={20} color={colors.gold} />
                        <Text style={styles.rating}>{product.rating}</Text>
                        <Text style={styles.reviewCount}>(127 reviews)</Text>
                    </View>

                    {/* Price + Counter */}
                    <View style={styles.priceRow}>
                        <View>
                            <Text style={styles.price}>₹{product.price}</Text>
                            <Text style={styles.originalPrice}>₹399</Text>
                        </View>

                        <View style={styles.counterBox}>
                            <Pressable style={styles.counterBtn}>
                                <MaterialIcons name="remove" size={20} color="#FFF" />
                            </Pressable>
                            <Text style={styles.counterText}>1</Text>
                            <Pressable style={styles.counterBtn}>
                                <MaterialIcons name="add" size={20} color="#FFF" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Weight Selector */}
                    <Text style={styles.sectionTitle}>Select Weight</Text>
                    <View style={styles.weightRow}>
                        {product.weights.map((item) => {
                            const isActive = selectedWeight === item;
                            return (
                                <Pressable
                                    key={item}
                                    onPress={() => setSelectedWeight(item)}
                                    style={[
                                        styles.weightBtn,
                                        isActive && styles.weightBtnActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.weightText,
                                            isActive && styles.weightTextActive,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Description */}
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.description}>{product.desc}</Text>

                    {/* Ingredients */}
                    <Text style={styles.sectionTitle}>Ingredients</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.ingScroll}
                    >
                        {product.ingredients.map((ing) => (
                            <View key={ing} style={styles.tag}>
                                <Ionicons name="ellipse" size={6} color={colors.accentLight} />
                                <Text style={styles.tagText}>{ing}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Highlights */}
                    <Text style={styles.sectionTitle}>Highlights</Text>
                    {product.highlights.map((h, i) => (
                        <View key={i} style={styles.highlightItem}>
                            <Ionicons name="checkmark-circle" size={20} color={colors.accentLight} />
                            <Text style={styles.highlightText}>{h}</Text>
                        </View>
                    ))}

                    {/* Spacer for bottom bar */}
                    <View style={styles.bottomSpacer} />
                </View>
            </ScrollView>

            {/* Fixed Bottom Bar */}
            <View style={styles.bottomBar}>
                <Pressable  onPress={() => router.push('/cart')}>
                  <LinearGradient colors={['#FF6B6B','#FF8E53']} style={styles.cartBtn}>
                      <Text style={styles.cartBtnText}>Add to Cart</Text>
                  </LinearGradient>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

/* ============= THEME COLORS ============= */

const colors = {
    bg: "#0F0F0F", // deep near-black
    card: "#0F0F0F", // dark chocolate charcoal
    gold: "#D4A017", // warm gold accent
    accentLight: "#FF8E53", // lighter warm highlight for price/weights
    cream: "#FFF8F2", // off-white for headings/text
    muted: "#CFC7BF", // muted cream for secondary text
    tagBg: "#2B2B2B", // tag background
    chocolateCTA: "#C25A2C", // chocolate CTA
};

const stylesIconColors = {
    backIcon: colors.gold,
};

/* ============= STYLES ============= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg, // Deep black for immersive dark theme
    },

    header: {
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        backgroundColor: colors.bg,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(212,160,23,0.08)", // very subtle golden border
    },

    backButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: "rgba(212,160,23,0.10)", // Golden tint for vibrancy
        marginRight: 12,
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: colors.cream, // Crisp cream for contrast
        flex: 1,
    },

    /* ------------ SMOOTH HERO GALLERY ------------ */
    galleryContainer: {
        width,
        height: height * 0.42,
        position: "relative",
        zIndex:10,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 6,
    },

    imageWrapper: {
        width,
        height: height * 0.42,
        position: "relative",
    },

    galleryImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

    imageOverlay: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 120,
        backgroundColor: "rgba(6,4,4,0.42)", // dark fade for readability
    },

    paginationContainer: {
        position: "absolute",
        bottom: 26,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
    },

    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.gold, // gold for dots
        opacity: 0.5,
        marginHorizontal: 4,
    },

    /* ------------------------------------- */

    contentArea: {
        flex: 1,
    },

    contentContainer: {
        paddingBottom: 20,
    },

    infoBox: {
        backgroundColor: colors.card, // Dark chocolate for rich depth
        position: "relative",
        top: -20,
        zIndex: 1,
        padding: 24,
        paddingTop: 40,
        paddingBottom: 140,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },

    categoryContainer: {
        backgroundColor: "rgba(212,160,23,0.12)", // subtle gold glow
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginBottom: 8,
    },

    category: {
        color: colors.accentLight,
        fontSize: 14,
        fontWeight: "600",
    },

    title: {
        color: colors.cream,
        fontSize: 26,
        fontWeight: "700",
        lineHeight: 32,
        marginBottom: 4,
    },

    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        gap: 6,
    },

    rating: {
        color: colors.cream,
        fontSize: 18,
        fontWeight: "600",
    },

    reviewCount: {
        color: colors.muted, // Soft muted cream for secondary info
        fontSize: 14,
    },

    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },

    price: {
        color: colors.accentLight, // warm highlight for price
        fontSize: 24,
        fontWeight: "800",
    },

    originalPrice: {
        color: colors.muted,
        fontSize: 12,
        textDecorationLine: "line-through",
        marginTop: 2,
    },

    counterBox: {
        flexDirection: "row",
        backgroundColor: "#2A2A2A",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    counterBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#333333", // slightly lighter for touch feedback
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 6,
    },

    counterText: {
        color: colors.cream,
        fontSize: 18,
        fontWeight: "600",
        minWidth: 20,
        textAlign: "center",
    },

    sectionTitle: {
        color: colors.cream,
        fontSize: 20,
        fontWeight: "700",
        marginTop: 28,
        marginBottom: 12,
    },

    weightRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 8,
    },

    weightBtn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#3A3A3A",
        minWidth: 60,
        alignItems: "center",
        backgroundColor: "transparent",
    },

    weightBtnActive: {
        backgroundColor: colors.accentLight,
        borderColor: colors.accentLight,
    },

    weightText: {
        fontSize: 15,
        fontWeight: "600",
        color: colors.muted,
    },

    weightTextActive: {
        color: "#0B0A0A", // dark text on warm highlight
    },

    description: {
        color: "#DAD6D0",
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
    },

    ingScroll: {
        marginBottom: 20,
    },

    tag: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.tagBg,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 25,
        marginRight: 12,
        minWidth: 80,
        justifyContent: "center",
    },

    tagText: {
        color: colors.cream,
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 8,
    },

    highlightItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginTop: 12,
        gap: 12,
    },

    highlightText: {
        color: "#DAD6D0",
        fontSize: 16,
        lineHeight: 22,
        flex: 1,
    },

    bottomSpacer: {
        height: 20,
    },

    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        backgroundColor: "#141210",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },

    cartBtn: {
        backgroundColor: colors.chocolateCTA, // Rich chocolate CTA
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: "center",
    },

    cartBtnText: {
        color: colors.cream,
        fontSize: 18,
        fontWeight: "700",
    },
});
