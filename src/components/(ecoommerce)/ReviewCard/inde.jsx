

import {
    StyleSheet,
    Text,
    View,
} from 'react-native';

import Rating from './Rating';

export default function ReviewCard({ review }) {
    if (!review) return null;

    return (
        <View style={styles.container}>

            {/* Customer & Date */}
            <View style={styles.header}>

                <Text style={styles.customer}>
                    {review.customer}
                </Text>

                <Text style={styles.date}>
                    {review.date
                        ? new Date(review.date).toLocaleDateString()
                        : ''}
                </Text>

            </View>

            {/* Rating */}
            <Rating value={review.rating} />

            {/* Review Comment */}
            <Text style={styles.comment}>
                {review.comment}
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 20,
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    customer: {
        fontSize: 13,
        fontWeight: '500',
        color: '#111827',
    },

    date: {
        fontSize: 11,
        color: '#9CA3AF',
    },

    comment: {
        marginTop: 8,
        fontSize: 13,
        color: '#374151',
        lineHeight: 20,
    },
});
