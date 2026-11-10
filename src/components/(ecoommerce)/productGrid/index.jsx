// src/components/ecommerce/ProductGrid.jsx
import { View, StyleSheet, Dimensions } from 'react-native';
import ProductCard from '../../(common)/ProductCard';
import Skeleton from '../../(common)/Skeleton';
import EmptyState from '../../(common)/EmptyState';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAP = 12;
const HORIZONTAL_PADDING = 16; // section-এর padding

export default function ProductGrid({ products = [], loading = false, columns = 2 }) {
    const itemWidth =
        (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - GAP * (columns - 1)) / columns;

    if (loading) {
        return (
            <View style={styles.grid}>
                {Array.from({ length: columns * 2 }).map((_, i) => (
                    <View key={i} style={[styles.item, { width: itemWidth }]}>
                        <Skeleton style={styles.skeleton} />
                    </View>
                ))}
            </View>
        );
    }

    if (!products?.length) {
        return (
            <EmptyState
                title="No products found"
                description="Try adjusting your filters or search terms."
            />
        );
    }

    return (
        <View style={styles.grid}>
            {products.map((product) => (
                <View
                    key={product._id || product.id}
                    style={[styles.item, { width: itemWidth }]}
                >
                    <ProductCard product={product} />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 16,
    },
    item: {
        // width dynamically set
    },
    skeleton: {
        height: 240,
        borderRadius: 12,
    },
});