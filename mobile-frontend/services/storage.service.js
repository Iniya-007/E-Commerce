import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUser = async (
  user,
  token
) => {
  try {
    await AsyncStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    await AsyncStorage.setItem(
      "token",
      token
    );
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async () => {
  try {
    const user =
      await AsyncStorage.getItem(
        "user"
      );

    const token =
      await AsyncStorage.getItem(
        "token"
      );

    return {
      user: user
        ? JSON.parse(user)
        : null,
      token,
    };
  } catch (error) {
    console.log(error);

    return {
      user: null,
      token: null,
    };
  }
};

export const logoutUser =
  async () => {
    try {
      await AsyncStorage.removeItem(
        "user"
      );

      await AsyncStorage.removeItem(
        "token"
      );
    } catch (error) {
      console.log(error);
    }
  };