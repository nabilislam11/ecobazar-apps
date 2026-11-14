
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    ChevronRight,
    Home,
} from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';

export default function Breadcrumb({ items = [] }) {
    const navigation = useNavigation();

    const handleNavigation = (screen) => {
        if (screen) {
            navigation.navigate(screen);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.breadcrumbContent}
            >

                {/* Home */}
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => handleNavigation('Home')}
                >
                    <Home size={14} color="#9CA3AF" />

                    <Text style={styles.linkText}>
                        Home
                    </Text>
                </TouchableOpacity>

                {/* Dynamic Breadcrumb Items */}
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <View key={index} style={styles.item}>

                            <ChevronRight size={14} color="#9CA3AF" />

                            {item.to && !isLast ? (
                                <TouchableOpacity
                                    onPress={() => handleNavigation(item.to)}
                                >
                                    <Text style={styles.linkText}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.activeText}>
                                    {item.label}
                                </Text>
                            )}

                        </View>
                    );
                })}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },

    breadcrumbContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 20,
        gap: 8,
    },

    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    linkText: {
        fontSize: 12,
        color: '#9CA3AF',
    },

    activeText: {
        fontSize: 12,
        color: '#111827',
        fontWeight: '600',
    },
});
