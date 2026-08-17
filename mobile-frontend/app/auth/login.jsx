import React, {
  useState,
  useContext,
} from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
  Alert,
} from "react-native";

import { useRouter } from "expo-router";

import { Ionicons } from "@expo/vector-icons";

import {
  loginUser,
} from "../../services/auth.service";

import {
  saveUser,
} from "../../services/storage.service";

import {
  AuthContext,
} from "../../context/AuthContext";

const { width } = Dimensions.get("window");

const isSmallScreen = width < 380;

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

const ROLES = [
  {
    key: "buyer",
    emoji: "👤",
    label: "Buyer",
    description: "Browse and purchase products.",
    route: "/(tabs)/home",
  },
  {
    key: "seller",
    emoji: "🏪",
    label: "Seller",
    description: "Manage your products and orders.",
    route: "/seller/dashboard",
  },
  {
    key: "admin",
    emoji: "🛡",
    label: "Admin",
    description: "Manage the entire platform.",
    route: "/admin/dashboard",
  },
];

export default function LoginScreen() {

  const router = useRouter();

  const { login } =
    useContext(AuthContext);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [emailFocused, setEmailFocused] =
    useState(false);

  const [passwordFocused, setPasswordFocused] =
    useState(false);

  const [selectedRole, setSelectedRole] =
    useState("buyer");

  const handleLogin = async () => {

    // ADMIN LOGIN

    if (
      email === "admin@aureva.com" &&
      password === "admin123"
    ) {

      Alert.alert(
        "Success",
        "Admin Login Successful"
      );

      router.replace(
        "/admin/dashboard"
      );

      return;

    }

    // USER LOGIN

    try {

      const data =
        await loginUser({

          email,

          password,

        });

       console.log("LOGIN USER:", data.user);

      await saveUser(

        data.user,

        data.token

      );

      login(

        data.user,

        data.token

      );

      Alert.alert(

        "Success",

        "Login Successful"

      );

      const role =
        ROLES.find(
          (r) =>
            r.key === selectedRole
        );

      router.replace(

        role
          ? role.route
          : "/(tabs)/home"

      );

    }

    catch (error) {

      Alert.alert(

        "Error",

        error.response?.data?.message ||
          "Login Failed"

      );

    }

  };

  const handleGuest = () => {

    router.push("/(tabs)/home");

  };

  const handleRegisterNav = () => {

    router.push("/auth/register");

  };

  return (

    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >

      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.white}
      />

      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingTop:
              Platform.OS === "android"
                ? 40
                : 20,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Logo */}

          <View
            style={{
              alignItems: "center",
              marginTop: 24,
              marginBottom: 12,
            }}
          >

            <View
              style={{
                width: 84,
                height: 84,
                borderRadius: 24,
                backgroundColor:
                  COLORS.primary,
                alignItems: "center",
                justifyContent: "center",
                shadowColor:
                  COLORS.primary,
                shadowOffset: {
                  width: 0,
                  height: 10,
                },
                shadowOpacity: 0.35,
                shadowRadius: 18,
                elevation: 10,
              }}
            >

              <Ionicons
                name="sparkles"
                size={38}
                color={COLORS.white}
              />

            </View>

            <Text
              style={{
                marginTop: 14,
                fontSize: 24,
                fontWeight: "800",
                letterSpacing: 0.5,
                color: COLORS.text,
              }}
            >
              Aureva
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: COLORS.subtext,
                letterSpacing: 1.5,
                marginTop: 2,
                textTransform:
                  "uppercase",
              }}
            >
              AI Powered Shopping
            </Text>

          </View>

          {/* Heading */}

          <View
            style={{
              marginTop: 28,
              marginBottom: 24,
            }}
          >

            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: COLORS.text,
                textAlign: "center",
              }}
            >
              Welcome Back
            </Text>

            <Text
              style={{
                fontSize: 15,
                color: COLORS.subtext,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Login to continue shopping.
            </Text>

          </View>

          {/* Card */}

          <View
            style={{
              backgroundColor:
                COLORS.white,
              borderRadius: 24,
              padding: 22,
              shadowColor:
                "#0F172A",
              shadowOffset: {
                width: 0,
                height: 12,
              },
              shadowOpacity: 0.08,
              shadowRadius: 24,
              elevation: 6,
              borderWidth: 1,
              borderColor: "#F1F5F9",
            }}
          >

            {/* Email */}

            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: COLORS.text,
                marginBottom: 8,
              }}
            >
              Email
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1.5,
                borderColor:
                  emailFocused
                    ? COLORS.primary
                    : COLORS.border,
                backgroundColor:
                  emailFocused
                    ? COLORS.primaryTint
                    : "#F8FAFC",
                borderRadius: 14,
                paddingHorizontal: 14,
                height: 54,
                marginBottom: 18,
              }}
            >

              <Ionicons
                name="mail-outline"
                size={20}
                color={
                  emailFocused
                    ? COLORS.primary
                    : COLORS.subtext
                }
              />

              <TextInput
                value={email}
                onChangeText={setEmail}
                onFocus={() =>
                  setEmailFocused(true)
                }
                onBlur={() =>
                  setEmailFocused(false)
                }
                placeholder="you@example.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 15,
                  color: COLORS.text,
                }}
              />

            </View>

            {/* Password */}

            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: COLORS.text,
                marginBottom: 8,
              }}
            >
              Password
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderWidth: 1.5,
                borderColor:
                  passwordFocused
                    ? COLORS.primary
                    : COLORS.border,
                backgroundColor:
                  passwordFocused
                    ? COLORS.primaryTint
                    : "#F8FAFC",
                borderRadius: 14,
                paddingHorizontal: 14,
                height: 54,
                marginBottom: 10,
              }}
            >

              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={
                  passwordFocused
                    ? COLORS.primary
                    : COLORS.subtext
                }
              />

              <TextInput
                value={password}
                onChangeText={setPassword}
                onFocus={() =>
                  setPasswordFocused(true)
                }
                onBlur={() =>
                  setPasswordFocused(false)
                }
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                style={{
                  flex: 1,
                  marginLeft: 10,
                  fontSize: 15,
                  color: COLORS.text,
                }}
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}
              >

                <Ionicons
                  name={
                    showPassword
                      ? "eye-off-outline"
                      : "eye-outline"
                  }
                  size={20}
                  color={COLORS.subtext}
                />

              </TouchableOpacity>

            </View>

            {/* ROLE SELECTION */}

            <View
              style={{
                marginTop: 14,
                marginBottom: 8,
              }}
            >

              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: COLORS.text,
                  marginBottom: 12,
                }}
              >
                Select Your Role
              </Text>

              <View
                style={{
                  flexDirection:
                    isSmallScreen
                      ? "column"
                      : "row",
                  justifyContent:
                    "space-between",
                  gap: 10,
                }}
              >

                {ROLES.map((role) => {

                  const isSelected =
                    selectedRole === role.key;

                  return (

                    <TouchableOpacity
                      key={role.key}
                      activeOpacity={0.85}
                      onPress={() =>
                        setSelectedRole(
                          role.key
                        )
                      }
                      style={{
                        flex:
                          isSmallScreen
                            ? undefined
                            : 1,
                        marginBottom:
                          isSmallScreen
                            ? 10
                            : 0,
                        borderRadius: 16,
                        paddingVertical: 14,
                        paddingHorizontal: 10,
                        alignItems: "center",
                        justifyContent:
                          "center",
                        borderWidth:
                          isSelected
                            ? 1.5
                            : 1,
                        borderColor:
                          isSelected
                            ? COLORS.primary
                            : COLORS.border,
                        backgroundColor:
                          isSelected
                            ? COLORS.primaryTint
                            : COLORS.white,
                        shadowColor:
                          isSelected
                            ? COLORS.primary
                            : "#0F172A",
                        shadowOffset: {
                          width: 0,
                          height:
                            isSelected
                              ? 6
                              : 2,
                        },
                        shadowOpacity:
                          isSelected
                            ? 0.18
                            : 0.04,
                        shadowRadius:
                          isSelected
                            ? 12
                            : 4,
                        elevation:
                          isSelected
                            ? 4
                            : 1,
                        position:
                          "relative",
                      }}
                    >

                      {isSelected && (

                        <View
                          style={{
                            position:
                              "absolute",
                            top: 8,
                            right: 8,
                            width: 18,
                            height: 18,
                            borderRadius: 9,
                            backgroundColor:
                              COLORS.primary,
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                          }}
                        >

                          <Ionicons
                            name="checkmark"
                            size={12}
                            color={
                              COLORS.white
                            }
                          />

                        </View>

                      )}

                      <Text
                        style={{
                          fontSize: 24,
                          marginBottom: 6,
                        }}
                      >
                        {role.emoji}
                      </Text>

                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color:
                            isSelected
                              ? COLORS.primaryDark
                              : COLORS.text,
                          marginBottom: 4,
                        }}
                      >
                        {role.label}
                      </Text>

                      <Text
                        style={{
                          fontSize: 11,
                          color:
                            COLORS.subtext,
                          textAlign:
                            "center",
                          lineHeight: 15,
                        }}
                      >
                        {role.description}
                      </Text>

                    </TouchableOpacity>

                  );

                })}

              </View>

            </View>

            {/* Remember Me */}

            <View
              style={{
                flexDirection: "row",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 4,
              }}
            >

              <TouchableOpacity
                onPress={() =>
                  setRememberMe(
                    (prev) => !prev
                  )
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >

                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    borderWidth: 1.5,
                    borderColor:
                      rememberMe
                        ? COLORS.primary
                        : COLORS.border,
                    backgroundColor:
                      rememberMe
                        ? COLORS.primary
                        : COLORS.white,
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    marginRight: 8,
                  }}
                >

                  {rememberMe && (

                    <Ionicons
                      name="checkmark"
                      size={14}
                      color={COLORS.white}
                    />

                  )}

                </View>

                <Text
                  style={{
                    fontSize: 13,
                    color: COLORS.subtext,
                  }}
                >
                  Remember Me
                </Text>

              </TouchableOpacity>

              <TouchableOpacity>

                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: COLORS.primary,
                  }}
                >
                  Forgot Password?
                </Text>

              </TouchableOpacity>

            </View>

          </View>

                    {/* Login Button */}

          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.85}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 16,
              height: 56,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 26,
              shadowColor: COLORS.primary,
              shadowOffset: {
                width: 0,
                height: 10,
              },
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
              Login
            </Text>
          </TouchableOpacity>

          {/* Continue as Guest */}

          <TouchableOpacity
            onPress={handleGuest}
            activeOpacity={0.85}
            style={{
              backgroundColor: COLORS.white,
              borderRadius: 16,
              height: 56,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 14,
              borderWidth: 1.5,
              borderColor: COLORS.primarySoft,
            }}
          >
            <Text
              style={{
                color: COLORS.primary,
                fontSize: 15,
                fontWeight: "700",
              }}
            >
              Continue as Guest
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
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: COLORS.border,
              }}
            />

            <Text
              style={{
                marginHorizontal: 12,
                color: COLORS.subtext,
                fontSize: 12,
              }}
            >
              or
            </Text>

            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: COLORS.border,
              }}
            />
          </View>

          {/* Register */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: COLORS.subtext,
              }}
            >
              Don't have an account?{" "}
            </Text>

            <TouchableOpacity
              onPress={handleRegisterNav}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: COLORS.primary,
                }}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>

  );

}