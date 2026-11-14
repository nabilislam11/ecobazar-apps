
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

export default function AdminStatsCard({
    label,
    value,
    icon: Icon,
    tone = 'success',
}) {
    const tones = {
        success: {
            background: '#DCFCE7',
            color: '#15803D',
        },
        warning: {
            background: '#FEF3C7',
            color: '#D97706',
        },
        error: {
            background: '#FEE2E2',
            color: '#DC2626',
        },
    };

    const selectedTone = tones[tone] || tones.success;

    return (
        <View style={styles.card}>

            {/* Icon */}
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: selectedTone.background },
                ]}
            >
                {Icon && (
                    <Icon
                        size={22}
                        color={selectedTone.color}
                    />
                )}
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.label}>
                    {label}
                </Text>

                <Text style={styles.value}>
                    {value}
                </Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        elevation: 2,
    },

    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
    },

    content: {
        flex: 1,
    },

    label: {
        fontSize: 12,
        color: '#9CA3AF',
        marginBottom: 5,
    },

    value: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
});
