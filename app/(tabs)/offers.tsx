import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ImageSourcePropType, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const { width } = Dimensions.get('window');

export default function OfferPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([
    { id: '1', name: 'Cakes', offers: 6, image: require('@/assets/images/pastry/cake8.jpg') },
    { id: '2', name: 'Pastries', offers: 4, image:require('@/assets/images/pastry/cake5.jpg') },
    { id: '3', name: 'Cookies', offers: 3, image: require('@/assets/images/pastry/bakery2.jpg') },
    { id: '4', name: 'Breads', offers: 5, image: require('@/assets/images/pastry/bakery6.jpg') },
    { id: '5', name: 'Combos', offers: 2, image: require('@/assets/images/pastry/cake6.jpg') },
  ]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1300);
    return () => clearTimeout(t);
  }, []);

  type Category = { id: string; name: string; offers: number; image: string | null };

  function CategoryCard({ item }: { item: Category }) {
    return (
      <TouchableOpacity style={styles.categoryCard}>
        <View style={styles.categoryThumb}>
          {item.image ? (
            <Image source={ item.image as ImageSourcePropType} style={styles.categoryImg} />
          ) : (
            <LinearGradient
              colors={["#2A2A2A", "#1A1A1A"]}
              style={styles.categoryImg}
            />
          )}
        </View>
        <Text style={styles.catName}>{item.name}</Text>
        <Text style={styles.catOffers}>{item.offers} Offers</Text>
      </TouchableOpacity>
    );
  }

  function ShimmerBox({ h, w, r = 12, mb = 14 }: { h: number; w: number; r?: number; mb?: number }) {
    return (
      <View style={{ width: w, height: h, borderRadius: r, marginBottom: mb, overflow: 'hidden', backgroundColor: '#1A1A1A' }} />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Offers & Deals</Text>

        {/* -------- Loading State -------- */}
        {loading ? (
          <View style={{ paddingHorizontal: 16 }}>
            <ShimmerBox h={140} w={width - 32} />
            <ShimmerBox h={140} w={width - 32} />

            <View style={{ height: 20 }} />
            <ShimmerBox h={28} w={140} mb={10} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <ShimmerBox h={120} w={(width - 48) / 2} />
              <ShimmerBox h={120} w={(width - 48) / 2} />
              <ShimmerBox h={120} w={(width - 48) / 2} />
              <ShimmerBox h={120} w={(width - 48) / 2} />
            </View>
          </View>
        ) : (
          <>
            {/* -------- Featured Offers Banners -------- */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingLeft: 16 }}
            >
              <View style={styles.banner}>
                <LinearGradient colors={["#FF8A00", "#FF5E00"]} style={styles.bannerBg}>
                  <Text style={styles.bannerTitle}>20% OFF on Cakes</Text>
                  <Text style={styles.bannerSub}>Fresh & Custom Designs</Text>
                </LinearGradient>
              </View>

              <View style={styles.banner}>
                <LinearGradient colors={["#FF6BAA", "#E94587"]} style={styles.bannerBg}>
                  <Text style={styles.bannerTitle}>Buy 2 Get 1</Text>
                  <Text style={styles.bannerSub}>Pastries Combo</Text>
                </LinearGradient>
              </View>
            </ScrollView>

            {/* -------- Category Offers -------- */}
            <Text style={styles.sectionTitle}>Explore Categories</Text>

            <View style={styles.categoryGrid}>
              {categories.map(c => (
                <CategoryCard key={c.id} item={c} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E0E0F',
  },
  pageTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 10,
    marginLeft: 16,
  },
  banner: {
    width: width * 0.7,
    height: 140,
    marginRight: 12,
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerBg: {
    flex: 1,
    padding: 18,
    justifyContent: 'flex-end',
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
    marginLeft: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  categoryCard: {
    width: (width - 48) / 2,
    backgroundColor: '#171717',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  categoryThumb: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  categoryImg: {
    width: '100%',
    height: '100%',
  },
  catName: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
  },
  catOffers: {
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    fontSize: 12,
  },
});
