
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { ChevronLeft, ChevronRight } from 'lucide-react-native';

export default function Pagination({
    page,
    totalPages,
    onChange,
}) {
    if (totalPages <= 1) return null;

    const pages = Array.from(
        { length: totalPages },
        (_, i) => i + 1
    );

    return (
        <View style={styles.container}>

            {/* Previous Button */}
            <TouchableOpacity
                onPress={() => onChange(Math.max(1, page - 1))}
                disabled={page === 1}
                style={[
                    styles.arrowButton,
                    page === 1 && styles.disabledButton,
                ]}
            >
                <ChevronLeft size={18} color="#374151" />
            </TouchableOpacity>

            {/* Page Numbers */}
            {pages.map((p) => (
                <TouchableOpacity
                    key={p}
                    onPress={() => onChange(p)}
                    style={[
                        styles.pageButton,
                        p === page && styles.activePage,
                    ]}
                >
                    <Text
                        style={[
                            styles.pageText,
                            p === page && styles.activePageText,
                        ]}
                    >
                        {p}
                    </Text>
                </TouchableOpacity>
            ))}

            {/* Next Button */}
            <TouchableOpacity
                onPress={() =>
                    onChange(Math.min(totalPages, page + 1))
                }
                disabled={page === totalPages}
                style={[
                    styles.arrowButton,
                    page === totalPages && styles.disabledButton,
                ]}
            >
                <ChevronRight size={18} color="#374151" />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginVertical: 12,
    },

    arrowButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },

    disabledButton: {
        opacity: 0.4,
    },

    pageButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },

    activePage: {
        backgroundColor: '#22C55E',
    },

    pageText: {
        fontSize: 13,
        color: '#374151',
    },

    activePageText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
