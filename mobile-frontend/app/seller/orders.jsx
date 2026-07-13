import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ---------------------------------------------------------------------------
// Theme (kept consistent with the rest of the seller app)
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

// ---------------------------------------------------------------------------
// Status metadata — drives tab labels, badge colors, and icons
// ---------------------------------------------------------------------------
const STATUS_META = {
  pending: { label: 'Pending', color: COLORS.warning, soft: COLORS.warningSoft, icon: 'time-outline' },
  accepted: { label: 'Pending', color: COLORS.warning, soft: COLORS.warningSoft, icon: 'checkmark-done-outline' },
  packed: { label: 'Packed', color: COLORS.purple, soft: COLORS.purpleSoft, icon: 'cube-outline' },
  shipped: { label: 'Shipped', color: COLORS.primary, soft: COLORS.primarySoft, icon: 'car-outline' },
  delivered: { label: 'Delivered', color: COLORS.success, soft: COLORS.successSoft, icon: 'checkmark-circle-outline' },
  cancelled: { label: 'Cancelled', color: COLORS.danger, soft: COLORS.dangerSoft, icon: 'close-circle-outline' },
  returned: { label: 'Returned', color: COLORS.textMuted, soft: '#EEF1F6', icon: 'return-up-back-outline' },
};

// Tabs shown at the top of the screen (order matters)
const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'returned', label: 'Returned' },
];

// A "pending" tab includes orders the seller hasn't accepted yet, plus ones
// they've accepted but not packed yet — both live under the same tab.
const tabIncludesStatus = (tabKey, status) => {
  if (tabKey === 'pending') return status === 'pending' || status === 'accepted';
  return tabKey === status;
};

// ---------------------------------------------------------------------------
// UI-only placeholder data
// ---------------------------------------------------------------------------
// TODO: Connect to backend API — replace this with orders fetched from your
// backend (e.g. GET /api/seller/orders), grouped or filtered by status.
const INITIAL_ORDERS = [
  {
    id: 'ORD-10231',
    placedOn: 'Today, 10:42 AM',
    customer: { name: 'Ananya Rao', phone: '+91 98765 43210' },
    products: [
      { id: 'p1', name: 'Handwoven Cotton Saree', qty: 1, price: 2450 },
      { id: 'p2', name: 'Zari Border Blouse Piece', qty: 1, price: 650 },
    ],
    amount: 3100,
    paymentStatus: 'paid',
    paymentMode: 'UPI',
    address: '14 Lotus Enclave, Anna Nagar, Chennai, TN 600040',
    status: 'pending',
  },
  {
    id: 'ORD-10228',
    placedOn: 'Today, 9:05 AM',
    customer: { name: 'Vikram Shah', phone: '+91 90876 54321' },
    products: [{ id: 'p3', name: 'Kanchipuram Silk Saree', qty: 1, price: 8200 }],
    amount: 8200,
    paymentStatus: 'cod',
    paymentMode: 'Cash on Delivery',
    address: '221B Marine Drive, Bandra West, Mumbai, MH 400050',
    status: 'accepted',
  },
  {
    id: 'ORD-10219',
    placedOn: 'Yesterday, 6:18 PM',
    customer: { name: 'Priya Menon', phone: '+91 99887 66554' },
    products: [
      { id: 'p4', name: 'Block Print Cotton Kurti', qty: 2, price: 990 },
      { id: 'p5', name: 'Ikat Dupatta', qty: 1, price: 540 },
    ],
    amount: 2520,
    paymentStatus: 'paid',
    paymentMode: 'Card',
    address: '9 Palm Grove Street, Indiranagar, Bengaluru, KA 560038',
    status: 'packed',
  },
  {
    id: 'ORD-10204',
    placedOn: '2 days ago',
    customer: { name: 'Rahul Verma', phone: '+91 91234 56789' },
    products: [{ id: 'p6', name: 'Chikankari Cotton Saree', qty: 1, price: 3350 }],
    amount: 3350,
    paymentStatus: 'paid',
    paymentMode: 'UPI',
    address: '77 Sector 21, Rohini, New Delhi, DL 110085',
    status: 'shipped',
  },
  {
    id: 'ORD-10188',
    placedOn: '5 days ago',
    customer: { name: 'Fatima Sheikh', phone: '+91 90011 22334' },
    products: [
      { id: 'p7', name: 'Jamdani Saree', qty: 1, price: 4100 },
      { id: 'p8', name: 'Matching Potli Bag', qty: 1, price: 420 },
    ],
    amount: 4520,
    paymentStatus: 'paid',
    paymentMode: 'UPI',
    address: '3 Hill View Apartments, Banjara Hills, Hyderabad, TS 500034',
    status: 'delivered',
  },
  {
    id: 'ORD-10175',
    placedOn: '1 week ago',
    customer: { name: 'Karan Kapoor', phone: '+91 98122 33445' },
    products: [{ id: 'p9', name: 'Cotton Handloom Saree', qty: 1, price: 1980 }],
    amount: 1980,
    paymentStatus: 'refunded',
    paymentMode: 'Card',
    address: '56 Church Street, Fort Kochi, Kerala 682001',
    status: 'cancelled',
  },
  {
    id: 'ORD-10160',
    placedOn: '2 weeks ago',
    customer: { name: 'Divya Nair', phone: '+91 96543 21098' },
    products: [{ id: 'p10', name: 'Tussar Silk Saree', qty: 1, price: 5600 }],
    amount: 5600,
    paymentStatus: 'refunded',
    paymentMode: 'UPI',
    address: '18 Green Valley Road, Salt Lake, Kolkata, WB 700091',
    status: 'returned',
  },
];

const PAYMENT_META = {
  paid: { label: 'Paid', color: COLORS.success, soft: COLORS.successSoft },
  cod: { label: 'Cash on Delivery', color: COLORS.warning, soft: COLORS.warningSoft },
  pending: { label: 'Payment Pending', color: COLORS.danger, soft: COLORS.dangerSoft },
  refunded: { label: 'Refunded', color: COLORS.textMuted, soft: '#EEF1F6' },
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function SellerOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState('pending');

  const counts = useMemo(() => {
    const c = {};
    TABS.forEach((t) => {
      c[t.key] = orders.filter((o) => tabIncludesStatus(t.key, o.status)).length;
    });
    return c;
  }, [orders]);

  const visibleOrders = useMemo(
    () => orders.filter((o) => tabIncludesStatus(activeTab, o.status)),
    [orders, activeTab]
  );

  const updateOrderStatus = (orderId, nextStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: nextStatus } : o)));
  };

  // -------------------------------------------------------------------------
  // Placeholder action handlers — wire these up to the backend service layer
  // -------------------------------------------------------------------------
  const handleAccept = (order) => {
    // TODO: Connect to backend API — POST /api/seller/orders/:id/accept
    console.log('Accept Order', order.id);
    updateOrderStatus(order.id, 'accepted');
  };

  const handleReject = (order) => {
    Alert.alert('Reject this order?', `Order ${order.id} will be marked as cancelled.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: () => {
          // TODO: Connect to backend API — POST /api/seller/orders/:id/reject
          console.log('Reject Order', order.id);
          updateOrderStatus(order.id, 'cancelled');
        },
      },
    ]);
  };

  const handlePack = (order) => {
    // TODO: Connect to backend API — POST /api/seller/orders/:id/pack
    console.log('Pack Order', order.id);
    updateOrderStatus(order.id, 'packed');
  };

  const handleShip = (order) => {
    // TODO: Connect to backend API — POST /api/seller/orders/:id/ship
    console.log('Ship Order', order.id);
    updateOrderStatus(order.id, 'shipped');
  };

  const handleMarkDelivered = (order) => {
    // TODO: Connect to backend API — POST /api/seller/orders/:id/deliver
    console.log('Mark Delivered', order.id);
    updateOrderStatus(order.id, 'delivered');
  };

  const handleOrderDetails = (order) => {
    // TODO: Connect to backend API / navigation — push to a detailed order
    // screen, e.g. router.push(`/seller/orders/${order.id}`)
    console.log('Open Order Details', order.id);
    router.push?.(`/seller/orders/${order.id}`);
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

        <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text }}>Orders</Text>

        <View style={{ width: 38, height: 38 }} />
      </View>

      {/* Status tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const meta = STATUS_META[tab.key];
          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.85}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingHorizontal: 14,
                paddingVertical: 9,
                borderRadius: 999,
                backgroundColor: isActive ? COLORS.primary : COLORS.card,
                borderWidth: 1,
                borderColor: isActive ? COLORS.primary : COLORS.border,
              }}
            >
              <Text
                style={{
                  fontSize: 12.5,
                  fontWeight: '700',
                  color: isActive ? '#FFFFFF' : COLORS.text,
                }}
              >
                {tab.label}
              </Text>
              <View
                style={{
                  minWidth: 20,
                  height: 20,
                  paddingHorizontal: 5,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : meta.soft,
                }}
              >
                <Text
                  style={{
                    fontSize: 10.5,
                    fontWeight: '800',
                    color: isActive ? '#FFFFFF' : meta.color,
                  }}
                >
                  {counts[tab.key] ?? 0}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Order list */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30, paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
      >
        {visibleOrders.length === 0 ? (
          <EmptyState label={STATUS_META[activeTab]?.label} />
        ) : (
          visibleOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={() => handleAccept(order)}
              onReject={() => handleReject(order)}
              onPack={() => handlePack(order)}
              onShip={() => handleShip(order)}
              onMarkDelivered={() => handleMarkDelivered(order)}
              onDetails={() => handleOrderDetails(order)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Order card
// ---------------------------------------------------------------------------
function OrderCard({ order, onAccept, onReject, onPack, onShip, onMarkDelivered, onDetails }) {
  const statusMeta = STATUS_META[order.status];
  const paymentMeta = PAYMENT_META[order.paymentStatus] ?? PAYMENT_META.pending;
  const visibleProducts = order.products.slice(0, 2);
  const extraCount = order.products.length - visibleProducts.length;

  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 16,
        marginTop: 14,
      }}
    >
      {/* Top row: order id + status + date */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 13.5, fontWeight: '800', color: COLORS.text }}>{order.id}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: statusMeta.soft,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Ionicons name={statusMeta.icon} size={12} color={statusMeta.color} />
          <Text style={{ fontSize: 10.5, fontWeight: '700', color: statusMeta.color }}>
            {statusMeta.label}
          </Text>
        </View>
      </View>
      <Text style={{ fontSize: 10.5, color: COLORS.textFaint, marginTop: 2 }}>{order.placedOn}</Text>

      <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 12 }} />

      {/* Customer */}
      <InfoRow icon="person-outline">
        <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }}>{order.customer.name}</Text>
        <Text style={{ fontSize: 11.5, color: COLORS.textMuted, marginTop: 1 }}>{order.customer.phone}</Text>
      </InfoRow>

      {/* Products */}
      <InfoRow icon="pricetags-outline" style={{ marginTop: 10 }}>
        {visibleProducts.map((p) => (
          <Text key={p.id} style={{ fontSize: 12.5, color: COLORS.text, marginBottom: 2 }}>
            {p.name} <Text style={{ color: COLORS.textMuted }}>× {p.qty}</Text>
          </Text>
        ))}
        {extraCount > 0 && (
          <Text style={{ fontSize: 11.5, color: COLORS.textMuted, marginTop: 1 }}>
            +{extraCount} more item{extraCount > 1 ? 's' : ''}
          </Text>
        )}
      </InfoRow>

      {/* Amount + payment */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
        <InfoRow icon="cash-outline">
          <Text style={{ fontSize: 15, fontWeight: '800', color: COLORS.text }}>
            ₹{order.amount.toLocaleString('en-IN')}
          </Text>
        </InfoRow>
        <View
          style={{
            backgroundColor: paymentMeta.soft,
            borderRadius: 8,
            paddingHorizontal: 9,
            paddingVertical: 5,
          }}
        >
          <Text style={{ fontSize: 10.5, fontWeight: '700', color: paymentMeta.color }}>
            {paymentMeta.label}
          </Text>
        </View>
      </View>

      {/* Delivery address */}
      <InfoRow icon="location-outline" style={{ marginTop: 10 }}>
        <Text style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 17 }}>{order.address}</Text>
      </InfoRow>

      <View style={{ height: 1, backgroundColor: COLORS.border, marginVertical: 14 }} />

      {/* Action buttons */}
      <ActionButtons
        order={order}
        onAccept={onAccept}
        onReject={onReject}
        onPack={onPack}
        onShip={onShip}
        onMarkDelivered={onMarkDelivered}
      />

      {/* Order details link — always available */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onDetails}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          marginTop: 10,
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontSize: 12.5, fontWeight: '700', color: COLORS.primary }}>Order Details</Text>
        <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}

function ActionButtons({ order, onAccept, onReject, onPack, onShip, onMarkDelivered }) {
  if (order.status === 'pending') {
    return (
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onReject}
          style={{
            flex: 1,
            borderWidth: 1.5,
            borderColor: COLORS.danger,
            borderRadius: 14,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.danger }}>Reject</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onAccept}
          style={{
            flex: 1,
            backgroundColor: COLORS.primary,
            borderRadius: 14,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>Accept</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (order.status === 'accepted') {
    return (
      <PrimaryActionButton label="Pack Order" icon="cube-outline" onPress={onPack} />
    );
  }

  if (order.status === 'packed') {
    return (
      <PrimaryActionButton label="Ship Order" icon="car-outline" onPress={onShip} />
    );
  }

  if (order.status === 'shipped') {
    return (
      <PrimaryActionButton label="Mark as Delivered" icon="checkmark-circle-outline" onPress={onMarkDelivered} />
    );
  }

  // delivered / cancelled / returned — no further action, just a status note
  const note =
    order.status === 'delivered'
      ? 'Order completed'
      : order.status === 'cancelled'
      ? 'Order was cancelled'
      : 'Order was returned by customer';

  return (
    <View
      style={{
        backgroundColor: COLORS.bg,
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ fontSize: 12.5, fontWeight: '600', color: COLORS.textMuted }}>{note}</Text>
    </View>
  );
}

function PrimaryActionButton({ label, icon, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: COLORS.primary,
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
      }}
    >
      <Ionicons name={icon} size={15} color="#FFFFFF" />
      <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>{label}</Text>
    </TouchableOpacity>
  );
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------
function InfoRow({ icon, children, style }) {
  return (
    <View style={[{ flexDirection: 'row', gap: 10 }, style]}>
      <View
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          backgroundColor: COLORS.bg,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}
      >
        <Ionicons name={icon} size={13.5} color={COLORS.textMuted} />
      </View>
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}

function EmptyState({ label }) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 70,
      }}
    >
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
        <Ionicons name="receipt-outline" size={26} color={COLORS.primary} />
      </View>
      <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.text }}>
        No {label?.toLowerCase()} orders
      </Text>
      <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
        Orders will show up here once available
      </Text>
    </View>
  );
}