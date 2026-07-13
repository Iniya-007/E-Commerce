import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// ---- Theme tokens (kept local since no StyleSheet / external lib is used) ----
const COLORS = {
  primary: "#2563EB",
  primaryDark: "#1E40AF",
  primaryTint: "#EFF6FF",
  primarySoft: "#DBEAFE",
  text: "#0F172A",
  subtext: "#64748B",
  border: "#E2E8F0",
  white: "#FFFFFF",
  danger: "#EF4444",
};

// Reusable labeled input row so the five fields stay visually consistent
function InputField({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  secure,
  toggleSecure,
  isSecureVisible,
  keyboardType,
  focusedKey,
  setFocusedKey,
  fieldKey,
}) {
  const focused = focusedKey === fieldKey;
  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: COLORS.text,
          marginBottom: 8,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1.5,
          borderColor: focused ? COLORS.primary : COLORS.border,
          backgroundColor: focused ? COLORS.primaryTint : "#F8FAFC",
          borderRadius: 14,
          paddingHorizontal: 14,
          height: 54,
        }}
      >
        <Ionicons
          name={icon}
          size={20}
          color={focused ? COLORS.primary : COLORS.subtext}
        />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocusedKey(fieldKey)}
          onBlur={() => setFocusedKey(null)}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={secure ? !isSecureVisible : false}
          keyboardType={keyboardType || "default"}
          autoCapitalize={fieldKey === "email" ? "none" : "words"}
          style={{
            flex: 1,
            marginLeft: 10,
            fontSize: 15,
            color: COLORS.text,
          }}
        />
        {secure && (
          <TouchableOpacity
            onPress={toggleSecure}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isSecureVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={COLORS.subtext}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function RegisterScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [focusedKey, setFocusedKey] = useState(null);

  const handleRegister = () => {
    // No auth / backend logic — UI + navigation only
    router.push("/(tabs)/home");
  };

  const handleLoginNav = () => {
    router.push("/auth/login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop: Platform.OS === "android" ? 40 : 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={{ alignItems: "center", marginTop: 16, marginBottom: 8 }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                backgroundColor: COLORS.primary,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 14,
                elevation: 8,
              }}
            >
              <Ionicons name="sparkles" size={32} color={COLORS.white} />
            </View>
          </View>

          {/* Heading */}
          <View style={{ marginTop: 18, marginBottom: 22 }}>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: COLORS.text,
                textAlign: "center",
              }}
            >
              Create Your Account
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: COLORS.subtext,
                textAlign: "center",
                marginTop: 8,
                paddingHorizontal: 12,
              }}
            >
              Join Aureva and start your AI shopping experience.
            </Text>
          </View>

          {/* Card */}
          <View
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 24,
              padding: 22,
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 12 },
              shadowOpacity: 0.08,
              shadowRadius: 24,
              elevation: 6,
              borderWidth: 1,
              borderColor: "#F1F5F9",
            }}
          >
            <InputField
              label="Full Name"
              icon="person-outline"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Jordan Smith"
              fieldKey="fullName"
              focusedKey={focusedKey}
              setFocusedKey={setFocusedKey}
            />

            <InputField
              label="Email"
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              fieldKey="email"
              focusedKey={focusedKey}
              setFocusedKey={setFocusedKey}
            />

            <InputField
              label="Phone Number"
              icon="call-outline"
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
              fieldKey="phone"
              focusedKey={focusedKey}
              setFocusedKey={setFocusedKey}
            />

            <InputField
              label="Password"
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secure
              isSecureVisible={showPassword}
              toggleSecure={() => setShowPassword((prev) => !prev)}
              fieldKey="password"
              focusedKey={focusedKey}
              setFocusedKey={setFocusedKey}
            />

            <InputField
              label="Confirm Password"
              icon="lock-closed-outline"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter your password"
              secure
              isSecureVisible={showConfirmPassword}
              toggleSecure={() => setShowConfirmPassword((prev) => !prev)}
              fieldKey="confirmPassword"
              focusedKey={focusedKey}
              setFocusedKey={setFocusedKey}
            />

            {/* Terms checkbox */}
            <TouchableOpacity
              onPress={() => setAgreed((prev) => !prev)}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 4,
              }}
            >
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 6,
                  borderWidth: 1.5,
                  borderColor: agreed ? COLORS.primary : COLORS.border,
                  backgroundColor: agreed ? COLORS.primary : COLORS.white,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                  marginTop: 1,
                }}
              >
                {agreed && (
                  <Ionicons name="checkmark" size={14} color={COLORS.white} />
                )}
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.subtext,
                  flex: 1,
                  lineHeight: 18,
                }}
              >
                I agree to the{" "}
                <Text style={{ color: COLORS.primary, fontWeight: "600" }}>
                  Terms & Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Register button */}
          <TouchableOpacity
            onPress={handleRegister}
            activeOpacity={0.85}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 16,
              height: 56,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 26,
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 6,
            }}
          >
            <Text
              style={{
                color: COLORS.white,
                fontSize: 16,
                fontWeight: "700",
                letterSpacing: 0.3,
              }}
            >
              Register
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 26,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
            <Text
              style={{
                marginHorizontal: 12,
                color: COLORS.subtext,
                fontSize: 12,
              }}
            >
              or
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: COLORS.border }} />
          </View>

          {/* Login link */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 10,
            }}
          >
            <Text style={{ fontSize: 14, color: COLORS.subtext }}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={handleLoginNav}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: COLORS.primary,
                }}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
