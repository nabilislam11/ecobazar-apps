// src/context/WishlistContext.jsx
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

const WishlistContext = createContext(null);

// AsyncStorage থেকে ডাটা আনার জন্য async ফাংশন
async function getStoredUserId() {
    try {
        const userStr = await AsyncStorage.getItem("ecobazar_user");
        const user = userStr ? JSON.parse(userStr) : null;
        return user?._id || user?.id || null;
    } catch {
        return null;
    }
}

export function WishlistProvider({ children }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load wishlist from MongoDB
    const refreshWishlist = useCallback(async () => {
        const userId = await getStoredUserId(); // await যোগ করা হয়েছে

        if (!userId) {
            setItems([]);
            return;
        }

        setLoading(true);

        try {
            const response = await api.get(`/auth/get/wishlist/${userId}`);
            const products = response.data?.data;
            setItems(Array.isArray(products) ? products : []);
        } catch (error) {
            console.error("Load wishlist error:", error.response?.data || error);
            Alert.alert("Error", "Failed to load wishlist");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshWishlist();

        // window.addEventListener এর বদলে React Native এর DeviceEventEmitter
        const subscription = DeviceEventEmitter.addListener(
            "ecobazar-auth-changed",
            refreshWishlist
        );

        return () => {
            subscription.remove();
        };
    }, [refreshWishlist]);

    // Add or remove a product through the backend
    const toggleItem = async (product) => {
        const productId =
            typeof product === "string" ? product : product?._id || product?.id;

        const userId = await getStoredUserId(); // await যোগ করা হয়েছে

        if (!userId) {
            Alert.alert("Notice", "Please login to use wishlist");
            return;
        }

        if (!productId) {
            Alert.alert("Error", "Invalid product");
            return;
        }

        try {
            // 🔥 এখানে proId পাঠানো হচ্ছে (backend যেভাবে চায়)
            const response = await api.post("/auth/create/wishlist", {
                userId,
                proId: productId,
            });

            if (!response.data?.success) {
                Alert.alert(
                    "Error",
                    response.data?.message || "Could not update wishlist"
                );
                return;
            }

            if (response.data.wishlisted) {
                // Add product without creating duplicates
                if (typeof product === "object" && product?._id) {
                    setItems((previous) => {
                        const alreadyExists = previous.some(
                            (item) => String(item._id) === String(productId)
                        );
                        return alreadyExists ? previous : [...previous, product];
                    });
                } else {
                    await refreshWishlist();
                }
            } else {
                // Remove product from local UI state
                setItems((previous) =>
                    previous.filter((item) => String(item._id) !== String(productId))
                );
            }

            Alert.alert(
                "Success",
                response.data.message ||
                (response.data.wishlisted
                    ? "Added to wishlist"
                    : "Removed from wishlist")
            );
        } catch (error) {
            console.error("Toggle wishlist error:", error.response?.data || error);
            Alert.alert(
                "Error",
                error.response?.data?.message || "Failed to update wishlist"
            );
        }
    };

    const isWishlisted = (productId) =>
        items.some((item) => String(item._id) === String(productId));

    const removeItem = async (productOrId) => {
        const productId =
            typeof productOrId === "string"
                ? productOrId
                : productOrId?._id || productOrId?.id;

        if (!productId || !isWishlisted(productId)) {
            return;
        }

        await toggleItem(
            items.find((item) => String(item._id) === String(productId))
        );
    };

    const value = useMemo(
        () => ({
            items,
            count: items.length,
            loading,
            toggleItem,
            isWishlisted,
            removeItem,
            refreshWishlist,
        }),
        [items, loading, refreshWishlist]
    );

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);

    if (!context) {
        throw new Error("useWishlist must be used within WishlistProvider");
    }

    return context;
}