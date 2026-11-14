
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as adminService from "../../service/AdminService";

const AdminAuthContext = createContext(null);

const KEY = "ecobazar_admin_auth";

export function AdminAuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load Saved Admin
    useEffect(() => {
        const loadAdmin = async () => {
            try {
                const saved = await AsyncStorage.getItem(KEY);

                if (saved) {
                    setAdmin(JSON.parse(saved));
                }
            } catch (error) {
                console.log("Admin storage error:", error);
                await AsyncStorage.removeItem(KEY);
            } finally {
                setLoading(false);
            }
        };

        loadAdmin();
    }, []);

    // Admin Login
    const login = async (email, password) => {
        const response = await adminService.adminLogin(email, password);

        const a = response.admin;

        await AsyncStorage.setItem(KEY, JSON.stringify(a));
        setAdmin(a);

        return a;
    };

    // Admin Logout
    const logout = async () => {
        await AsyncStorage.removeItem(KEY);
        setAdmin(null);
    };

    return (
        <AdminAuthContext.Provider
            value={{
                admin,
                loading,
                isAuthenticated: !!admin,
                login,
                logout,
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}

// Custom Hook
export const useAdminAuth = () => useContext(AdminAuthContext);
