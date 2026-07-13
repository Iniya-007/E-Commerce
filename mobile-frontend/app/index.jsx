import { Redirect } from "expo-router";
import {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
} from "react-native";

import {
  getUser,
} from "../services/storage.service";

export default function Index() {
  const [loading, setLoading] =
    useState(true);

  const [loggedIn, setLoggedIn] =
    useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin =
    async () => {
      const data =
        await getUser();

      console.log(
        "STORAGE DATA:",
        data
      );

      if (data.token) {
        setLoggedIn(true);
      }

      setLoading(false);
    };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent:
            "center",
          alignItems:
            "center",
        }}
      >
        <Text>
          Checking Login...
        </Text>
      </View>
    );
  }

  return loggedIn ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/auth/login" />
  );
}