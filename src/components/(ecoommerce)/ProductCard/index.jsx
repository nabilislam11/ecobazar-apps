

import {
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    Eye,
    Heart,
    ShoppingBag,
} from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';

import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

import { API_BASE_URL } from '../../config/api';
import Rating from './Rating';

export default function ProductCard({ product }) {
    const navigation = useNavigation();

    const { addItem } = useCart();

    const { toggleItem, isWishlisted } = useWishlist();

    if (!product) return null;

    const wishlisted = isWishlisted(product._id);

    // Get Main Image
    const mainImage =
        product.images?.find(
            (image) => image.isMain === true
        ) || product.images?.[0];

    // Image URL
    const imageUrl = mainImage?.url
        ? mainImage.url.startsWith('http')
            ? mainImage.url
            : `${API_BASE_URL}/${mainImage.url
                .replace(/\\/g, '/')
                .replace(/^\/+/, '')}`
        : null;

    // Product Price
    const price = Number(product.price) || 0;

    // Navigate to Product Details
    const handleProductDetails = () => {
        navigation.navigate('ProductDetails', {
            slug: product.slug,
        });
    };

    // Wishlist
    const handleWishlist = async () => {
        try {
            await toggleItem(product);
        } catch (error) {
            Alert.alert(
                'Wishlist Error',
                error?.message || 'Something went wrong!'
            );
        }
    };

    // Add To Cart
    const handleAddToCart = async () => {
        try {
            await addItem(product._id);
        } catch (error) {
            Alert.alert(
                'Cart Error',
                error?.message || 'Something went wrong!'
            );
        }
    };

    // Quick View
    const handleQuickView = () => {
        Alert.alert(
            'Quick View',
            'Quick view coming soon!'
        );
    };

    return (
        <View style={styles.container}>

            {/* Product Image & Details */}
            <Pressable onPress={handleProductDetails}>

                <View style={styles.imageContainer}>

                    {/* Sale Badge */}
                    {product.discount > 0 && (
                        <View style={styles.saleBadge}>
                            <Text style={styles.saleText}>
                                Sale {product.discount}%
                            </Text>
                        </View>
                    )}

                    {/* Product Image */}
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.noImage}>
                            <Text style={styles.noImageText}>
                                No Image
                            </Text>
                        </View>
                    )}

                </View>

                {/* Product Information */}
                <View style={styles.productInfo}>

                    <Text
                        style={styles.productName}
                        numberOfLines={1}
                    >
                        {product.title}
                    </Text>

                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>
                            ${price.toFixed(2)}
                        </Text>
                    </View>

                    <Rating value={product.rating} />

                </View>

            </Pressable>

            {/* Wishlist & Quick View */}
            <View style={styles.actionContainer}>

                {/* Wishlist */}
                <Pressable
                    onPress={handleWishlist}
                    style={styles.actionButton}
                >
                    <Heart
                        size={18}
                        color={wishlisted ? '#EF4444' : '#374151'}
                        fill={wishlisted ? '#EF4444' : 'none'}
                    />
                </Pressable>

                {/* Quick View */}
                <Pressable
                    onPress={handleQuickView}
                    style={styles.actionButton}
                >
                    <Eye size={18} color="#374151" />
                </Pressable>

            </View>

            {/* Add To Cart */}
            <Pressable
                onPress={handleAddToCart}
                style={styles.cartButton}
            >
                <ShoppingBag size={18} color="#FFFFFF" />
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 8,
        overflow: 'hidden',
    },

    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: '#F9FAFB',
        padding: 12,
        position: 'relative',
    },

    image: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
    },

    noImage: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    noImageText: {
        color: '#9CA3AF',
        fontSize: 12,
    },

    saleBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        zIndex: 10,
        backgroundColor: '#EF4444',
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 4,
    },

    saleText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '500',
    },

    productInfo: {
        padding: 12,
        gap: 6,
    },

    productName: {
        fontSize: 13,
        color: '#374151',
    },

    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    price: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },

    actionContainer: {
        position: 'absolute',
        top: 12,
        right: 12,
        gap: 8,
    },

    actionButton: {
        width: 38,
        height: 38,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },

    cartButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#22C55E',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
    },
});
