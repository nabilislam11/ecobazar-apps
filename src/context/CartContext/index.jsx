// src/context/CartContext.jsx
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { Alert, DeviceEventEmitter } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../service/api";

const CartContext = createContext(null);

// AsyncStorage হলো asynchronous, তাই ফাংশনটির আগে async দেওয়া হয়েছে
async function getStoredUserId() {
    try {
        const userStr = await AsyncStorage.getItem("ecobazar_user");
        const user = userStr ? JSON.parse(userStr) : null;
        return user?._id || user?.id || null;
    } catch {
        return null;
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // ===== Get Cart — backend: { cart, totalPrice, success } =====
    const refreshCart = useCallback(async () => {
        // এখন এটি await করে ডেটা আনবে
        const userId = await getStoredUserId();

        if (!userId) {
            setItems([]);
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`/auth/get-cart/${userId}`);
            const cartItems = response.data?.cart;
            setItems(Array.isArray(cartItems) ? cartItems : []);
        } catch (error) {
            console.error("Load cart error:", error.response?.data || error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshCart();

        // window.addEventListener এর বদলে React Native এর DeviceEventEmitter
        const subscription = DeviceEventEmitter.addListener("ecobazar-auth-changed", refreshCart);

        return () => {
            subscription.remove();
        };
    }, [refreshCart]);

    // ===== Add to Cart =====
    const addItem = async (product, quantity = 1) => {
        const userId = await getStoredUserId();
        const proId = typeof product === "string" ? product : product?._id || product?.id;

        if (!userId) {
            Alert.alert("Error", "Please login first to add to cart!");
            return;
        }
        if (!proId) {
            Alert.alert("Error", "Invalid product");
            return;
        }

        const qty = Number(quantity) || 1;
        if (!Number.isInteger(qty) || qty < 1) {
            Alert.alert("Error", "Quantity must be at least 1");
            return;
        }

        try {
            const response = await api.post("/auth/create/cart", {
                userId,
                proId,
                quantity: qty,
            });

            if (!response.data?.success) {
                Alert.alert("Error", response.data?.message || "Could not add to cart");
                return;
            }

            await refreshCart();
            Alert.alert("Success", response.data.message || "Product added to cart!");
        } catch (error) {
            console.error("Add to cart error:", error.response?.data || error);
            Alert.alert("Error", error.response?.data?.message || "Failed to add product to cart");
        }
    };

    // ===== Quantity + / - =====
    const updateQuantity = async (productId, type) => {
        const userId = await getStoredUserId();
        if (!userId || !productId) return;

        try {
            const response = await api.put(`/auth/cart-update/${productId}`, {
                type,
                userId,
            });

            if (!response.data?.success) {
                Alert.alert("Error", response.data?.message || "Could not update quantity");
                return;
            }

            await refreshCart();
        } catch (error) {
            console.error("Update quantity error:", error.response?.data || error);
            Alert.alert("Error", error.response?.data?.message || "Failed to update quantity");
        }
    };

    // ===== Delete =====
    const removeItem = async (cartItemId) => {
        if (!cartItemId) return;

        try {
            const response = await api.delete(`/auth/cart-delete/${cartItemId}`);

            if (!response.data?.success) {
                Alert.alert("Error", response.data?.message || "Could not remove item");
                return;
            }

            setItems((prev) => prev.filter((item) => String(item._id) !== String(cartItemId)));
            Alert.alert("Success", "Removed from cart");
        } catch (error) {
            console.error("Remove cart error:", error.response?.data || error);
            Alert.alert("Error", error.response?.data?.message || "Failed to remove item");
            await refreshCart();
        }
    };

    // ===== Clear =====
    const clearCart = async () => {
        try {
            setItems([]);
            Alert.alert("Success", "Cart cleared");
        } catch (error) {
            console.error("Clear cart error:", error);
            await refreshCart();
        }
    };

    const count = items.reduce(
        (sum, item) => sum + (Number(item.product) || 1),
        0
    );

    const subtotal = items.reduce(
        (sum, item) => sum + (Number(item.totalPrice) || 0),
        0
    );

    const value = useMemo(
        () => ({
            items,
            count,
            subtotal,
            total: subtotal,
            totalPrice: subtotal,
            loading,
            addItem,
            updateQuantity,
            removeItem,
            clearCart,
            refreshCart,
        }),
        [items, count, subtotal, loading, refreshCart]
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}