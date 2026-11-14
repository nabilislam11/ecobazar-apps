
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    loginUser,
    registerUser,
} from "../../service/authService";

const AuthContext = createContext(null);

const USER_KEY = "ecobazar_user";
const TOKEN_KEY = "ecobazar_token";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load Saved User When App Starts
    useEffect(() => {
        const loadUser = async () => {
            try {
                const savedUser = await AsyncStorage.getItem(USER_KEY);

                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.log("User storage error:", error);

                await AsyncStorage.removeItem(USER_KEY);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Register
    const register = async (data) => {
        setLoading(true);

        try {
            const response = await registerUser(data);

            return response;
        } finally {
            setLoading(false);
        }
    };

    // Login
    const login = async (data) => {
        setLoading(true);

        try {
            const response = await loginUser(data);

            // Save User Information
            if (response?.data) {
                await AsyncStorage.setItem(
                    USER_KEY,
                    JSON.stringify(response.data)
                );

                setUser(response.data);
            }

            // Save Token If Backend Returns One
            const token = response?.token || response?.data?.token;

            if (token) {
                await AsyncStorage.setItem(TOKEN_KEY, token);
            }

            return response;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        try {
            await AsyncStorage.multiRemove([
                USER_KEY,
                TOKEN_KEY,
            ]);

            setUser(null);
        } catch (error) {
            console.log("Logout error:", error);
            throw error;
        }
    };

    // Authentication Status
    const isAuthenticated = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated,
                login,
                register,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom Hook
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
}
