import axios from "axios";

const ML_URL = "http://127.0.0.1:8000";

export const predictPrice = async (product) => {
  try {

    const response = await axios.post(
      `${ML_URL}/predict`,
      {
        product_name:
          product.name,

        description:
          product.description || "",

        brand:
          product.brand || "",

        category:
          product.category?.name ||
          product.category ||
          "",

        current_price:
          Number(product.price),

        price_history:
          (product.priceHistory || []).map(
            (entry) => Number(entry.price)
          ),
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "ML prediction error:",
      error.response?.data ||
      error.message
    );

    throw new Error(
      "Price prediction service failed"
    );
  }
};