
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = 'Are you sure?',
    description,
}) {
    return (
        <Modal
            visible={open}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                style={styles.overlay}
                onPress={onClose}
            >
                <Pressable
                    style={styles.dialog}
                    onPress={(e) => e.stopPropagation()}
                >
                    {/* Title */}
                    <Text style={styles.title}>
                        {title}
                    </Text>

                    {/* Description */}
                    {description ? (
                        <Text style={styles.description}>
                            {description}
                        </Text>
                    ) : null}

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={onConfirm}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.deleteText}>
                                Delete
                            </Text>
                        </TouchableOpacity>

                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    dialog: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 22,
        elevation: 8,
    },

    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 12,
    },

    description: {
        fontSize: 13,
        color: '#374151',
        lineHeight: 21,
        marginBottom: 24,
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 12,
    },

    cancelButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 7,
    },

    cancelText: {
        color: '#374151',
        fontSize: 13,
        fontWeight: '600',
    },

    deleteButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#EF4444',
        borderRadius: 7,
    },

    deleteText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
});
