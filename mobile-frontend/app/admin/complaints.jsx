import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Image,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const COLORS = {
  primary: '#2563EB',
  secondary: '#60A5FA',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  background: '#F4F8FC',
  card: '#FFFFFF',
  textDark: '#0F172A',
  textMuted: '#64748B',
  border: '#E2E8F0',
};

const COMPLAINTS = [
  {
    id: 'c1',
    buyer: 'Sneha Reddy',
    seller: 'UrbanThreads Co.',
    product: 'Cotton Kurta - Blue',
    productImage: 'https://picsum.photos/seed/kurta/200/200',
    category: 'Product Quality',
    description: 'Received item has a torn seam near the sleeve and smells of chemicals.',
    date: '09 Jul 2026',
    priority: 'High',
    status: 'Open',
  },
  {
    id: 'c2',
    buyer: 'Arjun Mehta',
    seller: 'TechNest Gadgets',
    product: 'Wireless Earbuds Pro',
    productImage: 'https://picsum.photos/seed/earbuds/200/200',
    category: 'Delivery Delay',
    description: 'Order was supposed to arrive 5 days ago, tracking shows no movement.',
    date: '07 Jul 2026',
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: 'c3',
    buyer: 'Kavya Iyer',
    seller: 'GlowSkin Cosmetics',
    product: 'Vitamin C Serum',
    productImage: 'https://picsum.photos/seed/serum/200/200',
    category: 'Wrong Item',
    description: 'Ordered serum but received a different moisturizer product instead.',
    date: '05 Jul 2026',
    priority: 'Low',
    status: 'Resolved',
  },
  {
    id: 'c4',
    buyer: 'Rohit Singh',
    seller: 'HomeCraft Furniture',
    product: 'Wooden Bookshelf',
    productImage: 'https://picsum.photos/seed/shelf/200/200',
    category: 'Damaged in Transit',
    description: 'Bookshelf arrived with a broken panel and missing screws.',
    date: '01 Jul 2026',
    priority: 'High',
    status: 'Rejected',
  },
  {
    id: 'c5',
    buyer: 'Divya Prakash',
    seller: 'PetJoy Store',
    product: 'Dog Feeding Bowl Set',
    productImage: 'https://picsum.photos/seed/bowl/200/200',
    category: 'Refund Issue',
    description: 'Refund was approved 10 days ago but amount not credited yet.',
    date: '11 Jul 2026',
    priority: 'High',
    status: 'Open',
  },
];

const STATUS_META = {
  Open: { color: COLORS.primary, bg: '#EFF6FF' },
  Pending: { color: COLORS.warning, bg: '#FEF3E2' },
  Resolved: { color: COLORS.success, bg: '#E8FBF0' },
  Rejected: { color: COLORS.danger, bg: '#FDECEC' },
};

const PRIORITY_META = {
  High: { color: COLORS.danger, bg: '#FDECEC' },
  Medium: { color: COLORS.warning, bg: '#FEF3E2' },
  Low: { color: COLORS.success, bg: '#E8FBF0' },
};

export default function Complaints() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const filters = ['All', 'Open', 'Pending', 'Resolved', 'Rejected'];

  const stats = [
    {
      label: 'Open Complaints',
      value: COMPLAINTS.filter((c) => c.status === 'Open').length,
      icon: 'alert-circle-outline',
      color: COLORS.primary,
      bg: '#EFF6FF',
    },
    {
      label: 'Resolved',
      value: COMPLAINTS.filter((c) => c.status === 'Resolved').length,
      icon: 'checkmark-done-outline',
      color: COLORS.success,
      bg: '#E8FBF0',
    },
    {
      label: 'Pending',
      value: COMPLAINTS.filter((c) => c.status === 'Pending').length,
      icon: 'time-outline',
      color: COLORS.warning,
      bg: '#FEF3E2',
    },
    {
      label: 'High Priority',
      value: COMPLAINTS.filter((c) => c.priority === 'High').length,
      icon: 'flame-outline',
      color: COLORS.danger,
      bg: '#FDECEC',
    },
  ];

  const filteredComplaints = COMPLAINTS.filter((c) => {
    const matchesFilter = activeFilter === 'All' || c.status === activeFilter;
    const matchesSearch =
      c.buyer.toLowerCase().includes(search.toLowerCase()) ||
      c.seller.toLowerCase().includes(search.toLowerCase()) ||
      c.product.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openComplaint = (item) => {
    setSelectedComplaint(item);
    setModalVisible(true);
  };

  const renderComplaint = ({ item }) => {
    const statusMeta = STATUS_META[item.status];
    const priorityMeta = PRIORITY_META[item.priority];
    return (
      <View
        style={{
          backgroundColor: COLORS.card,
          borderRadius: 24,
          padding: 18,
          marginBottom: 16,
          shadowColor: '#1E293B',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 4,
          borderWidth: 1,
          borderColor: COLORS.border,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={{ uri: item.productImage }}
            style={{ width: 64, height: 64, borderRadius: 16, marginRight: 14 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.textDark }}>{item.product}</Text>
            <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
              {item.buyer} → {item.seller}
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <View
                style={{
                  backgroundColor: priorityMeta.bg,
                  paddingHorizontal: 9,
                  paddingVertical: 4,
                  borderRadius: 10,
                  marginRight: 8,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: priorityMeta.color }}>
                  {item.priority} Priority
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: statusMeta.bg,
                  paddingHorizontal: 9,
                  paddingVertical: 4,
                  borderRadius: 10,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: statusMeta.color }}>{item.status}</Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={{
            marginTop: 14,
            backgroundColor: '#F8FAFF',
            borderRadius: 16,
            padding: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <Ionicons name="pricetag-outline" size={14} color={COLORS.purple} />
            <Text style={{ marginLeft: 8, fontSize: 12, fontWeight: '700', color: COLORS.purple }}>
              {item.category}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: COLORS.textDark, lineHeight: 19 }}>{item.description}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
            <Text style={{ marginLeft: 6, fontSize: 12, color: COLORS.textMuted }}>{item.date}</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => openComplaint(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#EEF2FF',
            paddingVertical: 12,
            borderRadius: 14,
            marginTop: 12,
          }}
        >
          <Ionicons name="eye-outline" size={16} color={COLORS.primary} />
          <Text style={{ color: COLORS.primary, fontWeight: '700', marginLeft: 6, fontSize: 13 }}>
            View Complaint
          </Text>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              backgroundColor: COLORS.success,
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: 'center',
              marginRight: 6,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Resolve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              backgroundColor: COLORS.danger,
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: 'center',
              marginLeft: 6,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Reject</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              borderWidth: 1.5,
              borderColor: COLORS.secondary,
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: 'center',
              marginRight: 6,
            }}
          >
            <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 12 }}>Contact Buyer</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              borderWidth: 1.5,
              borderColor: COLORS.secondary,
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: 'center',
              marginLeft: 6,
            }}
          >
            <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 12 }}>Contact Seller</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* App Bar */}
      <View
        style={{
          paddingTop: 56,
          paddingHorizontal: 20,
          paddingBottom: 18,
          backgroundColor: COLORS.card,
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
          shadowColor: '#1E293B',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: '#FDECEC',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.danger} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.textDark }}>Customer Complaints</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: '#FDECEC',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F1F5F9',
            borderRadius: 16,
            paddingHorizontal: 14,
            marginTop: 16,
            height: 46,
          }}
        >
          <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by buyer, seller or product..."
            placeholderTextColor={COLORS.textMuted}
            style={{ flex: 1, marginLeft: 8, fontSize: 14, color: COLORS.textDark }}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
      >
        {/* Stats */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {stats.map((s) => (
            <View
              key={s.label}
              style={{
                width: '48%',
                backgroundColor: COLORS.card,
                borderRadius: 20,
                padding: 16,
                marginBottom: 14,
                shadowColor: '#1E293B',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.06,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: s.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name={s.icon} size={19} color={s.color} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.textDark }}>{s.value}</Text>
              <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {filters.map((f) => {
            const active = activeFilter === f;
            return (
              <TouchableOpacity
                key={f}
                activeOpacity={0.8}
                onPress={() => setActiveFilter(f)}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: active ? COLORS.primary : COLORS.card,
                  marginRight: 10,
                  borderWidth: active ? 0 : 1,
                  borderColor: COLORS.border,
                }}
              >
                <Text style={{ color: active ? '#fff' : COLORS.textMuted, fontWeight: '700', fontSize: 13 }}>
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filteredComplaints.length > 0 ? (
          <FlatList
            data={filteredComplaints}
            keyExtractor={(item) => item.id}
            renderItem={renderComplaint}
            scrollEnabled={false}
          />
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Ionicons name="happy-outline" size={54} color={COLORS.textMuted} />
            <Text style={{ marginTop: 12, color: COLORS.textMuted, fontSize: 14 }}>
              No complaints found for this filter.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Complaint Details Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.5)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: COLORS.card,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: 24,
              maxHeight: '85%',
            }}
          >
            <View
              style={{
                width: 48,
                height: 5,
                borderRadius: 3,
                backgroundColor: COLORS.border,
                alignSelf: 'center',
                marginBottom: 18,
              }}
            />
            {selectedComplaint && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: selectedComplaint.productImage }}
                  style={{ width: '100%', height: 180, borderRadius: 20, marginBottom: 16 }}
                />
                <Text style={{ fontSize: 19, fontWeight: '800', color: COLORS.textDark }}>
                  {selectedComplaint.product}
                </Text>
                <Text style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>
                  {selectedComplaint.buyer} vs {selectedComplaint.seller}
                </Text>

                <View style={{ flexDirection: 'row', marginTop: 12 }}>
                  <View
                    style={{
                      backgroundColor: PRIORITY_META[selectedComplaint.priority].bg,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                      marginRight: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: PRIORITY_META[selectedComplaint.priority].color,
                      }}
                    >
                      {selectedComplaint.priority} Priority
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: STATUS_META[selectedComplaint.status].bg,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 12,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: STATUS_META[selectedComplaint.status].color,
                      }}
                    >
                      {selectedComplaint.status}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    marginTop: 18,
                    backgroundColor: '#F8FAFF',
                    borderRadius: 18,
                    padding: 16,
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.purple, marginBottom: 6 }}>
                    {selectedComplaint.category}
                  </Text>
                  <Text style={{ fontSize: 14, color: COLORS.textDark, lineHeight: 21 }}>
                    {selectedComplaint.description}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setModalVisible(false)}
                  style={{
                    marginTop: 20,
                    backgroundColor: COLORS.primary,
                    paddingVertical: 14,
                    borderRadius: 16,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}