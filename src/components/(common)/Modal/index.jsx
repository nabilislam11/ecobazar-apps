
import {
    Pressable,
    Modal as RNModal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { X } from 'lucide-react-native';

export default function Modal({
    open,
    onClose,
    title,
    children,
}) {
    return (
        <RNModal
            visible={open}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable
                    style={styles.modalContainer}
                    onPress={(e) => e.stopPropagation()}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>{title}</Text>

                        <TouchableOpacity onPress={onClose}>
                            <X size={20} color="#000000" />
                        </TouchableOpacity>
                    </View>

                    {children}

                </Pressable>
            </Pressable>
        </RNModal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },

    modalContainer: {
        width: '100%',
        maxWidth: 448,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 24,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },

    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
});
