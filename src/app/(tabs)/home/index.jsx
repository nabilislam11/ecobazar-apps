import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
    Truck,
    Headphones,
    ShieldCheck,
    PackageCheck,
    ChevronLeft,
    ChevronRight,
    ChevronRight as ArrowRight,
} from 'lucide-react-native';

import { getImageUrl, getMainImage } from '../../../utils/imageUtils';
import * as productService from '../../../service/productService';
import * as categoryService from '../../../service/categoryService';
import ProductGrid from '../../../components/(ecoommerce)/productGrid';
import CategoryCard from '../../../components/(ecoommerce)/CategoryCard';
import Button from '../../../components/(common)/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'Free shipping on all your order' },
    { icon: Headphones, title: 'Customer Support 24/7', desc: 'Instant access to Support' },
    { icon: ShieldCheck, title: '100% Secure Payment', desc: 'We ensure your money is save' },
    { icon: PackageCheck, title: 'Money-Back Guarantee', desc: '30 Days Money-Back Guarantee' },
];

export default function Home() {
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

    // Navigation helpers (Expo Router)
    const goToProduct = (slug) => {
        if (!slug) return;
        router.push(`/product/${slug}`);
    };

    const goToShop = () => {
        router.push('/shop');
    };

    const goToAllProducts = (section) => {
        // section পাঠালে Shop পেজে ফিল্টার করতে পারবে
        if (section) {
            router.push({ pathname: '/shop', params: { section } });
        } else {
            router.push('/shop');
        }
    };

    const goToAllCategories = () => {
        router.push('/categories');
    };

    const goToCategory = (idOrSlug) => {
        router.push(`/category/${idOrSlug}`);
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

    // Category item (সুন্দর করে)
    const renderCategoryItem = ({ item }) => {
        const imageUri =
            item.image || item.icon
                ? getImageUrl(item.image || item.icon)
                : null;

        return (
            <TouchableOpacity
                style={styles.categoryCard}
                activeOpacity={0.8}
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
                        data={categories.slice(0, 6)} // হোমে ৬টা দেখাব
                        keyExtractor={(item) => String(item.id || item._id)}
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
                    products={todaysDeal.slice(0, 4)} // ২ কলাম × ২ রো
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    heroSection: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    sliderWrapper: {
        backgroundColor: 'rgba(22, 163, 74, 0.1)',
        borderRadius: 12,
        overflow: 'hidden',
        minHeight: 380,
        marginBottom: 12,
    },
    sliderItem: {
        width: SCREEN_WIDTH - 32,
    },
    sliderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        minHeight: 380,
    },
    sliderInfo: {
        flex: 1,
        paddingRight: 12,
    },
    featuredLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#15803d',
        marginBottom: 8,
    },
    sliderTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#111',
        marginBottom: 10,
        lineHeight: 28,
    },
    sliderDesc: {
        fontSize: 13,
        color: '#4b5563',
        marginBottom: 16,
        lineHeight: 18,
    },
    shopNowBtn: {
        backgroundColor: '#16a34a',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    shopNowText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },
    sliderPrice: {
        fontSize: 22,
        fontWeight: '600',
        color: '#111',
    },
    sliderImageWrap: {
        width: 140,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sliderImage: {
        width: '100%',
        height: '100%',
    },
    noImage: {
        color: '#9ca3af',
        fontSize: 12,
    },
    navBtn: {
        position: 'absolute',
        top: '45%',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
    },
    navLeft: { left: 10 },
    navRight: { right: 10 },
    dots: {
        position: 'absolute',
        bottom: 14,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    dotActive: { backgroundColor: '#16a34a' },
    dotInactive: { backgroundColor: '#d1d5db' },
    sliderLoading: {
        height: 380,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#9ca3af',
    },
    adsColumn: {
        gap: 12,
    },
    adCard: {
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 20,
        minHeight: 140,
        justifyContent: 'center',
    },
    adLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#16a34a',
        marginBottom: 6,
    },
    adTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
        lineHeight: 24,
    },
    adSub: {
        fontSize: 12,
        color: '#9ca3af',
        marginTop: 6,
    },
    adLink: {
        marginTop: 10,
        fontSize: 13,
        fontWeight: '500',
        color: '#16a34a',
    },
    featuresStrip: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f3f4f6',
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '47%',
        gap: 10,
    },
    featureText: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#111',
    },
    featureDesc: {
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 2,
    },
    section: {
        paddingHorizontal: 16,
        paddingVertical: 24,
    },
    grayBg: {
        backgroundColor: '#f9fafb',
    },
    sectionHeading: {
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111',
    },
    seeAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seeAllText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#16a34a',
    },
    // Category styles
    categoryRow: {
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    categoryCard: {
        width: (SCREEN_WIDTH - 32 - 24) / 3, // 3 columns with gap
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryImageWrap: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#f0fdf4',
        overflow: 'hidden',
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#dcfce7',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#bbf7d0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryPlaceholderText: {
        fontSize: 22,
        fontWeight: '600',
        color: '#15803d',
    },
    categoryName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#374151',
        textAlign: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9ca3af',
        paddingVertical: 20,
    },
    // Discount
    discountBanner: {
        backgroundColor: '#15803d',
        borderRadius: 12,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
    },
    discountLabel: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
    discountTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
    },
    discountBtn: {
        borderWidth: 1.5,
        borderColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    discountBtnText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    // Testimonials
    testimonialList: {
        gap: 12,
    },
    testimonialCard: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#f3f4f6',
        borderRadius: 12,
        padding: 20,
    },
    testimonialText: {
        fontSize: 13,
        color: '#374151',
        lineHeight: 20,
        marginBottom: 12,
    },
    testimonialName: {
        fontSize: 13,
        fontWeight: '500',
        color: '#111',
    },
    testimonialRole: {
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 2,
    },
});