import api from "./api";

export const createOrder =
  async (items) => {
    const response =
      await api.post(
        "/orders",
        {
          items,
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