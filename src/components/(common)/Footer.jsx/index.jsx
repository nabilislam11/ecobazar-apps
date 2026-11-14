
import { useState } from 'react';

import {
    Alert,
    Linking,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import {
    Facebook,
    Instagram,
    Mail,
    Phone,
    Twitter,
} from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';

// Account Links
const accountLinks = [
    { label: 'My Account', screen: 'Account' },
    { label: 'Order History', screen: 'OrderHistory' },
    { label: 'Shopping Cart', screen: 'Cart' },
    { label: 'Wishlist', screen: 'Wishlist' },
];

// Help Links
const helpLinks = [
    { label: 'Contact', screen: 'Contact' },
    { label: 'Faqs', screen: 'Faqs' },
    { label: 'Terms & Condition', screen: 'Terms' },
    { label: 'Privacy Policy', screen: 'Privacy' },
];

// Proxy Links
const proxyLinks = [
    { label: 'About', screen: 'About' },
    { label: 'Shop', screen: 'Shop' },
    { label: 'Product', screen: 'Shop' },
    { label: 'Track Order', screen: 'OrderHistory' },
];

// Category Links
const categoryLinks = [
    { label: 'Fruit & Vegetables', screen: 'Vegetables' },
    { label: 'Meat & Fish', screen: 'MeatFish' },
    { label: 'Bread & Bakery', screen: 'BreadBakery' },
    { label: 'Beauty & Health', screen: 'BeautyHealth' },
];

export default function Footer() {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Newsletter Subscription
    const handleSubscribe = async () => {
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter your email address.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.trim())) {
            Alert.alert('Invalid Email', 'Please enter a valid email address.');
            return;
        }

        try {
            setSubmitting(true);

            // Replace with your actual newsletter API endpoint
            const response = await fetch(
                'https://your-backend-url.com/api/newsletter/subscribe',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Subscription failed.');
            }

            Alert.alert(
                'Success',
                result.message || 'Subscribed successfully!'
            );

            setEmail('');
        } catch (error) {
            Alert.alert(
                'Subscription Error',
                error.message || 'Something went wrong.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    // Navigation
    const handleNavigation = (screen) => {
        try {
            navigation.navigate(screen);
        } catch (error) {
            console.log('Navigation Error:', error);
        }
    };

    // Social Media
    const openSocial = async (url) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert('Error', 'Unable to open this link.');
        }
    };

    return (
        <View style={styles.footer}>

            {/* Newsletter Section */}
            <View style={styles.newsletter}>
                <Text style={styles.newsletterTitle}>
                    Subscribe our Newsletter
                </Text>

                <Text style={styles.newsletterDescription}>
                    Pellentesque eu nibh eget mauris congue mattis
                    mattis nec tellus. Phasellus imperdiet elit eu magna.
                </Text>

                {/* Email Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.emailInput}
                        placeholder="Your email address"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TouchableOpacity
                        style={[
                            styles.subscribeButton,
                            submitting && styles.disabledButton,
                        ]}
                        onPress={handleSubscribe}
                        disabled={submitting}
                    >
                        <Text style={styles.subscribeText}>
                            {submitting ? 'Please wait...' : 'Subscribe'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Social Media */}
                <View style={styles.socialContainer}>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() =>
                            openSocial('https://facebook.com')
                        }
                    >
                        <Facebook size={18} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() =>
                            openSocial('https://twitter.com')
                        }
                    >
                        <Twitter size={18} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() =>
                            openSocial('https://instagram.com')
                        }
                    >
                        <Instagram size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Dark Footer */}
            <View style={styles.darkFooter}>

                {/* Brand Information */}
                <View style={styles.brandSection}>
                    <TouchableOpacity
                        style={styles.logoContainer}
                        onPress={() => handleNavigation('Home')}
                    >
                        <Text style={styles.logoEmoji}>🌱</Text>

                        <Text style={styles.logoText}>
                            Ecobazar
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.brandDescription}>
                        Morbi cursus porttitor enim lobortis molestie.
                        Duis gravida turpis dui, eget bibendum magna
                        congue nec.
                    </Text>

                    {/* Contact */}
                    <View style={styles.contactContainer}>
                        <TouchableOpacity
                            style={styles.contactItem}
                            onPress={() =>
                                Linking.openURL('tel:+12195550114')
                            }
                        >
                            <Phone size={15} color="#FFFFFF" />
                            <Text style={styles.contactText}>
                                (219) 555-0114
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.orText}>or</Text>

                        <TouchableOpacity
                            style={styles.contactItem}
                            onPress={() =>
                                Linking.openURL('mailto:Proxy@gmail.com')
                            }
                        >
                            <Mail size={15} color="#FFFFFF" />
                            <Text style={styles.contactText}>
                                Proxy@gmail.com
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer Navigation */}
                <View style={styles.linksGrid}>

                    <FooterCol
                        title="My Account"
                        links={accountLinks}
                        onNavigate={handleNavigation}
                    />

                    <FooterCol
                        title="Helps"
                        links={helpLinks}
                        onNavigate={handleNavigation}
                    />

                    <FooterCol
                        title="Proxy"
                        links={proxyLinks}
                        onNavigate={handleNavigation}
                    />

                    <FooterCol
                        title="Categories"
                        links={categoryLinks}
                        onNavigate={handleNavigation}
                    />

                </View>

                {/* Copyright */}
                <View style={styles.bottomSection}>
                    <Text style={styles.copyright}>
                        Ecobazar eCommerce © 2026.
                        {'\n'}All Rights Reserved
                    </Text>

                    {/* Payment Methods */}
                    <View style={styles.paymentContainer}>
                        {['Apple Pay', 'Visa', 'Discover', 'Mastercard'].map(
                            (method) => (
                                <View
                                    key={method}
                                    style={styles.paymentBadge}
                                >
                                    <Text style={styles.paymentText}>
                                        {method}
                                    </Text>
                                </View>
                            )
                        )}

                        <View style={styles.paymentBadge}>
                            <Text style={styles.paymentText}>
                                🔒 Secure Payment
                            </Text>
                        </View>
                    </View>
                </View>

            </View>
        </View>
    );
}

// Footer Column Component
function FooterCol({ title, links, onNavigate }) {
    return (
        <View style={styles.footerColumn}>

            <Text style={styles.columnTitle}>
                {title}
            </Text>

            {links.map((link) => (
                <TouchableOpacity
                    key={link.label}
                    onPress={() => onNavigate(link.screen)}
                    style={styles.footerLink}
                >
                    <Text style={styles.linkText}>
                        {link.label}
                    </Text>
                </TouchableOpacity>
            ))}

        </View>
    );
}

const styles = StyleSheet.create({

    footer: {
        width: '100%',
    },

    // Newsletter
    newsletter: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 20,
        paddingVertical: 35,
    },

    newsletterTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 10,
    },

    newsletterDescription: {
        fontSize: 13,
        lineHeight: 21,
        color: '#9CA3AF',
        marginBottom: 20,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 30,
        padding: 5,
        marginBottom: 20,
    },

    emailInput: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 13,
        color: '#111827',
    },

    subscribeButton: {
        backgroundColor: '#16A34A',
        paddingHorizontal: 18,
        paddingVertical: 13,
        borderRadius: 30,
    },

    disabledButton: {
        opacity: 0.6,
    },

    subscribeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
    },

    socialContainer: {
        flexDirection: 'row',
        gap: 10,
    },

    socialButton: {
        width: 40,
        height: 40,
        borderRadius: 25,
        backgroundColor: '#16A34A',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Dark Footer
    darkFooter: {
        backgroundColor: '#111827',
        paddingTop: 40,
        paddingHorizontal: 20,
    },

    // Brand
    brandSection: {
        marginBottom: 35,
    },

    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    logoEmoji: {
        fontSize: 27,
    },

    logoText: {
        fontSize: 30,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    brandDescription: {
        color: '#9CA3AF',
        fontSize: 13,
        lineHeight: 22,
        marginTop: 15,
        marginBottom: 20,
    },

    contactContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 12,
    },

    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        borderBottomWidth: 2,
        borderBottomColor: '#16A34A',
        paddingBottom: 5,
    },

    contactText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },

    orText: {
        color: '#9CA3AF',
        fontSize: 12,
    },

    // Navigation Grid
    linksGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 30,
    },

    footerColumn: {
        width: '48%',
    },

    columnTitle: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 18,
    },

    footerLink: {
        marginBottom: 14,
    },

    linkText: {
        color: '#9CA3AF',
        fontSize: 12,
    },

    // Bottom
    bottomSection: {
        marginTop: 35,
        borderTopWidth: 1,
        borderTopColor: '#374151',
        paddingVertical: 22,
        gap: 18,
    },

    copyright: {
        color: '#9CA3AF',
        fontSize: 12,
        lineHeight: 20,
        textAlign: 'center',
    },

    paymentContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
    },

    paymentBadge: {
        borderWidth: 1,
        borderColor: '#374151',
        borderRadius: 5,
        paddingHorizontal: 9,
        paddingVertical: 8,
    },

    paymentText: {
        color: '#D1D5DB',
        fontSize: 9,
    },

});
