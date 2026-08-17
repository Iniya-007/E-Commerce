import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { saveUser, getUser } from "../../services/storage.service";

import {
  updateProfile,
} from "../../services/auth.service";


import { Alert } from "react-native";

export default function EditProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const data = await getUser();

    if (data?.user) {
      setName(data.user.name || "");
      setEmail(data.user.email || "");
      setPhone(data.user.phone || "");
      setProfileImage(data.user.profileImage || "");
    }
  };

  const handleSave = async () => {

  console.log("Save button clicked");

  console.log({
    name,
    email,
    phone,
  });

  try {

    const res = await updateProfile({
      name,
      email,
      phone,
    });

    console.log("SUCCESS RESPONSE:", res);

    const current = await getUser();

    await saveUser(
      {
        ...current.user,
        ...res.user,
      },
      current.token
    );

    Alert.alert("Success", "Profile updated successfully");

    router.back();

  } catch (error) {

    console.log("FULL ERROR:", error);

    console.log("STATUS:", error.response?.status);

    console.log("DATA:", error.response?.data);

    Alert.alert(
      "Error",
      error.response?.data?.message || "Profile update failed"
    );
  }
};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={26}
              color="#222"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Edit Profile
          </Text>

          <View style={{ width: 26 }} />
        </View>

        {/* Profile Photo */}

        <View style={styles.imageContainer}>
          
            <Image
            source={
                profileImage
                ? { uri: profileImage }
                : require("../../assets/images/default-avatar.png")
            }
            style={styles.image}
            />

          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons
              name="camera"
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
        </View>

        {/* Form */}

        <View style={styles.form}>

          <Text style={styles.label}>
            Full Name
          </Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={setEmail}
          />

          <Text style={styles.label}>
            Phone Number
          </Text>

          <TextInput
            style={styles.input}
            value={phone}
            keyboardType="phone-pad"
            onChangeText={setPhone}
          />

        </View>

        {/* Save Button */}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>
            Save Changes
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F8F9FC",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
  },

  imageContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ddd",
  },

  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 120,
    backgroundColor: "#6C63FF",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },

  form: {
    paddingHorizontal: 20,
  },

  label: {
    fontSize: 15,
    color: "#555",
    marginBottom: 8,
    marginTop: 15,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 18,
    height: 56,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  button: {
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 30,
    backgroundColor: "#6C63FF",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});