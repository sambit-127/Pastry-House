import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = Math.round(height * 0.40);

type Product = {
  id: string;
  name: string;
  short: string;
  price: number;
  image: string;
  tag?: string;
  rating?: number;
};

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Rose Velvet Dream Cake',
    short: '1kg • Rose & Madagascan vanilla',
    price: 2499,
    image:
      require('@/assets/images/pastry/cake1.jpg'),
    tag: 'Bestseller',
    rating: 4.8,
  },
  {
    id: 'p2',
    name: 'Almond Biscotti Gift Box',
    short: '12 pcs • Hand-dipped chocolate',
    price: 899,
    image: require('@/assets/images/pastry/cake2.jpg'),
    rating: 4.9,
  },
  {
    id: 'p3',
    name: 'Saffron Pistachio Cake',
    short: 'Premium • Real saffron threads',
    price: 3199,
   image: require('@/assets/images/pastry/cake3.jpg'),
    tag: 'Limited',
    rating: 5.0,
  },
  {
    id: 'p4',
    name: 'Belgian Chocolate Donuts',
    short: 'Box of 6 • Fresh daily',
    price: 699,
   image: require('@/assets/images/pastry/cake4.jpg'),
    rating: 4.7,
  },
];

const CATEGORIES = [
  { id: 'c1', title: 'Cakes', icon: 'cake-variant', color: '#FF6B6B' },
  { id: 'c2', title: 'Donuts', icon: 'circle-slice-8', color: '#FF8E53' },
  { id: 'c3', title: 'Pastries', icon: 'food-croissant', color: '#FFB74D' },
  { id: 'c4', title: 'Breads', icon: 'bread-slice', color: '#AED581' },
  { id: 'c5', title: 'Custom', icon: 'palette', color: '#9C27B0' },
  { id: 'c6', title: 'Gifts', icon: 'gift', color: '#E91E63' },
];

export default function BakeryHomeScreen(){
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [cartCount, setCartCount] = useState<number>(2);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Animated header opacity (fade in as user scrolls)
 const headerOpacity = scrollY.interpolate({
  inputRange: [0, 120],
  outputRange: [1, 0],
  extrapolate: 'clamp',
});


// const headerOpacity = scrollY.interpolate({
//   inputRange: [0, 50, 150],
//   outputRange: [1, 0.4, 0],
//   extrapolate: 'clamp',
// });


  // Hero parallax translate

  const heroTranslateY = scrollY.interpolate({
  inputRange: [0, 120],
  outputRange: [0, -40],
  extrapolate: 'clamp',
});
  // Render category item
  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => {
    return (
      <Pressable style={styles.categoryItem} accessibilityRole="button">
        <LinearGradient
          colors={[`${item.color}33`, `${item.color}66`]}
          style={styles.categoryGradient}
        >
          <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
        </LinearGradient>
        <Text style={styles.categoryText}>{item.title}</Text>
      </Pressable>
    );
  };

  // Render product card
  const renderProduct = ({ item }: { item: Product }) => {
    return (
      <Pressable style={styles.productCard} accessibilityRole="button">
        <View style={styles.productImageWrap}>
          <Image source={ item.image as ImageSourcePropType} style={styles.productImage} />
          {item.tag ? (
            <View style={styles.tagBadge}>
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          ) : null}

          <Pressable style={styles.favBtn} accessibilityRole="button">
            <Ionicons name="heart-outline" size={18} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.productShort} numberOfLines={1}>
            {item.short}
          </Text>

          {item.rating ? (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
            </View>
          ) : null}

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{item.price}</Text>
            <Pressable
              onPress={() => setCartCount((c) => c + 1)}
              style={styles.addToCartBtn}
              accessibilityRole="button"
            >
              <Ionicons name="add" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left','right']}>
      <StatusBar barStyle="light-content" />

      {/* Animated Header (appears on scroll) */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerInner}>
          <Text style={styles.headerTitle}>Sweet Atelier</Text>
          <View style={styles.headerIconsRow}>
            <Pressable style={styles.headerIcon} accessibilityRole="button">
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </Pressable>
            <Pressable style={styles.headerIcon} accessibilityRole="button" onPress={()=>router.push("/edit-profile" as Href)}>
              <Ionicons name="person-outline" size={22} color="#fff" />
            </Pressable>
          </View>
        </View>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        {/* Hero with parallax */}
        <Animated.View
          style={[styles.heroContainer, { transform: [{ translateY: heroTranslateY }] }]}
        >
          <Image
            source={require('@/assets/images/pastry/heroImage.png')}
            style={styles.heroBg}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.7)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroBadge}>HANDCRAFTED WITH LOVE</Text>
            <Text style={styles.heroTitle}>Artisanal Bakery Delights</Text>
            <Text style={styles.heroSubtitle}>
              Fresh cakes, pastries & custom orders — luxury flavors inspired by Indian traditions.
            </Text>

            {/* Search (glass-like) */}
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color="#ccc" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search cakes, donuts, gifts..."
                placeholderTextColor="#bfbfbf"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Pressable accessibilityRole="button">
                <Ionicons name="mic" size={20} color="#FF6B6B" />
              </Pressable>
            </View>
          </View>
        </Animated.View>

        {/* Categories horizontal list */}
        <Animated.View style={[styles.section,{ transform: [{ translateY: heroTranslateY }] }]}>
          <FlatList
            data={CATEGORIES}
            horizontal
            keyExtractor={(i) => i.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            renderItem={renderCategory}
          />
        </Animated.View>

        {/* Quick action tiles */}
        <View style={styles.quickActions}>
          <Pressable style={styles.quickCard} accessibilityRole="button">
            <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.quickIconWrap}>
              <MaterialCommunityIcons name="palette" size={26} color="#fff" />
            </LinearGradient>
            <Text style={styles.quickTitle}>Custom Cakes</Text>
            <Text style={styles.quickSubtitle}>Design yours</Text>
          </Pressable>

          <Pressable style={styles.quickCard} accessibilityRole="button">
            <LinearGradient colors={['#9C27B0', '#E91E63']} style={styles.quickIconWrap}>
              <MaterialCommunityIcons name="gift" size={26} color="#fff" />
            </LinearGradient>
            <Text style={styles.quickTitle}>Gift Boxes</Text>
            <Text style={styles.quickSubtitle}>Sweet surprises</Text>
          </Pressable>

          <Pressable style={styles.quickCard} accessibilityRole="button">
            <LinearGradient colors={['#4CAF50', '#8BC34A']} style={styles.quickIconWrap}>
              <Ionicons name="flash-outline" size={26} color="#fff" />
            </LinearGradient>
            <Text style={styles.quickTitle}>Express Delivery</Text>
            <Text style={styles.quickSubtitle}>45 mins or less</Text>
          </Pressable>
        </View>

        {/* Section header: Fresh Bakes */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderTitle}>Fresh Bakes</Text>
          <Pressable accessibilityRole="button">
            <Text style={styles.sectionHeaderAction}>See all →</Text>
          </Pressable>
        </View>

        {/* Featured product list */}
        <FlatList
          data={SAMPLE_PRODUCTS}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
        />

        {/* Offer Banner */}
        <Pressable style={styles.offerBanner} accessibilityRole="button">
          <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.offerGradient}>
            <View>
              <Text style={styles.offerTag}>NEW USER OFFER</Text>
              <Text style={styles.offerBold}>20% OFF First Order</Text>
              <Text style={styles.offerCode}>Use code: BAKE20</Text>
            </View>
            <Image
              source={{
                uri:
                  'https://images.unsplash.com/photo-1571115764595-6442d26c3d1e?auto=format&fit=crop&w=400&q=80',
              }}
              style={styles.offerImage}
            />
          </LinearGradient>
        </Pressable>

        {/* Testimonials (short) */}
        <View style={styles.testimonialsWrap}>
          <Text style={styles.testimonialsTitle}>What customers say</Text>
          <FlatList
            data={[
              { id: 't1', text: 'The saffron cake tasted like a celebration!' },
              { id: 't2', text: 'Beautifully packed and delivered on time.' },
              { id: 't3', text: 'Perfect texture and subtle flavors.' },
            ]}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <View style={styles.testimonialCard}>
                <Text style={styles.testimonialText}>{item.text}</Text>
                <Text style={styles.testimonialAuthor}>— Happy Customer</Text>
              </View>
            )}
            keyExtractor={(t) => t.id}
          />
        </View>
      </Animated.ScrollView>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <Pressable style={styles.floatingCart} accessibilityRole="button">
          <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.cartGradient}>
            <Ionicons name="cart" size={20} color="#fff" />
            <Text style={styles.cartText}>{cartCount} Items</Text>
            <View style={styles.cartPriceBox}>
              <Text style={styles.cartPriceText}>₹1,299</Text>
            </View>
          </LinearGradient>
        </Pressable>
      )}

     
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // overall
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },

  // header (fades in)
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 40,
    paddingTop: 0,
    paddingBottom:5,
    backgroundColor: '#000000db',
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },
  headerIconsRow: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 12,
  },

  // hero
  heroContainer: {
    height: HERO_HEIGHT,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    marginBottom: 8,
  },
  heroBg: {
    ...StyleSheet.absoluteFillObject,
    width: undefined,
    height: undefined,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  heroBadge: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 8,
  },
  heroSubtitle: {
    color: '#ddd',
    fontSize: 14,
    marginTop: 8,
    maxWidth: width * 0.82,
    lineHeight: 20,
  },

  // search box
  searchBox: {
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#fff',
    fontSize: 15,
    padding: 0,
  },

  // categories
  section: {
    marginTop: 18,
  },
  categoryList: {
    paddingLeft: 16,
    paddingBottom: 6,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 22,
  },
  categoryGradient: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
  },

  // quick actions
  quickActions: {
    marginTop: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickCard: {
    width: (width - 48) / 3,
    backgroundColor: '#141414',
    borderRadius: 16,
    paddingTop: 14,
    paddingBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  quickIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTitle: {
    color: '#fff',
    marginTop: 10,
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  quickSubtitle: {
    color: '#a8a8a8',
    marginTop: 4,
    fontSize: 11,
    textAlign: 'center',
  },

  // section header
  sectionHeaderRow: {
    marginTop: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionHeaderTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionHeaderAction: {
    color: '#FF6B6B',
    fontSize: 14,
    fontWeight: '700',
  },

  // products
  productsList: {
    paddingLeft: 16,
    paddingVertical: 16,
  },
  productCard: {
    width: width * 0.72,
    backgroundColor: '#1E1E1E',
    borderRadius: 18,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 6,
  },
  productImageWrap: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#222',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  tagBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 107, 107, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
  },
  tagText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  favBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 8,
    borderRadius: 20,
  },
  productInfo: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  productName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  productShort: {
    color: '#a6a6a6',
    fontSize: 12,
    marginTop: 6,
  },
  ratingRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
  },
  priceRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  addToCartBtn: {
    width: 42,
    height: 42,
    backgroundColor: '#FF6B6B',
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // offer banner
  offerBanner: {
    marginHorizontal: 16,
    marginTop: 22,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 8,
  },
  offerGradient: {
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerTag: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
    opacity: 0.95,
  },
  offerBold: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 6,
  },
  offerCode: {
    color: '#fff',
    fontSize: 13,
    marginTop: 6,
    fontWeight: '700',
  },
  offerImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginLeft: 12,
  },

  // testimonials
  testimonialsWrap: {
    marginTop: 22,
  },
  testimonialsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    paddingHorizontal: 16,
  },
  testimonialCard: {
    width: width * 0.7,
    backgroundColor: '#141414',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    marginTop: 12,
  },
  testimonialText: {
    color: '#cfcfcf',
    fontSize: 13,
  },
  testimonialAuthor: {
    color: '#9a9a9a',
    fontSize: 12,
    marginTop: 8,
    fontWeight: '700',
  },

  // floating cart
  floatingCart: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 70,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 12,
  },
  cartGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  cartPriceBox: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
  },
  cartPriceText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },

  // bottom nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 86,
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    color: '#888',
    fontSize: 11,
    marginTop: 6,
  },
  navLabelActive: {
    color: '#FF6B6B',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '800',
  },
});
