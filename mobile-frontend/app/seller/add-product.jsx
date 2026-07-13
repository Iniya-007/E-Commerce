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
  ActivityIndicator,
} from 'react-native';
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
  bg: '#F5F7FB',
  card: '#FFFFFF',
  border: '#E7EAF2',
  text: '#0F172A',
  textMuted: '#64748B',
  textFaint: '#9AA6B8',
};

// ---------------------------------------------------------------------------
// Backend config — replace with your real API host
// ---------------------------------------------------------------------------
const API_BASE_URL = 'https://your-api.example.com'; // TODO: point this at your backend

async function postProduct(payload) {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// Static option sets
// ---------------------------------------------------------------------------
const CATEGORIES = [
  'Fashion & Apparel',
  'Electronics',
  'Home & Living',
  'Beauty & Wellness',
  'Groceries',
  'Handmade & Crafts',
];

const COLOR_OPTIONS = [
  { name: 'Black', hex: '#111827' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Red', hex: '#EF4444' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Beige', hex: '#D9C7A5' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Mustard', hex: '#F59E0B' },
];

const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

const MATERIAL_OPTIONS = [
  'Cotton',
  'Silk',
  'Leather',
  'Wool',
  'Polyester',
  'Linen',
  'Metal',
  'Wood',
  'Other',
];

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function AddProduct() {
  const router = useRouter();

  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(null);

  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [aiSuggestedPrice, setAiSuggestedPrice] = useState(null);
  const [generatingPrice, setGeneratingPrice] = useState(false);

  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [material, setMaterial] = useState(null);
  const [customMaterial, setCustomMaterial] = useState('');

  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('g');

  const [virtualTryOn, setVirtualTryOn] = useState(false);
  const [returnPrediction, setReturnPrediction] = useState(true);

  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const numericPrice = parseFloat(price) || 0;
  const numericDiscount = parseFloat(discount) || 0;
  const finalPrice = Math.max(0, numericPrice - (numericPrice * numericDiscount) / 100);

  const toggleFromArray = (arr, setArr, value) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const handleAddImage = () => {
    if (images.length >= 6) return;
    setImages((prev) => [...prev, `img-${prev.length + 1}`]);
  };

  const handleRemoveImage = (id) => {
    setImages((prev) => prev.filter((i) => i !== id));
  };

  const handleGenerateAiPrice = () => {
    setGeneratingPrice(true);
    setAiSuggestedPrice(null);
    // Simulated AI pricing call — swap for your real pricing model / endpoint
    setTimeout(() => {
      const base = numericPrice > 0 ? numericPrice : 999;
      const marketAdjustment = 1.08 + Math.random() * 0.12;
      setAiSuggestedPrice(Math.round(base * marketAdjustment));
      setGeneratingPrice(false);
    }, 1000);
  };

  const handleGenerateSku = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSku(`AUR-${random}`);
  };

  const buildPayload = (status) => ({
    name,
    description,
    brand,
    category,
    price: numericPrice,
    aiSuggestedPrice,
    discount: numericDiscount,
    finalPrice: Number(finalPrice.toFixed(2)),
    stock: parseInt(stock, 10) || 0,
    sku,
    color: colors,
    size: sizes,
    material: material === 'Other' ? customMaterial : material,
    weight: { value: parseFloat(weight) || 0, unit: weightUnit },
    images,
    virtualTryOnEnabled: virtualTryOn,
    returnPredictionEnabled: returnPrediction,
    status, // 'draft' | 'published'
  });

  const handleSaveDraft = async () => {
    setSavingDraft(true);
    try {
      await postProduct(buildPayload('draft'));
      Alert.alert('Draft saved', 'Your product has been saved as a draft.');
    } catch (err) {
      Alert.alert('Could not save draft', err.message);
    } finally {
      setSavingDraft(false);
    }
  };

  const handlePublish = async () => {
    if (!name.trim() || !category || !price || !stock) {
      Alert.alert(
        'Missing details',
        'Add at least a product name, category, price, and stock before publishing.'
      );
      return;
    }
    setPublishing(true);
    try {
      await postProduct(buildPayload('published'));
      Alert.alert('Product published', `${name} is now live on Aureva.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Could not publish', err.message);
    } finally {
      setPublishing(false);
    }
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

        <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text }}>Add Product</Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.primarySoft,
            borderRadius: 19,
            paddingHorizontal: 12,
            height: 38,
            gap: 5,
          }}
        >
          <Ionicons name="sparkles" size={14} color={COLORS.primary} />
          <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>AI-assisted</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 130 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Images */}
          <SectionCard title="Product Images" subtitle="First photo is used as the cover">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {images.map((id, idx) => (
                <View
                  key={id}
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
                    onPress={() => handleRemoveImage(id)}
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
                placeholder="e.g. Handwoven Cotton Saree"
                placeholderTextColor={COLORS.textFaint}
                style={inputText}
              />
            </Field>

            <View style={{ height: 12 }} />
            <Field label="Description" alignTop>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the product — fabric, fit, care instructions..."
                placeholderTextColor={COLORS.textFaint}
                multiline
                numberOfLines={4}
                style={[inputText, { minHeight: 84, textAlignVertical: 'top' }]}
              />
            </Field>

            <View style={{ height: 12 }} />
            <Field label="Brand">
              <TextInput
                value={brand}
                onChangeText={setBrand}
                placeholder="e.g. Meera Handloom Co."
                placeholderTextColor={COLORS.textFaint}
                style={inputText}
              />
            </Field>
          </SectionCard>

          {/* Category */}
          <SectionCard title="Category">
            <ChipRow
              options={CATEGORIES}
              isSelected={(c) => category === c}
              onToggle={(c) => setCategory(c)}
            />
          </SectionCard>

          {/* Pricing */}
          <SectionCard title="Pricing" subtitle="Let AI benchmark your price against similar listings">
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

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleGenerateAiPrice}
              disabled={generatingPrice}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: COLORS.primarySoft,
                borderRadius: 14,
                paddingVertical: 13,
                marginTop: 16,
                gap: 8,
              }}
            >
              {generatingPrice ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Ionicons name="sparkles" size={16} color={COLORS.primary} />
              )}
              <Text style={{ fontSize: 13.5, fontWeight: '700', color: COLORS.primary }}>
                {generatingPrice ? 'Analyzing market data…' : 'Generate AI Price'}
              </Text>
            </TouchableOpacity>

            {aiSuggestedPrice !== null && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: COLORS.successSoft,
                  borderRadius: 14,
                  padding: 14,
                  marginTop: 12,
                }}
              >
                <Ionicons name="trending-up" size={18} color={COLORS.success} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 11.5, color: '#178A44', fontWeight: '600' }}>
                    AI Suggested Price
                  </Text>
                  <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.text }}>
                    ₹{aiSuggestedPrice}
                  </Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setPrice(String(aiSuggestedPrice))}
                  style={{
                    backgroundColor: COLORS.success,
                    borderRadius: 10,
                    paddingVertical: 8,
                    paddingHorizontal: 14,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#FFFFFF' }}>Apply</Text>
                </TouchableOpacity>
              </View>
            )}
          </SectionCard>

          {/* Inventory */}
          <SectionCard title="Inventory">
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
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
              </View>
              <View style={{ flex: 1.3 }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8 }}>
                  SKU
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: COLORS.card,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: COLORS.border,
                    paddingHorizontal: 14,
                    paddingVertical: 13,
                  }}
                >
                  <TextInput
                    value={sku}
                    onChangeText={setSku}
                    placeholder="AUR-000000"
                    placeholderTextColor={COLORS.textFaint}
                    autoCapitalize="characters"
                    style={[inputText, { flex: 1 }]}
                  />
                  <TouchableOpacity onPress={handleGenerateSku} activeOpacity={0.7}>
                    <Ionicons name="refresh" size={16} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SectionCard>

          {/* Variants */}
          <SectionCard title="Variants">
            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 10 }}>
              Color
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
              {COLOR_OPTIONS.map((c) => {
                const selected = colors.includes(c.name);
                return (
                  <TouchableOpacity
                    key={c.name}
                    activeOpacity={0.8}
                    onPress={() => toggleFromArray(colors, setColors, c.name)}
                    style={{ alignItems: 'center', width: 52 }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: c.hex,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: selected ? 3 : c.hex === '#FFFFFF' ? 1 : 0,
                        borderColor: selected ? COLORS.primary : COLORS.border,
                      }}
                    >
                      {selected && (
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color={c.hex === '#FFFFFF' || c.hex === '#F59E0B' ? '#111827' : '#FFFFFF'}
                        />
                      )}
                    </View>
                    <Text style={{ fontSize: 9.5, color: COLORS.textMuted, marginTop: 4 }}>{c.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 10 }}>
              Size
            </Text>
            <View style={{ marginBottom: 18 }}>
              <ChipRow
                options={SIZE_OPTIONS}
                isSelected={(s) => sizes.includes(s)}
                onToggle={(s) => toggleFromArray(sizes, setSizes, s)}
              />
            </View>

            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 10 }}>
              Material
            </Text>
            <ChipRow
              options={MATERIAL_OPTIONS}
              isSelected={(m) => material === m}
              onToggle={(m) => setMaterial(m)}
            />
            {material === 'Other' && (
              <View style={{ marginTop: 12 }}>
                <TextInput
                  value={customMaterial}
                  onChangeText={setCustomMaterial}
                  placeholder="Specify material"
                  placeholderTextColor={COLORS.textFaint}
                  style={[inputText, { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13 }]}
                />
              </View>
            )}
          </SectionCard>

          {/* Weight */}
          <SectionCard title="Shipping Weight">
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Field label="Weight">
                  <TextInput
                    value={weight}
                    onChangeText={setWeight}
                    placeholder="0"
                    placeholderTextColor={COLORS.textFaint}
                    keyboardType="decimal-pad"
                    style={inputText}
                  />
                </Field>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingBottom: 3 }}>
                {['g', 'kg'].map((u) => (
                  <TouchableOpacity
                    key={u}
                    activeOpacity={0.8}
                    onPress={() => setWeightUnit(u)}
                    style={{
                      paddingVertical: 13,
                      paddingHorizontal: 16,
                      borderRadius: 14,
                      backgroundColor: weightUnit === u ? COLORS.primary : COLORS.card,
                      borderWidth: 1,
                      borderColor: weightUnit === u ? COLORS.primary : COLORS.border,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: weightUnit === u ? '#FFFFFF' : COLORS.textMuted,
                      }}
                    >
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </SectionCard>

          {/* Smart features */}
          <SectionCard title="Smart Features" subtitle="Powered by Aureva AI">
            <ToggleRow
              icon="body-outline"
              title="Enable Virtual Try-On"
              desc="Let shoppers preview this item on themselves"
              value={virtualTryOn}
              onChange={setVirtualTryOn}
            />
            <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 12 }} />
            <ToggleRow
              icon="return-down-back-outline"
              title="Enable Return Prediction"
              desc="Flag high return-risk orders before they ship"
              value={returnPrediction}
              onChange={setReturnPrediction}
            />
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
          flexDirection: 'row',
          gap: 10,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSaveDraft}
          disabled={savingDraft || publishing}
          style={{
            flex: 1,
            borderWidth: 1.5,
            borderColor: COLORS.border,
            borderRadius: 16,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {savingDraft ? (
            <ActivityIndicator size="small" color={COLORS.textMuted} />
          ) : (
            <Ionicons name="save-outline" size={16} color={COLORS.text} />
          )}
          <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.text }}>Save Draft</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePublish}
          disabled={savingDraft || publishing}
          style={{
            flex: 1.3,
            backgroundColor: COLORS.primary,
            borderRadius: 16,
            paddingVertical: 15,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {publishing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
          )}
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Publish Product</Text>
        </TouchableOpacity>
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

function ChipRow({ options, isSelected, onToggle }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => {
        const active = isSelected(opt);
        return (
          <TouchableOpacity
            key={opt}
            activeOpacity={0.8}
            onPress={() => onToggle(opt)}
            style={{
              paddingVertical: 9,
              paddingHorizontal: 14,
              borderRadius: 20,
              backgroundColor: active ? COLORS.primary : COLORS.bg,
              borderWidth: 1,
              borderColor: active ? COLORS.primary : COLORS.border,
            }}
          >
            <Text
              style={{
                fontSize: 12.5,
                fontWeight: '600',
                color: active ? '#FFFFFF' : COLORS.textMuted,
              }}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ToggleRow({ icon, title, desc, value, onChange }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: value ? COLORS.primarySoft : COLORS.bg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={18} color={value ? COLORS.primary : COLORS.textFaint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }}>{title}</Text>
        <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{desc}</Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onChange(!value)}
        style={{
          width: 46,
          height: 27,
          borderRadius: 14,
          backgroundColor: value ? COLORS.primary : COLORS.border,
          padding: 3,
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            width: 21,
            height: 21,
            borderRadius: 11,
            backgroundColor: '#FFFFFF',
            alignSelf: value ? 'flex-end' : 'flex-start',
          }}
        />
      </TouchableOpacity>
    </View>
  );
}