// src/app/product/[slug].jsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Heart, Minus, Plus, ShoppingBag } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ProductGrid from '../../components/(ecoommerce)/productGrid';
import Rating from '../../components/(ecoommerce)/Rating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import * as productService from '../../service/productService';
import * as reviewService from '../../service/review';
import { getImageUrl, getMainImage } from '../../utils/imageUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetails() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();

  // ===== API FETCH (Home এর মতো) =====
  useEffect(() => {
    if (!slug) return;

    let mounted = true;
    setLoading(true);
    setProduct(null);
    setQty(1);
    setTab('description');
    setActiveImage(0);

    const load = async () => {
      try {
        const res = await productService.getProductBySlug(slug);

        // response shape handle
        const p =
          res?.data?.data ||
          res?.data ||
          res?.product ||
          res;

        if (!mounted) return;

        if (!p || (!p._id && !p.title)) {
          setProduct(null);
          return;
        }

        setProduct(p);

        // Reviews
        try {
          if (p._id && reviewService?.getReviews) {
            const revRes = await reviewService.getReviews(p._id);
            const list = Array.isArray(revRes)
              ? revRes
              : revRes?.data || revRes?.items || [];
            if (mounted) setReviews(list);
          }
        } catch (e) {
          console.log('Reviews load failed:', e);
          if (mounted) setReviews([]);
        }

        // Related products
        try {
          const catId =
            p.category?._id || p.category?.id || p.category;
          if (catId) {
            const relRes = await productService.getProductsByParams({
              pageSize: 6,
              category: catId,
            });
            const list = Array.isArray(relRes)
              ? relRes
              : relRes?.items || relRes?.data || [];
            if (mounted) {
              setRelated(
                list.filter((item) => item._id !== p._id).slice(0, 4)
              );
            }
          }
        } catch (e) {
          console.log('Related load failed:', e);
          if (mounted) setRelated([]);
        }
      } catch (err) {
        console.error('Product details load failed:', err);
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [slug]);

  // ===== Loading =====
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#16a34a" />
        <Text style={styles.centerText}>Loading product…</Text>
      </View>
    );
  }

  // ===== Not found =====
  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>Product not found</Text>
        <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
          <Text style={styles.primaryBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const wishlisted = isWishlisted(product._id);
  const inStock = Number(product.stock) > 0;
  const price = Number(product.price || 0);
  const oldPrice = product.oldPrice ? Number(product.oldPrice) : 0;

  // Images
  const images = Array.isArray(product.images) ? product.images : [];
  const getImgUri = (img) => {
    if (!img) return null;
    if (typeof img === 'string') return getImageUrl(img);
    const raw = img.url || img.path || img.filename || img.src;
    return raw ? getImageUrl(raw) : null;
  };

  const mainUri =
    getImgUri(images[activeImage]) ||
    getImgUri(getMainImage?.(images) || images[0]) ||
    'https://via.placeholder.com/400?text=No+Image';

  const handleAddToCart = () => {
    if (!inStock) return;
    // CartContext যা সাপোর্ট করে সেটাই
    try {
      addItem(product, qty);
    } catch {
      addItem(product._id);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.headerBtn}>
          <ChevronLeft size={24} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Product Details
        </Text>
        <Pressable
          onPress={() => toggleItem(product)}
          style={styles.headerBtn}
        >
          <Heart
            size={22}
            color={wishlisted ? '#ef4444' : '#111'}
            fill={wishlisted ? '#ef4444' : 'none'}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* ===== Gallery ===== */}
        <View style={styles.gallery}>
          <Image
            source={{ uri: mainUri }}
            style={styles.mainImage}
            resizeMode="contain"
          />

          {images.length > 1 && (
            <FlatList
              data={images}
              horizontal
              keyExtractor={(_, i) => String(i)}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbList}
              renderItem={({ item, index }) => {
                const uri = getImgUri(item);
                if (!uri) return null;
                return (
                  <Pressable
                    onPress={() => setActiveImage(index)}
                    style={[
                      styles.thumb,
                      activeImage === index && styles.thumbActive,
                    ]}
                  >
                    <Image
                      source={{ uri }}
                      style={styles.thumbImg}
                      resizeMode="cover"
                    />
                  </Pressable>
                );
              }}
            />
          )}
        </View>

        {/* ===== Info ===== */}
        <View style={styles.info}>
          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.row}>
            <Rating value={product.rating || 0} count={product.reviewCount} />
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>${price.toFixed(2)}</Text>
            {oldPrice > 0 && (
              <Text style={styles.oldPrice}>${oldPrice.toFixed(2)}</Text>
            )}
            {product.discount > 0 && (
              <View style={styles.saleBadge}>
                <Text style={styles.saleText}>-{product.discount}%</Text>
              </View>
            )}
          </View>

          {!!product.description && (
            <Text style={styles.shortDesc} numberOfLines={3}>
              {product.description}
            </Text>
          )}

          <Text style={styles.stock}>
            Stock:{' '}
            <Text style={{ color: inStock ? '#16a34a' : '#ef4444' }}>
              {inStock ? `${product.stock} available` : 'Out of stock'}
            </Text>
          </Text>
          {!!product.sku && (
            <Text style={styles.sku}>SKU: {product.sku}</Text>
          )}

          {/* Qty + Cart */}
          <View style={styles.actionRow}>
            <View style={styles.qtyBox}>
              <Pressable
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                style={styles.qtyBtn}
              >
                <Minus size={16} color="#111" />
              </Pressable>
              <Text style={styles.qtyNum}>{qty}</Text>
              <Pressable
                onPress={() =>
                  setQty((q) =>
                    inStock
                      ? Math.min(q + 1, Number(product.stock) || q + 1)
                      : q
                  )
                }
                style={styles.qtyBtn}
              >
                <Plus size={16} color="#111" />
              </Pressable>
            </View>

            <Pressable
              onPress={handleAddToCart}
              disabled={!inStock}
              style={[styles.cartBtn, !inStock && { opacity: 0.5 }]}
            >
              <ShoppingBag size={18} color="#fff" />
              <Text style={styles.cartBtnText}>Add to Cart</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={handleBuyNow}
            disabled={!inStock}
            style={[styles.buyBtn, !inStock && { opacity: 0.5 }]}
          >
            <Text style={styles.buyBtnText}>Buy Now</Text>
          </Pressable>
        </View>

        {/* ===== Tabs ===== */}
        <View style={styles.tabs}>
          <View style={styles.tabBar}>
            {[
              { key: 'description', label: 'Description' },
              { key: 'additional', label: 'Info' },
              { key: 'reviews', label: `Reviews (${reviews.length})` },
            ].map((t) => (
              <Pressable
                key={t.key}
                onPress={() => setTab(t.key)}
                style={[styles.tab, tab === t.key && styles.tabActive]}
              >
                <Text
                  style={[
                    styles.tabText,
                    tab === t.key && styles.tabTextActive,
                  ]}
                >
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {tab === 'description' && (
            <Text style={styles.tabBody}>
              {product.description || 'No description available.'}
            </Text>
          )}

          {tab === 'additional' && (
            <View>
              {[
                ['Brand', product.brand],
                [
                  'Category',
                  typeof product.category === 'object'
                    ? product.category?.name
                    : product.category,
                ],
                ['SKU', product.sku],
                ['Stock', product.stock],
              ].map(([k, v]) => (
                <View key={k} style={styles.tableRow}>
                  <Text style={styles.tableKey}>{k}</Text>
                  <Text style={styles.tableVal}>{v ?? '—'}</Text>
                </View>
              ))}
            </View>
          )}

          {tab === 'reviews' && (
            <View>
              {reviews.length === 0 ? (
                <Text style={styles.muted}>No reviews yet.</Text>
              ) : (
                reviews.map((r) => (
                  <View key={r._id || r.id} style={styles.reviewCard}>
                    <Text style={styles.reviewName}>
                      {r.user?.name || r.name || 'User'}
                    </Text>
                    <Rating value={r.rating || 0} />
                    <Text style={styles.reviewText}>
                      {r.comment || r.review || ''}
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>

        {/* ===== Related ===== */}
        {related.length > 0 && (
          <View style={styles.related}>
            <Text style={styles.relatedTitle}>Related Products</Text>
            <ProductGrid products={related} columns={2} loading={false} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
  },
  centerText: { color: '#6b7280', fontSize: 14 },
  primaryBtn: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryBtnText: { color: '#fff', fontWeight: '600' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },

  gallery: {
    backgroundColor: '#f9fafb',
    paddingBottom: 12,
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: 300,
  },
  thumbList: {
    paddingHorizontal: 16,
    gap: 8,
    marginTop: 10,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 8,
  },
  thumbActive: {
    borderColor: '#16a34a',
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },

  info: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  sku: { fontSize: 12, color: '#9ca3af' },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  price: { fontSize: 24, fontWeight: '700', color: '#111' },
  oldPrice: {
    fontSize: 16,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  saleBadge: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  saleText: { color: '#ef4444', fontSize: 12, fontWeight: '600' },
  shortDesc: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 10,
  },
  stock: { fontSize: 13, color: '#6b7280', marginBottom: 16 },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 10,
  },
  qtyBtn: { padding: 4 },
  qtyNum: {
    minWidth: 22,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 15,
  },
  cartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#16a34a',
    paddingVertical: 12,
    borderRadius: 10,
  },
  cartBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  buyBtn: {
    borderWidth: 1.5,
    borderColor: '#16a34a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyBtnText: { color: '#16a34a', fontWeight: '600', fontSize: 15 },

  tabs: { paddingHorizontal: 16, paddingTop: 8 },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginBottom: 14,
    gap: 4,
  },
  tab: {
    paddingBottom: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#16a34a' },
  tabText: { fontSize: 13, color: '#9ca3af', fontWeight: '500' },
  tabTextActive: { color: '#16a34a' },
  tabBody: { fontSize: 14, color: '#4b5563', lineHeight: 22 },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableKey: { width: 100, fontSize: 13, color: '#9ca3af' },
  tableVal: { flex: 1, fontSize: 13, color: '#111' },
  muted: { color: '#9ca3af', fontSize: 14 },
  reviewCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 6,
  },
  reviewName: { fontWeight: '600', color: '#111', fontSize: 14 },
  reviewText: { fontSize: 13, color: '#4b5563', lineHeight: 18 },

  related: { paddingHorizontal: 16, paddingTop: 28 },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 14,
  },
});