// src/components/CategoryCard.jsx
import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function CategoryCard({ category }) {
    return (
        // Expo Router-e route parameter pathanor best practice holo object use kora
        <Link
            href={{
                pathname: "/shop",
                params: { category: category._id }
            }}
            asChild
        >
            {/* asChild mane Link tar nicher Pressable ke touchable baniye dibe */}
            <Pressable className="flex-col items-center gap-3 rounded-lg border border-gray-100 p-6 active:border-green-500">

                {/* bg-success/10 er bodole standard tailwind color (jemon green-100) ba apnar custom color use korben */}
                <View className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Text className="text-2xl text-green-700">
                        {category.name.charAt(0)}
                    </Text>
                </View>

                <View className="items-center">
                    {/* text-small er bodole text-sm ar text-tiny er bodole text-xs */}
                    <Text className="text-sm font-medium text-gray-900">
                        {category.name}
                    </Text>
                    <Text className="text-xs text-gray-400">
                        {category.productCount} Products
                    </Text>
                </View>

            </Pressable>
        </Link>
    );
}