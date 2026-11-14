
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function Badge({
    children,
    tone = 'success',
}) {
    const tones = {
        success: {
            backgroundColor: '#DCFCE7',
            color: '#15803D',
        },
        error: {
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
        },
        warning: {
            backgroundColor: '#FEF3C7',
            color: '#D97706',
        },
        gray: {
            backgroundColor: '#F3F4F6',
            color: '#374151',
        },
    };

    const selectedTone = tones[tone] || tones.success;

    return (
        <View
            style={[
                styles.badge,
                { backgroundColor: selectedTone.backgroundColor },
            ]}
        >
            <Text
                style={[
                    styles.text,
                    { color: selectedTone.color },
                ]}
            >
                {children}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },

    text: {
        fontSize: 11,
        fontWeight: '600',
    },
});
