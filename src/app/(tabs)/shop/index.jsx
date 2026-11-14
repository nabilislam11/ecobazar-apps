import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, SlidersHorizontal, X } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';

import {
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import ProductGrid from '../../../components/(ecoommerce)/productGrid';
import * as categoryService from '../../../service/categoryService';
import * as productService from '../../../service/productService';

const PAGE_SIZE = 12;

const SECTION_LABELS = {
    todaysDeal: "Today's Deals",
    featuredProducts: 'Featured Products',
    populerDeals: 'Popular Products',
    slider: 'Slider Products',
};

const SORT_OPTIONS = [
    { value: 'latest', label: 'Latest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
];

export default function Shop() {
    const router = useRouter();
    const params = useLocalSearchParams();

    // ROUTE PARAMS
    const categoryId = params.category ? String(params.category) : '';
    const search = params.q ? String(params.q) : undefined;
    const selectedBrand = params.brand ? String(params.brand) : '';
    const selectedSection = params.section ? String(params.section) : '';
    const selectedView = params.view ? String(params.view) : '';

    // STATES
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [sections, setSections] = useState([]);

    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [sort, setSort] = useState('latest');

    const [priceRange, setPriceRange] = useState({ minPrice: 0, maxPrice: 0 });
    const [selectedMinPrice, setSelectedMinPrice] = useState(null);
    const [selectedMaxPrice, setSelectedMaxPrice] = useState(null);

    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const [minInput, setMinInput] = useState('');
    const [maxInput, setMaxInput] = useState('');

    // ==============================
    // PAGE (FIX: filter বদলালে page নিজে থেকে 1 হয়ে যাবে,
    // আলাদা reset effect লাগে না, তাই দুইবার API call হবে না)
    // ==============================
    const filterKey = [
        categoryId,
        selectedBrand,
        selectedSection,
        selectedView,
        search ?? '',
    ].join('|');

    const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
    const page = pageState.key === filterKey ? pageState.page : 1;

    const setPage = useCallback(
        (value) => {
            setPageState((prev) => {
                const current = prev.key === filterKey ? prev.page : 1;
                const next = typeof value === 'function' ? value(current) : value;
                return { key: filterKey, page: next };
            });
        },
        [filterKey]
    );

    // SELECTED CATEGORY
    const selectedCategory = categories.find(
        (category) =>
            String(category._id) === categoryId ||
            String(category.slug) === categoryId
    );

    // PAGE TITLE
    const pageTitle =
        selectedView === 'categories'
            ? 'All Categories'
            : selectedCategory?.name ||
            (selectedSection
                ? SECTION_LABELS[selectedSection] || selectedSection
                : selectedBrand || 'Shop');

    // FETCH CATEGORIES
    useEffect(() => {
        let active = true;

        const fetchCategories = async () => {
            try {
                setCategoriesLoading(true);
                const response = await categoryService.getCategories();
                const list = Array.isArray(response)
                    ? response
                    : response?.data || response?.items || [];
                if (active) setCategories(list);
            } catch (error) {
                console.error('Categories fetch error:', error);
                if (active) setCategories([]);
            } finally {
                if (active) setCategoriesLoading(false);
            }
        };

        fetchCategories();
        return () => {
            active = false;
        };
    }, []);

    // RESET PRICE FILTER ON ROUTE CHANGE
    useEffect(() => {
        setSelectedMinPrice(null);
        setSelectedMaxPrice(null);
        setMinInput('');
        setMaxInput('');
    }, [filterKey]);

    // UPDATE ROUTE FILTER
    const updateFilter = useCallback(
        (key, value) => {
            const next = { ...params };

            if (value) {
                next[key] = String(value);
            } else {
                delete next[key];
            }

            if (key === 'category' && value) {
                delete next.section;
                delete next.view;
            }

            if (key === 'section' && value) {
                delete next.category;
                delete next.view;
            }

            if (key === 'view' && value === 'categories') {
                delete next.category;
                delete next.section;
            }

            setSelectedMinPrice(null);
            setSelectedMaxPrice(null);
            setFilterOpen(false);

            router.setParams(next);
        },
        [params, router]
    );

    const openCategory = (category) => {
        const id = category?._id || category?.slug;
        if (!id) return;
        updateFilter('category', id);
    };

    // FETCH PRODUCTS
    useEffect(() => {
        let active = true;

        const fetchProducts = async () => {
            if (selectedView === 'categories') {
                setProducts([]);
                setTotalPages(1);
                setTotalItems(0);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const apiParams = {
                    page,
                    pageSize: PAGE_SIZE,
                    category: categoryId || undefined,
                    brand: selectedBrand || undefined,
                    section: selectedSection || undefined,
                    q: search,
                    minPrice: selectedMinPrice ?? undefined,
                    maxPrice: selectedMaxPrice ?? undefined,
                    sort,
                };

                const response = await productService.getProductsByParams(apiParams);

                const productList = Array.isArray(response?.items)
                    ? response.items
                    : Array.isArray(response?.data)
                        ? response.data
                        : Array.isArray(response)
                            ? response
                            : [];

                const pagination = response?.pagination || {};
                const filterData = response?.filters || {};

                if (!active) return;

                setProducts(productList);
                setTotalPages(pagination.totalPages ?? response?.totalPages ?? 1);
                setTotalItems(
                    pagination.totalItems ?? response?.totalItems ?? productList.length
                );
                setBrands(Array.isArray(filterData.brands) ? filterData.brands : []);
                setSections(Array.isArray(filterData.sections) ? filterData.sections : []);
                setPriceRange({
                    minPrice: Number(filterData.minPrice ?? 0),
                    maxPrice: Number(filterData.maxPrice ?? 0),
                });
            } catch (error) {
                console.error('Shop products error:', error);
                if (active) {
                    setProducts([]);
                    setTotalPages(1);
                    setTotalItems(0);
                    setBrands([]);
                    setSections([]);
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        fetchProducts();
        return () => {
            active = false;
        };
    }, [
        categoryId,
        selectedBrand,
        selectedSection,
        selectedView,
        search,
        page,
        sort,
        selectedMinPrice,
        selectedMaxPrice,
    ]);

    // PRICE FILTER
    const applyPriceFilter = () => {
        const min = minInput.trim() === '' ? null : Number(minInput);
        const max = maxInput.trim() === '' ? null : Number(maxInput);

        if (
            (min !== null && Number.isNaN(min)) ||
            (max !== null && Number.isNaN(max))
        ) {
            return;
        }

        if (min !== null && max !== null && min > max) return;

        setSelectedMinPrice(min);
        setSelectedMaxPrice(max);
        setPage(1);
        setFilterOpen(false);
    };

    const resetPrice = () => {
        setSelectedMinPrice(null);
        setSelectedMaxPrice(null);
        setMinInput('');
        setMaxInput('');
        setPage(1);
    };

    const activeSortLabel =
        SORT_OPTIONS.find((option) => option.value === sort)?.label || 'Latest';

    // helper: category active কিনা (id অথবা slug দুটোই চেক করে)
    const isCategoryActive = (category) =>
        categoryId === String(category._id) ||
        categoryId === String(category.slug);

    return (
        <View style={styles.screen}>
            {/* HEADER */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.headerBtn}>
                    <ChevronLeft size={24} color="#111" />
                </Pressable>

                <Text style={styles.headerTitle} numberOfLines={1}>
                    {pageTitle}
                </Text>

                {selectedView !== 'categories' ? (
                    <Pressable onPress={() => setFilterOpen(true)} style={styles.headerBtn}>
                        <SlidersHorizontal size={22} color="#111" />
                    </Pressable>
                ) : (
                    <View style={styles.headerBtn} />
                )}
            </View>

            {/* TOP BAR */}
            <View style={styles.topBar}>
                <Text style={styles.countText}>
                    {selectedView === 'categories'
                        ? `Showing ${categories.length} categories`
                        : `Showing ${products.length} of ${totalItems} products`}
                </Text>

                {selectedView !== 'categories' && (
                    <Pressable style={styles.sortBtn} onPress={() => setSortOpen(true)}>
                        <Text style={styles.sortBtnText}>{activeSortLabel}</Text>
                    </Pressable>
                )}
            </View>

            {/* ACTIVE FILTER CHIPS */}
            {(categoryId || selectedBrand || selectedSection) && (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chips}
                    style={styles.chipsScroll}
                >
                    {!!selectedSection && (
                        <Pressable style={styles.chip} onPress={() => updateFilter('section', '')}>
                            <Text style={styles.chipText}>
                                {SECTION_LABELS[selectedSection] || selectedSection}
                            </Text>
                            <X size={14} color="#15803d" />
                        </Pressable>
                    )}

                    {!!categoryId && (
                        <Pressable style={styles.chip} onPress={() => updateFilter('category', '')}>
                            <Text style={styles.chipText}>
                                {selectedCategory?.name || 'Category'}
                            </Text>
                            <X size={14} color="#15803d" />
                        </Pressable>
                    )}

                    {!!selectedBrand && (
                        <Pressable style={styles.chip} onPress={() => updateFilter('brand', '')}>
                            <Text style={styles.chipText}>{selectedBrand}</Text>
                            <X size={14} color="#15803d" />
                        </Pressable>
                    )}
                </ScrollView>
            )}

            {/* MAIN CONTENT */}
            <ScrollView
                style={styles.list}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            >
                {selectedView === 'categories' ? (
                    <View style={styles.categoryGrid}>
                        {categoriesLoading ? (
                            <Text style={styles.emptyText}>Loading categories...</Text>
                        ) : categories.length > 0 ? (
                            categories.map((category) => (
                                <Pressable
                                    key={category._id || category.slug}
                                    style={({ pressed }) => [
                                        styles.categoryCard,
                                        pressed && styles.categoryPressed,
                                    ]}
                                    onPress={() => openCategory(category)}
                                >
                                    <Text style={styles.categoryName} numberOfLines={2}>
                                        {category.name}
                                    </Text>
                                    <Text style={styles.categorySubtitle}>Explore Products</Text>
                                    {typeof category.productCount === 'number' && (
                                        <Text style={styles.categoryCount}>
                                            {category.productCount} Products
                                        </Text>
                                    )}
                                </Pressable>
                            ))
                        ) : (
                            <Text style={styles.emptyText}>No categories available.</Text>
                        )}
                    </View>
                ) : (
                    <View style={styles.gridWrap}>
                        <ProductGrid products={products} loading={loading} columns={2} />

                        {!loading && products.length === 0 && (
                            <Text style={styles.emptyText}>No products found.</Text>
                        )}
                    </View>
                )}

                {/* PAGINATION */}
                {selectedView !== 'categories' && !loading && totalPages > 1 && (
                    <View style={styles.pagination}>
                        <Pressable
                            disabled={page <= 1}
                            onPress={() => setPage((p) => Math.max(1, p - 1))}
                            style={[styles.pageBtn, page <= 1 && styles.pageBtnDisabled]}
                        >
                            <Text style={styles.pageBtnText}>Prev</Text>
                        </Pressable>

                        <Text style={styles.pageInfo}>
                            {page} / {totalPages}
                        </Text>

                        <Pressable
                            disabled={page >= totalPages}
                            onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                            style={[styles.pageBtn, page >= totalPages && styles.pageBtnDisabled]}
                        >
                            <Text style={styles.pageBtnText}>Next</Text>
                        </Pressable>
                    </View>
                )}
            </ScrollView>

            {/* FILTER MODAL */}
            <Modal
                visible={filterOpen}
                animationType="slide"
                transparent
                onRequestClose={() => setFilterOpen(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filters</Text>
                            <Pressable onPress={() => setFilterOpen(false)}>
                                <X size={22} color="#111" />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* CATEGORIES */}
                            <Text style={styles.filterLabel}>Categories</Text>

                            <Pressable onPress={() => updateFilter('category', '')} style={styles.filterItem}>
                                <Text style={[styles.filterItemText, !categoryId && styles.filterItemActive]}>
                                    All Categories
                                </Text>
                            </Pressable>

                            {categories.map((category) => (
                                <Pressable
                                    key={category._id || category.slug}
                                    onPress={() => updateFilter('category', category._id || category.slug)}
                                    style={styles.filterItem}
                                >
                                    <Text
                                        style={[
                                            styles.filterItemText,
                                            isCategoryActive(category) && styles.filterItemActive,
                                        ]}
                                    >
                                        {category.name}
                                        {typeof category.productCount === 'number'
                                            ? ` (${category.productCount})`
                                            : ''}
                                    </Text>
                                </Pressable>
                            ))}

                            {/* BRANDS */}
                            <Text style={styles.filterLabel}>Brands</Text>

                            <Pressable onPress={() => updateFilter('brand', '')} style={styles.filterItem}>
                                <Text style={[styles.filterItemText, !selectedBrand && styles.filterItemActive]}>
                                    All Brands
                                </Text>
                            </Pressable>

                            {brands.map((brand) => (
                                <Pressable
                                    key={brand}
                                    onPress={() => updateFilter('brand', brand)}
                                    style={styles.filterItem}
                                >
                                    <Text
                                        style={[
                                            styles.filterItemText,
                                            selectedBrand === brand && styles.filterItemActive,
                                        ]}
                                    >
                                        {brand}
                                    </Text>
                                </Pressable>
                            ))}

                            {!brands.length && <Text style={styles.muted}>No brands available</Text>}

                            {/* SECTIONS */}
                            <Text style={styles.filterLabel}>Product Sections</Text>

                            <Pressable onPress={() => updateFilter('section', '')} style={styles.filterItem}>
                                <Text style={[styles.filterItemText, !selectedSection && styles.filterItemActive]}>
                                    All Sections
                                </Text>
                            </Pressable>

                            {sections.map((section) => (
                                <Pressable
                                    key={section}
                                    onPress={() => updateFilter('section', section)}
                                    style={styles.filterItem}
                                >
                                    <Text
                                        style={[
                                            styles.filterItemText,
                                            selectedSection === section && styles.filterItemActive,
                                        ]}
                                    >
                                        {SECTION_LABELS[section] || section}
                                    </Text>
                                </Pressable>
                            ))}

                            {!sections.length && <Text style={styles.muted}>No sections available</Text>}

                            {/* PRICE RANGE */}
                            <Text style={styles.filterLabel}>Price Range</Text>

                            {priceRange.maxPrice > 0 ? (
                                <View style={styles.priceRow}>
                                    <TextInput
                                        style={styles.priceInput}
                                        keyboardType="numeric"
                                        placeholder={`Min (${priceRange.minPrice})`}
                                        placeholderTextColor="#9ca3af"
                                        value={minInput}
                                        onChangeText={setMinInput}
                                    />
                                    <Text style={styles.priceDash}>—</Text>
                                    <TextInput
                                        style={styles.priceInput}
                                        keyboardType="numeric"
                                        placeholder={`Max (${priceRange.maxPrice})`}
                                        placeholderTextColor="#9ca3af"
                                        value={maxInput}
                                        onChangeText={setMaxInput}
                                    />
                                </View>
                            ) : (
                                <Text style={styles.muted}>Price range unavailable</Text>
                            )}

                            <View style={styles.modalActions}>
                                <Pressable style={styles.resetBtn} onPress={resetPrice}>
                                    <Text style={styles.resetBtnText}>Reset Price</Text>
                                </Pressable>

                                <Pressable style={styles.applyBtn} onPress={applyPriceFilter}>
                                    <Text style={styles.applyBtnText}>Apply</Text>
                                </Pressable>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* SORT MODAL */}
            <Modal
                visible={sortOpen}
                animationType="fade"
                transparent
                onRequestClose={() => setSortOpen(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setSortOpen(false)}>
                    <Pressable style={styles.sortSheet} onPress={(event) => event.stopPropagation()}>
                        <Text style={styles.modalTitle}>Sort by</Text>

                        {SORT_OPTIONS.map((option) => (
                            <Pressable
                                key={option.value}
                                style={styles.filterItem}
                                onPress={() => {
                                    setSort(option.value);
                                    setPage(1);
                                    setSortOpen(false);
                                }}
                            >
                                <Text
                                    style={[
                                        styles.filterItemText,
                                        sort === option.value && styles.filterItemActive,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </Pressable>
                        ))}
                    </Pressable>
                </Pressable>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#FFFFFF' },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
    },

    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    countText: { fontSize: 13, color: '#6B7280' },
    sortBtn: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    sortBtnText: { fontSize: 13, color: '#111827', fontWeight: '500' },

    // FIX: horizontal ScrollView যেন পুরো height না নেয়
    chipsScroll: { flexGrow: 0 },
    chips: { paddingHorizontal: 16, gap: 8, paddingBottom: 8 },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F0FDF4',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    chipText: { fontSize: 12, color: '#15803D', fontWeight: '500' },

    list: { flex: 1 },
    listContent: { paddingBottom: 24 },
    gridWrap: { paddingHorizontal: 16 },

    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        gap: 12,
    },
    categoryCard: {
        width: '48%',
        minHeight: 105,
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#DCFCE7',
        borderRadius: 14,
        padding: 15,
        justifyContent: 'center',
    },
    categoryPressed: { opacity: 0.7, backgroundColor: '#DCFCE7' },
    categoryName: { fontSize: 15, fontWeight: '700', color: '#166534' },
    categorySubtitle: { fontSize: 11, color: '#64748B', marginTop: 6 },
    categoryCount: { fontSize: 11, color: '#16A34A', fontWeight: '600', marginTop: 5 },

    emptyText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        padding: 25,
        width: '100%',
    },

    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginTop: 20,
        paddingVertical: 8,
    },
    pageBtn: {
        backgroundColor: '#16A34A',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    pageBtnDisabled: { opacity: 0.4 },
    pageBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 13 },
    pageInfo: { fontSize: 14, color: '#374151', fontWeight: '500' },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '85%',
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    sortSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        paddingBottom: 28,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 },

    filterLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
    },
    filterItem: { paddingVertical: 10 },
    filterItemText: { fontSize: 14, color: '#4B5563' },
    filterItemActive: { color: '#16A34A', fontWeight: '700' },
    muted: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },

    priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
    priceInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: '#111827',
    },
    priceDash: { color: '#9CA3AF' },

    modalActions: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 12 },
    resetBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    resetBtnText: { color: '#374151', fontWeight: '600' },
    applyBtn: {
        flex: 1,
        backgroundColor: '#16A34A',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    applyBtnText: { color: '#FFFFFF', fontWeight: '700' },
});