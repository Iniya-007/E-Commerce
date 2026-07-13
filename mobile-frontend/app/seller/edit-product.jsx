import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

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
  bg: '#F5F7FB',
  card: '#FFFFFF',
  border: '#E7EAF2',
  text: '#0F172A',
  textMuted: '#64748B',
  textFaint: '#9AA6B8',
};

// ---------------------------------------------------------------------------
// UI-only placeholder/default data
// ---------------------------------------------------------------------------
// TODO: Connect to backend API — replace this static object with the
// product fetched from your backend (e.g. GET /api/products/:id).
const DEFAULT_PRODUCT = {
  id: 'demo-1',
  name: 'Handwoven Cotton Saree',
  description:
    'A breathable, hand-loomed cotton saree with traditional zari border detailing. Woven by artisans in small batches.',
  price: '2450',
  discount: '10',
  stock: '42',
  images: ['img-1', 'img-2', 'img-3'],
  specifications: [
    { id: 's1', key: 'Material', value: 'Cotton' },
    { id: 's2', key: 'Color', value: 'Blue' },
    { id: 's3', key: 'Weight', value: '450g' },
    { id: 's4', key: 'Origin', value: 'Kanchipuram, India' },
  ],
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function EditProduct() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const productId = id || DEFAULT_PRODUCT.id;

  // NOTE: This screen is UI-only. All fields are seeded with placeholder
  // data below. Once the backend is wired up, replace DEFAULT_PRODUCT with
  // the product loaded via your API layer (e.g. inside a useEffect).
  // TODO: Connect to backend API — fetch product by `productId` and call
  // the setters below (setName, setDescription, etc.) with the response.
  const [name, setName] = useState(DEFAULT_PRODUCT.name);
  const [description, setDescription] = useState(DEFAULT_PRODUCT.description);
  const [price, setPrice] = useState(DEFAULT_PRODUCT.price);
  const [discount, setDiscount] = useState(DEFAULT_PRODUCT.discount);
  const [stock, setStock] = useState(DEFAULT_PRODUCT.stock);
  const [images, setImages] = useState(DEFAULT_PRODUCT.images);
  const [specs, setSpecs] = useState(DEFAULT_PRODUCT.specifications);

  const numericPrice = parseFloat(price) || 0;
  const numericDiscount = parseFloat(discount) || 0;
  const finalPrice = Math.max(0, numericPrice - (numericPrice * numericDiscount) / 100);

  // -------------------------------------------------------------------------
  // Local UI-state handlers (these just update on-screen state, no backend)
  // -------------------------------------------------------------------------
  const handleAddImage = () => {
    if (images.length >= 6) return;
    setImages((prev) => [...prev, `img-${prev.length + 1}-${Date.now()}`]);
    // TODO: Connect to backend API — trigger image picker / upload flow
    // and replace the placeholder id above with the uploaded image URL.
  };

  const handleRemoveImage = (imgId) => {
    setImages((prev) => prev.filter((i) => i !== imgId));
  };

  const handleAddSpec = () => {
    setSpecs((prev) => [...prev, { id: `spec-${Date.now()}`, key: '', value: '' }]);
  };

  const handleSpecChange = (specId, field, text) => {
    setSpecs((prev) => prev.map((s) => (s.id === specId ? { ...s, [field]: text } : s)));
  };

  const handleRemoveSpec = (specId) => {
    setSpecs((prev) => prev.filter((s) => s.id !== specId));
  };

  // -------------------------------------------------------------------------
  // Placeholder actions — to be wired up to the backend service layer later
  // -------------------------------------------------------------------------
  const handleUpdate = () => {
    if (!name.trim() || !price || !stock) {
      Alert.alert('Missing details', 'Name, price, and stock are required.');
      return;
    }

    // TODO: Connect to backend API — send the updated product fields
    // (name, description, price, discount, finalPrice, stock, images, specs)
    // to your update-product endpoint here.
    console.log('Update Product', {
      id: productId,
      name,
      description,
      price: numericPrice,
      discount: numericDiscount,
      finalPrice: Number(finalPrice.toFixed(2)),
      stock,
      images,
      specifications: specs,
    });

    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete this product?',
      `"${name || 'This product'}" will be permanently removed from your store.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Connect to backend API — call your delete-product
            // endpoint with `productId` here.
            console.log('Delete Product', productId);
            router.back();
          },
        },
      ]
    );
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
          paddingBottom: 12,
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

        <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text }}>Edit Product</Text>

        <TouchableOpacity
          onPress={handleDelete}
          activeOpacity={0.7}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: COLORS.dangerSoft,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="trash-outline" size={17} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Images */}
          <SectionCard title="Product Images" subtitle="First photo is used as the cover">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {images.map((imgId, idx) => (
                <View
                  key={imgId}
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: 14,
                    backgroundColor: COLORS.primarySoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="image" size={22} color={COLORS.primary} />
                  {idx === 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        top: 4,
                        left: 4,
                        backgroundColor: COLORS.primary,
                        borderRadius: 6,
                        paddingHorizontal: 5,
                        paddingVertical: 1,
                      }}
                    >
                      <Text style={{ fontSize: 8.5, fontWeight: '700', color: '#FFFFFF' }}>COVER</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(imgId)}
                    activeOpacity={0.8}
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      backgroundColor: COLORS.card,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: COLORS.border,
                    }}
                  >
                    <Ionicons name="close" size={12} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              ))}

              {images.length < 6 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleAddImage}
                  style={{
                    width: 78,
                    height: 78,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderStyle: 'dashed',
                    borderColor: COLORS.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="camera-outline" size={20} color={COLORS.textMuted} />
                  <Text style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 4 }}>Add</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </SectionCard>

          {/* Basic info */}
          <SectionCard title="Basic Information">
            <Field label="Product Name">
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Product name"
                placeholderTextColor={COLORS.textFaint}
                style={inputText}
              />
            </Field>

            <View style={{ height: 12 }} />
            <Field label="Description" alignTop>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Product description"
                placeholderTextColor={COLORS.textFaint}
                multiline
                numberOfLines={4}
                style={[inputText, { minHeight: 84, textAlignVertical: 'top' }]}
              />
            </Field>
          </SectionCard>

          {/* Pricing & stock */}
          <SectionCard title="Pricing & Stock">
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field label="Price (₹)">
                  <TextInput
                    value={price}
                    onChangeText={setPrice}
                    placeholder="0.00"
                    placeholderTextColor={COLORS.textFaint}
                    keyboardType="decimal-pad"
                    style={inputText}
                  />
                </Field>
              </View>
              <View style={{ flex: 1 }}>
                <Field label="Discount (%)">
                  <TextInput
                    value={discount}
                    onChangeText={setDiscount}
                    placeholder="0"
                    placeholderTextColor={COLORS.textFaint}
                    keyboardType="decimal-pad"
                    style={inputText}
                  />
                </Field>
              </View>
            </View>

            {numericPrice > 0 && numericDiscount > 0 && (
              <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 10 }}>
                Customer pays{' '}
                <Text style={{ color: COLORS.success, fontWeight: '700' }}>
                  ₹{finalPrice.toFixed(2)}
                </Text>{' '}
                after discount
              </Text>
            )}

            <View style={{ height: 12 }} />
            <Field label="Stock Quantity">
              <TextInput
                value={stock}
                onChangeText={setStock}
                placeholder="0"
                placeholderTextColor={COLORS.textFaint}
                keyboardType="number-pad"
                style={inputText}
              />
            </Field>
          </SectionCard>

          {/* Specifications */}
          <SectionCard title="Specifications" subtitle="Key details shown on the product page">
            {specs.map((s, idx) => (
              <View
                key={s.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: idx === specs.length - 1 ? 0 : 10,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.bg,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                >
                  <TextInput
                    value={s.key}
                    onChangeText={(t) => handleSpecChange(s.id, 'key', t)}
                    placeholder="Attribute (e.g. Material)"
                    placeholderTextColor={COLORS.textFaint}
                    style={{ fontSize: 13, color: COLORS.text, padding: 0 }}
                  />
                </View>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: COLORS.bg,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                  }}
                >
                  <TextInput
                    value={s.value}
                    onChangeText={(t) => handleSpecChange(s.id, 'value', t)}
                    placeholder="Value (e.g. Cotton)"
                    placeholderTextColor={COLORS.textFaint}
                    style={{ fontSize: 13, color: COLORS.text, padding: 0 }}
                  />
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveSpec(s.id)}
                  activeOpacity={0.8}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: COLORS.dangerSoft,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="close" size={15} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAddSpec}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: specs.length ? 14 : 0,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1.5,
                borderStyle: 'dashed',
                borderColor: COLORS.border,
                gap: 6,
              }}
            >
              <Ionicons name="add" size={16} color={COLORS.primary} />
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.primary }}>
                Add Specification
              </Text>
            </TouchableOpacity>
          </SectionCard>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sticky action bar */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 22,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleUpdate}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 16,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
            marginBottom: 10,
          }}
        >
          <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Update Product</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.back()}
            style={{
              flex: 1,
              borderWidth: 1.5,
              borderColor: COLORS.border,
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: COLORS.text }}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleDelete}
            style={{
              flex: 1,
              borderWidth: 1.5,
              borderColor: COLORS.danger,
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 6,
            }}
          >
            <Ionicons name="trash-outline" size={15} color={COLORS.danger} />
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: COLORS.danger }}>
              Delete Product
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Shared style objects
// ---------------------------------------------------------------------------
const inputText = { flex: 1, fontSize: 14.5, color: COLORS.text, paddingVertical: 0 };

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------
function SectionCard({ title, subtitle, children }) {
  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 18,
        marginTop: 16,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.text }}>{title}</Text>
      {subtitle ? (
        <Text style={{ fontSize: 11.5, color: COLORS.textMuted, marginTop: 2, marginBottom: 14 }}>
          {subtitle}
        </Text>
      ) : (
        <View style={{ height: 14 }} />
      )}
      {children}
    </View>
  );
}

function Field({ label, children, alignTop }) {
  return (
    <View>
      <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8 }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: alignTop ? 'flex-start' : 'center',
          backgroundColor: COLORS.card,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: COLORS.border,
          paddingHorizontal: 14,
          paddingVertical: 13,
        }}
      >
        {children}
      </View>
    </View>
  );
}