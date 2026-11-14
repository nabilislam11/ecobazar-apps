
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export default function Loader({ label = 'Loading...' }) {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#22C55E" />
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 64,
    },
    label: {
        fontSize: 14,
        color: '#9CA3AF',
    },
});
