import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Animated,
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
// Mock data
// ---------------------------------------------------------------------------
const STATS = [
  { key: 'revenue', label: 'Total Revenue', value: '₹12,84,300', icon: 'cash-outline', tint: COLORS.primary, tintSoft: COLORS.primarySoft },
  { key: 'orders', label: 'Total Orders', value: '1,248', icon: 'receipt-outline', tint: COLORS.primary, tintSoft: COLORS.primarySoft },
  { key: 'pending', label: 'Pending Orders', value: '34', icon: 'time-outline', tint: COLORS.warning, tintSoft: COLORS.warningSoft },
  { key: 'products', label: 'Products Listed', value: '186', icon: 'cube-outline', tint: COLORS.primary, tintSoft: COLORS.primarySoft },
  { key: 'lowstock', label: 'Low Stock', value: '7', icon: 'alert-circle-outline', tint: COLORS.danger, tintSoft: COLORS.dangerSoft },
  { key: 'rating', label: 'Average Rating', value: '4.6', icon: 'star', tint: COLORS.warning, tintSoft: COLORS.warningSoft },
];

const WEEK_DATA = [
  { label: 'Mon', value: 32 },
  { label: 'Tue', value: 41 },
  { label: 'Wed', value: 28 },
  { label: 'Thu', value: 52 },
  { label: 'Fri', value: 46 },
  { label: 'Sat', value: 61 },
  { label: 'Sun', value: 48 },
];

const MONTH_DATA = [
  { label: 'Wk 1', value: 210 },
  { label: 'Wk 2', value: 268 },
  { label: 'Wk 3', value: 189 },
  { label: 'Wk 4', value: 302 },
];

const RECENT_ORDERS = [
  { id: '#AV-58231', product: 'Handwoven Cotton Saree', customer: 'R. Kavitha', amount: '₹2,450', status: 'Delivered' },
  { id: '#AV-58230', product: 'Bluetooth Neckband X2', customer: 'A. Farhan', amount: '₹899', status: 'Shipped' },
  { id: '#AV-58229', product: 'Ceramic Dinner Set (12pc)', customer: 'S. Meenakshi', amount: '₹3,199', status: 'Pending' },
  { id: '#AV-58228', product: 'Organic Turmeric 500g', customer: 'V. Prakash', amount: '₹210', status: 'Cancelled' },
  { id: '#AV-58227', product: 'Leather Laptop Sleeve', customer: 'N. Divya', amount: '₹1,150', status: 'Delivered' },
];

const STATUS_STYLES = {
  Delivered: { bg: COLORS.successSoft, fg: '#178A44' },
  Shipped: { bg: COLORS.primarySoft, fg: COLORS.primaryDark },
  Pending: { bg: COLORS.warningSoft, fg: '#8A5A0A' },
  Cancelled: { bg: COLORS.dangerSoft, fg: '#B23636' },
};

const TOP_PRODUCTS = [
  { name: 'Handwoven Cotton Saree', units: 312, revenue: '₹4,68,000', trend: 'up' },
  { name: 'Bluetooth Neckband X2', units: 268, revenue: '₹2,40,900', trend: 'up' },
  { name: 'Ceramic Dinner Set (12pc)', units: 154, revenue: '₹4,92,000', trend: 'down' },
  { name: 'Organic Turmeric 500g', units: 890, revenue: '₹1,86,900', trend: 'up' },
  { name: 'Leather Laptop Sleeve', units: 121, revenue: '₹1,39,150', trend: 'down' },
];

const LOW_STOCK = [
  { name: 'Ceramic Dinner Set (12pc)', stock: 2, threshold: 20 },
  { name: 'Bluetooth Neckband X2', stock: 5, threshold: 25 },
  { name: 'Organic Turmeric 500g', stock: 8, threshold: 30 },
  { name: 'Brass Table Lamp', stock: 4, threshold: 15 },
];

const NOTIFICATIONS = [
  { icon: 'receipt-outline', tint: COLORS.primary, tintSoft: COLORS.primarySoft, title: 'New order received', desc: 'Order #AV-58231 · ₹2,450', time: '4m ago' },
  { icon: 'alert-circle-outline', tint: COLORS.danger, tintSoft: COLORS.dangerSoft, title: 'Low stock alert', desc: 'Ceramic Dinner Set has 2 units left', time: '32m ago' },
  { icon: 'star', tint: COLORS.warning, tintSoft: COLORS.warningSoft, title: 'New review · 5 stars', desc: '"Fast shipping, great quality!"', time: '1h ago' },
  { icon: 'card-outline', tint: COLORS.success, tintSoft: COLORS.successSoft, title: 'Payout processed', desc: '₹38,200 sent to your bank account', time: '3h ago' },
  { icon: 'megaphone-outline', tint: COLORS.primary, tintSoft: COLORS.primarySoft, title: 'Seller tip', desc: 'Add more photos to boost conversions', time: '1d ago' },
];

const NAV_ITEMS = [
  {
    key: "Dashboard",
    icon: "grid-outline",
    route: "/seller/dashboard",
  },
  {
    key: "Products",
    icon: "cube-outline",
    route: "/seller/products",
  },
  {
    key: "Orders",
    icon: "receipt-outline",
    route: "/seller/orders",
  },
  {
    key: "Analytics",
    icon: "bar-chart-outline",
    route: "/seller/analytics",
  },
  {
    key: "Settings",
    icon: "settings-outline",
    route: "/seller/settings",
  },
];

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function SellerDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [notifOpen, setNotifOpen] = useState(false);
  const [range, setRange] = useState('7D');

  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.6, duration: 750, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 750, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const chartData = range === '7D' ? WEEK_DATA : MONTH_DATA;
  const maxVal = Math.max(...chartData.map((d) => d.value));

  const handleNav = (item) => {
    setActiveTab(item.key);
    if (item.key !== 'Dashboard') {
      router.push(item.route);
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
          paddingBottom: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: COLORS.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 16 }}>M</Text>
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.text }}>
              Meera Handloom Co.
            </Text>
            <Text style={{ fontSize: 11.5, color: COLORS.textMuted }}>Seller Dashboard</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: COLORS.card,
              borderWidth: 1,
              borderColor: COLORS.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setNotifOpen(true)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              backgroundColor: COLORS.card,
              borderWidth: 1,
              borderColor: COLORS.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="notifications-outline" size={18} color={COLORS.textMuted} />
            <View
              style={{
                position: 'absolute',
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: COLORS.danger,
                borderWidth: 1.5,
                borderColor: COLORS.card,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero: Today's Sales */}
        <View
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 24,
            padding: 22,
            marginTop: 6,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Animated.View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: COLORS.success,
                marginRight: 6,
                transform: [{ scale: pulse }],
              }}
            />
            <Text style={{ fontSize: 10.5, fontWeight: '700', color: 'rgba(255,255,255,0.8)', letterSpacing: 1 }}>
              LIVE · TODAY
            </Text>
          </View>

          <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 4 }}>
            Today's Sales
          </Text>
          <Text style={{ fontSize: 34, fontWeight: '800', color: '#FFFFFF', marginBottom: 10 }}>
            ₹48,650
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(34,197,94,0.22)',
                borderRadius: 20,
                paddingVertical: 4,
                paddingHorizontal: 10,
                marginRight: 8,
              }}
            >
              <Ionicons name="trending-up" size={13} color={COLORS.success} />
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: COLORS.success, marginLeft: 4 }}>
                +18.4%
              </Text>
            </View>
            <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.7)' }}>vs. yesterday · 218 orders</Text>
          </View>

          {/* mini sparkline bars */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 34, gap: 5 }}>
            {WEEK_DATA.map((d, i) => (
              <View
                key={d.label}
                style={{
                  flex: 1,
                  height: `${(d.value / 61) * 100}%`,
                  borderRadius: 4,
                  backgroundColor: i === WEEK_DATA.length - 1 ? '#FFFFFF' : 'rgba(255,255,255,0.35)',
                }}
              />
            ))}
          </View>
        </View>

        {/* Stats grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 }}>
          {STATS.map((s) => (
            <View
              key={s.key}
              style={{
                width: '48%',
                backgroundColor: COLORS.card,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: COLORS.border,
                padding: 14,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: s.tintSoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name={s.icon} size={16} color={s.tint} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.text }}>{s.value}</Text>
              <Text style={{ fontSize: 11.5, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.text, marginTop: 22, marginBottom: 12 }}>
          Quick Actions
        </Text>
        <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{ gap: 10 }}
>

  <TouchableOpacity
    activeOpacity={0.85}
    onPress={() => router.push("/seller/add-product")}
    style={{
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: COLORS.primary,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 16,
      gap: 8,
    }}
  >
    <Ionicons name="add-circle" size={18} color="#FFFFFF" />
    <Text
      style={{
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 13,
      }}
    >
      Add Product
    </Text>
  </TouchableOpacity>

  <QuickAction
    icon="cube-outline"
    label="My Products"
    onPress={() => router.push("/seller/products")}
  />

  <QuickAction
    icon="receipt-outline"
    label="Orders"
    onPress={() => router.push("/seller/orders")}
  />

  <QuickAction
    icon="bar-chart-outline"
    label="Analytics"
    onPress={() => router.push("/seller/analytics")}
  />

  <QuickAction
    icon="cash-outline"
    label="Revenue"
    onPress={() => router.push("/seller/revenue")}
  />

  <QuickAction
    icon="settings-outline"
    label="Settings"
    onPress={() => router.push("/seller/settings")}
  />

</ScrollView>

        {/* Revenue */}
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 18,
            marginTop: 22,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.text }}>Revenue</Text>
            <View style={{ flexDirection: 'row', backgroundColor: COLORS.bg, borderRadius: 12, padding: 3 }}>
              {['7D', '30D'].map((r) => (
                <TouchableOpacity
                  key={r}
                  activeOpacity={0.8}
                  onPress={() => setRange(r)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    borderRadius: 10,
                    backgroundColor: range === r ? COLORS.card : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11.5,
                      fontWeight: '700',
                      color: range === r ? COLORS.primary : COLORS.textFaint,
                    }}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 110, gap: 8 }}>
            {chartData.map((d) => (
              <View key={d.label} style={{ flex: 1, alignItems: 'center' }}>
                <View
                  style={{
                    width: '100%',
                    height: `${(d.value / maxVal) * 100}%`,
                    borderRadius: 8,
                    backgroundColor: COLORS.primarySoft,
                  }}
                >
                  <View
                    style={{
                      width: '100%',
                      height: '55%',
                      borderRadius: 8,
                      backgroundColor: COLORS.primary,
                      position: 'absolute',
                      bottom: 0,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
            {chartData.map((d) => (
              <Text
                key={d.label}
                style={{ flex: 1, fontSize: 10.5, color: COLORS.textFaint, textAlign: 'center' }}
              >
                {d.label}
              </Text>
            ))}
          </View>
        </View>

        {/* Recent Orders */}
        <Card title="Recent Orders" onViewAll={() => router.push('/seller/orders')}>
          {RECENT_ORDERS.slice(0, 4).map((o, idx) => (
            <View
              key={o.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderTopWidth: idx === 0 ? 0 : 1,
                borderTopColor: COLORS.border,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }} numberOfLines={1}>
                  {o.product}
                </Text>
                <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                  {o.id} · {o.customer}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 5 }}>
                  {o.amount}
                </Text>
                <View
                  style={{
                    paddingVertical: 3,
                    paddingHorizontal: 9,
                    borderRadius: 20,
                    backgroundColor: STATUS_STYLES[o.status].bg,
                  }}
                >
                  <Text style={{ fontSize: 10, fontWeight: '700', color: STATUS_STYLES[o.status].fg }}>
                    {o.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        {/* Top Selling Products */}
        <Card title="Top Selling Products" onViewAll={() => router.push('/seller/analytics')}>
          {TOP_PRODUCTS.slice(0, 4).map((p, idx) => (
            <View
              key={p.name}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                borderTopWidth: idx === 0 ? 0 : 1,
                borderTopColor: COLORS.border,
              }}
            >
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  backgroundColor: COLORS.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.textMuted }}>
                  {idx + 1}
                </Text>
              </View>
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: COLORS.primarySoft,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.primary }}>
                  {p.name.charAt(0)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.text }} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                  {p.units} units · {p.revenue}
                </Text>
              </View>
              <Ionicons
                name={p.trend === 'up' ? 'trending-up' : 'trending-down'}
                size={16}
                color={p.trend === 'up' ? COLORS.success : COLORS.danger}
              />
            </View>
          ))}
        </Card>

        {/* Low Stock Products */}
        <Card title="Low Stock Products" icon="alert-circle-outline" iconTint={COLORS.danger}>
          {LOW_STOCK.map((p, idx) => {
            const pct = Math.min(100, Math.round((p.stock / p.threshold) * 100));
            const critical = p.stock <= 3;
            return (
              <View
                key={p.name}
                style={{
                  paddingVertical: 12,
                  borderTopWidth: idx === 0 ? 0 : 1,
                  borderTopColor: COLORS.border,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.text, flex: 1 }} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 11.5,
                      fontWeight: '700',
                      color: critical ? COLORS.danger : COLORS.warning,
                    }}
                  >
                    {p.stock} left
                  </Text>
                </View>
                <View style={{ height: 6, backgroundColor: COLORS.bg, borderRadius: 4, overflow: 'hidden' }}>
                  <View
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      backgroundColor: critical ? COLORS.danger : COLORS.warning,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </Card>
      </ScrollView>

      {/* Notification panel */}
      <Modal
        visible={notifOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setNotifOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setNotifOpen(false)}
          style={{ flex: 1, backgroundColor: 'rgba(15,23,42,0.4)', justifyContent: 'flex-start' }}
        >
          <View
            onStartShouldSetResponder={() => true}
            style={{
              marginTop: 70,
              marginHorizontal: 16,
              backgroundColor: COLORS.card,
              borderRadius: 20,
              padding: 16,
              maxHeight: '70%',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.text }}>Notifications</Text>
              <TouchableOpacity onPress={() => setNotifOpen(false)} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {NOTIFICATIONS.map((n, idx) => (
                <View
                  key={n.title + idx}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    paddingVertical: 10,
                    borderTopWidth: idx === 0 ? 0 : 1,
                    borderTopColor: COLORS.border,
                  }}
                >
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 11,
                      backgroundColor: n.tintSoft,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                  >
                    <Ionicons name={n.icon} size={16} color={n.tint} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.text }}>
                      {n.title}
                    </Text>
                    <Text style={{ fontSize: 11.5, color: COLORS.textMuted, marginTop: 2 }}>
                      {n.desc}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 10.5, color: COLORS.textFaint, marginLeft: 8 }}>
                    {n.time}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom navigation */}
      <View
        style={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          backgroundColor: COLORS.card,
          borderRadius: 22,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'space-around',
          shadowColor: '#0F172A',
          shadowOpacity: 0.12,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = activeTab === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.7}
              onPress={() => handleNav(item)}
              style={{ alignItems: 'center', paddingVertical: 4, paddingHorizontal: 8 }}
            >
              <Ionicons
                name={item.icon}
                size={21}
                color={active ? COLORS.primary : COLORS.textFaint}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: '700',
                  marginTop: 3,
                  color: active ? COLORS.primary : COLORS.textFaint,
                }}
              >
                {item.key}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------
function QuickAction({ icon, label, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 8,
      }}
    >
      <Ionicons name={icon} size={17} color={COLORS.text} />
      <Text style={{ color: COLORS.text, fontWeight: '700', fontSize: 13 }}>{label}</Text>
    </TouchableOpacity>
  );
}

function Card({ title, icon, iconTint, onViewAll, children }) {
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {icon ? <Ionicons name={icon} size={16} color={iconTint || COLORS.text} /> : null}
          <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.text }}>{title}</Text>
        </View>
        {onViewAll ? (
          <TouchableOpacity activeOpacity={0.7} onPress={onViewAll}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.primary }}>View all</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {children}
    </View>
  );
}