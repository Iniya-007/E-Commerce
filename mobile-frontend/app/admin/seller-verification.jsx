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

const SELLERS = [
  {
    id: 's1',
    storeName: 'UrbanThreads Co.',
    ownerName: 'Ravi Kumar',
    businessName: 'Urban Threads Pvt Ltd',
    phone: '+91 98765 43210',
    email: 'ravi@urbanthreads.com',
    appliedDate: '05 Jul 2026',
    status: 'Pending',
    logo: 'https://i.pravatar.cc/150?img=12',
    documents: ['Aadhaar', 'PAN', 'GST', 'Business Certificate'],
  },
  {
    id: 's2',
    storeName: 'GlowSkin Cosmetics',
    ownerName: 'Anita Sharma',
    businessName: 'GlowSkin Beauty LLP',
    phone: '+91 91234 56780',
    email: 'anita@glowskin.in',
    appliedDate: '03 Jul 2026',
    status: 'Approved',
    logo: 'https://i.pravatar.cc/150?img=32',
    documents: ['Aadhaar', 'PAN', 'GST', 'Business Certificate'],
  },
  {
    id: 's3',
    storeName: 'TechNest Gadgets',
    ownerName: 'Mohammed Faisal',
    businessName: 'TechNest Electronics',
    phone: '+91 99887 66554',
    email: 'faisal@technest.com',
    appliedDate: '02 Jul 2026',
    status: 'Rejected',
    logo: 'https://i.pravatar.cc/150?img=51',
    documents: ['Aadhaar', 'PAN', 'GST'],
  },
  {
    id: 's4',
    storeName: 'HomeCraft Furniture',
    ownerName: 'Priya Nair',
    businessName: 'HomeCraft Interiors',
    phone: '+91 90000 11223',
    email: 'priya@homecraft.in',
    appliedDate: '11 Jul 2026',
    status: 'Pending',
    logo: 'https://i.pravatar.cc/150?img=45',
    documents: ['Aadhaar', 'PAN', 'GST', 'Business Certificate'],
  },
  {
    id: 's5',
    storeName: 'PetJoy Store',
    ownerName: 'Karthik Iyer',
    businessName: 'PetJoy Retail',
    phone: '+91 98123 45670',
    email: 'karthik@petjoy.com',
    appliedDate: '10 Jul 2026',
    status: 'Approved',
    logo: 'https://i.pravatar.cc/150?img=15',
    documents: ['Aadhaar', 'PAN', 'GST', 'Business Certificate'],
  },
];

const STATUS_META = {
  Pending: { color: COLORS.warning, bg: '#FEF3E2', icon: 'time-outline' },
  Approved: { color: COLORS.success, bg: '#E8FBF0', icon: 'checkmark-circle-outline' },
  Rejected: { color: COLORS.danger, bg: '#FDECEC', icon: 'close-circle-outline' },
};

export default function SellerVerification() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const filters = ['All', 'Pending', 'Approved', 'Rejected'];

  const stats = [
    {
      label: 'Pending Requests',
      value: SELLERS.filter((s) => s.status === 'Pending').length,
      icon: 'time-outline',
      color: COLORS.warning,
      bg: '#FEF3E2',
    },
    {
      label: 'Approved Sellers',
      value: SELLERS.filter((s) => s.status === 'Approved').length,
      icon: 'checkmark-done-outline',
      color: COLORS.success,
      bg: '#E8FBF0',
    },
    {
      label: 'Rejected Sellers',
      value: SELLERS.filter((s) => s.status === 'Rejected').length,
      icon: 'close-circle-outline',
      color: COLORS.danger,
      bg: '#FDECEC',
    },
    {
      label: "Today's Applications",
      value: 2,
      icon: 'calendar-outline',
      color: COLORS.purple,
      bg: '#F1EBFC',
    },
  ];

  const filteredSellers = SELLERS.filter((s) => {
    const matchesFilter = activeFilter === 'All' || s.status === activeFilter;
    const matchesSearch =
      s.storeName.toLowerCase().includes(search.toLowerCase()) ||
      s.ownerName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const openDocuments = (seller) => {
    setSelectedSeller(seller);
    setModalVisible(true);
  };

  const renderSeller = ({ item }) => {
    const meta = STATUS_META[item.status];
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: item.logo }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              marginRight: 14,
              borderWidth: 2,
              borderColor: COLORS.secondary,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: '800', color: COLORS.textDark }}>
              {item.storeName}
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 2 }}>
              {item.ownerName} • {item.businessName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: meta.bg,
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 14,
            }}
          >
            <Ionicons name={meta.icon} size={14} color={meta.color} />
            <Text style={{ color: meta.color, fontSize: 12, fontWeight: '700', marginLeft: 4 }}>
              {item.status}
            </Text>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="call-outline" size={15} color={COLORS.primary} />
            <Text style={{ marginLeft: 8, color: COLORS.textDark, fontSize: 13 }}>{item.phone}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="mail-outline" size={15} color={COLORS.primary} />
            <Text style={{ marginLeft: 8, color: COLORS.textDark, fontSize: 13 }}>{item.email}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" size={15} color={COLORS.primary} />
            <Text style={{ marginLeft: 8, color: COLORS.textDark, fontSize: 13 }}>
              Applied on {item.appliedDate}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 12 }}>
          {item.documents.map((doc) => (
            <View
              key={doc}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#EFF6FF',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 12,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Ionicons name="document-text-outline" size={12} color={COLORS.primary} />
              <Text style={{ fontSize: 11, color: COLORS.primary, marginLeft: 4, fontWeight: '600' }}>
                {doc}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => openDocuments(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#EEF2FF',
            paddingVertical: 12,
            borderRadius: 14,
            marginTop: 6,
          }}
        >
          <Ionicons name="folder-open-outline" size={16} color={COLORS.primary} />
          <Text style={{ color: COLORS.primary, fontWeight: '700', marginLeft: 6, fontSize: 13 }}>
            View Documents
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
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              flex: 1,
              backgroundColor: COLORS.danger,
              paddingVertical: 12,
              borderRadius: 14,
              alignItems: 'center',
              marginHorizontal: 6,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>Reject</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            marginTop: 8,
            borderWidth: 1.5,
            borderColor: COLORS.secondary,
            paddingVertical: 12,
            borderRadius: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: COLORS.primary, fontWeight: '700', fontSize: 13 }}>
            Request More Information
          </Text>
        </TouchableOpacity>
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
              backgroundColor: '#EFF6FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.textDark }}>
            Seller Verification
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: '#EFF6FF',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 6 }}>
          Review and verify seller applications.
        </Text>

        {/* Search */}
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
            placeholder="Search sellers by name or store..."
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

        {/* Seller list */}
        {filteredSellers.length > 0 ? (
          <FlatList
            data={filteredSellers}
            keyExtractor={(item) => item.id}
            renderItem={renderSeller}
            scrollEnabled={false}
          />
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Ionicons name="file-tray-outline" size={54} color={COLORS.textMuted} />
            <Text style={{ marginTop: 12, color: COLORS.textMuted, fontSize: 14 }}>
              No sellers found for this filter.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          position: 'absolute',
          right: 22,
          bottom: 30,
          width: 58,
          height: 58,
          borderRadius: 20,
          backgroundColor: COLORS.primary,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Documents Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.card,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: 24,
              maxHeight: '80%',
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
            {selectedSeller && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                  <Image
                    source={{ uri: selectedSeller.logo }}
                    style={{ width: 64, height: 64, borderRadius: 20, marginRight: 14 }}
                  />
                  <View>
                    <Text style={{ fontSize: 19, fontWeight: '800', color: COLORS.textDark }}>
                      {selectedSeller.storeName}
                    </Text>
                    <Text style={{ fontSize: 13, color: COLORS.textMuted }}>
                      {selectedSeller.businessName}
                    </Text>
                  </View>
                </View>

                <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.textDark, marginBottom: 10 }}>
                  Uploaded Documents
                </Text>
                {selectedSeller.documents.map((doc) => (
                  <View
                    key={doc}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#F8FAFF',
                      padding: 14,
                      borderRadius: 16,
                      marginBottom: 10,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          backgroundColor: '#EFF6FF',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 12,
                        }}
                      >
                        <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.textDark }}>{doc}</Text>
                    </View>
                    <Ionicons name="eye-outline" size={20} color={COLORS.textMuted} />
                  </View>
                ))}

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setModalVisible(false)}
                  style={{
                    marginTop: 12,
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