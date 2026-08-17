import api from "./api";

export const tryOnProduct = async (productId) => {
  const response = await api.post("/vton/try-on", {
    productId,
  });

  return response.data;
};