// src/components/common/EmptyState.jsx
import { View, Text } from 'react-native';

export default function EmptyState({ title, description, action }) {
    return (
        <View className="flex-col items-center justify-center gap-3 py-20 px-4">
            {/* h3 এর বদলে Text এবং text-medium এর বদলে text-base দেওয়া হয়েছে */}
            <Text className="text-base font-semibold text-center text-gray-900">
                {title}
            </Text>

            {/* p এর বদলে Text এবং text-small এর বদলে text-sm দেওয়া হয়েছে */}
            {description ? (
                <Text className="text-sm text-center text-gray-400">
                    {description}
                </Text>
            ) : null}

            {/* Action বাটনটি যদি পাঠানো হয়, তবে রেন্ডার হবে */}
            {action}
        </View>
    );
}