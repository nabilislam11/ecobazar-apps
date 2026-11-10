// src/components/ecommerce/Rating.jsx
import { View, Text } from 'react-native';
import { Star } from 'lucide-react-native';

export default function Rating({ value = 0, count, size = 14 }) {
    return (
        // div এর বদলে View এবং flex-row ব্যবহার করা হয়েছে (পাশাপাশি বসানোর জন্য)
        <View className="flex-row items-center gap-1">
            <View className="flex-row items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                    // রেটিং অনুযায়ী কালার ডিসাইড করা হচ্ছে
                    const isActive = i < Math.round(value);
                    // warning এর জন্য হলুদ/অরেঞ্জ (#f59e0b) এবং gray-100 এর জন্য হালকা ধূসর (#f3f4f6)
                    const iconColor = isActive ? '#f59e0b' : '#f3f4f6';

                    return (
                        <Star
                            key={i}
                            size={size}
                            color={iconColor}
                            fill={iconColor}
                        />
                    );
                })}
            </View>

            {/* span এর বদলে Text এবং text-tiny এর বদলে text-xs */}
            {count != null && (
                <Text className="text-xs text-gray-400">({count})</Text>
            )}
        </View>
    );
}