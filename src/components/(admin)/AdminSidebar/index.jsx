
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';

import {
    LayoutDashboard,
    Package,
    FolderTree,
    Tag,
    ShoppingCart,
    Users,
    Star,
    FileText,
    Ticket,
    Bell,
    Settings,
    Leaf,
} from 'lucide-react-native';

import {
    useNavigation,
    useRoute,
} from '@react-navigation/native';

const links = [
    { name: 'Dashboard', screen: 'AdminDashboard', icon: LayoutDashboard },
    { name: 'Products', screen: 'AdminProducts', icon: Package },
    { name: 'Categories', screen: 'AdminCategories', icon: FolderTree },
    { name: 'Brands', screen: 'AdminBrands', icon: Tag },
    { name: 'Orders', screen: 'AdminOrders', icon: ShoppingCart },
    { name: 'Customers', screen: 'AdminCustomers', icon: Users },
    { name: 'Reviews', screen: 'AdminReviews', icon: Star },
    { name: 'Blogs', screen: 'AdminBlogs', icon: FileText },
    { name: 'Coupons', screen: 'AdminCoupons', icon: Ticket },
    { name: 'Notifications', screen: 'Notifications', icon: Bell },
    { name: 'Settings', screen: 'AdminSettings', icon: Settings },
];

export default function AdminSidebar() {
    const navigation = useNavigation();
    const route = useRoute();

    const handleNavigation = (screen) => {
        navigation.navigate(screen);
    };

    return (
        <View style={styles.sidebar}>

            {/* Logo */}
            <View style={styles.logoContainer}>
                <Leaf size={25} color="#16A34A" />

                <Text style={styles.logoText}>
                    Ecobazar Admin
                </Text>
            </View>

            {/* Navigation Links */}
            <ScrollView
                style={styles.navContainer}
                showsVerticalScrollIndicator={false}
            >
                {links.map(({ name, screen, icon: Icon }) => {
                    const isActive = route.name === screen;

                    return (
                        <TouchableOpacity
                            key={screen}
                            onPress={() => handleNavigation(screen)}
                            style={[
                                styles.navItem,
                                isActive && styles.activeNavItem,
                            ]}
                            activeOpacity={0.7}
                        >
                            <Icon
                                size={19}
                                color={isActive ? '#15803D' : '#374151'}
                            />

                            <Text
                                style={[
                                    styles.navText,
                                    isActive && styles.activeNavText,
                                ]}
                            >
                                {name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    sidebar: {
        flex: 1,
        width: 260,
        backgroundColor: '#FFFFFF',
        borderRightWidth: 1,
        borderRightColor: '#F3F4F6',
    },

    logoContainer: {
        height: 75,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },

    logoText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },

    navContainer: {
        flex: 1,
        paddingHorizontal: 12,
        paddingTop: 16,
    },

    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 13,
        borderRadius: 9,
        marginBottom: 4,
    },

    activeNavItem: {
        backgroundColor: '#DCFCE7',
    },

    navText: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '400',
    },

    activeNavText: {
        color: '#15803D',
        fontWeight: '600',
    },
});
