
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

export default function Select({
    label,
    error,
    children,
    ...props
}) {
    return (
        <View style={styles.container}>

            {/* Label */}
            {label && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}

            {/* Select Picker */}
            <View
                style={[
                    styles.pickerContainer,
                    error
                        ? styles.errorBorder
                        : styles.normalBorder,
                ]}
            >
                <Picker
                    {...props}
                    style={styles.picker}
                >
                    {children}
                </Picker>
            </View>

            {/* Error */}
            {error && (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },

    label: {
        marginBottom: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },

    pickerContainer: {
        width: '100%',
        borderWidth: 1,
        borderRadius: 4,
        overflow: 'hidden',
    },

    normalBorder: {
        borderColor: '#E5E7EB',
    },

    errorBorder: {
        borderColor: '#EF4444',
    },

    picker: {
        width: '100%',
        height: 50,
    },

    errorText: {
        marginTop: 4,
        fontSize: 12,
        color: '#EF4444',
    },
});
