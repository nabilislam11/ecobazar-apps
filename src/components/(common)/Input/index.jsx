
import { forwardRef } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

const Input = forwardRef(
    (
        {
            label,
            error,
            style,
            ...props
        },
        ref
    ) => {
        return (
            <View style={styles.container}>
                {label ? (
                    <Text style={styles.label}>
                        {label}
                    </Text>
                ) : null}

                <TextInput
                    ref={ref}
                    placeholderTextColor="#9CA3AF"
                    style={[
                        styles.input,
                        error ? styles.inputError : null,
                        style,
                    ]}
                    {...props}
                />

                {error ? (
                    <Text style={styles.error}>
                        {error}
                    </Text>
                ) : null}
            </View>
        );
    }
);

Input.displayName = 'Input';

export default Input;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },

    label: {
        marginBottom: 8,
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },

    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14,
        color: '#111827',
        backgroundColor: '#FFFFFF',
    },

    inputError: {
        borderColor: '#DC2626',
    },

    error: {
        marginTop: 4,
        fontSize: 12,
        color: '#DC2626',
    },
});
