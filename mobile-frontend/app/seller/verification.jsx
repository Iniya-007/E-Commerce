import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// ---- Theme tokens ----
const COLORS = {
  bg: "#F5F7FB",
  surface: "#FFFFFF",
  text: "#0F172A",
  subtext: "#64748B",
  border: "#EEF1F6",
  primary: "#2563EB",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
};

const CARD_SHADOW = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.06,
  shadowRadius: 14,
  elevation: 3,
};

const STATUS_META = {
  Pending: {
    color: COLORS.warning,
    bg: "#FEF3E2",
    icon: "time-outline",
    heading: "Your Application is Under Review",
    message: "Our team is verifying your documents. This usually takes 24–48 hours.",
  },
  Approved: {
    color: COLORS.success,
    bg: "#E8FBF0",
    icon: "checkmark-circle-outline",
    heading: "You're Verified as a Seller!",
    message: "Congratulations — your store is live and ready to start selling on Aureva.",
  },
  Rejected: {
    color: COLORS.danger,
    bg: "#FDECEC",
    icon: "close-circle-outline",
    heading: "Application Not Approved",
    message: "We found an issue with your application. See the reason below and reapply.",
  },
};

const STEP_DEFINITIONS = [
  { key: "submitted", label: "Application Submitted", icon: "document-text-outline" },
  { key: "documents", label: "Documents Verified", icon: "folder-open-outline" },
  { key: "review", label: "Admin Review", icon: "people-outline" },
  { key: "approved", label: "Approved", icon: "ribbon-outline" },
];

// Dummy fallback profile, used if the API request fails or while mocking locally
const FALLBACK_PROFILE = {
  verificationStatus: "Pending",
  submittedDate: "09 Jul 2026",
  documentsUploaded: 4,
  totalDocuments: 4,
  rejectionReason: null,
};

function getStepStates(status) {
  // Returns "done" | "current" | "upcoming" | "rejected" for each of the 4 steps
  if (status === "Approved") return ["done", "done", "done", "done"];
  if (status === "Rejected") return ["done", "done", "done", "rejected"];
  return ["done", "done", "current", "upcoming"]; // Pending
}

export default function SellerVerificationStatus() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch("/api/seller/profile");
      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
      const data = await response.json();
      setProfile(data);
      setError(false);
    } catch (e) {
      setProfile(FALLBACK_PROFILE);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg, alignItems: "center", justifyContent: "center" }}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 12, color: COLORS.subtext, fontSize: 13 }}>
          Loading your verification status...
        </Text>
      </SafeAreaView>
    );
  }

  const status = profile?.verificationStatus || "Pending";
  const meta = STATUS_META[status] || STATUS_META.Pending;
  const stepStates = getStepStates(status);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* App Bar */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: Platform.OS === "android" ? 20 : 6,
          paddingBottom: 18,
          backgroundColor: COLORS.surface,
          borderBottomLeftRadius: 26,
          borderBottomRightRadius: 26,
          ...CARD_SHADOW,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => router.back()}
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              backgroundColor: "#EFF6FF",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={{ fontSize: 19, fontWeight: "800", color: COLORS.text }}>Verification Status</Text>
          <View style={{ width: 42, height: 42 }} />
        </View>
        <Text style={{ fontSize: 13, color: COLORS.subtext, marginTop: 6 }}>
          Track the progress of your seller application.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      >
        {error && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#FEF3E2",
              borderRadius: 14,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Ionicons name="wifi-outline" size={16} color={COLORS.warning} />
            <Text style={{ fontSize: 12, color: COLORS.warning, marginLeft: 8, flex: 1 }}>
              Couldn't reach the server — showing your last known status.
            </Text>
          </View>
        )}

        {/* Hero status card */}
        <View
          style={{
            backgroundColor: meta.bg,
            borderRadius: 24,
            padding: 22,
            marginBottom: 18,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              backgroundColor: COLORS.surface,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
              ...CARD_SHADOW,
            }}
          >
            <Ionicons name={meta.icon} size={30} color={meta.color} />
          </View>
          <Text style={{ fontSize: 17, fontWeight: "800", color: COLORS.text, textAlign: "center" }}>
            {meta.heading}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: COLORS.subtext,
              textAlign: "center",
              marginTop: 6,
              lineHeight: 19,
              paddingHorizontal: 10,
            }}
          >
            {meta.message}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: COLORS.surface,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 14,
              marginTop: 14,
            }}
          >
            <View
              style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: meta.color, marginRight: 8 }}
            />
            <Text style={{ fontSize: 13, fontWeight: "800", color: meta.color }}>{status}</Text>
          </View>
        </View>

        {/* Status option cards (Pending / Approved / Rejected) */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 18 }}>
          {Object.keys(STATUS_META).map((key) => {
            const isActive = key === status;
            const m = STATUS_META[key];
            return (
              <View
                key={key}
                style={{
                  width: "31%",
                  backgroundColor: isActive ? m.bg : COLORS.surface,
                  borderRadius: 18,
                  paddingVertical: 16,
                  alignItems: "center",
                  borderWidth: isActive ? 0 : 1,
                  borderColor: COLORS.border,
                  ...(isActive ? CARD_SHADOW : {}),
                }}
              >
                <View
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    backgroundColor: isActive ? COLORS.surface : `${m.color}14`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons name={m.icon} size={18} color={m.color} />
                </View>
                <Text
                  style={{
                    fontSize: 11.5,
                    fontWeight: isActive ? "800" : "600",
                    color: isActive ? m.color : COLORS.subtext,
                  }}
                >
                  {key}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Application summary */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            padding: 18,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: COLORS.border,
            ...CARD_SHADOW,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 11,
                backgroundColor: "#EFF6FF",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: COLORS.subtext, fontWeight: "600" }}>
                Application Submitted
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "800", color: COLORS.text, marginTop: 1 }}>
                {profile?.submittedDate || "—"}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 11,
                backgroundColor: "#E8FBF0",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Ionicons name="documents-outline" size={16} color={COLORS.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, color: COLORS.subtext, fontWeight: "600" }}>
                Documents Uploaded
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "800", color: COLORS.text, marginTop: 1 }}>
                {profile?.documentsUploaded ?? 0} of {profile?.totalDocuments ?? 4} documents
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Timeline */}
        <Text style={{ fontSize: 16, fontWeight: "800", color: COLORS.text, marginBottom: 14 }}>
          Progress Timeline
        </Text>
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            padding: 18,
            marginBottom: 18,
            borderWidth: 1,
            borderColor: COLORS.border,
            ...CARD_SHADOW,
          }}
        >
          {STEP_DEFINITIONS.map((step, index) => {
            const state = stepStates[index];
            const isLast = index === STEP_DEFINITIONS.length - 1;
            const dotColor =
              state === "done"
                ? COLORS.success
                : state === "current"
                ? COLORS.warning
                : state === "rejected"
                ? COLORS.danger
                : "#CBD5E1";
            const dotBg =
              state === "done"
                ? "#22C55E"
                : state === "current"
                ? "#F59E0B"
                : state === "rejected"
                ? "#EF4444"
                : "#E2E8F0";
            const iconName =
              state === "done"
                ? "checkmark"
                : state === "rejected"
                ? "close"
                : state === "current"
                ? "ellipse"
                : step.icon;

            return (
              <View key={step.key} style={{ flexDirection: "row" }}>
                <View style={{ alignItems: "center", marginRight: 14 }}>
                  <View
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: dotBg,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={state === "upcoming" ? step.icon : iconName}
                      size={state === "current" ? 10 : 16}
                      color={state === "upcoming" ? "#94A3B8" : "#fff"}
                    />
                  </View>
                  {!isLast && (
                    <View
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 30,
                        backgroundColor: state === "done" ? COLORS.success : "#E2E8F0",
                        marginTop: 2,
                      }}
                    />
                  )}
                </View>
                <View style={{ flex: 1, paddingBottom: isLast ? 0 : 24 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "800",
                      color: state === "upcoming" ? COLORS.subtext : COLORS.text,
                    }}
                  >
                    {step.label}
                  </Text>
                  <Text style={{ fontSize: 11.5, color: COLORS.subtext, marginTop: 2 }}>
                    {state === "done" && "Completed"}
                    {state === "current" && "In progress"}
                    {state === "upcoming" && "Pending"}
                    {state === "rejected" && "Not approved"}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Rejection reason */}
        {status === "Rejected" && (
          <View
            style={{
              backgroundColor: "#FDECEC",
              borderRadius: 20,
              padding: 18,
              marginBottom: 18,
              borderWidth: 1,
              borderColor: "#FBC7C7",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={{ fontSize: 14, fontWeight: "800", color: COLORS.danger, marginLeft: 8 }}>
                Reason for Rejection
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 19 }}>
              {profile?.rejectionReason ||
                "The submitted PAN card image was unclear and could not be verified. Please re-upload a clearer copy and resubmit your application."}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/seller/seller-activation")}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.danger,
                paddingVertical: 13,
                borderRadius: 14,
                marginTop: 14,
              }}
            >
              <Ionicons name="refresh-outline" size={16} color="#fff" />
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13, marginLeft: 6 }}>
                Reapply Now
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Back to Dashboard */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/dashboard")}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 18,
            paddingVertical: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 14,
            elevation: 4,
          }}
        >
          <Ionicons name="home-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>Back to Dashboard</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}