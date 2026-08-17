import React, { useEffect, useMemo, useState } from 'react';import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import {
  getProducts,
  deleteProduct,
} from "../../services/product.service";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------
const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primarySoft: '#EAF1FF',
  success: '#22C55E',
  successSoft: '#E9FBF0',
  warning: '#F59E0B',
  warningSoft: '#FEF6E4',
  danger: '#EF4444',
  dangerSoft: '#FDEBEB',
  purple: '#8B5CF6',
  purpleSoft: '#F1EBFE',
  bg: '#F5F7FB',
  card: '#FFFFFF',
  border: '#E7EAF2',
  text: '#0F172A',
  textMuted: '#64748B',
  textFaint: '#9AA6B8',
};

const fmtINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

// ---------------------------------------------------------------------------
// Filter / sort config
// ---------------------------------------------------------------------------
const CATEGORIES = ['All', 'Sarees', 'Kurtis', 'Dupattas', 'Accessories'];
const STATUS_FILTERS = ['All', 'Active', 'Out of Stock', 'Disabled'];
const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest', icon: 'time-outline' },
  { key: 'nameAsc', label: 'Name A–Z', icon: 'text-outline' },
  { key: 'priceLow', label: 'Price: Low to High', icon: 'arrow-up-outline' },
  { key: 'priceHigh', label: 'Price: High to Low', icon: 'arrow-down-outline' },
  { key: 'stock', label: 'Stock: Low to High', icon: 'cube-outline' },
  { key: 'rating', label: 'Rating: High to Low', icon: 'star-outline' },
];

const STATUS_META = {
  active: { label: 'Active', color: COLORS.success, soft: COLORS.successSoft },
  outOfStock: { label: 'Out of Stock', color: COLORS.warning, soft: COLORS.warningSoft },
  disabled: { label: 'Disabled', color: COLORS.textMuted, soft: '#EEF1F6' },
};

// ---------------------------------------------------------------------------
// UI-only placeholder data
// ---------------------------------------------------------------------------
// TODO: Connect to backend API — replace with GET /api/seller/products
// (scoped to the logged-in seller only).
const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Handwoven Cotton Saree',
    category: 'Sarees',
    price: 2450,
    stock: 42,
    orders: 214,
    rating: 4.7,
    status: 'active',
    createdAt: 10,
  },
  {
    id: 'prod-2',
    name: 'Kanchipuram Silk Saree',
    category: 'Sarees',
    price: 8200,
    stock: 6,
    orders: 96,
    rating: 4.9,
    status: 'active',
    createdAt: 9,
  },
  {
    id: 'prod-3',
    name: 'Block Print Cotton Kurti',
    category: 'Kurtis',
    price: 990,
    stock: 0,
    orders: 182,
    rating: 4.3,
    status: 'outOfStock',
    createdAt: 8,
  },
  {
    id: 'prod-4',
    name: 'Chikankari Cotton Saree',
    category: 'Sarees',
    price: 3350,
    stock: 18,
    orders: 87,
    rating: 4.5,
    status: 'active',
    createdAt: 7,
  },
  {
    id: 'prod-5',
    name: 'Ikat Dupatta',
    category: 'Dupattas',
    price: 540,
    stock: 25,
    orders: 63,
    rating: 4.1,
    status: 'active',
    createdAt: 6,
  },
  {
    id: 'prod-6',
    name: 'Matching Potli Bag',
    category: 'Accessories',
    price: 420,
    stock: 12,
    orders: 39,
    rating: 4.0,
    status: 'active',
    createdAt: 5,
  },
  {
    id: 'prod-7',
    name: 'Jamdani Saree',
    category: 'Sarees',
    price: 4100,
    stock: 9,
    orders: 41,
    rating: 4.8,
    status: 'disabled',
    createdAt: 4,
  },
  {
    id: 'prod-8',
    name: 'Tussar Silk Saree',
    category: 'Sarees',
    price: 5600,
    stock: 0,
    orders: 28,
    rating: 4.4,
    status: 'outOfStock',
    createdAt: 3,
  },
];

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function MyProducts() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey] = useState('newest');
  const [panel, setPanel] = useState(null); // null | 'filter' | 'sort'


  useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {
  try {
    const data = await getProducts();

    const backendProducts = data.products || data;

    const formattedProducts = backendProducts.map((product) => ({
      ...product,

      // Keep the existing UI fields working
      id: product._id,

      category:
        typeof product.category === "object"
          ? product.category?.name || "Uncategorized"
          : product.category || "Uncategorized",

      orders: product.orders || 0,

      rating:
        product.averageRating !== undefined
          ? Number(product.averageRating)
          : 0,

      status:
        product.stock === 0
          ? "outOfStock"
          : product.isActive === false
          ? "disabled"
          : "active",

      createdAt: new Date(product.createdAt).getTime(),
    }));

    setProducts(formattedProducts);
  } catch (error) {
    console.log(
      "FETCH SELLER PRODUCTS ERROR:",
      error.response?.data || error.message
    );
  }
};

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    if (category !== 'All') {
      list = list.filter((p) => p.category === category);
    }

    if (statusFilter !== 'All') {
      const key = statusFilter === 'Out of Stock' ? 'outOfStock' : statusFilter.toLowerCase();
      list = list.filter((p) => p.status === key);
    }

    switch (sortKey) {
      case 'nameAsc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'priceLow':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'stock':
        list.sort((a, b) => a.stock - b.stock);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => b.createdAt - a.createdAt);
    }

    return list;
  }, [products, query, category, statusFilter, sortKey]);

  const togglePanel = (key) => setPanel((prev) => (prev === key ? null : key));

  // -------------------------------------------------------------------------
  // Placeholder action handlers
  // -------------------------------------------------------------------------
  const handleView = (product) => {
    // TODO: Connect to backend API / navigation — push to a product detail screen
    console.log('View Product', product.id);
    router.push?.(`/seller/products/${product.id}`);
  };

  const handleEdit = (product) => {
  console.log("Edit Product:", product.id);

  router.push({
    pathname: "/seller/edit-product/[id]",
    params: {
      id: product.id,
    },
  });
  };

  const handleDelete = (product) => {
  Alert.alert(
    "Delete this product?",
    `"${product.name}" will be permanently removed.`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            console.log(
              "Deleting product:",
              product.id
            );

            // Call backend
            await deleteProduct(product.id);

            // Remove from current UI after backend succeeds
            setProducts((prev) =>
              prev.filter(
                (p) => p.id !== product.id
              )
            );

            Alert.alert(
              "Success",
              "Product deleted successfully."
            );
          } catch (error) {
            console.log(
              "DELETE PRODUCT ERROR:",
              error.response?.data || error.message
            );

            Alert.alert(
              "Error",
              error.response?.data?.message ||
                "Failed to delete product."
            );
          }
        },
      },
    ]
  );
};

  const handleToggleDisable = (product) => {
    const willEnable = product.status === 'disabled';
    // TODO: Connect to backend API — PATCH /api/seller/products/:id
    // with { status: willEnable ? 'active' : 'disabled' }
    console.log(willEnable ? 'Enable Product' : 'Disable Product', product.id);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, status: willEnable ? 'active' : 'disabled' } : p
      )
    );
  };

  const handleAddProduct = () => {
    // TODO: Connect to backend API / navigation — push to Add Product screen
    console.log('Add Product');
    router.push?.('/seller/products/new');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: COLORS.card,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.text} />
        </TouchableOpacity>

        <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text }}>My Products</Text>

        <TouchableOpacity
          onPress={handleAddProduct}
          activeOpacity={0.7}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search + filter + sort */}
      <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.card,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
              paddingHorizontal: 12,
              height: 44,
              gap: 8,
            }}
          >
            <Ionicons name="search" size={16} color={COLORS.textFaint} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search your products"
              placeholderTextColor={COLORS.textFaint}
              style={{ flex: 1, fontSize: 13.5, color: COLORS.text, padding: 0 }}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} activeOpacity={0.7}>
                <Ionicons name="close-circle" size={16} color={COLORS.textFaint} />
              </TouchableOpacity>
            )}
          </View>

          <SquareIconButton
            icon="options-outline"
            active={panel === 'filter'}
            onPress={() => togglePanel('filter')}
          />
          <SquareIconButton
            icon="swap-vertical-outline"
            active={panel === 'sort'}
            onPress={() => togglePanel('sort')}
          />
        </View>

        {/* Active filter/sort summary chips */}
        {(category !== 'All' || statusFilter !== 'All' || sortKey !== 'newest') && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {category !== 'All' && (
              <SummaryChip label={category} onClear={() => setCategory('All')} />
            )}
            {statusFilter !== 'All' && (
              <SummaryChip label={statusFilter} onClear={() => setStatusFilter('All')} />
            )}
            {sortKey !== 'newest' && (
              <SummaryChip
                label={SORT_OPTIONS.find((s) => s.key === sortKey)?.label}
                onClear={() => setSortKey('newest')}
              />
            )}
          </View>
        )}

        {/* Filter panel */}
        {panel === 'filter' && (
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              padding: 14,
              marginTop: 10,
            }}
          >
            <Text style={{ fontSize: 11.5, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8 }}>
              CATEGORY
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
              {CATEGORIES.map((c) => (
                <ChoiceChip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
              ))}
            </View>

            <Text style={{ fontSize: 11.5, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8 }}>
              STATUS
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {STATUS_FILTERS.map((s) => (
                <ChoiceChip
                  key={s}
                  label={s}
                  active={statusFilter === s}
                  onPress={() => setStatusFilter(s)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Sort panel */}
        {panel === 'sort' && (
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: COLORS.border,
              padding: 8,
              marginTop: 10,
            }}
          >
            {SORT_OPTIONS.map((opt, idx) => {
              const isActive = sortKey === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  activeOpacity={0.75}
                  onPress={() => setSortKey(opt.key)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    paddingVertical: 11,
                    paddingHorizontal: 8,
                    borderRadius: 10,
                    backgroundColor: isActive ? COLORS.primarySoft : 'transparent',
                  }}
                >
                  <Ionicons name={opt.icon} size={15} color={isActive ? COLORS.primary : COLORS.textMuted} />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? '700' : '500',
                      color: isActive ? COLORS.primary : COLORS.text,
                      flex: 1,
                    }}
                  >
                    {opt.label}
                  </Text>
                  {isActive && <Ionicons name="checkmark" size={16} color={COLORS.primary} />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Results count */}
      <Text style={{ fontSize: 11.5, color: COLORS.textMuted, paddingHorizontal: 20, marginTop: 12 }}>
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
      </Text>

      {/* Product list */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredProducts.length === 0 ? (
          <EmptyState />
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={() => handleView(product)}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product)}
              onToggleDisable={() => handleToggleDisable(product)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Product card
// ---------------------------------------------------------------------------
function ProductCard({ product, onView, onEdit, onDelete, onToggleDisable }) {
  const statusMeta = STATUS_META[product.status];
  const isDisabled = product.status === 'disabled';

  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 16,
        marginTop: 14,
        opacity: isDisabled ? 0.75 : 1,
      }}
    >
      {/* Top: image + name/category + status */}
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View
          style={{
            width: 62,
            height: 62,
            borderRadius: 14,
            backgroundColor: COLORS.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name="image" size={24} color={COLORS.primary} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: 8 }} numberOfLines={2}>
              {product.name}
            </Text>
            <View
              style={{
                backgroundColor: statusMeta.soft,
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '700', color: statusMeta.color }}>
                {statusMeta.label}
              </Text>
            </View>
          </View>

          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: COLORS.bg,
              borderRadius: 7,
              paddingHorizontal: 8,
              paddingVertical: 3,
              marginTop: 6,
            }}
          >
            <Text style={{ fontSize: 10.5, fontWeight: '600', color: COLORS.textMuted }}>
              {product.category}
            </Text>
          </View>
        </View>
      </View>

      {/* Stat row: price, stock, orders, rating */}
      <View
        style={{
          flexDirection: 'row',
          marginTop: 14,
          backgroundColor: COLORS.bg,
          borderRadius: 14,
          paddingVertical: 10,
        }}
      >
        <StatCell label="Price" value={fmtINR(product.price)} />
        <Divider />
        <StatCell
          label="Stock"
          value={product.stock === 0 ? '0' : String(product.stock)}
          valueColor={product.stock === 0 ? COLORS.danger : COLORS.text}
        />
        <Divider />
        <StatCell label="Orders" value={String(product.orders)} />
        <Divider />
        <StatCell
          label="Rating"
          value={product.rating.toFixed(1)}
          icon="star"
          iconColor={COLORS.warning}
        />
      </View>

      {/* Action buttons */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onView}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            borderWidth: 1.5,
            borderColor: COLORS.border,
            borderRadius: 13,
            paddingVertical: 11,
          }}
        >
          <Ionicons name="eye-outline" size={15} color={COLORS.text} />
          <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.text }}>View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onEdit}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            backgroundColor: COLORS.primary,
            borderRadius: 13,
            paddingVertical: 11,
          }}
        >
          <Ionicons name="create-outline" size={15} color="#FFFFFF" />
          <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#FFFFFF' }}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onToggleDisable}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            borderWidth: 1.5,
            borderColor: COLORS.warning,
            borderRadius: 13,
            paddingVertical: 11,
          }}
        >
          <Ionicons
            name={isDisabled ? 'toggle-outline' : 'pause-circle-outline'}
            size={15}
            color={COLORS.warning}
          />
          <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.warning }}>
            {isDisabled ? 'Enable' : 'Disable'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onDelete}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            borderWidth: 1.5,
            borderColor: COLORS.danger,
            borderRadius: 13,
            paddingVertical: 11,
          }}
        >
          <Ionicons name="trash-outline" size={15} color={COLORS.danger} />
          <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.danger }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function StatCell({ label, value, valueColor, icon, iconColor }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        {icon && <Ionicons name={icon} size={11} color={iconColor} />}
        <Text style={{ fontSize: 12.5, fontWeight: '800', color: valueColor ?? COLORS.text }}>
          {value}
        </Text>
      </View>
      <Text style={{ fontSize: 9.5, color: COLORS.textMuted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function Divider() {
  return <View style={{ width: 1, backgroundColor: COLORS.border, marginVertical: 2 }} />;
}

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------
function SquareIconButton({ icon, active, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? COLORS.primary : COLORS.card,
        borderWidth: 1,
        borderColor: active ? COLORS.primary : COLORS.border,
      }}
    >
      <Ionicons name={icon} size={17} color={active ? '#FFFFFF' : COLORS.text} />
    </TouchableOpacity>
  );
}

function ChoiceChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: active ? COLORS.primary : COLORS.bg,
        borderWidth: 1,
        borderColor: active ? COLORS.primary : COLORS.border,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: '700', color: active ? '#FFFFFF' : COLORS.textMuted }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function SummaryChip({ label, onClear }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: COLORS.primarySoft,
        borderRadius: 999,
        paddingLeft: 12,
        paddingRight: 8,
        paddingVertical: 6,
      }}
    >
      <Text style={{ fontSize: 11.5, fontWeight: '700', color: COLORS.primary }}>{label}</Text>
      <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
        <Ionicons name="close" size={13} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 70 }}>
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: COLORS.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
        }}
      >
        <Ionicons name="cube-outline" size={26} color={COLORS.primary} />
      </View>
      <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.text }}>No products found</Text>
      <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4, textAlign: 'center' }}>
        Try adjusting your search or filters
      </Text>
    </View>
  );
}