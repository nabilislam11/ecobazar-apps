
import { useEffect, useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    Heart,
    Menu,
    PhoneCall,
    Search,
    ShoppingBag,
    X
} from "lucide-react-native";

import { useRouter } from "expo-router";

import { useAuth } from "../../../context/AuthContext";
import { useCart } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";

import { getCategories } from "../../../service/categoryService";

export default function Header() {
    const [categories, setCategories] = useState([]);
    const [query, setQuery] = useState("");
    const [mobileOpen, setMobileOpen] = useState(false);

    const router = useRouter();

    const { subtotal, count } = useCart();
    const { count: wishlistCount } = useWishlist();
    const { isAuthenticated, user } = useAuth();

    const safeSubtotal = Number(subtotal) || 0;
    const safeCartCount = Number(count) || 0;
    const safeWishlistCount = Number(wishlistCount) || 0;

    // Search functionality
    const handleSearch = () => {
        const searchQuery = query.trim();

        router.push({
            pathname: "/search",
            params: searchQuery ? { q: searchQuery } : {},
        });

        setMobileOpen(false);
    };

    // Load categories from API
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const response = await getCategories();

                const categoryList = Array.isArray(response)
                    ? response
                    : response?.data || [];

                setCategories(categoryList);
            } catch (error) {
                console.error("Category loading error:", error);
            }
        };

        loadCategories();
    }, []);

    // Only active categories
    const activeCategories = categories.filter(
        (category) => category.status === "active"
    );

    // Category navigation
    const handleCategoryPress = (categoryId) => {
        router.push({
            pathname: "/shop",
            params: {
                category: categoryId,
            },
        });

        setMobileOpen(false);
    };

    const navigateTo = (path) => {
        setMobileOpen(false);
        router.push(path);
    };

    return (
        <View style={styles.header}>
            {/* Top Bar */}


            {/* Logo, Wishlist, Cart and Menu */}
            <View style={styles.mainHeader}>
                <Pressable
                    style={styles.logoContainer}
                    onPress={() => navigateTo("/")}
                >
                    <Text style={styles.logoEmoji}>🌱</Text>

                    <Text style={styles.logoText}>Ecobazar</Text>
                </Pressable>

                <View style={styles.headerActions}>
                    {/* Wishlist */}
                    <Pressable
                        style={styles.iconButton}
                        onPress={() => navigateTo("/wishlist")}
                    >
                        <Heart size={24} color="#333333" />

                        {safeWishlistCount > 0 && (
                            <View style={styles.wishlistBadge}>
                                <Text style={styles.badgeText}>
                                    {safeWishlistCount}
                                </Text>
                            </View>
                        )}
                    </Pressable>

                    {/* Cart */}
                    <Pressable
                        style={styles.cartButton}
                        onPress={() => navigateTo("/cart")}
                    >
                        <View style={styles.cartIconContainer}>
                            <ShoppingBag size={27} color="#333333" />

                            <View style={styles.cartBadge}>
                                <Text style={styles.badgeText}>
                                    {safeCartCount}
                                </Text>
                            </View>
                        </View>

                        <View>
                            <Text style={styles.cartLabel}>Shopping cart</Text>

                            <Text style={styles.cartPrice}>
                                ${safeSubtotal.toFixed(2)}
                            </Text>
                        </View>
                    </Pressable>

                    {/* Mobile Menu */}
                    <Pressable
                        style={styles.menuButton}
                        onPress={() => setMobileOpen((previous) => !previous)}
                    >
                        {mobileOpen ? (
                            <X size={26} color="#333333" />
                        ) : (
                            <Menu size={26} color="#333333" />
                        )}
                    </Pressable>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Search size={20} color="#999999" />

                <TextInput
                    style={styles.searchInput}
                    placeholder="Search products..."
                    placeholderTextColor="#999999"
                    value={query}
                    onChangeText={setQuery}
                    returnKeyType="search"
                    onSubmitEditing={handleSearch}
                />

                <Pressable
                    style={styles.searchButton}
                    onPress={handleSearch}
                >
                    <Text style={styles.searchButtonText}>Search</Text>
                </Pressable>
            </View>

            {/* Category Navigation */}
            <View style={styles.categoryBar}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    {activeCategories.map((category) => (
                        <Pressable
                            key={category._id}
                            onPress={() => handleCategoryPress(category._id)}
                            style={styles.categoryItem}
                        >
                            <Text style={styles.categoryText}>
                                {category.name}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>

            {/* Mobile Menu */}
            {mobileOpen && (
                <View style={styles.mobileMenu}>
                    <View style={styles.menuTitleContainer}>
                        <Text style={styles.menuTitle}>Categories</Text>

                        <Text style={styles.categoryCount}>
                            {activeCategories.length} categories
                        </Text>
                    </View>

                    {/* Categories */}
                    <View style={styles.categoryGrid}>
                        {activeCategories.map((category) => (
                            <Pressable
                                key={category._id}
                                style={styles.mobileCategoryItem}
                                onPress={() => handleCategoryPress(category._id)}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={styles.mobileCategoryText}
                                >
                                    {category.name}
                                </Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Other Links */}
                    <View style={styles.menuLinks}>
                        <Pressable
                            style={styles.menuLink}
                            onPress={() => navigateTo("/wishlist")}
                        >
                            <Text style={styles.menuLinkText}>Wishlist</Text>

                            {safeWishlistCount > 0 && (
                                <Text style={styles.menuCount}>
                                    {safeWishlistCount}
                                </Text>
                            )}
                        </Pressable>

                        <Pressable
                            style={styles.menuLink}
                            onPress={() => navigateTo("/cart")}
                        >
                            <Text style={styles.menuLinkText}>My Cart</Text>
                        </Pressable>

                        {isAuthenticated ? (
                            <Pressable
                                style={styles.menuLink}
                                onPress={() => navigateTo("/account")}
                            >
                                <Text style={styles.menuLinkText}>My Account</Text>
                            </Pressable>
                        ) : (
                            <>
                                <Pressable
                                    style={styles.menuLink}
                                    onPress={() => router.push("/login")}
                                >
                                    <Text style={styles.menuLinkText}>
                                        Sign In
                                    </Text>
                                </Pressable>

                                <Pressable
                                    style={styles.menuLink}
                                    onPress={() => router.push("/register")}
                                >
                                    <Text style={styles.menuLinkText}>
                                        Sign Up
                                    </Text>
                                </Pressable>
                            </>
                        )}
                    </View>

                    {/* Contact */}
                    <View style={styles.contactContainer}>
                        <PhoneCall size={19} color="#00B207" />

                        <Text style={styles.contactText}>
                            (219) 555-0114
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#FFFFFF",
        width: "100%",
        zIndex: 10,
        elevation: 3,
    },

    topBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#EEEEEE",
    },

    locationContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        gap: 5,
    },

    topBarText: {
        fontSize: 10,
        color: "#666666",
        flexShrink: 1,
    },

    accountContainer: {
        marginLeft: 5,
    },

    authLinks: {
        flexDirection: "row",
        alignItems: "center",
    },

    accountText: {
        fontSize: 11,
        color: "#555555",
    },

    mainHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 12,
        paddingVertical: 16,
    },

    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

    logoEmoji: {
        fontSize: 24,
    },

    logoText: {
        fontSize: 23,
        fontWeight: "600",
        color: "#002603",
        letterSpacing: -0.8,
    },

    headerActions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    iconButton: {
        position: "relative",
        padding: 3,
    },

    wishlistBadge: {
        position: "absolute",
        top: -4,
        right: -5,
        backgroundColor: "#00B207",
        width: 17,
        height: 17,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    cartButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },

    cartIconContainer: {
        position: "relative",
    },

    cartBadge: {
        position: "absolute",
        top: -6,
        right: -6,
        backgroundColor: "#00B207",
        borderWidth: 1,
        borderColor: "#FFFFFF",
        width: 18,
        height: 18,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    badgeText: {
        color: "#FFFFFF",
        fontSize: 9,
        fontWeight: "600",
    },

    cartLabel: {
        fontSize: 9,
        color: "#666666",
    },

    cartPrice: {
        fontSize: 12,
        fontWeight: "600",
        color: "#222222",
    },

    menuButton: {
        padding: 2,
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 12,
        marginBottom: 12,
        paddingLeft: 12,
        borderWidth: 1,
        borderColor: "#EEEEEE",
        borderRadius: 6,
        height: 46,
    },

    searchInput: {
        flex: 1,
        paddingHorizontal: 9,
        color: "#222222",
        fontSize: 13,
    },

    searchButton: {
        height: "100%",
        backgroundColor: "#00B207",
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },

    searchButtonText: {
        color: "#FFFFFF",
        fontSize: 12,
        fontWeight: "600",
    },

    categoryBar: {
        backgroundColor: "#333333",
        paddingVertical: 13,
    },

    categoryScroll: {
        paddingHorizontal: 12,
        gap: 22,
    },

    categoryItem: {
        paddingVertical: 2,
    },

    categoryText: {
        color: "#EEEEEE",
        fontSize: 12,
        fontWeight: "500",
    },

    mobileMenu: {
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 15,
        paddingVertical: 18,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },

    menuTitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 13,
    },

    menuTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#222222",
    },

    categoryCount: {
        fontSize: 11,
        color: "#999999",
    },

    categoryGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 9,
    },

    mobileCategoryItem: {
        width: "48%",
        minHeight: 44,
        justifyContent: "center",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: "#F8F8F8",
        borderWidth: 1,
        borderColor: "#EEEEEE",
        borderRadius: 7,
    },

    mobileCategoryText: {
        fontSize: 12,
        fontWeight: "500",
        color: "#555555",
    },

    menuLinks: {
        marginTop: 15,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },

    menuLink: {
        minHeight: 44,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },

    menuLinkText: {
        fontSize: 13,
        fontWeight: "500",
        color: "#444444",
    },

    menuCount: {
        color: "#00B207",
        fontSize: 12,
        fontWeight: "600",
    },

    contactContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: 12,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },

    contactText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#444444",
    },
});
