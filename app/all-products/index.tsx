// // AllProducts.tsx

// import { Ionicons, MaterialIcons } from "@expo/vector-icons";
// import React, { useMemo, useRef, useState } from "react";
// import {
//     Animated,
//     Dimensions,
//     FlatList,
//     Image,
//     Pressable,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const { width, height } = Dimensions.get("window");

// /* ---------- TYPES ---------- */

// type Category = "All" | "Cakes" | "Pastries" | "Donuts" | "Breads";
// type SortKey = "popular" | "price_low" | "price_high" | "rating";
// type PriceKey = "all" | "lt200" | "200-400" | "gt400";

// type Product = {
//     id: string;
//     title: string;
//     category: Exclude<Category, "All">;
//     price: number;
//     rating: number;
//     image?: any; // you can change to ImageSourcePropType if using real images
// };

// /* ---------- THEME ---------- */

// const theme = {
//     bg: "#0F0F0F",
//     surface: "#0F0F0F",
//     card: "#0F0F0F",
//     border: "#262626",
//     gold: "#D4A017",
//     accent: '#ff7171ff',
//     text: "#FFFFFF",
//     muted: "#A1A1AA",
//     chip: "#1E1E20",
//     chipActive: "#F5C451",
//     cta: '#ff5050ff',
// };

// /* ---------- MOCK DATA ---------- */

// const SAMPLE_PRODUCTS: Product[] = [
//     {
//         id: "1",
//         title: "Chocolate Heaven Cake",
//         image: require('@/assets/images/pastry/cake1.jpg'),
//         category: "Cakes",
//         price: 349,
//         rating: 4.7,
//     },
//     {
//         id: "2",
//         title: "Classic Glazed Donut",
//         image: require('@/assets/images/pastry/cake2.jpg'),
//         category: "Donuts",
//         price: 59,
//         rating: 4.3,
//     },
//     {
//         id: "3",
//         title: "Artisan Sourdough Loaf",
//         image: require('@/assets/images/pastry/cake3.jpg'),
//         category: "Breads",
//         price: 129,
//         rating: 4.5,
//     },
//     {
//         id: "4",
//         title: "French Butter Croissant",
//         image: require('@/assets/images/pastry/cake4.jpg'),
//         category: "Pastries",
//         price: 89,
//         rating: 4.4,
//     },
//     {
//         id: "5",
//         title: "Red Velvet Celebration Cake",
//         image: require('@/assets/images/pastry/cake5.jpg'),
//         category: "Cakes",
//         price: 399,
//         rating: 4.8,
//     },
//     {
//         id: "6",
//         title: "Cinnamon Swirl Roll",
//         image: require('@/assets/images/pastry/cake6.jpg'),
//         category: "Pastries",
//         price: 79,
//         rating: 4.2,
//     },
//     {
//         id: "7",
//         title: "Dark Chocolate Donut",
//         image: require('@/assets/images/pastry/cake8.jpg'),
//         category: "Donuts",
//         price: 69,
//         rating: 4.1,
//     },
//     {
//         id: "8",
//         title: "Crispy French Baguette",
//         image: require('@/assets/images/pastry/cake9.jpg'),
//         category: "Breads",
//         price: 99,
//         rating: 4.0,
//     },
// ];

// const CATEGORIES: Category[] = ["All", "Cakes", "Pastries", "Donuts", "Breads"];

// const PRICE_RANGES: { key: PriceKey; label: string }[] = [
//     { key: "all", label: "All" },
//     { key: "lt200", label: "< ₹200" },
//     { key: "200-400", label: "₹200 - ₹400" },
//     { key: "gt400", label: "> ₹400" },
// ];

// const SORT_OPTIONS: { key: SortKey; label: string }[] = [
//     { key: "popular", label: "Most popular" },
//     { key: "price_low", label: "Price: Low to High" },
//     { key: "price_high", label: "Price: High to Low" },
//     { key: "rating", label: "Top rated" },
// ];

// /* ---------- COMPONENT ---------- */

// const AllProducts: React.FC = () => {
//     const [search, setSearch] = useState("");
//     const [selectedCategory, setSelectedCategory] = useState<Category>("All");
//     const [selectedPrice, setSelectedPrice] = useState<PriceKey>("all");
//     const [selectedSort, setSelectedSort] = useState<SortKey>("popular");

//     const [filterVisible, setFilterVisible] = useState(false);
//     const anim = useRef(new Animated.Value(0)).current;

//     const openFilter = () => {
//         setFilterVisible(true);
//         anim.setValue(0);
//         Animated.timing(anim, {
//             toValue: 1,
//             duration: 260,
//             useNativeDriver: true,
//         }).start();
//     };

//     const closeFilter = () => {
//         Animated.timing(anim, {
//             toValue: 0,
//             duration: 220,
//             useNativeDriver: true,
//         }).start(() => {
//             setFilterVisible(false);
//         });
//     };

//     const resetFilters = () => {
//         setSelectedCategory("All");
//         setSelectedPrice("all");
//         setSelectedSort("popular");
//     };

//     /* ---------- FILTERED DATA ---------- */

//     const filteredProducts = useMemo(() => {
//         const q = search.trim().toLowerCase();

//         let list = [...SAMPLE_PRODUCTS].filter((p) => {
//             const matchQ =
//                 q.length === 0 ||
//                 p.title.toLowerCase().includes(q) ||
//                 p.category.toLowerCase().includes(q);

//             const matchCategory =
//                 selectedCategory === "All" || p.category === selectedCategory;

//             let matchPrice = true;
//             if (selectedPrice === "lt200") matchPrice = p.price < 200;
//             if (selectedPrice === "200-400")
//                 matchPrice = p.price >= 200 && p.price <= 400;
//             if (selectedPrice === "gt400") matchPrice = p.price > 400;

//             return matchQ && matchCategory && matchPrice;
//         });

//         if (selectedSort === "price_low") {
//             list.sort((a, b) => a.price - b.price);
//         } else if (selectedSort === "price_high") {
//             list.sort((a, b) => b.price - a.price);
//         } else if (selectedSort === "rating") {
//             list.sort((a, b) => b.rating - a.rating);
//         }
//         // "popular" keeps original order

//         return list;
//     }, [search, selectedCategory, selectedPrice, selectedSort]);

//     /* ---------- ANIMATED VALUES ---------- */

//     const translateY = anim.interpolate({
//         inputRange: [0, 1],
//         outputRange: [height, 0],
//     });

//     const overlayOpacity = anim.interpolate({
//         inputRange: [0, 1],
//         outputRange: [0, 0.6],
//     });

//     /* ---------- RENDER ITEM ---------- */

//     const renderProduct = ({ item }: { item: Product }) => {
//         const cardWidth = (width - 16 * 2 - 12) / 2; // padding left/right + gap
//         const initials = item.title
//             .split(" ")
//             .slice(0, 2)
//             .map((w) => w[0])
//             .join("");

//         return (
//             <Pressable style={[styles.card, { width: cardWidth }]}>
//                 <View style={styles.cardImageWrapper}>
//                     {/* Placeholder visual – replace with <Image> if you have real images */}
//                     <View style={styles.cardImagePlaceholder}>
//                         {/* <Text style={styles.cardImageText}>{initials}</Text> */}
//                         <Image source={item.image} style={{ width: '100%', height: '100%', borderRadius: 2 }} />
//                     </View>
//                 </View>

//                 <View style={styles.cardBody}>
//                     <Text numberOfLines={2} style={styles.cardTitle}>
//                         {item.title}
//                     </Text>
//                     <Text style={styles.cardCategory}>{item.category}</Text>

//                     <View style={styles.cardFooterRow}>
//                         <Text style={styles.cardPrice}>₹{item.price}</Text>
//                         <View style={styles.ratingRow}>
//                             <Ionicons name="star" size={14} color={theme.gold} />
//                             <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
//                         </View>
//                     </View>
//                 </View>
//             </Pressable>
//         );
//     };

//     /* ---------- JSX ---------- */

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Top header row */}
//             <View style={styles.header}>
//                 <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
//                     <TouchableOpacity onPress={() => { }}>
//                         <Ionicons name="arrow-back" size={22} color={theme.text} />
//                     </TouchableOpacity>
//                     <Text style={styles.headerTitle}>All Products</Text>
//                 </View>
//                 <TouchableOpacity style={styles.filterIconBtn} onPress={openFilter}>
//                     <Ionicons name="options" size={20} color={theme.text} />
//                 </TouchableOpacity>
//             </View>

//             {/* Search bar */}
//             <View style={styles.searchRow}>
//                 <View style={styles.searchBox}>
//                     <Ionicons name="search" size={18} color={theme.muted} />
//                     <TextInput
//                         placeholder="Search cakes, donuts, breads..."
//                         placeholderTextColor={theme.muted}
//                         value={search}
//                         onChangeText={setSearch}
//                         cursorColor={theme.cta}
//                         style={styles.searchInput}
//                     />
//                     {search.length > 0 && (
//                         <TouchableOpacity onPress={() => setSearch("")}>
//                             <MaterialIcons name="close" size={18} color={theme.muted} />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </View>

//             <View style={{ height: 50, }}>
//                 {/* Category chips */}
//                 <ScrollView
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     style={styles.categoryScroll}
//                     contentContainerStyle={styles.categoryScrollContent}
//                 >
//                     {CATEGORIES.map((cat) => {
//                         const active = selectedCategory === cat;
//                         return (
//                             <Pressable
//                                 key={cat}
//                                 onPress={() => setSelectedCategory(cat)}
//                                 style={[styles.chip, active && styles.chipActive]}
//                             >
//                                 <Text style={[styles.chipText, active && styles.chipTextActive]}>
//                                     {cat}
//                                 </Text>
//                             </Pressable>
//                         );
//                     })}
//                 </ScrollView>
//             </View>

//             {/* Products grid */}
//             <FlatList
//                 data={filteredProducts}
//                 keyExtractor={(item) => item.id}
//                 numColumns={2}
//                 showsVerticalScrollIndicator={false}
//                 contentContainerStyle={styles.listContent}
//                 columnWrapperStyle={styles.columnWrapper}
//                 renderItem={renderProduct}
//                 ListEmptyComponent={
//                     <View style={styles.emptyState}>
//                         <Ionicons name="search" size={36} color={theme.muted} />
//                         <Text style={styles.emptyTitle}>No items found</Text>
//                         <Text style={styles.emptySubtitle}>
//                             Try changing filters or search text.
//                         </Text>
//                     </View>
//                 }
//             />

//             {/* Filter modal */}
//             {filterVisible && (
//                 <View style={StyleSheet.absoluteFill}>
//                     {/* Tap overlay to close */}
//                     <Animated.View
//                         style={[styles.overlay, { opacity: overlayOpacity }]}
//                     >
//                         <Pressable style={StyleSheet.absoluteFill} onPress={closeFilter} />
//                     </Animated.View>

//                     <Animated.View
//                         style={[styles.filterPanel, { transform: [{ translateY }] }]}
//                     >
//                         <View style={styles.filterHeader}>
//                             <Text style={styles.filterTitle}>Filter & Sort</Text>
//                             <TouchableOpacity onPress={closeFilter}>
//                                 <MaterialIcons
//                                     name="close"
//                                     size={22}
//                                     color={theme.muted}
//                                 />
//                             </TouchableOpacity>
//                         </View>

//                         <ScrollView
//                             style={styles.filterScroll}
//                             contentContainerStyle={styles.filterScrollContent}
//                         >
//                             {/* Sort */}
//                             <Text style={styles.filterSectionTitle}>Sort by</Text>
//                             {SORT_OPTIONS.map((s) => {
//                                 const active = selectedSort === s.key;
//                                 return (
//                                     <Pressable
//                                         key={s.key}
//                                         style={styles.optionRow}
//                                         onPress={() => setSelectedSort(s.key)}
//                                     >
//                                         <View
//                                             style={[
//                                                 styles.radioOuter,
//                                                 active && styles.radioOuterActive,
//                                             ]}
//                                         >
//                                             {active && <View style={styles.radioInner} />}
//                                         </View>
//                                         <Text style={styles.optionText}>{s.label}</Text>
//                                     </Pressable>
//                                 );
//                             })}

//                             {/* Price */}
//                             <Text style={styles.filterSectionTitle}>Price range</Text>
//                             <View style={styles.chipRowWrap}>
//                                 {PRICE_RANGES.map((p) => {
//                                     const active = selectedPrice === p.key;
//                                     return (
//                                         <Pressable
//                                             key={p.key}
//                                             style={[
//                                                 styles.filterChip,
//                                                 active && styles.filterChipActive,
//                                             ]}
//                                             onPress={() => setSelectedPrice(p.key)}
//                                         >
//                                             <Text
//                                                 style={[
//                                                     styles.filterChipText,
//                                                     active && styles.filterChipTextActive,
//                                                 ]}
//                                             >
//                                                 {p.label}
//                                             </Text>
//                                         </Pressable>
//                                     );
//                                 })}
//                             </View>

//                             {/* Categories inside modal */}
//                             <Text style={styles.filterSectionTitle}>Categories</Text>
//                             <View style={styles.chipRowWrap}>
//                                 {CATEGORIES.filter((c) => c !== "All").map((c) => {
//                                     const active = selectedCategory === c;
//                                     return (
//                                         <Pressable
//                                             key={c}
//                                             style={[
//                                                 styles.filterChip,
//                                                 active && styles.filterChipActive,
//                                             ]}
//                                             onPress={() =>
//                                                 setSelectedCategory(active ? "All" : (c as Category))
//                                             }
//                                         >
//                                             <Text
//                                                 style={[
//                                                     styles.filterChipText,
//                                                     active && styles.filterChipTextActive,
//                                                 ]}
//                                             >
//                                                 {c}
//                                             </Text>
//                                         </Pressable>
//                                     );
//                                 })}
//                             </View>
//                         </ScrollView>

//                         {/* Footer buttons */}
//                         <View style={styles.filterFooter}>
//                             <TouchableOpacity
//                                 style={styles.resetBtn}
//                                 onPress={resetFilters}
//                             >
//                                 <Text style={styles.resetText}>Reset</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={styles.applyBtn} onPress={closeFilter}>
//                                 <Text style={styles.applyText}>Apply</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </Animated.View>
//                 </View>
//             )}
//         </SafeAreaView>
//     );
// };

// export default AllProducts;

// /* ---------- STYLES ---------- */

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: theme.bg,
//     },

//     /* Header */
//     header: {
//         paddingHorizontal: 16,
//         paddingTop: 14,
//         paddingBottom: 10,
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//     },
//     headerTitle: {
//         color: theme.text,
//         fontSize: 20,
//         fontWeight: "700",
//     },
//     filterIconBtn: {
//         width: 36,
//         height: 36,
//         borderRadius: 18,
//         backgroundColor: theme.surface,
//         alignItems: "center",
//         justifyContent: "center",
//     },

//     /* Search */
//     searchRow: {
//         paddingHorizontal: 16,
//         marginBottom: 8,
//     },
//     searchBox: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: theme.surface,
//         borderRadius: 14,
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         gap: 8,
//         borderWidth: 1,
//         borderColor: theme.border,
//     },
//     searchInput: {
//         flex: 1,
//         color: theme.text,
//         fontSize: 15,
//     },

//     /* Category chips */
//     categoryScroll: {
//         height: 53,
//         maxHeight: 53,

//     },
//     categoryScrollContent: {
//         paddingHorizontal: 16,
//         paddingVertical: 6,
//     },
//     chip: {
//         paddingHorizontal: 14,
//         paddingVertical: 8,
//         borderRadius: 999,
//         backgroundColor: theme.chip,
//         marginRight: 8,
//     },
//     chipActive: {
//         backgroundColor: theme.accent,
//     },
//     chipText: {
//         color: '#fff',
//         fontSize: 13,
//         fontWeight: "600",
//     },
//     chipTextActive: {
//         color: "#ffffffff",
//         fontWeight: "700",
//     },

//     /* Grid */
//     listContent: {
//         paddingHorizontal: 16,
//         marginTop: 8, paddingBottom: 24,
//     },
//     columnWrapper: {
//         justifyContent: "space-between",
//         marginBottom: 14,
//     },
//     card: {
//         backgroundColor: theme.card,
//         borderRadius: 16,
//         overflow: "hidden",
//         borderWidth: 1,
//         borderColor: "rgba(255,255,255,0.04)",
//     },
//     cardImageWrapper: {
//         height: 110,
//         backgroundColor: "#262626",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     cardImagePlaceholder: {
//         width: '100%',
//         height: '100%',
//         borderRadius: 2,
//         backgroundColor: "#3a3a3a",
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     cardImageText: {
//         color: "#f4f4f5",
//         fontWeight: "700",
//         fontSize: 20,
//     },
//     cardBody: {
//         paddingHorizontal: 10,
//         paddingVertical: 10,
//     },
//     cardTitle: {
//         color: theme.text,
//         fontSize: 14,
//         fontWeight: "700",
//     },
//     cardCategory: {
//         marginTop: 4,
//         color: theme.muted,
//         fontSize: 12,
//     },
//     cardFooterRow: {
//         marginTop: 8,
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//     },
//     cardPrice: {
//         color: theme.accent,
//         fontWeight: "800",
//         fontSize: 15,
//     },
//     ratingRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 4,
//     },
//     ratingText: {
//         color: theme.muted,
//         fontSize: 12,
//         fontWeight: "600",
//     },

//     /* Empty state */
//     emptyState: {
//         marginTop: 40,
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 6,
//     },
//     emptyTitle: {
//         color: theme.text,
//         fontSize: 16,
//         fontWeight: "600",
//     },
//     emptySubtitle: {
//         color: theme.muted,
//         fontSize: 13,
//     },

//     /* Filter modal */
//     overlay: {
//         ...StyleSheet.absoluteFillObject,
//         backgroundColor: "#000",
//     },
//     filterPanel: {
//         position: "absolute",
//         left: 0,
//         right: 0,
//         bottom: 0,
//         height: height * 0.7,
//         backgroundColor: theme.surface,
//         borderTopLeftRadius: 24,
//         borderTopRightRadius: 24,
//         paddingTop: 10,
//         paddingHorizontal: 16,
//         paddingBottom: 16,
//     },
//     filterHeader: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         marginBottom: 6,
//     },
//     filterTitle: {
//         color: theme.text,
//         fontSize: 18,
//         fontWeight: "700",
//     },
//     filterScroll: {
//         flex: 1,
//         marginTop: 4,
//     },
//     filterScrollContent: {
//         paddingBottom: 16,
//     },
//     filterSectionTitle: {
//         color: theme.text,
//         fontSize: 14,
//         fontWeight: "700",
//         marginTop: 14,
//         marginBottom: 8,
//     },
//     optionRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingVertical: 6,
//         gap: 10,
//     },
//     radioOuter: {
//         width: 18,
//         height: 18,
//         borderRadius: 9,
//         borderWidth: 2,
//         borderColor: theme.border,
//         alignItems: "center",
//         justifyContent: "center",
//     },
//     radioOuterActive: {
//         borderColor: theme.accent,
//     },
//     radioInner: {
//         width: 9,
//         height: 9,
//         borderRadius: 4.5,
//         backgroundColor: theme.accent,
//     },
//     optionText: {
//         color: theme.text,
//         fontSize: 14,
//     },

//     chipRowWrap: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         gap: 8,
//     },
//     filterChip: {
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderRadius: 999,
//         backgroundColor: theme.chip,
//     },
//     filterChipActive: {
//         backgroundColor: theme.accent,
//     },
//     filterChipText: {
//         color: theme.muted,
//         fontSize: 13,
//         fontWeight: "600",
//     },
//     filterChipTextActive: {
//         fontWeight: "700",
//         color: "#ffffffff",
//     },

//     filterFooter: {
//         flexDirection: "row",
//         gap: 10,
//         marginTop: 6,
//     },
//     resetBtn: {
//         flex: 1,
//         borderRadius: 999,
//         borderWidth: 1,
//         borderColor: theme.border,
//         alignItems: "center",
//         justifyContent: "center",
//         paddingVertical: 10,
//     },
//     resetText: {
//         color: theme.muted,
//         fontWeight: "600",
//     },
//     applyBtn: {
//         flex: 1,
//         borderRadius: 999,
//         backgroundColor: theme.cta,
//         alignItems: "center",
//         justifyContent: "center",
//         paddingVertical: 10,
//     },
//     applyText: {
//         color: "#fff",
//         fontWeight: "700",
//     },
// });



// AllProducts.tsx

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

/* ---------- TYPES ---------- */

type Category = "All" | "Cakes" | "Pastries" | "Donuts" | "Breads";
type SortKey = "popular" | "price_low" | "price_high" | "rating";
type PriceKey = "all" | "lt200" | "200-400" | "gt400";
type Dietary = "veg" | "nonveg" | "vegan";
type DietaryKey = "all" | Dietary;
type ProductFlavour = "chocolate" | "vanilla" | "plain" | "strawberry" | "cinnamon" | "red-velvet";
type FlavourKey = "all" | ProductFlavour;

type Product = {
    id: string;
    title: string;
    category: Exclude<Category, "All">;
    price: number;
    rating: number;
    dietary: Dietary;
    flavour: ProductFlavour;
    image?: any; // you can change to ImageSourcePropType if using real images
};

/* ---------- THEME ---------- */

const theme = {
    bg: "#0F0F0F",
    surface: "#0F0F0F",
    card: "#0F0F0F",
    border: "#262626",
    gold: "#D4A017",
    accent: '#ff7171ff',
    text: "#FFFFFF",
    muted: "#A1A1AA",
    chip: "#1E1E20",
    chipActive: "#F5C451",
    cta: '#ff5050ff',
};

/* ---------- MOCK DATA ---------- */

const SAMPLE_PRODUCTS: Product[] = [
    {
        id: "1",
        title: "Chocolate Heaven Cake",
        image: require('@/assets/images/pastry/cake1.jpg'),
        category: "Cakes",
        price: 349,
        rating: 4.7,
        dietary: "veg",
        flavour: "chocolate",
    },
    {
        id: "2",
        title: "Classic Glazed Donut",
        image: require('@/assets/images/pastry/cake2.jpg'),
        category: "Donuts",
        price: 59,
        rating: 4.3,
        dietary: "veg",
        flavour: "vanilla",
    },
    {
        id: "3",
        title: "Artisan Sourdough Loaf",
        image: require('@/assets/images/pastry/cake3.jpg'),
        category: "Breads",
        price: 129,
        rating: 4.5,
        dietary: "vegan",
        flavour: "plain",
    },
    {
        id: "4",
        title: "French Butter Croissant",
        image: require('@/assets/images/pastry/cake4.jpg'),
        category: "Pastries",
        price: 89,
        rating: 4.4,
        dietary: "nonveg",
        flavour: "plain",
    },
    {
        id: "5",
        title: "Red Velvet Celebration Cake",
        image: require('@/assets/images/pastry/cake5.jpg'),
        category: "Cakes",
        price: 399,
        rating: 4.8,
        dietary: "nonveg",
        flavour: "red-velvet",
    },
    {
        id: "6",
        title: "Cinnamon Swirl Roll",
        image: require('@/assets/images/pastry/cake6.jpg'),
        category: "Pastries",
        price: 79,
        rating: 4.2,
        dietary: "veg",
        flavour: "cinnamon",
    },
    {
        id: "7",
        title: "Dark Chocolate Donut",
        image: require('@/assets/images/pastry/cake8.jpg'),
        category: "Donuts",
        price: 69,
        rating: 4.1,
        dietary: "veg",
        flavour: "chocolate",
    },
    {
        id: "8",
        title: "Crispy French Baguette",
        image: require('@/assets/images/pastry/cake9.jpg'),
        category: "Breads",
        price: 99,
        rating: 4.0,
        dietary: "vegan",
        flavour: "plain",
    },
];

const CATEGORIES: Category[] = ["All", "Cakes", "Pastries", "Donuts", "Breads"];

const PRICE_RANGES: { key: PriceKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "lt200", label: "< ₹200" },
    { key: "200-400", label: "₹200 - ₹400" },
    { key: "gt400", label: "> ₹400" },
];

const DIETARY_RANGES: { key: DietaryKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "veg", label: "Veg" },
    { key: "nonveg", label: "Non-Veg" },
    { key: "vegan", label: "Vegan" },
];

const FLAVOUR_RANGES: { key: FlavourKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "chocolate", label: "Chocolate" },
    { key: "vanilla", label: "Vanilla" },
    { key: "strawberry", label: "Strawberry" },
    { key: "cinnamon", label: "Cinnamon" },
    { key: "plain", label: "Plain" },
    { key: "red-velvet", label: "Red Velvet" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "popular", label: "Most popular" },
    { key: "price_low", label: "Price: Low to High" },
    { key: "price_high", label: "Price: High to Low" },
    { key: "rating", label: "Top rated" },
];

/* ---------- COMPONENT ---------- */

const AllProducts: React.FC = () => {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<Category>("All");
    const [selectedPrice, setSelectedPrice] = useState<PriceKey>("all");
    const [selectedSort, setSelectedSort] = useState<SortKey>("popular");
    const [selectedDietary, setSelectedDietary] = useState<DietaryKey>("all");
    const [selectedFlavour, setSelectedFlavour] = useState<FlavourKey>("all");

    const [filterVisible, setFilterVisible] = useState(false);
    const anim = useRef(new Animated.Value(0)).current;

    const openFilter = () => {
        setFilterVisible(true);
        anim.setValue(0);
        Animated.timing(anim, {
            toValue: 1,
            duration: 260,
            useNativeDriver: true,
        }).start();
    };

    const closeFilter = () => {
        Animated.timing(anim, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
        }).start(() => {
            setFilterVisible(false);
        });
    };

    const resetFilters = () => {
        setSelectedCategory("All");
        setSelectedPrice("all");
        setSelectedSort("popular");
        setSelectedDietary("all");
        setSelectedFlavour("all");
    };

    /* ---------- FILTERED DATA ---------- */

    const filteredProducts = useMemo(() => {
        const q = search.trim().toLowerCase();

        let list = [...SAMPLE_PRODUCTS].filter((p) => {
            const matchQ =
                q.length === 0 ||
                p.title.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q);

            const matchCategory =
                selectedCategory === "All" || p.category === selectedCategory;

            let matchPrice = true;
            if (selectedPrice === "lt200") matchPrice = p.price < 200;
            if (selectedPrice === "200-400")
                matchPrice = p.price >= 200 && p.price <= 400;
            if (selectedPrice === "gt400") matchPrice = p.price > 400;

            const matchDietary =
                selectedDietary === "all" || p.dietary === selectedDietary;

            const matchFlavour =
                selectedFlavour === "all" || p.flavour === selectedFlavour;

            return matchQ && matchCategory && matchPrice && matchDietary && matchFlavour;
        });

        if (selectedSort === "price_low") {
            list.sort((a, b) => a.price - b.price);
        } else if (selectedSort === "price_high") {
            list.sort((a, b) => b.price - a.price);
        } else if (selectedSort === "rating") {
            list.sort((a, b) => b.rating - a.rating);
        }
        // "popular" keeps original order

        return list;
    }, [search, selectedCategory, selectedPrice, selectedSort, selectedDietary, selectedFlavour]);

    /* ---------- ANIMATED VALUES ---------- */

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [height, 0],
    });

    const overlayOpacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.6],
    });

    /* ---------- RENDER ITEM ---------- */

    const renderProduct = ({ item }: { item: Product }) => {
        const cardWidth = (width - 16 * 2 - 12) / 2; // padding left/right + gap
        const initials = item.title
            .split(" ")
            .slice(0, 2)
            .map((w) => w[0])
            .join("");

        return (
            <Pressable style={[styles.card, { width: cardWidth }]} onPress={() => router.push('/product-details')}>
                <View style={styles.cardImageWrapper}>
                    {/* Placeholder visual – replace with <Image> if you have real images */}
                    <View style={styles.cardImagePlaceholder}>
                        {/* <Text style={styles.cardImageText}>{initials}</Text> */}
                        <Image source={item.image} style={{ width: '100%', height: '100%', borderRadius: 2 }} />
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <Text numberOfLines={2} style={styles.cardTitle}>
                        {item.title}
                    </Text>
                    <Text style={styles.cardCategory}>{item.category}</Text>

                    <View style={styles.cardFooterRow}>
                        <Text style={styles.cardPrice}>₹{item.price}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color={theme.gold} />
                            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        );
    };

    /* ---------- JSX ---------- */

    return (
        <SafeAreaView style={styles.container}>
            {/* Top header row */}
            <View style={styles.header}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    <TouchableOpacity onPress={() => { }}>
                        <Ionicons name="arrow-back" size={22} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>All Products</Text>
                </View>
                <TouchableOpacity style={styles.filterIconBtn} onPress={openFilter}>
                    <Ionicons name="options" size={20} color={theme.text} />
                </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Ionicons name="search" size={18} color={theme.muted} />
                    <TextInput
                        placeholder="Search cakes, donuts, breads..."
                        placeholderTextColor={theme.muted}
                        value={search}
                        onChangeText={setSearch}
                        cursorColor={theme.cta}
                        style={styles.searchInput}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch("")}>
                            <MaterialIcons name="close" size={18} color={theme.muted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={{ height: 50, }}>
                {/* Category chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScroll}
                    contentContainerStyle={styles.categoryScrollContent}
                >
                    {CATEGORIES.map((cat) => {
                        const active = selectedCategory === cat;
                        return (
                            <Pressable
                                key={cat}
                                onPress={() => setSelectedCategory(cat)}
                                style={[styles.chip, active && styles.chipActive]}
                            >
                                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                                    {cat}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Products grid */}
            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={renderProduct}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="search" size={36} color={theme.muted} />
                        <Text style={styles.emptyTitle}>No items found</Text>
                        <Text style={styles.emptySubtitle}>
                            Try changing filters or search text.
                        </Text>
                    </View>
                }
            />

            {/* Filter modal */}
            {filterVisible && (
                <View style={StyleSheet.absoluteFill}>
                    {/* Tap overlay to close */}
                    <Animated.View
                        style={[styles.overlay, { opacity: overlayOpacity }]}
                    >
                        <Pressable style={StyleSheet.absoluteFill} onPress={closeFilter} />
                    </Animated.View>

                    <Animated.View
                        style={[styles.filterPanel, { transform: [{ translateY }] }]}
                    >
                        <View style={styles.filterHeader}>
                            <Text style={styles.filterTitle}>Filter & Sort</Text>
                            <TouchableOpacity onPress={closeFilter}>
                                <MaterialIcons
                                    name="close"
                                    size={22}
                                    color={theme.muted}
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.filterScroll}
                            contentContainerStyle={styles.filterScrollContent}
                        >
                            {/* Sort */}
                            <Text style={styles.filterSectionTitle}>Sort by</Text>
                            {SORT_OPTIONS.map((s) => {
                                const active = selectedSort === s.key;
                                return (
                                    <Pressable
                                        key={s.key}
                                        style={styles.optionRow}
                                        onPress={() => setSelectedSort(s.key)}
                                    >
                                        <View
                                            style={[
                                                styles.radioOuter,
                                                active && styles.radioOuterActive,
                                            ]}
                                        >
                                            {active && <View style={styles.radioInner} />}
                                        </View>
                                        <Text style={styles.optionText}>{s.label}</Text>
                                    </Pressable>
                                );
                            })}

                            {/* Price */}
                            <Text style={styles.filterSectionTitle}>Price range</Text>
                            <View style={styles.chipRowWrap}>
                                {PRICE_RANGES.map((p) => {
                                    const active = selectedPrice === p.key;
                                    return (
                                        <Pressable
                                            key={p.key}
                                            style={[
                                                styles.filterChip,
                                                active && styles.filterChipActive,
                                            ]}
                                            onPress={() => setSelectedPrice(p.key)}
                                        >
                                            <Text
                                                style={[
                                                    styles.filterChipText,
                                                    active && styles.filterChipTextActive,
                                                ]}
                                            >
                                                {p.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            {/* Dietary */}
                            <Text style={styles.filterSectionTitle}>Dietary</Text>
                            <View style={styles.chipRowWrap}>
                                {DIETARY_RANGES.map((d) => {
                                    const active = selectedDietary === d.key;
                                    return (
                                        <Pressable
                                            key={d.key}
                                            style={[
                                                styles.filterChip,
                                                active && styles.filterChipActive,
                                            ]}
                                            onPress={() => setSelectedDietary(d.key)}
                                        >
                                            <Text
                                                style={[
                                                    styles.filterChipText,
                                                    active && styles.filterChipTextActive,
                                                ]}
                                            >
                                                {d.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            {/* Flavours */}
                            <Text style={styles.filterSectionTitle}>Flavours</Text>
                            <View style={styles.chipRowWrap}>
                                {FLAVOUR_RANGES.map((f) => {
                                    const active = selectedFlavour === f.key;
                                    return (
                                        <Pressable
                                            key={f.key}
                                            style={[
                                                styles.filterChip,
                                                active && styles.filterChipActive,
                                            ]}
                                            onPress={() => setSelectedFlavour(f.key)}
                                        >
                                            <Text
                                                style={[
                                                    styles.filterChipText,
                                                    active && styles.filterChipTextActive,
                                                ]}
                                            >
                                                {f.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            {/* Categories inside modal */}
                            <Text style={styles.filterSectionTitle}>Categories</Text>
                            <View style={styles.chipRowWrap}>
                                {CATEGORIES.filter((c) => c !== "All").map((c) => {
                                    const active = selectedCategory === c;
                                    return (
                                        <Pressable
                                            key={c}
                                            style={[
                                                styles.filterChip,
                                                active && styles.filterChipActive,
                                            ]}
                                            onPress={() =>
                                                setSelectedCategory(active ? "All" : (c as Category))
                                            }
                                        >
                                            <Text
                                                style={[
                                                    styles.filterChipText,
                                                    active && styles.filterChipTextActive,
                                                ]}
                                            >
                                                {c}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </ScrollView>

                        {/* Footer buttons */}
                        <View style={styles.filterFooter}>
                            <TouchableOpacity
                                style={styles.resetBtn}
                                onPress={resetFilters}
                            >
                                <Text style={styles.resetText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyBtn} onPress={closeFilter}>
                                <Text style={styles.applyText}>Apply</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default AllProducts;

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
    },

    /* Header */
    header: {
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    headerTitle: {
        color: theme.text,
        fontSize: 20,
        fontWeight: "700",
    },
    filterIconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.surface,
        alignItems: "center",
        justifyContent: "center",
    },

    /* Search */
    searchRow: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.surface,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
        borderWidth: 1,
        borderColor: theme.border,
    },
    searchInput: {
        flex: 1,
        color: theme.text,
        fontSize: 15,
    },

    /* Category chips */
    categoryScroll: {
        height: 53,
        maxHeight: 53,

    },
    categoryScrollContent: {
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    chip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: theme.chip,
        marginRight: 8,
    },
    chipActive: {
        backgroundColor: theme.accent,
    },
    chipText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: "600",
    },
    chipTextActive: {
        color: "#ffffffff",
        fontWeight: "700",
    },

    /* Grid */
    listContent: {
        paddingHorizontal: 16,
        marginTop: 8, paddingBottom: 24,
    },
    columnWrapper: {
        justifyContent: "space-between",
        marginBottom: 14,
    },
    card: {
        backgroundColor: theme.card,
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.04)",
    },
    cardImageWrapper: {
        height: 110,
        backgroundColor: "#262626",
        alignItems: "center",
        justifyContent: "center",
    },
    cardImagePlaceholder: {
        width: '100%',
        height: '100%',
        borderRadius: 2,
        backgroundColor: "#3a3a3a",
        alignItems: "center",
        justifyContent: "center",
    },
    cardImageText: {
        color: "#f4f4f5",
        fontWeight: "700",
        fontSize: 20,
    },
    cardBody: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    cardTitle: {
        color: theme.text,
        fontSize: 14,
        fontWeight: "700",
    },
    cardCategory: {
        marginTop: 4,
        color: theme.muted,
        fontSize: 12,
    },
    cardFooterRow: {
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cardPrice: {
        color: theme.accent,
        fontWeight: "800",
        fontSize: 15,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ratingText: {
        color: theme.muted,
        fontSize: 12,
        fontWeight: "600",
    },

    /* Empty state */
    emptyState: {
        marginTop: 40,
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
    },
    emptyTitle: {
        color: theme.text,
        fontSize: 16,
        fontWeight: "600",
    },
    emptySubtitle: {
        color: theme.muted,
        fontSize: 13,
    },

    /* Filter modal */
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "#000",
    },
    filterPanel: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: height * 0.7,
        backgroundColor: theme.surface,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    filterHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    filterTitle: {
        color: theme.text,
        fontSize: 18,
        fontWeight: "700",
    },
    filterScroll: {
        flex: 1,
        marginTop: 4,
    },
    filterScrollContent: {
        paddingBottom: 16,
    },
    filterSectionTitle: {
        color: theme.text,
        fontSize: 14,
        fontWeight: "700",
        marginTop: 14,
        marginBottom: 8,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        gap: 10,
    },
    radioOuter: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: theme.border,
        alignItems: "center",
        justifyContent: "center",
    },
    radioOuterActive: {
        borderColor: theme.accent,
    },
    radioInner: {
        width: 9,
        height: 9,
        borderRadius: 4.5,
        backgroundColor: theme.accent,
    },
    optionText: {
        color: theme.text,
        fontSize: 14,
    },

    chipRowWrap: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: theme.chip,
    },
    filterChipActive: {
        backgroundColor: theme.accent,
    },
    filterChipText: {
        color: theme.muted,
        fontSize: 13,
        fontWeight: "600",
    },
    filterChipTextActive: {
        fontWeight: "700",
        color: "#ffffffff",
    },

    filterFooter: {
        flexDirection: "row",
        gap: 10,
        marginTop: 6,
    },
    resetBtn: {
        flex: 1,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: theme.border,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
    },
    resetText: {
        color: theme.muted,
        fontWeight: "600",
    },
    applyBtn: {
        flex: 1,
        borderRadius: 999,
        backgroundColor: theme.cta,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10,
    },
    applyText: {
        color: "#fff",
        fontWeight: "700",
    },
});