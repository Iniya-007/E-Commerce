import { Platform } from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

let API_URL = "";

if (Platform.OS === "web") {
  // Running in browser
  API_URL = "http://localhost:5000/api";
} else {
  // Running in Expo Go / Android
  const host = Constants.expoConfig?.hostUri?.split(":")[0];
  API_URL = `http://${host}:5000/api`;
}

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;