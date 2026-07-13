import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ActivityIndicator,
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

const DOCUMENTS = [
  { key: "gstCertificate", label: "Upload GST Certificate", icon: "document-text-outline" },
  { key: "pan", label: "Upload PAN", icon: "card-outline" },
  { key: "aadhaar", label: "Upload Aadhaar", icon: "finger-print-outline" },
  { key: "businessCertificate", label: "Upload Business Certificate", icon: "ribbon-outline" },
];

function SectionCard({ icon, color, title, subtitle, children }) {
  return (
    <View
      style={{
        backgroundColor: COLORS.surface,
        borderRadius: 22,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...CARD_SHADOW,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            backgroundColor: `${color}1A`,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: COLORS.text }}>{title}</Text>
          {subtitle ? (
            <Text style={{ fontSize: 12, color: COLORS.subtext, marginTop: 1 }}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {children}
    </View>
  );
}

function InputField({ label, icon, value, onChangeText, placeholder, keyboardType, multiline, maxLength }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 12, fontWeight: "700", color: COLORS.subtext, marginBottom: 6 }}>
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: multiline ? "flex-start" : "center",
          backgroundColor: "#F8FAFF",
          borderRadius: 14,
          borderWidth: 1,
          borderColor: COLORS.border,
          paddingHorizontal: 14,
          paddingVertical: multiline ? 12 : 0,
          minHeight: multiline ? 90 : 52,
        }}
      >
        <Ionicons
          name={icon}
          size={17}
          color={COLORS.primary}
          style={{ marginRight: 10, marginTop: multiline ? 2 : 0 }}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          keyboardType={keyboardType || "default"}
          multiline={!!multiline}
          maxLength={maxLength}
          style={{
            flex: 1,
            fontSize: 14,
            color: COLORS.text,
            paddingVertical: multiline ? 0 : 14,
            textAlignVertical: multiline ? "top" : "center",
          }}
        />
      </View>
    </View>
  );
}

function UploadRow({ label, icon, uploaded, fileName, onPress, last }) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 13,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: COLORS.border,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: uploaded ? "#22C55E1A" : "#2563EB1A",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Ionicons name={icon} size={19} color={uploaded ? COLORS.success : COLORS.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13.5, fontWeight: "700", color: COLORS.text }}>{label}</Text>
        <Text style={{ fontSize: 11.5, color: uploaded ? COLORS.success : COLORS.subtext, marginTop: 2 }}>
          {uploaded ? fileName : "No file selected yet"}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: uploaded ? "#22C55E1A" : "#EFF6FF",
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
        }}
      >
        <Ionicons
          name={uploaded ? "checkmark-circle" : "cloud-upload-outline"}
          size={15}
          color={uploaded ? COLORS.success : COLORS.primary}
        />
        <Text
          style={{
            fontSize: 11.5,
            fontWeight: "700",
            color: uploaded ? COLORS.success : COLORS.primary,
            marginLeft: 5,
          }}
        >
          {uploaded ? "Uploaded" : "Upload"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SellerActivation() {
  const [form, setForm] = useState({
    storeName: "",
    businessName: "",
    ownerName: "",
    phone: "",
    email: "",
    gstNumber: "",
    panNumber: "",
    aadhaarNumber: "",
    businessAddress: "",
    bankName: "",
    accountNumber: "",
    ifsc: "",
  });

  const [documents, setDocuments] = useState({
    gstCertificate: null,
    pan: null,
    aadhaar: null,
    businessCertificate: null,
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const simulateUpload = (key, label) => {
    setDocuments((prev) => ({
      ...prev,
      [key]: `${label.replace("Upload ", "")}.pdf`,
    }));
  };

  const resetForm = () => {
    Alert.alert("Reset Form", "This will clear all entered details and documents.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setForm({
            storeName: "",
            businessName: "",
            ownerName: "",
            phone: "",
            email: "",
            gstNumber: "",
            panNumber: "",
            aadhaarNumber: "",
            businessAddress: "",
            bankName: "",
            accountNumber: "",
            ifsc: "",
          });
          setDocuments({ gstCertificate: null, pan: null, aadhaar: null, businessCertificate: null });
          setAgreedToTerms(false);
        },
      },
    ]);
  };

  const validate = () => {
    const requiredFields = [
      "storeName",
      "businessName",
      "ownerName",
      "phone",
      "email",
      "gstNumber",
      "panNumber",
      "aadhaarNumber",
      "businessAddress",
      "bankName",
      "accountNumber",
      "ifsc",
    ];
    const missing = requiredFields.some((key) => !form[key]?.trim());
    if (missing) {
      Alert.alert("Incomplete Form", "Please fill in all fields before submitting.");
      return false;
    }
    const missingDoc = Object.values(documents).some((v) => !v);
    if (missingDoc) {
      Alert.alert("Documents Required", "Please upload all four required documents.");
      return false;
    }
    if (!agreedToTerms) {
      Alert.alert("Accept Terms", "Please agree to the Seller Terms before submitting.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/seller/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, documents }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      router.replace("/seller/verification");
    } catch (error) {
      Alert.alert(
        "Submission Failed",
        "We couldn't submit your application right now. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

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
          <Text style={{ fontSize: 19, fontWeight: "800", color: COLORS.text }}>Become a Seller</Text>
          <View style={{ width: 42, height: 42 }} />
        </View>
        <Text style={{ fontSize: 13, color: COLORS.subtext, marginTop: 6 }}>
          Fill in your business details to start selling on Aureva.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      >
        {/* Hero banner */}
        <View
          style={{
            backgroundColor: "#2563EB",
            borderRadius: 22,
            padding: 20,
            marginBottom: 18,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          />
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              backgroundColor: "rgba(255,255,255,0.18)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons name="rocket-outline" size={22} color="#fff" />
          </View>
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#fff" }}>
            Start Your Seller Journey
          </Text>
          <Text style={{ fontSize: 12.5, color: "rgba(255,255,255,0.85)", marginTop: 6, lineHeight: 18 }}>
            Complete this application to unlock your seller dashboard, list products, and start
            earning on Aureva's AI-powered marketplace.
          </Text>
        </View>

        {/* Business Details */}
        <SectionCard
          icon="storefront-outline"
          color={COLORS.primary}
          title="Business Details"
          subtitle="Tell us about your store"
        >
          <InputField
            label="Store Name"
            icon="pricetag-outline"
            value={form.storeName}
            onChangeText={(v) => updateField("storeName", v)}
            placeholder="e.g. UrbanThreads Co."
          />
          <InputField
            label="Business Name"
            icon="business-outline"
            value={form.businessName}
            onChangeText={(v) => updateField("businessName", v)}
            placeholder="Registered business name"
          />
          <InputField
            label="Owner Name"
            icon="person-outline"
            value={form.ownerName}
            onChangeText={(v) => updateField("ownerName", v)}
            placeholder="Full name of the owner"
          />
        </SectionCard>

        {/* Contact Details */}
        <SectionCard
          icon="call-outline"
          color={COLORS.success}
          title="Contact Details"
          subtitle="How buyers and admins can reach you"
        >
          <InputField
            label="Phone Number"
            icon="call-outline"
            value={form.phone}
            onChangeText={(v) => updateField("phone", v)}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
          />
          <InputField
            label="Email"
            icon="mail-outline"
            value={form.email}
            onChangeText={(v) => updateField("email", v)}
            placeholder="you@business.com"
            keyboardType="email-address"
          />
        </SectionCard>

        {/* Identity & Tax Details */}
        <SectionCard
          icon="shield-checkmark-outline"
          color={COLORS.warning}
          title="Identity & Tax Details"
          subtitle="Used to verify your business"
        >
          <InputField
            label="GST Number"
            icon="receipt-outline"
            value={form.gstNumber}
            onChangeText={(v) => updateField("gstNumber", v.toUpperCase())}
            placeholder="22AAAAA0000A1Z5"
            maxLength={15}
          />
          <InputField
            label="PAN Number"
            icon="card-outline"
            value={form.panNumber}
            onChangeText={(v) => updateField("panNumber", v.toUpperCase())}
            placeholder="ABCDE1234F"
            maxLength={10}
          />
          <InputField
            label="Aadhaar Number"
            icon="finger-print-outline"
            value={form.aadhaarNumber}
            onChangeText={(v) => updateField("aadhaarNumber", v)}
            placeholder="XXXX XXXX XXXX"
            keyboardType="number-pad"
            maxLength={12}
          />
          <InputField
            label="Business Address"
            icon="location-outline"
            value={form.businessAddress}
            onChangeText={(v) => updateField("businessAddress", v)}
            placeholder="Street, City, State, PIN Code"
            multiline
          />
        </SectionCard>

        {/* Bank Details */}
        <SectionCard
          icon="cash-outline"
          color={COLORS.primary}
          title="Bank Details"
          subtitle="Where your payouts will be sent"
        >
          <InputField
            label="Bank Name"
            icon="business-outline"
            value={form.bankName}
            onChangeText={(v) => updateField("bankName", v)}
            placeholder="e.g. HDFC Bank"
          />
          <InputField
            label="Account Number"
            icon="wallet-outline"
            value={form.accountNumber}
            onChangeText={(v) => updateField("accountNumber", v)}
            placeholder="Bank account number"
            keyboardType="number-pad"
          />
          <InputField
            label="IFSC Code"
            icon="key-outline"
            value={form.ifsc}
            onChangeText={(v) => updateField("ifsc", v.toUpperCase())}
            placeholder="e.g. HDFC0001234"
            maxLength={11}
          />
        </SectionCard>

        {/* Document Uploads */}
        <SectionCard
          icon="folder-open-outline"
          color={COLORS.success}
          title="Document Uploads"
          subtitle="Clear scans or photos, under 5MB each"
        >
          {DOCUMENTS.map((doc, index) => (
            <UploadRow
              key={doc.key}
              label={doc.label}
              icon={doc.icon}
              uploaded={!!documents[doc.key]}
              fileName={documents[doc.key]}
              onPress={() => simulateUpload(doc.key, doc.label)}
              last={index === DOCUMENTS.length - 1}
            />
          ))}
        </SectionCard>

        {/* Terms Checkbox */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setAgreedToTerms((prev) => !prev)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: COLORS.surface,
            borderRadius: 18,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            ...CARD_SHADOW,
          }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: agreedToTerms ? COLORS.success : "#CBD5E1",
              backgroundColor: agreedToTerms ? COLORS.success : "transparent",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            {agreedToTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
          </View>
          <Text style={{ flex: 1, fontSize: 13.5, color: COLORS.text, fontWeight: "600" }}>
            I agree to the{" "}
            <Text style={{ color: COLORS.primary, fontWeight: "800" }}>Seller Terms & Conditions</Text>{" "}
            and confirm that all information provided is accurate.
          </Text>
        </TouchableOpacity>

        {/* Submit & Reset Buttons */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={submitting}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 18,
            paddingVertical: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 12,
            opacity: submitting ? 0.7 : 1,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 14,
            elevation: 4,
          }}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
          ) : (
            <Ionicons name="paper-plane-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
          )}
          <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
            {submitting ? "Submitting..." : "Submit Application"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={resetForm}
          disabled={submitting}
          style={{
            borderWidth: 1.5,
            borderColor: COLORS.danger,
            borderRadius: 18,
            paddingVertical: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: COLORS.danger, fontWeight: "800", fontSize: 15 }}>Reset Form</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}