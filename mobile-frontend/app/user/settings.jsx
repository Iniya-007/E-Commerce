import { View, Text } from "react-native";

export default function SettingsScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
        }}
      >
        Settings
      </Text>
    </View>
  );
}