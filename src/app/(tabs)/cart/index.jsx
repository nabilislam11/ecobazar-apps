
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useRouter } from "expo-router";

import CartItem from "../../../components/(ecoommerce)/CartItem";
import { useCart } from "../../../context/CartContext";

export default function Cart() {
    const router = useRouter();

    const { items, subtotal, clearCart } = useCart();

    const [coupon, setCoupon] = useState("");

    const safeSubtotal = Number(subtotal) || 0;
    const total = safeSubtotal;

    // Clear Cart
    const handleClearCart = () => {
        Alert.alert(
            "Clear Cart",
            "Are you sure you want to remove all items?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await clearCart();
                        } catch (error) {
                            Alert.alert("Error", "Failed to clear cart.");
                        }
                    },
                },
            ]
        );
    };

    // Apply Coupon
    const handleApplyCoupon = () => {
        if (!coupon.trim()) {
            Alert.alert("Coupon", "Please enter a coupon code.");
            return;
        }

        // Original frontend code only shows a success message.
        // Real coupon API needs to be connected here.
        Alert.alert("Coupon", "Coupon applied (demo only).");
    };

    // Empty Cart
    if (!items || items.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>
                    Your cart is empty
                </Text>

                <Text style={styles.emptyDescription}>
                    Looks like you haven't added anything yet.
                </Text>

                <Pressable
                    style={styles.primaryButton}
                    onPress={() => router.push("/shop")}
                >
                    <Text style={styles.primaryButtonText}>
                        Continue Shopping
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.heading}>
                Shopping Cart
            </Text>

            {/* Cart Items */}
            <View>
                {items.map((item) => (
                    <CartItem
                        key={item._id}
                        item={item}
                    />
                ))}
            </View>

            {/* Cart Actions */}
            <View style={styles.cartActions}>
                <Pressable
                    style={styles.outlineButton}
                    onPress={() => router.push("/shop")}
                >
                    <Text style={styles.outlineButtonText}>
                        Continue Shopping
                    </Text>
                </Pressable>

                <Pressable onPress={handleClearCart}>
                    <Text style={styles.clearText}>
                        Clear Cart
                    </Text>
                </Pressable>
            </View>

            {/* Order Summary */}
            <View style={styles.summary}>
                <Text style={styles.summaryTitle}>
                    Order Summary
                </Text>

                {/* Coupon */}
                <View style={styles.couponContainer}>
                    <TextInput
                        value={coupon}
                        onChangeText={setCoupon}
                        placeholder="Coupon code"
                        placeholderTextColor="#999"
                        style={styles.couponInput}
                        autoCapitalize="characters"
                    />

                    <Pressable
                        style={styles.applyButton}
                        onPress={handleApplyCoupon}
                    >
                        <Text style={styles.applyButtonText}>
                            Apply
                        </Text>
                    </Pressable>
                </View>

                {/* Price Details */}
                <View style={styles.priceContainer}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>
                            Subtotal
                        </Text>

                        <Text style={styles.priceValue}>
                            ${safeSubtotal.toFixed(2)}
                        </Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>
                            Total
                        </Text>

                        <Text style={styles.totalValue}>
                            ${total.toFixed(2)}
                        </Text>
                    </View>
                </View>

                {/* Checkout */}
                <Pressable
                    style={styles.checkoutButton}
                    onPress={() => router.push("/checkout")}
                >
                    <Text style={styles.checkoutButtonText}>
                        Proceed to Checkout
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    content: {
        padding: 16,
        paddingBottom: 40,
    },

    heading: {
        fontSize: 24,
        fontWeight: "700",
        color: "#222222",
        marginBottom: 20,
    },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#FFFFFF",
    },

    emptyTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#222222",
        marginBottom: 8,
    },

    emptyDescription: {
        fontSize: 14,
        color: "#777777",
        textAlign: "center",
        marginBottom: 20,
    },

    primaryButton: {
        backgroundColor: "#00B207",
        paddingHorizontal: 24,
        paddingVertical: 13,
        borderRadius: 6,
    },

    primaryButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },

    cartActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
        marginBottom: 28,
    },

    outlineButton: {
        borderWidth: 1,
        borderColor: "#DDDDDD",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 6,
    },

    outlineButtonText: {
        color: "#333333",
        fontSize: 12,
        fontWeight: "600",
    },

    clearText: {
        color: "#DC2626",
        fontSize: 13,
        fontWeight: "500",
    },

    summary: {
        borderWidth: 1,
        borderColor: "#EEEEEE",
        borderRadius: 10,
        padding: 18,
    },

    summaryTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222222",
        marginBottom: 18,
    },

    couponContainer: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 20,
    },

    couponInput: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 6,
        paddingHorizontal: 12,
        fontSize: 13,
        color: "#222222",
    },

    applyButton: {
        backgroundColor: "#222222",
        paddingHorizontal: 18,
        justifyContent: "center",
        borderRadius: 6,
    },

    applyButtonText: {
        color: "#FFFFFF",
        fontWeight: "600",
    },

    priceContainer: {
        borderTopWidth: 1,
        borderColor: "#EEEEEE",
        paddingTop: 16,
    },

    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },

    priceLabel: {
        fontSize: 14,
        color: "#666666",
    },

    priceValue: {
        fontSize: 14,
        color: "#333333",
    },

    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderColor: "#EEEEEE",
        paddingTop: 14,
    },

    totalLabel: {
        fontSize: 16,
        fontWeight: "700",
        color: "#222222",
    },

    totalValue: {
        fontSize: 18,
        fontWeight: "700",
        color: "#222222",
    },

    checkoutButton: {
        backgroundColor: "#00B207",
        paddingVertical: 15,
        alignItems: "center",
        borderRadius: 6,
        marginTop: 22,
    },

    checkoutButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },
});
