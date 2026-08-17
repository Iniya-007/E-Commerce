import api from "./api";

export const registerUser = async (
  userData
) => {
  const response =
    await api.post(
      "/auth/register",
      userData
    );

  return response.data;
};

export const loginUser = async (
  userData
) => {
  const response =
    await api.post(
      "/auth/login",
      userData
    );

  return response.data;
};

export const removeProfilePhoto = async () => {

  const response =
    await api.delete(
      "/users/profile-image"
    );

  return response.data;

};

export const getProfile = async () => {

  const response = await api.get("/users/profile");

  return response.data;

};

export const updateProfile = async (data) => {

  const response = await api.put(
    "/users/profile",
    data
  );

  return response.data;

};