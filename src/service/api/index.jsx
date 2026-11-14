// src/services/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Vite এর বদলে Expo-তে EXPO_PUBLIC_ প্রিফিক্স ব্যবহার করতে হয়। 
// Localhost এর জায়গায় অবশ্যই আপনার পিসির Local IP Address বসিয়ে নিবেন।
const API_BASE_URL = "https://ecobazar-backend-uo0h.onrender.com/api/v1" || "http://192.168.0.106:5000/api/v1";

export const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    // AsyncStorage থেকে ডেটা আনতে await করতে হয়, তাই ফাংশনটি async করা হয়েছে
    async (config) => {
        try {
            const token = await AsyncStorage.getItem("ecobazar_token");

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Token fetch error:", error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Dummy API support
const DUMMY_LATENCY = 300;

export const resolveAfter = (data, ms = DUMMY_LATENCY) =>
    new Promise((resolve) => {
        setTimeout(() => resolve(data), ms);
    });

export default api; 