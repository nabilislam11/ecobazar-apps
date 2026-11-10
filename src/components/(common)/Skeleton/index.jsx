// src/components/common/Skeleton.jsx
import { View } from 'react-native';

export default function Skeleton({ className = '' }) {
    // ওয়েবে animate-pulse সরাসরি কাজ করে, তবে React Native-এ NativeWind দিয়ে ডিফল্টভাবে পালস এনিমেশন কাজ নাও করতে পারে।
    // আপাতত এটি একটি সুন্দর গ্রে-বক্স হিসেবে প্রোডাক্ট লোড হওয়ার আগে জায়গা ধরে রাখবে।
    return (
        <View className={`rounded-md bg-gray-200 ${className}`} />
    );
}