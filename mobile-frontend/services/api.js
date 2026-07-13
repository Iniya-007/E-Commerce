import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const host =
  Constants.expoConfig?.hostUri?.split(":")[0];

const api = axios.create({
  baseURL: `http://${host}:5000/api`,
});

api.interceptors.request.use(
  async (config) => {
    const token =
      await AsyncStorage.getItem(
        "token"
      );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  }
);

export default api;