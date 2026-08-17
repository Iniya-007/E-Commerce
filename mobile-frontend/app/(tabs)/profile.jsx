import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  ScrollView,
} from "react-native";

import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";


import {
  getUser,
  logoutUser,
  saveUser,
} from "../../services/storage.service";

import {
  removeProfilePhoto,
  getProfile,
} from "../../services/auth.service";

import * as ImagePicker from "expo-image-picker";
import { useActionSheet } from "@expo/react-native-action-sheet";
import api from "../../services/api";

import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback } from "react";


export default function ProfileScreen() {
  const { showActionSheetWithOptions } =
  useActionSheet();

  const [user, setUser] =
    useState(null);

  const [selectedImage, setSelectedImage] =
    useState(null);

  const [viewPhotoVisible, setViewPhotoVisible] =
  useState(false);

  useFocusEffect(

  useCallback(() => {

    loadUser();

  }, [])

);

  const loadUser = async () => {
  try {
    const data = await getProfile();
    setUser(data.user);
  } catch (error) {
    console.log(error);
  }
};

    const showProfileOptions = () => {

  const options = [

    "View Photo",

    "Take Photo",

    "Upload Photo",

    "Remove Photo",

    "Cancel"

  ];

  const cancelButtonIndex = 4;

  showActionSheetWithOptions(

    {

      options,

      cancelButtonIndex,

      destructiveButtonIndex: 3,

    },

    (selectedIndex) => {

      switch (selectedIndex) {

        case 0:
          viewPhoto();
          break;

        case 1:
          takePhoto();
          break;

        case 2:
          pickImage();
          break;

        case 3:
          removePhoto();
          break;

      }

    }

  );

};

  const handleLogout =
    async () => {
      Alert.alert(
        "Logout",
        "Are you sure?",
        [
          {
            text: "Cancel",
          },
          {
            text: "Logout",
            onPress:
              async () => {
                await logoutUser();

                router.replace(
                  "/auth/login"
                );
              },
          },
        ]
      );
    };

    
        const viewPhoto = () => {

          if (!(selectedImage || user?.profileImage)) {

            Alert.alert(
              "No Photo",
              "Please upload a profile photo."
            );

          return;

          }

          setViewPhotoVisible(true);

        };

  const takePhoto = async () => {

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {

        Alert.alert(
          "Permission Required",
          "Please allow camera access."
        );

        return;

      }

      const result =
        await ImagePicker.launchCameraAsync({

          allowsEditing: true,

          aspect: [1, 1],

          quality: 0.8,

        });

      if (!result.canceled) {

        setSelectedImage(
          result.assets[0].uri
        );
        await uploadProfileImage(result.assets[0]);

      }

};

        const removePhoto = () => {

      if (!(selectedImage || user?.profileImage)) {

        Alert.alert(
          "No Photo",
          "No profile photo found."
        );

        return;

      }

      Alert.alert(

        "Remove Photo",

        "Are you sure you want to remove your profile photo?",

        [

          {

            text: "Cancel",

            style: "cancel",

          },

          {

            text: "Remove",

            style: "destructive",

            onPress: async () => {

              try {

                await removeProfilePhoto();

                setSelectedImage(null);

                const updatedUser = {

                  ...user,

                  profileImage: "",

                  profileImagePublicId: "",

                };

                setUser(updatedUser);

                await saveUser(
                  updatedUser,
                  (await getUser()).token
                );

                Alert.alert(

                  "Success",

                  "Profile photo removed."

                );

          }

          catch (error) {

            Alert.alert(

              "Error",

              error.response?.data?.message ||

              "Unable to remove photo."

            );

          }

        },

      },

    ]

  );

};




const uploadProfileImage = async (image) => {

  try {

    const formData =
      new FormData();

    const fileType =
  image.mimeType ||
  "image/jpeg";

const fileName =
  image.fileName ||
  `profile.${fileType.split("/")[1]}`;

    formData.append(
      "profileImage",
      {

        uri: image.uri,

        name: "profile.jpg",

        type: "image/jpeg",


      }

    );

    const response =
      await api.patch(

        "/users/profile-image",

        formData,

        {

          headers: {

            "Content-Type":
              "multipart/form-data",

          },

        }

      );

    const updatedUser = {

  ...user,

  profileImage: response.data.profileImage,

  profileImagePublicId:
    response.data.user.profileImagePublicId,

};

setUser(updatedUser);

await saveUser(
  updatedUser,
  (await getUser()).token
);
    

    Alert.alert(

      "✅ Upload Successful",

      "Your profile photo has been updated."

    );

  }
  catch (error) {

  console.log("UPLOAD ERROR:", error);

  console.log("STATUS:", error.response?.status);

  console.log("DATA:", error.response?.data);

  console.log("MESSAGE:", error.message);

  Alert.alert(
    "Upload Failed",
    error.response?.data?.message ||
      error.message ||
      "Something went wrong."
  );

}

};





  const pickImage = async () => {

  const permission =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {

    Alert.alert(
      "Permission Required",
      "Please allow gallery access."
    );

    return;
  }

  const result =
    await ImagePicker.launchImageLibraryAsync({

      mediaTypes: ["images"],

      allowsEditing: true,

      aspect: [1, 1],

      quality: 0.8,

    });

  if (!result.canceled) {

    setSelectedImage(result.assets[0].uri);

   await uploadProfileImage(result.assets[0]);

  }

};

  return (

    <View
    style={{
      flex: 1,
      backgroundColor: "#F3F4F6",
    }}
  >
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 18,
        paddingTop: 15,
        paddingBottom: 120,
      }}
    >

     
  <View
    style={{
      flex: 1,
      backgroundColor: "#F5F7FB",
      paddingHorizontal: 18,
      paddingTop: 45,
    }}
  >
    {/* TITLE */}
    <Text
      style={{
        fontSize: 34,
        fontWeight: "bold",
        color: "#111827",
        marginBottom: 15,
      }}
    >
      Profile
    </Text>

    {/* USER CARD */}
   
      {/* ================= PROFILE HEADER ================= */}

<View
  style={{
    backgroundColor: "#4F46E5",
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  }}
>

  {/* Profile Photo */}

  <TouchableOpacity
    onPress={showProfileOptions}
    activeOpacity={0.9}
  >

    {selectedImage || user?.profileImage ? (

      <Image
        source={{
          uri: selectedImage || user?.profileImage,
        }}
        style={{
          width: 110,
          height: 110,
          borderRadius: 55,
          borderWidth: 4,
          borderColor: "#fff",
        }}
      />

    ) : (

      <View
        style={{
          width: 110,
          height: 110,
          borderRadius: 55,
          backgroundColor: "#E5E7EB",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <Text
          style={{
            fontSize: 42,
            color: "#4F46E5",
            fontWeight: "bold",
          }}
        >
          {user?.name?.charAt(0)}
        </Text>

      </View>

    )}

    {/* Camera Button */}

    <View
      style={{
        position: "absolute",
        bottom: 2,
        right: 2,
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons
        name="camera"
        color="white"
        size={18}
      />
    </View>

  </TouchableOpacity>

  {/* Name */}

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginTop: 18,
    }}
  >

    <Text
      style={{
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
      }}
    >
      {user?.name}
    </Text>

    <TouchableOpacity
      onPress={() => router.push("/user/edit-profile")}
      style={{
        marginLeft: 8,
      }}
    >
      <Ionicons
        name="create-outline"
        color="white"
        size={20}
      />
    </TouchableOpacity>

  </View>

  {/* Email */}

  <Text
    style={{
      color: "#E5E7EB",
      marginTop: 6,
      fontSize: 15,
    }}
  >
    {user?.email}
  </Text>

</View>

{/* ================= QUICK ACTIONS ================= */}

<View
  style={{
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  }}
>

  {/* Orders */}

  <TouchableOpacity
    onPress={() => router.push("/orders")}
    style={{
      width: "48%",
      backgroundColor: "#fff",
      borderRadius: 18,
      paddingVertical: 22,
      alignItems: "center",
      marginBottom: 15,
      elevation: 3,
    }}
  >

    <Ionicons
      name="cube-outline"
      size={30}
      color="#4F46E5"
    />

    <Text
      style={{
        marginTop: 10,
        fontWeight: "700",
        fontSize: 16,
      }}
    >
      Orders
    </Text>

    <Text
      style={{
        color: "#6B7280",
        marginTop: 3,
      }}
    >
      View Orders
    </Text>

  </TouchableOpacity>

  {/* Wishlist */}

  <TouchableOpacity
    onPress={() => router.push("/wishlist")}
    style={{
      width: "48%",
      backgroundColor: "#fff",
      borderRadius: 18,
      paddingVertical: 22,
      alignItems: "center",
      marginBottom: 15,
      elevation: 3,
    }}
  >

    <Ionicons
      name="heart-outline"
      size={30}
      color="#EF4444"
    />

    <Text
      style={{
        marginTop: 10,
        fontWeight: "700",
        fontSize: 16,
      }}
    >
      Wishlist
    </Text>

    <Text
      style={{
        color: "#6B7280",
        marginTop: 3,
      }}
    >
      Saved Items
    </Text>

  </TouchableOpacity>

  {/* Address */}

  <TouchableOpacity
    onPress={() => router.push("/user/addresses")}
    style={{
      width: "48%",
      backgroundColor: "#fff",
      borderRadius: 18,
      paddingVertical: 22,
      alignItems: "center",
      elevation: 3,
    }}
  >

    <Ionicons
      name="location-outline"
      size={30}
      color="#10B981"
    />

    <Text
      style={{
        marginTop: 10,
        fontWeight: "700",
        fontSize: 16,
      }}
    >
      Address
    </Text>

    <Text
      style={{
        color: "#6B7280",
        marginTop: 3,
      }}
    >
      Manage
    </Text>

  </TouchableOpacity>

  {/* Coupons */}

  <TouchableOpacity
    style={{
      width: "48%",
      backgroundColor: "#fff",
      borderRadius: 18,
      paddingVertical: 22,
      alignItems: "center",
      elevation: 3,
    }}
  >

    <Ionicons
      name="ticket-outline"
      size={30}
      color="#F59E0B"
    />

    <Text
      style={{
        marginTop: 10,
        fontWeight: "700",
        fontSize: 16,
      }}
    >
      Coupons
    </Text>

    <Text
      style={{
        color: "#6B7280",
        marginTop: 3,
      }}
    >
      Offers
    </Text>

  </TouchableOpacity>

</View>

   {/* ================= ACCOUNT ================= */}

<Text
  style={{
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 5,
    letterSpacing: 1,
  }}
>
  ACCOUNT
</Text>

<View
  style={{
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 22,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
  }}
>

  {/* Settings */}

  <TouchableOpacity
    onPress={() => router.push("/user/settings")}
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderColor: "#F3F4F6",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: "#EEF2FF",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="settings-outline"
          size={20}
          color="#4F46E5"
        />
      </View>

      <Text
        style={{
          marginLeft: 14,
          fontSize: 16,
          fontWeight: "600",
          color: "#111827",
        }}
      >
        Settings
      </Text>
    </View>

    <Ionicons
      name="chevron-forward"
      size={20}
      color="#9CA3AF"
    />
  </TouchableOpacity>

  {/* Help Center */}

  <TouchableOpacity
    onPress={() => router.push("/user/help")}
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderColor: "#F3F4F6",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: "#FEF3C7",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="help-circle-outline"
          size={20}
          color="#D97706"
        />
      </View>

      <Text
        style={{
          marginLeft: 14,
          fontSize: 16,
          fontWeight: "600",
          color: "#111827",
        }}
      >
        Help Center
      </Text>
    </View>

    <Ionicons
      name="chevron-forward"
      size={20}
      color="#9CA3AF"
    />
  </TouchableOpacity>

  {/* Seller */}

  <TouchableOpacity
    onPress={() => router.push("/seller/dashboard")}
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingVertical: 16,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: "#DCFCE7",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="storefront-outline"
          size={20}
          color="#16A34A"
        />
      </View>

      <Text
        style={{
          marginLeft: 14,
          fontSize: 16,
          fontWeight: "600",
          color: "#111827",
        }}
      >
        Seller Dashboard
      </Text>
    </View>

    <Ionicons
      name="chevron-forward"
      size={20}
      color="#9CA3AF"
    />
  </TouchableOpacity>

</View>

{/* ================= LOGOUT ================= */}

<TouchableOpacity
  onPress={handleLogout}
  style={{
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
  }}
>

  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#FEE2E2",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Ionicons
        name="log-out-outline"
        size={22}
        color="#DC2626"
      />
    </View>

    <Text
      style={{
        marginLeft: 14,
        fontSize: 17,
        fontWeight: "700",
        color: "#DC2626",
      }}
    >
      Logout
    </Text>
  </View>

  <Ionicons
    name="chevron-forward"
    size={20}
    color="#9CA3AF"
  />

</TouchableOpacity>

<Text
  style={{
    textAlign: "center",
    color: "#9CA3AF",
    marginTop: 25,
    marginBottom: 20,
    fontSize: 13,
  }}
>
  Aureva v1.0
</Text>

    {/* APP VERSION */}
    <Text
      style={{
        textAlign: "center",
        color: "#94A3B8",
        marginTop: 15,
        fontSize: 12,
      }}
    >
      Aureva v1.0
    </Text>

    <Modal
  visible={viewPhotoVisible}
  animationType="fade"
  transparent
>

  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.95)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >

    <TouchableOpacity
      onPress={() =>
        setViewPhotoVisible(false)
      }
      style={{
        position: "absolute",
        top: 60,
        right: 25,
        zIndex: 10,
      }}
    >

      <Text
        style={{
          color: "#fff",
          fontSize: 32,
        }}
      >
        ✕
      </Text>

    </TouchableOpacity>

    <Image
      source={{
        uri:
          selectedImage ||
          user?.profileImage,
      }}
      style={{
        width: 320,
        height: 320,
        borderRadius: 160,
      }}
      resizeMode="cover"
    />

  </View>

</Modal>
  </View>

  </ScrollView>
  </View>

);
}

