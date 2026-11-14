
import { useState } from "react";

import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";

import { Eye, EyeOff } from "lucide-react-native";

import { useAuth } from "../../../context/AuthContext";

export default function Register() {
    const router = useRouter();

    const { register: signUp } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onBlur",
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const passwordValue = watch("password");

    // Registration Submit
    const onSubmit = async (data) => {
        try {
            const response = await signUp(data);

            Alert.alert(
                "Success",
                response?.message ||
                "Account created successfully! Please verify your email.",
                [
                    {
                        text: "OK",
                        onPress: () => router.replace("/login"),
                    },
                ]
            );
        } catch (error) {
            console.error("Registration error:", error);

            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 429) {
                Alert.alert(
                    "Too Many Attempts",
                    message || "Too many registration attempts. Please try again later."
                );
                return;
            }

            if (status === 401) {
                Alert.alert(
                    "Registration Error",
                    message || "This email is already registered."
                );
                return;
            }

            if (status === 400) {
                Alert.alert(
                    "Invalid Information",
                    message || "Please check your information and try again."
                );
                return;
            }

            Alert.alert(
                "Registration Failed",
                message || "Registration failed. Please try again."
            );
        }
    };

    // Reusable Input Field
    const renderInput = ({
        name,
        label,
        placeholder,
        rules,
        secureTextEntry = false,
        showToggle = false,
        showValue = false,
        togglePassword,
        keyboardType = "default",
        autoCapitalize = "sentences",
    }) => (
        <View style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>

            <View style={styles.inputWrapper}>
                <Controller
                    control={control}
                    name={name}
                    rules={rules}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={[
                                styles.input,
                                showToggle && styles.passwordInput,
                                errors[name] && styles.inputError,
                            ]}
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder={placeholder}
                            placeholderTextColor="#999999"
                            secureTextEntry={secureTextEntry && !showValue}
                            keyboardType={keyboardType}
                            autoCapitalize={autoCapitalize}
                            autoCorrect={false}
                        />
                    )}
                />

                {showToggle && (
                    <Pressable
                        style={styles.eyeButton}
                        onPress={togglePassword}
                        hitSlop={10}
                    >
                        {showValue ? (
                            <EyeOff size={21} color="#777777" />
                        ) : (
                            <Eye size={21} color="#777777" />
                        )}
                    </Pressable>
                )}
            </View>

            {errors[name] && (
                <Text style={styles.errorText}>
                    {errors[name].message}
                </Text>
            )}
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formContainer}>
                    <Text style={styles.heading}>Create Account</Text>

                    {/* First Name */}
                    {renderInput({
                        name: "firstName",
                        label: "First Name",
                        placeholder: "Enter your first name",
                        rules: {
                            required: "First name is required",
                            minLength: {
                                value: 2,
                                message: "First name must be at least 2 characters",
                            },
                        },
                    })}

                    {/* Last Name */}
                    {renderInput({
                        name: "lastName",
                        label: "Last Name",
                        placeholder: "Enter your last name",
                        rules: {
                            required: "Last name is required",
                            minLength: {
                                value: 2,
                                message: "Last name must be at least 2 characters",
                            },
                        },
                    })}

                    {/* Email */}
                    {renderInput({
                        name: "email",
                        label: "Email",
                        placeholder: "Enter your email",
                        keyboardType: "email-address",
                        autoCapitalize: "none",
                        rules: {
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Enter a valid email address",
                            },
                        },
                    })}

                    {/* Password */}
                    {renderInput({
                        name: "password",
                        label: "Password",
                        placeholder: "Enter your password",
                        secureTextEntry: true,
                        showToggle: true,
                        showValue: showPassword,
                        togglePassword: () => setShowPassword((prev) => !prev),
                        autoCapitalize: "none",
                        rules: {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        },
                    })}

                    {/* Confirm Password */}
                    {renderInput({
                        name: "confirmPassword",
                        label: "Confirm Password",
                        placeholder: "Confirm your password",
                        secureTextEntry: true,
                        showToggle: true,
                        showValue: showConfirmPassword,
                        togglePassword: () =>
                            setShowConfirmPassword((prev) => !prev),
                        autoCapitalize: "none",
                        rules: {
                            required: "Confirm password is required",
                            validate: (value) =>
                                value === passwordValue || "Passwords do not match",
                        },
                    })}

                    {/* Submit Button */}
                    <Pressable
                        style={[
                            styles.submitButton,
                            isSubmitting && styles.disabledButton,
                        ]}
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.submitButtonText}>
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Text>
                    </Pressable>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>
                            Already have an account?{" "}
                        </Text>

                        <Pressable onPress={() => router.push("/login")}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },

    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
        paddingVertical: 40,
    },

    formContainer: {
        width: "100%",
        maxWidth: 450,
        alignSelf: "center",
        borderWidth: 1,
        borderColor: "#EEEEEE",
        borderRadius: 10,
        padding: 22,
    },

    heading: {
        fontSize: 25,
        fontWeight: "700",
        color: "#222222",
        marginBottom: 25,
    },

    inputGroup: {
        marginBottom: 17,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#333333",
        marginBottom: 8,
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
    },

    input: {
        width: "100%",
        height: 48,
        borderWidth: 1,
        borderColor: "#DDDDDD",
        borderRadius: 6,
        paddingHorizontal: 13,
        fontSize: 14,
        color: "#222222",
    },

    passwordInput: {
        paddingRight: 48,
    },

    inputError: {
        borderColor: "#DC2626",
    },

    eyeButton: {
        position: "absolute",
        right: 14,
        height: 48,
        justifyContent: "center",
    },

    errorText: {
        color: "#DC2626",
        fontSize: 12,
        marginTop: 5,
    },

    submitButton: {
        backgroundColor: "#00B207",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 6,
        marginTop: 10,
    },

    disabledButton: {
        opacity: 0.6,
    },

    submitButtonText: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "700",
    },

    loginContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        flexWrap: "wrap",
    },

    loginText: {
        color: "#888888",
        fontSize: 13,
    },

    loginLink: {
        color: "#00B207",
        fontSize: 13,
        fontWeight: "600",
    },
});
