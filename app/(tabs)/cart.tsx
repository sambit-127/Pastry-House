import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


type CartItem = {
    id: string;
    name: string;
    price: number; // in rupees
    qty: number;
    desc?: string;
    image?: string | null; // If you have image URIs
};

const { width } = Dimensions.get('window');

export default function CartScreen() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<CartItem[]>([]);

    // Simulate initial loading (shimmer)
    useEffect(() => {
        const t = setTimeout(() => {
            // populate with a couple of default items to demonstrate
            setItems([
                {
                    id: 'p1',
                    name: 'Chocolate Eclair (Box of 4)',
                    price: 249,
                    qty: 1,
                    desc: 'Freshly filled choux with dark chocolate',
                    image: null,
                },
                {
                    id: 'p2',
                    name: 'Rose Pistachio Slice',
                    price: 199,
                    qty: 2,
                    desc: 'Soft sponge with rose & pistachio',
                    image: null,
                },
            ]);
            setLoading(false);
        }, 1400);
        return () => clearTimeout(t);
    }, []);

    // helper to update quantity
    function changeQty(id: string, delta: number) {
        setItems(prev =>
            prev
                .map(it => (it.id === id ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
                .filter(it => it.qty > 0),
        );
    }

    function removeItem(id: string) {
        setItems(prev => prev.filter(it => it.id !== id));
    }

    // Demo function to add an item (in real app you'd open product screen)
    function addDemoItem() {
        const newItem: CartItem = {
            id: `p${Date.now()}`,
            name: `Pastry Special ${items.length + 1}`,
            price: 129 + (items.length % 5) * 30,
            qty: 1,
            desc: 'Chef special pastry',
            image: null,
        };
        setItems(prev => [newItem, ...prev]);
    }

    // Computed totals
    const itemTotal = useMemo(() => items.reduce((s, it) => s + it.price * it.qty, 0), [items]);
    const taxes = useMemo(() => Math.round(itemTotal * 0.05), [itemTotal]); // 5% taxes demo
    const delivery = useMemo(() => (itemTotal > 799 ? 0 : 49), [itemTotal]);
    const toPay = itemTotal + taxes + delivery;

    // Render empty state
    function EmptyState() {
        return (
            <View style={styles.emptyContainer}>
                <Image source={require('@/assets/images/pastry/emptyplate.png')} style={styles.emptyGraphic} />
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptySubtitle}>Add some pastries to make your day sweeter ✨</Text>
                {/* <TouchableOpacity style={styles.primaryBtn} onPress={addDemoItem}>
                    <Text style={styles.primaryBtnText}>Browse Pastries</Text>
                </TouchableOpacity> */}
            </View>
        );
    }

    // Single cart item
    function CartRow({ item }: { item: CartItem }) {
        return (
            <View style={styles.rowContainer}>
                {/* thumbnail: if image is available render it else a small placeholder */}
                <View style={styles.thumbnailWrap}>
                    {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.thumbnail} />
                    ) : (
                        <View style={styles.thumbPlaceholder}>
                            <Text style={styles.thumbInitial}>{item.name.charAt(0)}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.rowBody}>
                    <Text style={styles.itemTitle} numberOfLines={1} ellipsizeMode="tail">
                        {item.name}
                    </Text>
                    {item.desc ? <Text style={styles.itemDesc}>{item.desc}</Text> : null}

                    <View style={styles.rowFooter}>
                        <Text style={styles.price}>₹{item.price}</Text>

                        <View style={styles.qtyWrap}>
                            <Pressable onPress={() => changeQty(item.id, -1)} style={styles.qtyBtn}>
                                <Text style={styles.qtyText}>-</Text>
                            </Pressable>
                            <View style={styles.qtyNumWrap}>
                                <Text style={styles.qtyNum}>{item.qty}</Text>
                            </View>
                            <Pressable onPress={() => changeQty(item.id, +1)} style={styles.qtyBtn}>
                                <Text style={styles.qtyText}>+</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.removeBtn} onPress={() => removeItem(item.id)}>
                    <Text style={styles.removeText}>✕</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['left', 'right']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cart</Text>
                <TouchableOpacity onPress={() => setItems([])} style={styles.clearAll}>
                    <Text style={styles.clearAllText}>Clear</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                // shimmer skeleton
                <View style={{ paddingHorizontal: 16 }}>
                    <Shimmer height={92} width={width - 32} style={{ borderRadius: 12, marginBottom: 12 }} />
                    <Shimmer height={92} width={width - 32} style={{ borderRadius: 12, marginBottom: 12 }} />
                    <Shimmer height={92} width={width - 32} style={{ borderRadius: 12, marginBottom: 12 }} />

                    <View style={{ height: 16 }} />
                    <Shimmer height={18} width={width - 32} style={{ borderRadius: 8, marginBottom: 8 }} />
                    <Shimmer height={48} width={width - 32} style={{ borderRadius: 12 }} />
                </View>
            ) : (
                <>
                    {items.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <FlatList
                            data={items}
                            keyExtractor={i => i.id}
                            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 18 }}
                            renderItem={({ item }) => <CartRow item={item} />}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                        />
                    )}

                    {/* Bill Summary & CTA (shows even if empty, but hides totals when empty) */}
                    <View style={styles.summaryWrap}>
                        <View style={styles.summaryInner}>

                            {
                                items.length !== 0 &&
                                <>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Item Total</Text>
                                        <Text style={styles.summaryValue}>₹{itemTotal}</Text>
                                    </View>

                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Taxes (5%)</Text>
                                        <Text style={styles.summaryValue}>₹{taxes}</Text>
                                    </View>

                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Delivery</Text>
                                        <Text style={styles.summaryValue}>{delivery === 0 ? 'Free' : `₹${delivery}`}</Text>
                                    </View>

                                    <View style={[{ marginTop: 8, backgroundColor: '#171717ff', alignItems: "center", padding: 15, borderRadius: 14, flexDirection: "row", gap: 10 }]}>

                                        <View style={{ padding: 5, borderRadius: 4, backgroundColor: "#18A671", height: 30, width: 30, justifyContent: "center", alignItems: "center" }}>
                                            <FontAwesome name='building-o' size={18} color={"#fff"} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                                                <Text style={[styles.summaryLabel, { fontWeight: '700', fontSize: 16 }]}>To Pay</Text>
                                                <Text style={[styles.summaryValue, { fontWeight: '700', fontSize: 16 }]}>₹{toPay}</Text>
                                            </View>
                                            <Text style={{ color: "#1ab97cff", fontSize: 14, fontWeight: "600" }}>
                                                ₹558 saved on the total
                                            </Text>
                                        </View>
                                    </View>
                                </>}

                            <View style={{ height: 12 }} />

                            <TouchableOpacity style={styles.checkoutBtn} disabled={items.length === 0} onPress={() => alert('Proceed to payment')}>
                                <Text style={styles.checkoutText}>{items.length === 0 ? 'Cart is empty' : `Proceed to Payment`}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}

// ---------------- Shimmer component -----------------
function Shimmer({ width, height = 12, style }: { width?: number | string; height?: number; style?: any }) {
    const translate = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(translate, {
                toValue: 1,
                duration: 900,
                useNativeDriver: true,
            }),
        ).start();
    }, [translate]);

    // interpolate translate to move gradient across
    const numericWidth =
        typeof width === 'number' ? width : typeof width === 'string' ? parseFloat(width) || 300 : 300;
    const translateX = translate.interpolate({
        inputRange: [-1, 1],
        outputRange: [-numericWidth, numericWidth],
    });

    return (
        <View style={[{ width: width ?? '100%', height, backgroundColor: '#1A1A1A', overflow: 'hidden' }, style] as any}>
            <Animated.View style={{ flex: 1, transform: [{ translateX }] }}>
                <LinearGradient
                    // moving gradient
                    colors={["transparent", 'rgba(255,255,255,0.06)', 'transparent']}
                    start={[0, 0]}
                    end={[1, 0]}
                    style={{ flex: 1, width: numericWidth * 1.5 }}
                />
            </Animated.View>
        </View>
    );
}

// ---------------- Styles -----------------
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F10',
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 0,
        paddingHorizontal: 16,
    },
    headerTitle: {
        color: '#F7F7F7',
        fontSize: 18,
        fontWeight: '700',
    },
    clearAll: { position: 'absolute', right: 16 },
    clearAllText: { color: 'rgba(255,255,255,0.5)' },

    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#171717ff',
        padding: 12,
        borderRadius: 12,
    },
    thumbnailWrap: {
        width: 64,
        height: 64,
        borderRadius: 14,
        overflow: 'hidden',
        marginRight: 12,
        backgroundColor: '#121212',
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: { width: '100%', height: '100%' },
    thumbPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 14,
        backgroundColor: '#1e1e1eff',
        borderWidth: 1,
        borderColor: "#2d2d2dff",
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbInitial: { color: '#FFF', fontWeight: '700', fontSize: 18 },

    rowBody: { flex: 1 },
    itemTitle: { color: '#F7F7F7', fontSize: 15, fontWeight: '600' },
    itemDesc: { color: 'rgba(255,255,255,0.55)', fontSize: 12, marginTop: 4 },
    rowFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },

    price: { color: '#F7F7F7', fontSize: 15, fontWeight: '700' },
    qtyWrap: { flexDirection: 'row', alignItems: 'center' },
    qtyBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#1B1B1C',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 6,
    },
    qtyText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
    qtyNumWrap: { minWidth: 24, alignItems: 'center' },
    qtyNum: { color: '#FFF', fontSize: 14, fontWeight: '700' },

    removeBtn: { marginLeft: 8 },
    removeText: { color: 'rgba(255,255,255,0.45)' },

    summaryWrap: {
        paddingHorizontal: 10,
        paddingTop: 6,
    },
    summaryInner: {
        backgroundColor: '#0E0E0F',
        padding: 14,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        borderColor: 'rgba(255,255,255,0.03)',
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
    summaryLabel: { color: 'rgba(255,255,255,0.65)' },
    summaryValue: { color: '#F7F7F7' },

    checkoutBtn: {
        marginTop: 8,
        backgroundColor: '#FE5200',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 60
    },
    checkoutText: { color: '#ffffffff', fontWeight: '800' },

    primaryBtn: {
        marginTop: 18,
        backgroundColor: '#FF8A00',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 12,
    },
    primaryBtnText: { color: '#0F0F10', fontWeight: '700' },

    secondaryBtn: {
        marginTop: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    secondaryBtnText: { color: 'rgba(255,255,255,0.7)' },

    // Empty state
    emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30 },
    emptyGraphic: { width: 150, height: 141, borderRadius: 20, },
    emptyTitle: { color: '#F7F7F7', fontSize: 18, fontWeight: '700' },
    emptySubtitle: { color: 'rgba(255,255,255,0.6)', marginTop: 6, textAlign: 'center' },
});
