import api from "./api";

export const createOrder = async (
  items,
  addressId
) => {

  const response =
    await api.post(
      "/orders",
      {
        items,
        addressId,
      }
    );

  return response.data;
};


export const getMyOrders =
  async () => {

    const response =
      await api.get(
        "/orders/my-orders"
      );

    return response.data;
  };