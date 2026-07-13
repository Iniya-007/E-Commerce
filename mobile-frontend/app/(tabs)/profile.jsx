import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";

import { router } from "expo-router";

import {
  getUser,
  logoutUser,
} from "../../services/storage.service";

export default function ProfileScreen() {
  const [user, setUser] =
    useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser =
    async () => {
      const data =
        await getUser();

      setUser(data.user);
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

  return (
  <View
    style={{
      flex: 1,
      backgroundColor: "#F5F7FB",
      paddingHorizontal: 15,
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
    <View
      style={{
        backgroundColor: "#1E293B",
        borderRadius: 20,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        elevation: 4,
      }}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: "#2563EB",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          {user?.name?.charAt(0)}
        </Text>
      </View>

      <View
        style={{
          marginLeft: 15,
          flex: 1,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {user?.name}
        </Text>

        <Text
          style={{
            color: "#CBD5E1",
            marginTop: 2,
          }}
        >
          {user?.email}
        </Text>
      </View>
    </View>

    {/* QUICK ACTIONS */}
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 15,
      }}
    >
      <TouchableOpacity
onPress={() => router.push("/orders")}
style={{
width:"48%",
height:75,
backgroundColor:"white",
borderRadius:15,
justifyContent:"center",
alignItems:"center",
marginBottom:10,
elevation:2
}}
>

<Text
style={{
fontSize:15,
fontWeight:"600"
}}
>

📦 Orders

</Text>

</TouchableOpacity>



<TouchableOpacity

onPress={() => router.push("/wishlist")}

style={{

width:"48%",
height:75,
backgroundColor:"white",
borderRadius:15,
justifyContent:"center",
alignItems:"center",
marginBottom:10,
elevation:2

}}

>

<Text

style={{

fontSize:15,
fontWeight:"600"

}}

>

❤️ Wishlist

</Text>

</TouchableOpacity>



<TouchableOpacity

style={{

width:"48%",
height:75,
backgroundColor:"white",
borderRadius:15,
justifyContent:"center",
alignItems:"center",
marginBottom:10,
elevation:2

}}

>

<Text

style={{

fontSize:15,
fontWeight:"600"

}}

>

📍 Address

</Text>

</TouchableOpacity>



<TouchableOpacity

style={{

width:"48%",
height:75,
backgroundColor:"white",
borderRadius:15,
justifyContent:"center",
alignItems:"center",
marginBottom:10,
elevation:2

}}

>

<Text

style={{

fontSize:15,
fontWeight:"600"

}}

>

🎟 Coupons

</Text>

</TouchableOpacity>
    </View>

    {/* MENU */}
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 15,
        overflow: "hidden",
        elevation: 2,
      }}
    >
      <TouchableOpacity

      onPress={() => Alert.alert("Coming Soon")}

        style={{
          padding: 14,
          borderBottomWidth: 1,
          borderColor: "#F1F5F9",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          ❓ Help Center
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          padding: 14,
          borderBottomWidth: 1,
          borderColor: "#F1F5F9",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          ⚙ Settings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          padding: 14,
        }}
      >
        <Text
          style={{
            color: "#DC2626",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          🚪 Logout
        </Text>
      </TouchableOpacity>
    </View>

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
  </View>
);
}