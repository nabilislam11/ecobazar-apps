// src/components/ecommerce/ProductCard.jsx
import { View, Text, Image, Pressable, Alert, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Heart, ShoppingBag, Eye } from 'lucide-react-native';

import Rating from '../../(ecoommerce)/Rating';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';

const API_BASE_URL = (
    process.env.EXPO_PUBLIC_API_BASE_URL || 'http://192.168.0.106:5000'
).replace(/\/+$/, '');

function resolveImageUrl(product) {
    if (!product?.images?.length) {
        return 'https://via.placeholder.com/300?text=No+Image';
    }

    const mainImage =
        product.images.find(
            (img) => img.isMain === true || img.isMain === 'true' || img.isMain === 1
        ) || product.images[0];

    const raw =
        mainImage?.url ||
        mainImage?.path ||
        mainImage?.filename ||
        mainImage?.src ||
        (typeof mainImage === 'string' ? mainImage : null);

    if (!raw) return 'https://via.placeholder.com/300?text=No+Image';

    if (raw.startsWith('http://') || raw.startsWith('https://')) {
        return raw;
    }

    const cleanPath = String(raw).replace(/\\/g, '/').replace(/^\/+/, '');
    return `${API_BASE_URL}/${cleanPath}`;
}

export default function ProductCard({ product }) {
    const { addItem } = useCart();
    const { toggleItem, isWishlisted } = useWishlist();

    if (!product) {
        return (
            <View style={styles.loadingBox}>
                <Text style={styles.loadingText}>Loading…</Text>
            </View>
        );
    }

    const wishlisted = isWishlisted(product._id);
    const imageUrl = resolveImageUrl(product);

    return (
        <View style={styles.card}>
            <Link href={`/product/${product.slug}`} asChild>
                <Pressable>
                    {/* ===== Image (fixed height) ===== */}
                    <View style={styles.imageWrap}>
                        {product.discount > 0 && (
                            <View style={styles.saleBadge}>
                                <Text style={styles.saleText}>Sale {product.discount}%</Text>
                            </View>
                        )}

                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    </View>

                    {/* ===== Details ===== */}
                    <View style={styles.info}>
                        <Text numberOfLines={1} style={styles.title}>
                            {product.title || product.name}
                        </Text>

                        <Text style={styles.price}>
                            ${Number(product.price || 0).toFixed(2)}
                        </Text>

                        <Rating value={product.rating || 0} />
                    </View>
                </Pressable>
            </Link>

            {/* Wishlist + Eye */}
            <View style={styles.actionsTop}>
                <Pressable
                    onPress={() => toggleItem(product)}
                    style={styles.iconBtn}
                >
                    <Heart
                        size={15}
                        color={wishlisted ? '#ef4444' : '#374151'}
                        fill={wishlisted ? '#ef4444' : 'none'}
                    />
                </Pressable>

                <Pressable
                    onPress={() => Alert.alert('Notice', 'Quick view coming soon')}
                    style={styles.iconBtn}
                >
                    <Eye size={15} color="#374151" />
                </Pressable>
            </View>

            {/* Add to Cart */}
            <Pressable
                onPress={() => addItem(product._id)}
                style={styles.cartBtn}
            >
                <ShoppingBag size={16} color="#fff" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6',
        overflow: 'hidden', // খুব জরুরি
    },

    // ===== ইমেজ ফিক্সড সাইজ =====
    imageWrap: {
        width: '100%',
        height: 140,          // ← চাইলে 130 / 150 করো
        backgroundColor: '#f9fafb',
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },

    saleBadge: {
        position: 'absolute',
        left: 8,
        top: 8,
        zIndex: 10,
        backgroundColor: '#ef4444',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
    },
    saleText: {
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
    },

    info: {
        paddingHorizontal: 10,
        paddingTop: 8,
        paddingBottom: 12,
        gap: 4,
    },
    title: {
        fontSize: 13,
        color: '#374151',
    },
    price: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
    },

    actionsTop: {
        position: 'absolute',
        right: 8,
        top: 8,
        gap: 6,
    },
    iconBtn: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
    },
    cartBtn: {
        position: 'absolute',
        right: 10,
        bottom: 12,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#16a34a',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },

    loadingBox: {
        padding: 16,
    },
    loadingText: {
        textAlign: 'center',
        color: '#9ca3af',
    },
});