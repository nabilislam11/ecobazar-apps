import {
    ChevronRight as ArrowRight,
    ChevronLeft,
    ChevronRight,
    Headphones,
    PackageCheck,
    ShieldCheck,
    Truck,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { useRouter } from 'expo-router';
import Header from '../../../components/(common)/Header';
import ProductGrid from '../../../components/(ecoommerce)/productGrid';
import * as categoryService from '../../../service/categoryService';
import * as productService from '../../../service/productService';
import { getImageUrl, getMainImage } from '../../../utils/imageUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'Free shipping on all your order' },
    { icon: Headphones, title: 'Customer Support 24/7', desc: 'Instant access to Support' },
    { icon: ShieldCheck, title: '100% Secure Payment', desc: 'We ensure your money is save' },
    { icon: PackageCheck, title: 'Money-Back Guarantee', desc: '30 Days Money-Back Guarantee' },
];

// Shop page যে params পড়ে: category, section, view, brand, q
// প্রতিবার সবগুলো পাঠাই (খালি string দিয়ে), যাতে আগের filter থেকে না যায়
const EMPTY_SHOP_PARAMS = {
    category: '',
    section: '',
    view: '',
    brand: '',
    q: '',
};

export default function Home() {
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Header />

        {/* তোমার আগের Home screen content */}
    </View>

    const router = useRouter();

    const [featured, setFeatured] = useState([]);
    const [popular, setPopular] = useState([]);
    const [todaysDeal, setTodaysDeal] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sliderProducts, setSliderProducts] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);

    const sliderRef = useRef(null);

    // Auto-slide
    useEffect(() => {
        if (!sliderProducts.length) return;

        const timer = setInterval(() => {
            setActiveSlide((prev) => {
                const next = (prev + 1) % sliderProducts.length;
                sliderRef.current?.scrollToIndex({ index: next, animated: true });
                return next;
            });
        }, 4000);

        return () => clearInterval(timer);
    }, [sliderProducts.length]);

    // Fetch data
    useEffect(() => {
        Promise.all([
            productService.getProductsByParams({ pageSize: 5, section: 'slider' }),
            productService.getProductsByParams({ pageSize: 10, section: 'populerDeals' }),
            productService.getProductsByParams({ pageSize: 10, section: 'todaysDeal' }),
            productService.getProductsByParams({ pageSize: 10, section: 'featuredProducts' }),
            categoryService.getCategories(),
        ])
            .then(([sliderRes, popularRes, dealsRes, featuredRes, cats]) => {
                const toArray = (response) =>
                    Array.isArray(response) ? response : response?.items || response?.data || [];

                setSliderProducts(toArray(sliderRes));
                setPopular(toArray(popularRes));
                setTodaysDeal(toArray(dealsRes));
                setFeatured(toArray(featuredRes));
                setCategories(Array.isArray(cats) ? cats : cats?.data || []);
                setActiveSlide(0);
            })
            .catch((error) => {
                console.error('Homepage data load failed:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // ==============================
    // NAVIGATION HELPERS (Expo Router)
    // ==============================

    const goToProduct = (slug) => {
        if (!slug) return;
        router.push({
            pathname: '/product/[slug]',
            params: { slug },
        });
    };

    // shop tab-এ যাওয়ার একটাই function: tab হওয়ায় navigate ব্যবহার করেছি
    const openShop = (params = {}) => {
        router.navigate({
            pathname: '/shop',
            params: { ...EMPTY_SHOP_PARAMS, ...params },
        });
    };

    const goToShop = () => openShop();

    const goToAllProducts = (section) => openShop({ section });

    const goToAllCategories = () => openShop({ view: 'categories' });

    const goToCategory = (category) => {
        if (!category) return;
        openShop({ category: String(category) });
    };

    const renderSliderItem = ({ item }) => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => goToProduct(item.slug)}
            style={styles.sliderItem}
        >
            <View style={styles.sliderContent}>
                <View style={styles.sliderInfo}>
                    <Text style={styles.featuredLabel}>Featured Product</Text>
                    <Text style={styles.sliderTitle} numberOfLines={2}>
                        {item.title}
                    </Text>
                    <Text style={styles.sliderDesc} numberOfLines={3}>
                        {item.shortDescription || item.description?.slice(0, 100)}
                    </Text>

                    <View style={styles.shopNowBtn}>
                        <Text style={styles.shopNowText}>Shop Now</Text>
                    </View>

                    <Text style={styles.sliderPrice}>
                        ${Number(item.price || 0).toFixed(2)}
                    </Text>
                </View>

                <View style={styles.sliderImageWrap}>
                    {item.images?.length > 0 ? (
                        <Image
                            source={{ uri: getImageUrl(getMainImage(item.images)) }}
                            style={styles.sliderImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <Text style={styles.noImage}>No image available</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    // Category item
    const renderCategoryItem = ({ item }) => {
        const imageUri =
            item.image || item.icon
                ? getImageUrl(item.image || item.icon)
                : null;

        return (
            <TouchableOpacity
                style={styles.categoryCard}
                activeOpacity={0.8}
                // shop পেজ _id / slug / id তিনটাই চেনে
                onPress={() => goToCategory(item.slug || item._id || item.id)}
            >
                <View style={styles.categoryImageWrap}>
                    {imageUri ? (
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.categoryImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.categoryPlaceholder}>
                            <Text style={styles.categoryPlaceholderText}>
                                {(item.name || item.title || '?')[0]}
                            </Text>
                        </View>
                    )}
                </View>
                <Text style={styles.categoryName} numberOfLines={2}>
                    {item.name || item.title}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Header />
            {/* Hero Slider + Ads */}
            <View style={styles.heroSection}>
                <View style={styles.sliderWrapper}>
                    {sliderProducts.length > 0 ? (
                        <>
                            <FlatList
                                ref={sliderRef}
                                data={sliderProducts}
                                keyExtractor={(item, index) => item._id || String(index)}
                                renderItem={renderSliderItem}
                                horizontal
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                onMomentumScrollEnd={(e) => {
                                    const index = Math.round(
                                        e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32)
                                    );
                                    setActiveSlide(index);
                                }}
                            />

                            <TouchableOpacity
                                style={[styles.navBtn, styles.navLeft]}
                                onPress={() => {
                                    const prev =
                                        (activeSlide - 1 + sliderProducts.length) %
                                        sliderProducts.length;
                                    setActiveSlide(prev);
                                    sliderRef.current?.scrollToIndex({ index: prev, animated: true });
                                }}
                            >
                                <ChevronLeft size={20} color="#111" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.navBtn, styles.navRight]}
                                onPress={() => {
                                    const next = (activeSlide + 1) % sliderProducts.length;
                                    setActiveSlide(next);
                                    sliderRef.current?.scrollToIndex({ index: next, animated: true });
                                }}
                            >
                                <ChevronRight size={20} color="#111" />
                            </TouchableOpacity>

                            <View style={styles.dots}>
                                {sliderProducts.map((_, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setActiveSlide(index);
                                            sliderRef.current?.scrollToIndex({ index, animated: true });
                                        }}
                                        style={[
                                            styles.dot,
                                            activeSlide === index ? styles.dotActive : styles.dotInactive,
                                        ]}
                                    />
                                ))}
                            </View>
                        </>
                    ) : (
                        <View style={styles.sliderLoading}>
                            <ActivityIndicator size="large" color="#16a34a" />
                            <Text style={styles.loadingText}>Loading products...</Text>
                        </View>
                    )}
                </View>

                {/* Ads */}
                <View style={styles.adsColumn}>
                    <TouchableOpacity style={styles.adCard} onPress={goToShop}>
                        <Text style={styles.adLabel}>Fresh & Healthy</Text>
                        <Text style={styles.adTitle}>Fresh Fruit{'\n'}Collections</Text>
                        <Text style={styles.adSub}>Starting from $9.99</Text>
                        <Text style={styles.adLink}>Shop Now →</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.adCard} onPress={goToShop}>
                        <Text style={styles.adLabel}>Special Offer</Text>
                        <Text style={styles.adTitle}>Cooking{'\n'}Essentials</Text>
                        <Text style={styles.adSub}>Up to 25% off</Text>
                        <Text style={styles.adLink}>Shop Now →</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Feature strip */}
            <View style={styles.featuresStrip}>
                {features.map(({ icon: Icon, title, desc }) => (
                    <View key={title} style={styles.featureItem}>
                        <Icon size={28} color="#16a34a" />
                        <View style={styles.featureText}>
                            <Text style={styles.featureTitle}>{title}</Text>
                            <Text style={styles.featureDesc}>{desc}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* ========== Popular Categories ========== */}
            <View style={styles.section}>
                <SectionHeading
                    title="Popular Categories"
                    onSeeAll={goToAllCategories}
                    seeAllText="See All"
                />

                {categories.length > 0 ? (
                    <FlatList
                        data={categories.slice(0, 6)}
                        keyExtractor={(item, index) =>
                            String(item._id || item.id || item.slug || index)
                        }
                        numColumns={3}
                        scrollEnabled={false}
                        columnWrapperStyle={styles.categoryRow}
                        renderItem={renderCategoryItem}
                    />
                ) : (
                    <Text style={styles.emptyText}>No categories found</Text>
                )}
            </View>

            {/* ========== Hot Deals ========== */}
            <View style={styles.section}>
                <SectionHeading
                    title="Hot Deals"
                    onSeeAll={() => goToAllProducts('todaysDeal')}
                    seeAllText="See All"
                />
                <ProductGrid
                    products={todaysDeal.slice(0, 4)}
                    loading={loading}
                    columns={2}
                />
            </View>

            {/* Discount banner */}
            <View style={styles.section}>
                <View style={styles.discountBanner}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.discountLabel}>Limited Time Offer</Text>
                        <Text style={styles.discountTitle}>Get 30% Off Your First Order</Text>
                    </View>
                    <TouchableOpacity style={styles.discountBtn} onPress={goToShop}>
                        <Text style={styles.discountBtnText}>Shop Now</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* ========== Popular Products ========== */}
            <View style={[styles.section, styles.grayBg]}>
                <SectionHeading
                    title="Popular Products"
                    onSeeAll={() => goToAllProducts('populerDeals')}
                    seeAllText="See All"
                />
                <ProductGrid
                    products={popular.slice(0, 4)}
                    loading={loading}
                    columns={2}
                />
            </View>

            {/* ========== Featured Products ========== */}
            <View style={styles.section}>
                <SectionHeading
                    title="Featured Products"
                    onSeeAll={() => goToAllProducts('featuredProducts')}
                    seeAllText="See All"
                />
                <ProductGrid
                    products={featured.slice(0, 4)}
                    loading={loading}
                    columns={2}
                />
            </View>

            {/* Testimonials */}
            <View style={[styles.section, styles.grayBg]}>
                <SectionHeading title="Client Testimonials" />
                <View style={styles.testimonialList}>
                    {[1, 2, 3].map((i) => (
                        <View key={i} style={styles.testimonialCard}>
                            <Text style={styles.testimonialText}>
                                “Fresh produce every time, delivered fast. EcoBazar has become
                                our weekly go-to for groceries.”
                            </Text>
                            <Text style={styles.testimonialName}>Jane Cooper</Text>
                            <Text style={styles.testimonialRole}>Verified Buyer</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

// ========== Section Heading with See All ==========
function SectionHeading({ title, onSeeAll, seeAllText = 'See All', center }) {
    return (
        <View
            style={[
                styles.sectionHeading,
                center && { justifyContent: 'center' },
            ]}
        >
            <Text style={styles.sectionTitle}>{title}</Text>

            {onSeeAll && (
                <TouchableOpacity
                    style={styles.seeAllBtn}
                    onPress={onSeeAll}
                    activeOpacity={0.7}
                >
                    <Text style={styles.seeAllText}>{seeAllText}</Text>
                    <ArrowRight size={16} color="#16a34a" />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff' },

    heroSection: { paddingHorizontal: 16, paddingTop: 16 },

    sliderWrapper: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#f0fdf4',
        position: 'relative',
    },
    sliderItem: { width: SCREEN_WIDTH - 32, height: 220, padding: 16 },
    sliderContent: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    sliderInfo: { flex: 1, paddingRight: 8 },
    featuredLabel: { color: '#16a34a', fontSize: 12, fontWeight: '700', marginBottom: 8 },
    sliderTitle: { color: '#111827', fontSize: 20, fontWeight: '700', marginBottom: 8 },
    sliderDesc: { color: '#6b7280', fontSize: 12, lineHeight: 18, marginBottom: 12 },
    shopNowBtn: {
        backgroundColor: '#16a34a',
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    shopNowText: { color: '#ffffff', fontSize: 12, fontWeight: '700' },
    sliderPrice: { color: '#111827', fontSize: 16, fontWeight: '700', marginTop: 10 },
    sliderImageWrap: {
        width: '42%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderImage: { width: '100%', height: '100%' },
    noImage: { color: '#9ca3af', fontSize: 11, textAlign: 'center' },

    navBtn: {
        position: 'absolute',
        top: '45%',
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
    navLeft: { left: 8 },
    navRight: { right: 8 },

    dots: {
        position: 'absolute',
        bottom: 8,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    dot: { width: 7, height: 7, borderRadius: 4 },
    dotActive: { backgroundColor: '#16a34a', width: 18 },
    dotInactive: { backgroundColor: '#d1d5db' },

    sliderLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#6b7280', fontSize: 13, marginTop: 10 },

    adsColumn: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginTop: 16 },
    adCard: {
        flex: 1,
        minHeight: 150,
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#fef3c7',
        justifyContent: 'center',
    },
    adLabel: { color: '#92400e', fontSize: 11, fontWeight: '600', marginBottom: 6 },
    adTitle: { color: '#78350f', fontSize: 17, fontWeight: '700', marginBottom: 8 },
    adSub: { color: '#92400e', fontSize: 11, marginBottom: 10 },
    adLink: { color: '#15803d', fontSize: 12, fontWeight: '700' },

    featuresStrip: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingVertical: 20,
        gap: 16,
    },
    featureItem: { width: '47%', flexDirection: 'row', alignItems: 'center', gap: 10 },
    featureText: { flex: 1 },
    featureTitle: { color: '#111827', fontSize: 12, fontWeight: '700' },
    featureDesc: { color: '#6b7280', fontSize: 10, marginTop: 4 },

    section: { paddingHorizontal: 16, paddingVertical: 20 },
    grayBg: { backgroundColor: '#f9fafb' },

    sectionHeading: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: { color: '#111827', fontSize: 18, fontWeight: '700' },
    seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    seeAllText: { color: '#16a34a', fontSize: 12, fontWeight: '600' },

    categoryRow: { justifyContent: 'space-between', marginBottom: 12 },
    categoryCard: {
        width: '31.5%',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 10,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    categoryImageWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        overflow: 'hidden',
        backgroundColor: '#f0fdf4',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryImage: { width: '100%', height: '100%' },
    categoryPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryPlaceholderText: { color: '#16a34a', fontSize: 24, fontWeight: '700' },
    categoryName: { color: '#374151', fontSize: 12, fontWeight: '600', textAlign: 'center' },

    emptyText: { color: '#9ca3af', fontSize: 13, textAlign: 'center', paddingVertical: 20 },

    discountBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dcfce7',
        padding: 16,
        borderRadius: 14,
        gap: 12,
    },
    discountLabel: { color: '#15803d', fontSize: 11, fontWeight: '600', marginBottom: 6 },
    discountTitle: { color: '#166534', fontSize: 16, fontWeight: '700' },
    discountBtn: {
        backgroundColor: '#16a34a',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 8,
    },
    discountBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },

    testimonialList: { gap: 12 },
    testimonialCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
    },
    testimonialText: { color: '#4b5563', fontSize: 13, lineHeight: 20, marginBottom: 12 },
    testimonialName: { color: '#111827', fontSize: 13, fontWeight: '700' },
    testimonialRole: { color: '#9ca3af', fontSize: 11, marginTop: 3 },
});