

import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    Minus,
    Plus,
    X,
} from 'lucide-react-native';

import { useRouter } from 'expo-router';

import { useCart } from '../../../context/CartContext';
import { API_BASE_URL } from '../../../service/api';

export default function CartItem({ item }) {
    const { updateQuantity, removeItem } = useCart();

    const router = useRouter();

    // Backend populated product
    const product = item.product || {};

    const productId = product._id;
    const cartItemId = item._id;

    const name = product.title || product.name || 'Product';

    const slug = product.slug || productId;

    const price = Number(product.price) || 0;

    const quantity = Number(item.quantity) || 1;

    // Product Image
    const imageData = product.images?.[0];

    const imagePath =
        imageData?.url ||
        imageData ||
        (typeof product.images === 'string'
            ? product.images
            : null);

    const image = imagePath
        ? imagePath.startsWith('http')
            ? imagePath
            : `${API_BASE_URL}/${imagePath.replace(/\\/g, '/').replace(/^\/+/, '')}`
        : 'https://via.placeholder.com/100?text=No+Image';

    // Total Price
    const lineTotal =
        Number(item.totalPrice) || price * quantity;

    return (
        <View style={styles.container}>

            {/* Product Image */}
            <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="cover"
            />

            {/* Product Details */}
            <View style={styles.productInfo}>

                <Pressable
                    onPress={() =>
                        router.push({
                            pathname: '/product/[slug]',
                            params: { slug },
                        })
                    }
                >
                    <Text style={styles.name} numberOfLines={2}>
                        {name}
                    </Text>
                </Pressable>

                <Text style={styles.price}>
                    ${price.toFixed(2)}
                </Text>

            </View>

            {/* Quantity Controls */}
            <View style={styles.quantityContainer}>

                <Pressable
                    onPress={() => updateQuantity(productId, 'minus')}
                    disabled={quantity <= 1}
                    style={styles.quantityButton}
                >
                    <Minus size={14} color="#374151" />
                </Pressable>

                <Text style={styles.quantity}>
                    {quantity}
                </Text>

                <Pressable
                    onPress={() => updateQuantity(productId, 'plus')}
                    style={styles.quantityButton}
                >
                    <Plus size={14} color="#374151" />
                </Pressable>

            </View>

            {/* Total Price */}
            <Text style={styles.totalPrice}>
                ${lineTotal.toFixed(2)}
            </Text>

            {/* Remove Item */}
            <Pressable
                onPress={() => removeItem(cartItemId)}
                style={styles.removeButton}
            >
                <X size={18} color="#9CA3AF" />
            </Pressable>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },

    image: {
        width: 64,
        height: 64,
        borderRadius: 8,
        backgroundColor: '#F9FAFB',
    },

    productInfo: {
        flex: 1,
        gap: 5,
    },

    name: {
        fontSize: 13,
        fontWeight: '500',
        color: '#111827',
    },

    price: {
        fontSize: 12,
        color: '#9CA3AF',
    },

    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 5,
        paddingVertical: 4,
        gap: 6,
    },

    quantityButton: {
        padding: 3,
    },

    quantity: {
        fontSize: 12,
        color: '#374151',
        minWidth: 16,
        textAlign: 'center',
    },

    totalPrice: {
        width: 65,
        textAlign: 'right',
        fontSize: 12,
        fontWeight: '600',
        color: '#111827',
    },

    removeButton: {
        padding: 3,
    },
});
