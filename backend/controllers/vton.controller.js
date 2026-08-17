import axios from "axios";
import User from "../models/User.js";
import Product from "../models/Product.js";

const VTON_API_URL = process.env.VTON_API_URL;

export const tryOnProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    console.log("================================");
    console.log("VTON REQUEST STARTED");
    console.log("Product ID:", productId);
    console.log("================================");

    // 1. Check product ID
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // 2. Check VTON URL
    if (!VTON_API_URL) {
      return res.status(500).json({
        success: false,
        message: "VTON_API_URL is not configured",
      });
    }

    console.log("VTON API URL:", VTON_API_URL);

    // 3. Get logged-in user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Check profile image
    if (!user.profileImage) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload a profile image before using Virtual Try-On",
      });
    }

    // 5. Get product
    const product = await Product.findById(productId)
      .populate("category");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 6. Check Fashion category
    const categoryName =
      product.category?.name?.toLowerCase();

    console.log("Product category:", categoryName);

    if (categoryName !== "fashion") {
      return res.status(400).json({
        success: false,
        message:
          "Virtual Try-On is available only for Fashion products",
      });
    }

    // 7. Check product image
    if (
      !product.images ||
      product.images.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Product image not available",
      });
    }

    const personImage = user.profileImage;
    const garmentImage = product.images[0];

    console.log("User:", user._id);
    console.log("Product:", product._id);
    console.log("Person:", personImage);
    console.log("Garment:", garmentImage);

    // 8. Call Python VTON API
    console.log("Calling Python VTON API...");
    console.log("VTON URL:", VTON_API_URL);

    const response = await axios.post(
      VTON_API_URL,
      {
        personImage,
        garmentImage,
        category: "tops",
      },
      {
        timeout: 600000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // 9. Check Python response
    console.log(
      "VTON response status:",
      response.status
    );

    console.log(
      "VTON response success:",
      response.data?.success
    );

    console.log(
      "VTON image received:",
      !!response.data?.image
    );

    console.log(
      "VTON image length:",
      response.data?.image?.length
    );

    // 10. Validate Python response
    if (
      !response.data?.success ||
      !response.data?.image
    ) {
      throw new Error(
        "Python VTON did not return an image"
      );
    }

    // 11. Send Base64 image to frontend
    return res.json({
      success: true,
      image: response.data.image,
    });

  } catch (error) {

    console.error("================================");
    console.error("VTON ERROR");
    console.error("================================");

    console.error(
      "Message:",
      error.message
    );

    if (error.response) {

      console.error(
        "VTON STATUS:",
        error.response.status
      );

      console.error(
        "VTON HEADERS:",
        error.response.headers
      );

      try {
        console.error(
          "VTON RESPONSE:",
          typeof error.response.data === "string"
            ? error.response.data
            : JSON.stringify(error.response.data)
        );
      } catch {
        console.error(
          "Could not read VTON error response"
        );
      }
    }

    console.error("================================");

    return res.status(500).json({
      success: false,
      message:
        "Virtual Try-On generation failed",
      error: error.message,
    });
  }
};


export const testVtonConnection = async (req, res) => {
  try {
    console.log("Testing VTON connection...");

    const healthUrl = VTON_API_URL.replace("/vton", "/health");

    console.log("Health URL:", healthUrl);

    const response = await axios.get(
      healthUrl,
      {
        timeout: 15000,
      }
    );

    return res.json({
      success: true,
      message: "Node connected to Python VTON API",
      pythonResponse: response.data,
    });

  } catch (error) {
    console.error(
      "VTON HEALTH ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Could not connect to Python VTON API",
      error: error.message,
    });
  }
};