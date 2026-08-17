import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { router, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// ---- Theme tokens ----
const COLORS = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  text: "#0F172A",
  subtext: "#64748B",
  border: "#EEF1F6",
  primary: "#2563EB",
  secondary: "#60A5FA",
  green: "#16A34A",
  orange: "#F59E0B",
  purple: "#9333EA",
  pink: "#EC4899",
  red: "#EF4444",
};

// Reusable shadow token — still applied inline via spread (`{...CARD_SHADOW}`),
// not a StyleSheet, just a plain JS object to avoid repeating six lines everywhere.
const CARD_SHADOW = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.06,
  shadowRadius: 14,
  elevation: 3,
};

// Stat cards — each with its own accent so the grid reads "colourful" while
// staying disciplined (one accent per metric, not per random element)
const STATS = [
  {
    title: "Total Buyers",
    value: "8,942",
    trend: "+3.1% this week",
    up: true,
    icon: "people-outline",
    color: COLORS.primary,
  },
  {
    title: "Active Sellers",
    value: "612",
    trend: "+18 this week",
    up: true,
    icon: "storefront-outline",
    color: COLORS.green,
  },
  {
    title: "Pending Seller Requests",
    value: "14",
    trend: "5 new today",
    up: true,
    icon: "time-outline",
    color: COLORS.orange,
  },
  {
    title: "Open Complaints",
    value: "27",
    trend: "3 new today",
    up: false,
    icon: "alert-circle-outline",
    color: COLORS.red,
  },
  {
    title: "Resolved Complaints",
    value: "512",
    trend: "+41 this week",
    up: true,
    icon: "checkmark-done-outline",
    color: COLORS.purple,
  },
  {
    title: "Platform Revenue",
    value: "₹18.6L",
    trend: "+9.2% MoM",
    up: true,
    icon: "cash-outline",
    color: COLORS.pink,
  },
  {
    title: "Platform Commission",
    value: "₹2.4L",
    trend: "+6.4% MoM",
    up: true,
    icon: "wallet-outline",
    color: COLORS.primary,
  },
  {
    title: "App Rating",
    value: "4.7 / 5",
    trend: "+0.2 this month",
    up: true,
    icon: "star-outline",
    color: COLORS.orange,
  },
  {
    title: "Today's New Users",
    value: "138",
    trend: "+22 vs yesterday",
    up: true,
    icon: "person-add-outline",
    color: COLORS.green,
  },
  {
    title: "Today's New Sellers",
    value: "9",
    trend: "+2 vs yesterday",
    up: true,
    icon: "add-circle-outline",
    color: COLORS.purple,
  },
];

const QUICK_ACTIONS = [
  {
    label: "Add Product",
    icon: "add-circle-outline",
    color: COLORS.green,
    page: "/admin/add-product",
},
  {
    label: "Customer Complaints",
    icon: "chatbox-ellipses-outline",
    color: COLORS.red,
    page: "/admin/complaints",
  },
  {
    label: "Platform Settings",
    icon: "settings-outline",
    color: COLORS.purple,
    page: "/admin/platform-settings",
  },
  {
    label: "Admin Profile",
    icon: "person-circle-outline",
    color: COLORS.pink,
    page: "/admin/profile",
  },
];

const PLATFORM_OVERVIEW = [
  { label: "Platform Health", value: "99.8%", icon: "pulse-outline", color: COLORS.green },
  { label: "Server Status", value: "Online", icon: "server-outline", color: COLORS.primary },
  { label: "Application Version", value: "v1.0.0", icon: "cube-outline", color: COLORS.purple },
  { label: "Database", value: "Connected", icon: "layers-outline", color: COLORS.green },
  { label: "AI Services", value: "Running", icon: "sparkles-outline", color: COLORS.pink },
  { label: "Storage Used", value: "67%", icon: "cloud-outline", color: COLORS.orange },
  { label: "API Requests Today", value: "2,451", icon: "swap-horizontal-outline", color: COLORS.secondary },
];

const RECENT_ACTIVITIES = [
  {
    title: "New Seller Registration",
    subtitle: "HomeCraft Furniture applied to sell",
    time: "10 min ago",
    icon: "storefront-outline",
    color: COLORS.primary,
  },
  {
    title: "Seller Approved",
    subtitle: "PetJoy Store verification completed",
    time: "45 min ago",
    icon: "checkmark-circle-outline",
    color: COLORS.green,
  },
  {
    title: "Complaint Submitted",
    subtitle: "Buyer reported a damaged bookshelf",
    time: "1 hr ago",
    icon: "alert-circle-outline",
    color: COLORS.red,
  },
  {
    title: "Complaint Resolved",
    subtitle: "Refund issue with PetJoy Store closed",
    time: "2 hr ago",
    icon: "checkmark-done-outline",
    color: COLORS.purple,
  },
  {
    title: "Platform Settings Updated",
    subtitle: "Commission percentage changed to 12%",
    time: "5 hr ago",
    icon: "settings-outline",
    color: COLORS.orange,
  },
];

const NOTIFICATIONS = [
  {
    label: "5 Pending Seller Requests",
    time: "Just now",
    icon: "shield-checkmark-outline",
    color: COLORS.orange,
  },
  {
    label: "3 New Complaints",
    time: "20 min ago",
    icon: "chatbox-ellipses-outline",
    color: COLORS.red,
  },
  {
    label: "2 Platform Alerts",
    time: "1 hr ago",
    icon: "warning-outline",
    color: COLORS.purple,
  },
];

const TABS = [
  { label: "Dashboard", icon: "grid-outline", page: "/admin/dashboard" },
  { label: "Sellers", icon: "shield-checkmark-outline", page: "/admin/seller-verification" },
  { label: "Complaints", icon: "chatbox-ellipses-outline", page: "/admin/complaints" },
  { label: "Settings", icon: "settings-outline", page: "/admin/platform-settings" },
];

export default function Dashboard() {
  const pathname = usePathname ? usePathname() : "/admin/dashboard";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: Platform.OS === "android" ? 30 : 10,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 24,
          }}
        >
          <View>
            <Text style={{ fontSize: 13, color: COLORS.subtext, fontWeight: "600" }}>
              Welcome back
            </Text>
            <Text style={{ fontSize: 28, fontWeight: "800", color: COLORS.text, marginTop: 2 }}>
              Admin Dashboard
            </Text>
            <Text style={{ color: COLORS.subtext, marginTop: 4, fontSize: 13 }}>
              Manage the Aureva Platform
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              backgroundColor: COLORS.surface,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 9,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: COLORS.red,
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Statistics cards grid */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {STATS.map((item) => (
            <TouchableOpacity
              key={item.title}
              activeOpacity={0.85}
              style={{
                width: "48%",
                backgroundColor: COLORS.surface,
                borderRadius: 18,
                padding: 16,
                marginBottom: 14,
                ...CARD_SHADOW,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: `${item.color}1A`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>

              <Text style={{ fontSize: 12, color: COLORS.subtext, fontWeight: "600" }} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 20, fontWeight: "800", color: COLORS.text, marginTop: 4 }}>
                {item.value}
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
                <Ionicons
                  name={item.up ? "trending-up" : "trending-down"}
                  size={13}
                  color={item.up ? COLORS.green : COLORS.red}
                />
                <Text
                  style={{
                    fontSize: 10,
                    color: item.up ? COLORS.green : COLORS.red,
                    marginLeft: 4,
                    fontWeight: "600",
                    flexShrink: 1,
                  }}
                  numberOfLines={1}
                >
                  {item.trend}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick actions */}
        <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 12, marginTop: 6 }}>
          Quick Actions
        </Text>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              activeOpacity={0.85}
              onPress={() => {
                console.log("Clicked:", action.page);
                router.push(action.page)
              }}
              style={{
                width: "48%",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: COLORS.surface,
                borderRadius: 16,
                paddingVertical: 14,
                paddingHorizontal: 14,
                marginBottom: 12,
                shadowColor: "#0F172A",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  backgroundColor: `${action.color}1A`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Ionicons name={action.icon} size={19} color={action.color} />
              </View>
              <Text
                style={{ fontSize: 13, fontWeight: "600", color: COLORS.text, flex: 1 }}
                numberOfLines={2}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Platform Overview */}
        <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text, marginBottom: 12 }}>
          Platform Overview
        </Text>
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            padding: 18,
            marginBottom: 24,
            ...CARD_SHADOW,
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            {PLATFORM_OVERVIEW.map((item) => (
              <View
                key={item.label}
                style={{
                  width: "48%",
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F8FAFF",
                  borderRadius: 14,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: `${item.color}1A`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  <Ionicons name={item.icon} size={16} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, color: COLORS.subtext, fontWeight: "600" }} numberOfLines={1}>
                    {item.label}
                  </Text>
                  <Text style={{ fontSize: 13, fontWeight: "800", color: COLORS.text, marginTop: 1 }}>
                    {item.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activities */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text }}>
            Recent Activities
          </Text>
        </View>

        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 18,
            paddingHorizontal: 16,
            marginBottom: 24,
            ...CARD_SHADOW,
          }}
        >
          {RECENT_ACTIVITIES.map((activity, index) => (
            <View
              key={activity.title}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                paddingVertical: 14,
                borderBottomWidth: index === RECENT_ACTIVITIES.length - 1 ? 0 : 1,
                borderBottomColor: COLORS.border,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: `${activity.color}1A`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name={activity.icon} size={18} color={activity.color} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: COLORS.text }}>
                  {activity.title}
                </Text>
                <Text style={{ fontSize: 12, color: COLORS.subtext, marginTop: 2 }} numberOfLines={2}>
                  {activity.subtitle}
                </Text>
              </View>

              <Text style={{ fontSize: 11, color: COLORS.subtext, marginLeft: 8 }}>
                {activity.time}
              </Text>
            </View>
          ))}
        </View>

        {/* Notifications */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name="notifications-outline" size={18} color={COLORS.primary} />
          <Text style={{ fontSize: 16, fontWeight: "700", color: COLORS.text, marginLeft: 6 }}>
            Notifications
          </Text>
        </View>

        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 18,
            paddingHorizontal: 16,
            marginBottom: 10,
            ...CARD_SHADOW,
          }}
        >
          {NOTIFICATIONS.map((note, index) => (
            <TouchableOpacity
              key={note.label}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 14,
                borderBottomWidth: index === NOTIFICATIONS.length - 1 ? 0 : 1,
                borderBottomColor: COLORS.border,
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  backgroundColor: `${note.color}1A`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name={note.icon} size={17} color={note.color} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: COLORS.text }}>
                  {note.label}
                </Text>
                <Text style={{ fontSize: 11, color: COLORS.subtext, marginTop: 2 }}>
                  {note.time}
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={16} color={COLORS.subtext} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={{
          position: "absolute",
          right: 22,
          bottom: 96,
          width: 56,
          height: 56,
          borderRadius: 18,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
          elevation: 6,
        }}
      >
        <Ionicons name="add" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: COLORS.surface,
          paddingVertical: 10,
          paddingBottom: Platform.OS === "ios" ? 22 : 12,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 14,
          elevation: 8,
        }}
      >
        {TABS.map((tab) => {
          const active = pathname === tab.page;
          return (
            <TouchableOpacity
              key={tab.label}
              activeOpacity={0.8}
              onPress={() => router.push(tab.page)}
              style={{ flex: 1, alignItems: "center" }}
            >
              <View
                style={{
                  width: 44,
                  height: 32,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: active ? `${COLORS.primary}1A` : "transparent",
                }}
              >
                <Ionicons
                  name={tab.icon}
                  size={19}
                  color={active ? COLORS.primary : COLORS.subtext}
                />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: active ? "700" : "600",
                  color: active ? COLORS.primary : COLORS.subtext,
                  marginTop: 2,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}