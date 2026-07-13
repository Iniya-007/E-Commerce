import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// NOTE: this screen uses `expo-linear-gradient` for the hero balance card —
// a standard Expo package. Install with: expo install expo-linear-gradient

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
// UI-only placeholder data
// ---------------------------------------------------------------------------
// TODO: Connect to backend API — replace with GET /api/seller/revenue
const REVENUE_SUMMARY = {
  today: 18420,
  weekly: 96350,
  monthly: 482650,
  yearly: 4128400,
};

const PAYMENTS_SUMMARY = {
  pending: 32800,
  completed: 449850,
  platformCommission: 48265,
  netEarnings: 434385,
};

const AVAILABLE_BALANCE = 61240;

const TRANSACTIONS = [
  { id: 'TXN-8841', orderId: 'ORD-10231', customer: 'Ananya Rao', amount: 3100, commission: 310, net: 2790, status: 'completed', date: 'Today, 10:42 AM' },
  { id: 'TXN-8836', orderId: 'ORD-10228', customer: 'Vikram Shah', amount: 8200, commission: 820, net: 7380, status: 'pending', date: 'Today, 9:05 AM' },
  { id: 'TXN-8821', orderId: 'ORD-10219', customer: 'Priya Menon', amount: 2520, commission: 252, net: 2268, status: 'completed', date: 'Yesterday, 6:18 PM' },
  { id: 'TXN-8809', orderId: 'ORD-10204', customer: 'Rahul Verma', amount: 3350, commission: 335, net: 3015, status: 'completed', date: '2 days ago' },
  { id: 'TXN-8794', orderId: 'ORD-10188', customer: 'Fatima Sheikh', amount: 4520, commission: 452, net: 4068, status: 'pending', date: '5 days ago' },
  { id: 'TXN-8770', orderId: 'ORD-10175', customer: 'Karan Kapoor', amount: 1980, commission: 198, net: 1782, status: 'completed', date: '1 week ago' },
];

const WITHDRAWALS = [
  { id: 'WD-2231', amount: 45000, bank: 'HDFC •••• 4821', status: 'completed', date: 'Jul 2, 2026' },
  { id: 'WD-2198', amount: 32000, bank: 'HDFC •••• 4821', status: 'completed', date: 'Jun 18, 2026' },
  { id: 'WD-2160', amount: 28500, bank: 'HDFC •••• 4821', status: 'processing', date: 'Jun 5, 2026' },
  { id: 'WD-2104', amount: 15000, bank: 'HDFC •••• 4821', status: 'failed', date: 'May 22, 2026' },
];

const TXN_STATUS_META = {
  completed: { label: 'Completed', color: COLORS.success, soft: COLORS.successSoft },
  pending: { label: 'Pending', color: COLORS.warning, soft: COLORS.warningSoft },
};

const WD_STATUS_META = {
  completed: { label: 'Completed', color: COLORS.success, soft: COLORS.successSoft, icon: 'checkmark-circle' },
  processing: { label: 'Processing', color: COLORS.primary, soft: COLORS.primarySoft, icon: 'time' },
  failed: { label: 'Failed', color: COLORS.danger, soft: COLORS.dangerSoft, icon: 'close-circle' },
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function SellerRevenue() {
  const router = useRouter();
  const [historyTab, setHistoryTab] = useState('transactions'); // 'transactions' | 'withdrawals'

  // -------------------------------------------------------------------------
  // Placeholder action handlers
  // -------------------------------------------------------------------------
  const handleWithdraw = () => {
    Alert.alert(
      'Withdraw funds',
      `Withdraw ${fmtINR(AVAILABLE_BALANCE)} to your registered bank account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          onPress: () => {
            // TODO: Connect to backend API — POST /api/seller/withdrawals
            console.log('Withdraw Funds', AVAILABLE_BALANCE);
          },
        },
      ]
    );
  };

  const handleDownloadStatement = () => {
    // TODO: Connect to backend API — GET /api/seller/revenue/statement
    // and trigger a file download / share sheet with the generated PDF.
    console.log('Download Statement');
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

        <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text }}>Revenue</Text>

        <TouchableOpacity
          onPress={handleDownloadStatement}
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
          <Ionicons name="download-outline" size={17} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 6 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Available balance hero */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 22, padding: 20, marginBottom: 16 }}
        >
          <Text style={{ fontSize: 12.5, fontWeight: '600', color: 'rgba(255,255,255,0.85)' }}>
            Available Balance
          </Text>
          <Text style={{ fontSize: 32, fontWeight: '800', color: '#FFFFFF', marginTop: 6 }}>
            {fmtINR(AVAILABLE_BALANCE)}
          </Text>
          <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
            Ready to withdraw to your bank account
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleWithdraw}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                backgroundColor: '#FFFFFF',
                borderRadius: 13,
                paddingVertical: 12,
              }}
            >
              <Ionicons name="arrow-up-circle-outline" size={16} color={COLORS.primary} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary }}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleDownloadStatement}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderRadius: 13,
                paddingVertical: 12,
              }}
            >
              <Ionicons name="document-text-outline" size={16} color="#FFFFFF" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#FFFFFF' }}>Statement</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Revenue by period */}
        <SectionLabel label="Revenue Overview" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 4 }}>
          <StatCard label="Today's Revenue" value={REVENUE_SUMMARY.today} icon="today-outline" color={COLORS.primary} soft={COLORS.primarySoft} />
          <StatCard label="Weekly Revenue" value={REVENUE_SUMMARY.weekly} icon="calendar-outline" color={COLORS.purple} soft={COLORS.purpleSoft} />
          <StatCard label="Monthly Revenue" value={REVENUE_SUMMARY.monthly} icon="stats-chart-outline" color={COLORS.success} soft={COLORS.successSoft} />
          <StatCard label="Yearly Revenue" value={REVENUE_SUMMARY.yearly} icon="trending-up-outline" color={COLORS.warning} soft={COLORS.warningSoft} />
        </View>

        {/* Payments & earnings */}
        <SectionLabel label="Payments & Earnings" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          <StatCard label="Pending Payments" value={PAYMENTS_SUMMARY.pending} icon="hourglass-outline" color={COLORS.warning} soft={COLORS.warningSoft} />
          <StatCard label="Completed Payments" value={PAYMENTS_SUMMARY.completed} icon="checkmark-done-outline" color={COLORS.success} soft={COLORS.successSoft} />
          <StatCard label="Platform Commission" value={PAYMENTS_SUMMARY.platformCommission} icon="pricetag-outline" color={COLORS.danger} soft={COLORS.dangerSoft} isDeduction />
          <StatCard label="Net Earnings" value={PAYMENTS_SUMMARY.netEarnings} icon="wallet-outline" color={COLORS.primary} soft={COLORS.primarySoft} />
        </View>

        {/* History tabs */}
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, marginBottom: 14 }}>
          <TabButton
            label="Transaction History"
            active={historyTab === 'transactions'}
            onPress={() => setHistoryTab('transactions')}
          />
          <TabButton
            label="Withdrawal History"
            active={historyTab === 'withdrawals'}
            onPress={() => setHistoryTab('withdrawals')}
          />
        </View>

        {historyTab === 'transactions' ? (
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
              padding: 16,
            }}
          >
            {TRANSACTIONS.map((t, idx) => (
              <TransactionRow key={t.id} txn={t} isLast={idx === TRANSACTIONS.length - 1} />
            ))}
          </View>
        ) : (
          <View
            style={{
              backgroundColor: COLORS.card,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.border,
              padding: 16,
            }}
          >
            {WITHDRAWALS.map((w, idx) => (
              <WithdrawalRow key={w.id} withdrawal={w} isLast={idx === WITHDRAWALS.length - 1} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Building blocks
// ---------------------------------------------------------------------------
function SectionLabel({ label }) {
  return (
    <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 10, marginTop: 4 }}>
      {label.toUpperCase()}
    </Text>
  );
}

function StatCard({ label, value, icon, color, soft, isDeduction }) {
  return (
    <View
      style={{
        width: '47.5%',
        backgroundColor: COLORS.card,
        borderRadius: 16,
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
          backgroundColor: soft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}
      >
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={{ fontSize: 10.5, fontWeight: '600', color: COLORS.textMuted }}>{label}</Text>
      <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.text, marginTop: 3 }}>
        {isDeduction ? '−' : ''}{fmtINR(value)}
      </Text>
    </View>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        flex: 1,
        paddingVertical: 10,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? COLORS.primary : COLORS.card,
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

function TransactionRow({ txn, isLast }) {
  const meta = TXN_STATUS_META[txn.status];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: meta.soft,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name="receipt-outline" size={17} color={meta.color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }} numberOfLines={1}>
          {txn.customer}
        </Text>
        <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>
          {txn.orderId} · {txn.date}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.text }}>{fmtINR(txn.net)}</Text>
        <View
          style={{
            backgroundColor: meta.soft,
            borderRadius: 7,
            paddingHorizontal: 7,
            paddingVertical: 2,
            marginTop: 3,
          }}
        >
          <Text style={{ fontSize: 9.5, fontWeight: '700', color: meta.color }}>{meta.label}</Text>
        </View>
      </View>
    </View>
  );
}

function WithdrawalRow({ withdrawal, isLast }) {
  const meta = WD_STATUS_META[withdrawal.status];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: meta.soft,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name={meta.icon} size={17} color={meta.color} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }}>{withdrawal.id}</Text>
        <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>
          {withdrawal.bank} · {withdrawal.date}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.text }}>
          {fmtINR(withdrawal.amount)}
        </Text>
        <View
          style={{
            backgroundColor: meta.soft,
            borderRadius: 7,
            paddingHorizontal: 7,
            paddingVertical: 2,
            marginTop: 3,
          }}
        >
          <Text style={{ fontSize: 9.5, fontWeight: '700', color: meta.color }}>{meta.label}</Text>
        </View>
      </View>
    </View>
  );
}