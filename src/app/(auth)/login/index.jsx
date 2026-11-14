
import { useState } from 'react';

import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { login, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        if (!email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            newErrors.email = 'Enter a valid email address';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        try {
            const response = await login({
                email: email.trim(),
                password,
            });

            console.log('Login response:', response);

            if (response?.success) {
                router.replace('/account');
            } else {
                Alert.alert(
                    'Login Failed',
                    response?.message || 'Invalid email or password'
                );
            }
        } catch (error) {
            console.log('Login error:', error);

            Alert.alert(
                'Login Failed',
                error?.response?.data?.message ||
                error?.message ||
                'Something went wrong'
            );
        }
    };



    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.card}>

                    <Text style={styles.title}>Sign In</Text>

                    {/* Email */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email</Text>

                        <TextInput
                            style={[
                                styles.input,
                                errors.email && styles.inputError,
                            ]}
                            placeholder="Enter your email"
                            placeholderTextColor="#9CA3AF"
                            value={email}
                            onChangeText={(value) => {
                                setEmail(value);
                                setErrors(prev => ({ ...prev, email: '' }));
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        {errors.email ? (
                            <Text style={styles.errorText}>
                                {errors.email}
                            </Text>
                        ) : null}
                    </View>

                    {/* Password */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>

                        <TextInput
                            style={[
                                styles.input,
                                errors.password && styles.inputError,
                            ]}
                            placeholder="Enter your password"
                            placeholderTextColor="#9CA3AF"
                            value={password}
                            onChangeText={(value) => {
                                setPassword(value);
                                setErrors(prev => ({ ...prev, password: '' }));
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                        />

                        {errors.password ? (
                            <Text style={styles.errorText}>
                                {errors.password}
                            </Text>
                        ) : null}
                    </View>

                    {/* Forgot Password */}
                    <TouchableOpacity
                        style={styles.forgotContainer}
                        onPress={() => router.push('/forgot-password')}
                    >
                        <Text style={styles.forgotText}>
                            Forgot password?
                        </Text>
                    </TouchableOpacity>

                    {/* Login Button */}
                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            loading && styles.disabledButton,
                        ]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.loginButtonText}>
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Register */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            No account?
                        </Text>

                        <TouchableOpacity
                            onPress={() => router.push('/register')}
                        >
                            <Text style={styles.registerLink}>
                                {' '}Sign Up
                            </Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },

    card: {
        width: '100%',
        maxWidth: 450,
        alignSelf: 'center',
        padding: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
    },

    title: {
        fontSize: 26,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 28,
    },

    inputGroup: {
        marginBottom: 18,
    },

    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 8,
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 15,
        color: '#111827',
        backgroundColor: '#FFFFFF',
    },

    inputError: {
        borderColor: '#EF4444',
    },

    errorText: {
        color: '#EF4444',
        fontSize: 12,
        marginTop: 5,
    },

    forgotContainer: {
        alignItems: 'flex-end',
        marginTop: 2,
    },

    forgotText: {
        fontSize: 13,
        color: '#16A34A',
        fontWeight: '500',
    },

    loginButton: {
        height: 50,
        backgroundColor: '#16A34A',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
    },

    disabledButton: {
        opacity: 0.65,
    },

    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },

    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },

    registerText: {
        fontSize: 13,
        color: '#9CA3AF',
    },

    registerLink: {
        fontSize: 13,
        color: '#16A34A',
        fontWeight: '600',
    },
});
