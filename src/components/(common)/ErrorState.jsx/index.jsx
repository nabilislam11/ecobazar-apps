
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ErrorState({
    message = 'Something went wrong.',
    onRetry,
}) {
    return (
        <View style={styles.container}>

            {/* Error Message */}
            <Text style={styles.message}>
                {message}
            </Text>

            {/* Retry Button */}
            {onRetry && (
                <TouchableOpacity
                    onPress={onRetry}
                    activeOpacity={0.7}
                    style={styles.retryButton}
                >
                    <Text style={styles.retryText}>
                        Try again
                    </Text>
                </TouchableOpacity>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 64,
        paddingHorizontal: 20,
        gap: 12,
    },

    message: {
        fontSize: 13,
        color: '#DC2626',
        textAlign: 'center',
    },

    retryButton: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },

    retryText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#16A34A',
        textDecorationLine: 'underline',
    },
});
