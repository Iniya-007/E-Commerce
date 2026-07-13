import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path,
  Line as SvgLine,
  Circle,
  Rect,
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';

// NOTE: this screen uses `expo-linear-gradient` and `react-native-svg` for
// the hero card and charts. Both are standard Expo packages — install with:
//   expo install expo-linear-gradient react-native-svg

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
  teal: '#0EA5A4',
  tealSoft: '#E3F8F7',
  bg: '#F5F7FB',
  card: '#FFFFFF',
  border: '#E7EAF2',
  text: '#0F172A',
  textMuted: '#64748B',
  textFaint: '#9AA6B8',
};

const fmtINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`;
const fmtCompact = (n) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};

// ---------------------------------------------------------------------------
// UI-only placeholder data
// ---------------------------------------------------------------------------
// TODO: Connect to backend API — replace every block below with data from
// your analytics endpoints (e.g. GET /api/seller/analytics?range=week).
const PERIODS = ['Today', 'Week', 'Month', 'Year'];

const HEADLINE_BY_PERIOD = {
  Today: { label: "Today's Sales", value: 18420, change: 12.4 },
  Week: { label: "This Week's Sales", value: 96350, change: 9.8 },
  Month: { label: 'Monthly Sales', value: 482650, change: 8.1 },
  Year: { label: "This Year's Sales", value: 4128400, change: 21.3 },
};

const STATS = [
  { key: 'monthlySales', label: 'Monthly Sales', value: 482650, change: 8.1, icon: 'bar-chart-outline', color: COLORS.primary, soft: COLORS.primarySoft },
  { key: 'revenue', label: 'Revenue', value: 412300, change: 9.6, icon: 'wallet-outline', color: COLORS.success, soft: COLORS.successSoft },
  { key: 'orders', label: 'Orders', value: 356, change: 15.0, icon: 'receipt-outline', color: COLORS.purple, soft: COLORS.purpleSoft, isCount: true },
  { key: 'visitors', label: 'Visitors', value: 12480, change: 6.2, icon: 'people-outline', color: COLORS.teal, soft: COLORS.tealSoft, isCount: true },
  { key: 'productViews', label: 'Product Views', value: 34920, change: 11.8, icon: 'eye-outline', color: COLORS.warning, soft: COLORS.warningSoft, isCount: true },
  { key: 'bestCategory', label: 'Best Category', value: 'Sarees', change: 42, icon: 'ribbon-outline', color: COLORS.danger, soft: COLORS.dangerSoft, isCategory: true },
];

const WEEKLY_SALES = [
  { label: 'Mon', value: 9200 },
  { label: 'Tue', value: 14800 },
  { label: 'Wed', value: 11200 },
  { label: 'Thu', value: 18600 },
  { label: 'Fri', value: 16200 },
  { label: 'Sat', value: 24500 },
  { label: 'Sun', value: 19300 },
];

const MONTHLY_REVENUE = [
  { label: 'Feb', value: 268000 },
  { label: 'Mar', value: 301500 },
  { label: 'Apr', value: 289000 },
  { label: 'May', value: 342000 },
  { label: 'Jun', value: 378500 },
  { label: 'Jul', value: 412300 },
];

const CUSTOMER_GROWTH = [
  { label: 'Feb', newC: 120, returning: 240 },
  { label: 'Mar', newC: 148, returning: 268 },
  { label: 'Apr', newC: 132, returning: 291 },
  { label: 'May', newC: 176, returning: 318 },
  { label: 'Jun', newC: 205, returning: 346 },
  { label: 'Jul', newC: 231, returning: 382 },
];

const PRODUCT_PERFORMANCE = [
  { id: 'p1', name: 'Handwoven Cotton Saree', revenue: 128400 },
  { id: 'p2', name: 'Kanchipuram Silk Saree', revenue: 96200 },
  { id: 'p3', name: 'Block Print Cotton Kurti', revenue: 71800 },
  { id: 'p4', name: 'Chikankari Cotton Saree', revenue: 58500 },
  { id: 'p5', name: 'Jamdani Saree', revenue: 41200 },
];

const TOP_PRODUCTS = [
  { id: 'p1', name: 'Handwoven Cotton Saree', unitsSold: 214, revenue: 128400, growth: 18.2 },
  { id: 'p2', name: 'Kanchipuram Silk Saree', unitsSold: 96, revenue: 96200, growth: 12.6 },
  { id: 'p3', name: 'Block Print Cotton Kurti', unitsSold: 182, revenue: 71800, growth: -4.1 },
  { id: 'p4', name: 'Chikankari Cotton Saree', unitsSold: 87, revenue: 58500, growth: 6.8 },
  { id: 'p5', name: 'Jamdani Saree', unitsSold: 41, revenue: 41200, growth: 22.9 },
];

const AI_INSIGHTS = {
  bestSeller: {
    product: 'Handwoven Cotton Saree',
    text:
      'This product is your strongest performer this month, contributing 26% of total revenue with a steady week-over-week climb. Stock levels are on track to run low within 9 days at the current sell-through rate.',
    tag: 'Top Performer',
  },
  demandForecast: {
    text:
      'Demand for cotton sarees is projected to rise about 18% over the next two weeks, driven by seasonal buying patterns. Consider increasing inventory for your top 3 SKUs to avoid stockouts.',
    tag: 'Next 14 Days',
    trend: [12, 15, 14, 18, 22, 26, 31],
  },
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function SellerAnalytics() {
  const router = useRouter();
  const [period, setPeriod] = useState('Week');
  const headline = HEADLINE_BY_PERIOD[period];

  const handleExport = () => {
    // TODO: Connect to backend API — generate/download an analytics report
    console.log('Export Analytics Report');
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

        <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.text }}>Analytics</Text>

        <TouchableOpacity
          onPress={handleExport}
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
        {/* Period selector */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {PERIODS.map((p) => {
            const isActive = p === period;
            return (
              <TouchableOpacity
                key={p}
                activeOpacity={0.85}
                onPress={() => setPeriod(p)}
                style={{
                  flex: 1,
                  paddingVertical: 9,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isActive ? COLORS.primary : COLORS.card,
                  borderWidth: 1,
                  borderColor: isActive ? COLORS.primary : COLORS.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 12.5,
                    fontWeight: '700',
                    color: isActive ? '#FFFFFF' : COLORS.textMuted,
                  }}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Hero headline card */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 22, padding: 20, marginBottom: 14 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12.5, fontWeight: '600', color: 'rgba(255,255,255,0.85)' }}>
              {headline.label}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 3,
                backgroundColor: 'rgba(255,255,255,0.18)',
                borderRadius: 8,
                paddingHorizontal: 8,
                paddingVertical: 4,
              }}
            >
              <Ionicons name="trending-up" size={12} color="#FFFFFF" />
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFFFFF' }}>
                +{headline.change}%
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 30, fontWeight: '800', color: '#FFFFFF', marginTop: 8 }}>
            {fmtINR(headline.value)}
          </Text>
          <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', marginTop: 4 }}>
            Compared to the previous {period.toLowerCase()}
          </Text>
        </LinearGradient>

        {/* Stat grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
          {STATS.map((s) => (
            <StatCard key={s.key} stat={s} />
          ))}
        </View>

        {/* Weekly Sales chart */}
        <ChartCard
          title="Weekly Sales"
          subtitle="Revenue by day, this week"
          icon="bar-chart-outline"
          badge={`${fmtCompact(WEEKLY_SALES.reduce((a, b) => a + b.value, 0))} total`}
        >
          <BarChart data={WEEKLY_SALES} color={COLORS.primary} />
        </ChartCard>

        {/* Monthly Revenue chart */}
        <ChartCard
          title="Monthly Revenue"
          subtitle="Last 6 months"
          icon="trending-up-outline"
          badge="+9.6% vs last month"
          badgeTone="success"
        >
          <AreaChart data={MONTHLY_REVENUE} color={COLORS.success} />
        </ChartCard>

        {/* Product Performance chart */}
        <ChartCard title="Product Performance" subtitle="Revenue by top product" icon="albums-outline">
          <ProductPerformanceChart data={PRODUCT_PERFORMANCE} />
        </ChartCard>

        {/* Customer Growth chart */}
        <ChartCard
          title="Customer Growth"
          subtitle="New vs. returning customers"
          icon="people-circle-outline"
        >
          <CustomerGrowthChart data={CUSTOMER_GROWTH} />
          <View style={{ flexDirection: 'row', gap: 18, marginTop: 12, justifyContent: 'center' }}>
            <LegendDot color={COLORS.primary} label="New customers" />
            <LegendDot color={COLORS.purple} label="Returning customers" />
          </View>
        </ChartCard>

        {/* Top Products list */}
        <SectionHeader title="Top Products" subtitle="Ranked by revenue this month" />
        <View
          style={{
            backgroundColor: COLORS.card,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 16,
            marginBottom: 20,
          }}
        >
          {TOP_PRODUCTS.map((p, idx) => (
            <TopProductRow key={p.id} product={p} rank={idx + 1} isLast={idx === TOP_PRODUCTS.length - 1} />
          ))}
        </View>

        {/* AI Insights */}
        <SectionHeader title="AI Insights" subtitle="Generated from your store's recent activity" />

        <AIInsightCard
          icon="star"
          tag={AI_INSIGHTS.bestSeller.tag}
          title="Best Selling Product"
          highlight={AI_INSIGHTS.bestSeller.product}
          text={AI_INSIGHTS.bestSeller.text}
          gradient={[COLORS.purple, '#6D28D9']}
        />

        <AIInsightCard
          icon="pulse"
          tag={AI_INSIGHTS.demandForecast.tag}
          title="Demand Forecast"
          text={AI_INSIGHTS.demandForecast.text}
          gradient={[COLORS.teal, '#0B7A79']}
          trend={AI_INSIGHTS.demandForecast.trend}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------
function StatCard({ stat }) {
  const isPositive = stat.change >= 0;
  const width = '31%';

  return (
    <View
      style={{
        width,
        backgroundColor: COLORS.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 12,
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 9,
          backgroundColor: stat.soft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 8,
        }}
      >
        <Ionicons name={stat.icon} size={15} color={stat.color} />
      </View>
      <Text style={{ fontSize: 10.5, fontWeight: '600', color: COLORS.textMuted }} numberOfLines={1}>
        {stat.label}
      </Text>
      <Text style={{ fontSize: 14.5, fontWeight: '800', color: COLORS.text, marginTop: 3 }} numberOfLines={1}>
        {stat.isCategory
          ? stat.value
          : stat.isCount
          ? Number(stat.value).toLocaleString('en-IN')
          : fmtCompact(stat.value)}
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4 }}>
        <Ionicons
          name={stat.isCategory ? 'ribbon-outline' : isPositive ? 'arrow-up' : 'arrow-down'}
          size={10}
          color={stat.isCategory ? COLORS.danger : isPositive ? COLORS.success : COLORS.danger}
        />
        <Text
          style={{
            fontSize: 10,
            fontWeight: '700',
            color: stat.isCategory ? COLORS.danger : isPositive ? COLORS.success : COLORS.danger,
          }}
        >
          {stat.isCategory ? `${stat.change}% share` : `${isPositive ? '+' : ''}${stat.change}%`}
        </Text>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section header + chart card shell
// ---------------------------------------------------------------------------
function SectionHeader({ title, subtitle }) {
  return (
    <View style={{ marginTop: 8, marginBottom: 12 }}>
      <Text style={{ fontSize: 15.5, fontWeight: '800', color: COLORS.text }}>{title}</Text>
      {subtitle ? (
        <Text style={{ fontSize: 11.5, color: COLORS.textMuted, marginTop: 2 }}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

function ChartCard({ title, subtitle, icon, badge, badgeTone = 'primary', children }) {
  const badgeColor = badgeTone === 'success' ? COLORS.success : COLORS.primary;
  const badgeSoft = badgeTone === 'success' ? COLORS.successSoft : COLORS.primarySoft;

  return (
    <View
      style={{
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 18,
        marginTop: 14,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              backgroundColor: COLORS.primarySoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name={icon} size={15} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '800', color: COLORS.text }}>{title}</Text>
            {subtitle ? (
              <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>{subtitle}</Text>
            ) : null}
          </View>
        </View>

        {badge ? (
          <View
            style={{
              backgroundColor: badgeSoft,
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '700', color: badgeColor }}>{badge}</Text>
          </View>
        ) : null}
      </View>

      <View style={{ marginTop: 16 }}>{children}</View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Charts (built with react-native-svg — no external chart library required)
// ---------------------------------------------------------------------------
const CHART_WIDTH = 300;
const CHART_HEIGHT = 150;
const CHART_PADDING = 24;

function BarChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.value)) * 1.15;
  const innerWidth = CHART_WIDTH - CHART_PADDING;
  const innerHeight = CHART_HEIGHT - 30;
  const barSlot = innerWidth / data.length;
  const barWidth = barSlot * 0.5;

  return (
    <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
      <Defs>
        <SvgLinearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="1" />
          <Stop offset="1" stopColor={color} stopOpacity="0.55" />
        </SvgLinearGradient>
      </Defs>

      {[0.25, 0.5, 0.75].map((f) => (
        <SvgLine
          key={f}
          x1={0}
          x2={CHART_WIDTH}
          y1={innerHeight * (1 - f)}
          y2={innerHeight * (1 - f)}
          stroke={COLORS.border}
          strokeWidth={1}
        />
      ))}

      {data.map((d, i) => {
        const barHeight = (d.value / max) * innerHeight;
        const x = i * barSlot + (barSlot - barWidth) / 2;
        const y = innerHeight - barHeight;
        return (
          <React.Fragment key={d.label}>
            <Rect x={x} y={y} width={barWidth} height={barHeight} rx={6} fill="url(#barGradient)" />
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

function AreaChart({ data, color }) {
  const max = Math.max(...data.map((d) => d.value)) * 1.1;
  const min = Math.min(...data.map((d) => d.value)) * 0.9;
  const innerWidth = CHART_WIDTH;
  const innerHeight = CHART_HEIGHT - 30;
  const stepX = innerWidth / (data.length - 1);

  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = innerHeight - ((d.value - min) / (max - min)) * innerHeight;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${innerHeight} L ${points[0].x} ${innerHeight} Z`;

  return (
    <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
      <Defs>
        <SvgLinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.35" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>

      {[0.25, 0.5, 0.75].map((f) => (
        <SvgLine
          key={f}
          x1={0}
          x2={CHART_WIDTH}
          y1={innerHeight * (1 - f)}
          y2={innerHeight * (1 - f)}
          stroke={COLORS.border}
          strokeWidth={1}
        />
      ))}

      <Path d={areaPath} fill="url(#areaGradient)" />
      <Path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r={3.5} fill={COLORS.card} stroke={color} strokeWidth={2} />
      ))}
    </Svg>
  );
}

function CustomerGrowthChart({ data }) {
  const allValues = data.flatMap((d) => [d.newC, d.returning]);
  const max = Math.max(...allValues) * 1.1;
  const min = 0;
  const innerWidth = CHART_WIDTH;
  const innerHeight = CHART_HEIGHT - 30;
  const stepX = innerWidth / (data.length - 1);

  const buildPath = (key) =>
    data
      .map((d, i) => {
        const x = i * stepX;
        const y = innerHeight - ((d[key] - min) / (max - min)) * innerHeight;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');

  const newPath = buildPath('newC');
  const returningPath = buildPath('returning');

  return (
    <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
      {[0.25, 0.5, 0.75].map((f) => (
        <SvgLine
          key={f}
          x1={0}
          x2={CHART_WIDTH}
          y1={innerHeight * (1 - f)}
          y2={innerHeight * (1 - f)}
          stroke={COLORS.border}
          strokeWidth={1}
        />
      ))}

      <Path d={returningPath} fill="none" stroke={COLORS.purple} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d={newPath} fill="none" stroke={COLORS.primary} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ProductPerformanceChart({ data }) {
  const max = Math.max(...data.map((d) => d.revenue));
  return (
    <View style={{ gap: 14 }}>
      {data.map((p) => {
        const pct = Math.max(6, (p.revenue / max) * 100);
        return (
          <View key={p.id}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.text, flex: 1 }} numberOfLines={1}>
                {p.name}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.textMuted }}>
                {fmtCompact(p.revenue)}
              </Text>
            </View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: COLORS.bg, overflow: 'hidden' }}>
              <View
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: COLORS.primary,
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

function LegendDot({ color, label }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Top product row
// ---------------------------------------------------------------------------
function TopProductRow({ product, rank, isLast }) {
  const isPositive = product.growth >= 0;
  const rankColors = ['#F59E0B', '#94A3B8', '#B45309'];
  const rankColor = rankColors[rank - 1] ?? COLORS.textFaint;

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
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: rank <= 3 ? rankColor : COLORS.bg,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Text
          style={{
            fontSize: 11.5,
            fontWeight: '800',
            color: rank <= 3 ? '#FFFFFF' : COLORS.textMuted,
          }}
        >
          {rank}
        </Text>
      </View>

      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: COLORS.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}
      >
        <Ionicons name="shirt-outline" size={18} color={COLORS.primary} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 1 }}>
          {product.unitsSold} units sold
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.text }}>
          {fmtCompact(product.revenue)}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 2 }}>
          <Ionicons
            name={isPositive ? 'arrow-up' : 'arrow-down'}
            size={9}
            color={isPositive ? COLORS.success : COLORS.danger}
          />
          <Text
            style={{
              fontSize: 10.5,
              fontWeight: '700',
              color: isPositive ? COLORS.success : COLORS.danger,
            }}
          >
            {Math.abs(product.growth)}%
          </Text>
        </View>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// AI Insight card
// ---------------------------------------------------------------------------
function AIInsightCard({ icon, tag, title, highlight, text, gradient, trend }) {
  const sparkPoints = useMemo(() => {
    if (!trend) return null;
    const w = 120;
    const h = 34;
    const max = Math.max(...trend);
    const min = Math.min(...trend);
    const step = w / (trend.length - 1);
    return trend
      .map((v, i) => {
        const x = i * step;
        const y = h - ((v - min) / (max - min || 1)) * h;
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  }, [trend]);

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 20, padding: 18, marginTop: 14 }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Ionicons name="sparkles" size={11} color="#FFFFFF" />
          <Text style={{ fontSize: 10, fontWeight: '800', color: '#FFFFFF' }}>AI INSIGHT</Text>
        </View>
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 4,
          }}
        >
          <Text style={{ fontSize: 10, fontWeight: '700', color: '#FFFFFF' }}>{tag}</Text>
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 }}>
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name={icon} size={17} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '800', color: '#FFFFFF' }}>{title}</Text>
          {highlight ? (
            <Text style={{ fontSize: 12, fontWeight: '600', color: 'rgba(255,255,255,0.85)' }}>
              {highlight}
            </Text>
          ) : null}
        </View>
      </View>

      <Text style={{ fontSize: 12, lineHeight: 18, color: 'rgba(255,255,255,0.9)', marginTop: 10 }}>
        {text}
      </Text>

      {sparkPoints ? (
        <View style={{ marginTop: 14, alignItems: 'flex-end' }}>
          <Svg width={120} height={34} viewBox="0 0 120 34">
            <Path d={sparkPoints} fill="none" stroke="#FFFFFF" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      ) : null}
    </LinearGradient>
  );
}