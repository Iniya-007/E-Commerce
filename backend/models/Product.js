import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Seller
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Basic Details
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Pricing
    price: {
      type: Number,
      required: true,
    },

    aiSuggestedPrice: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    // Inventory
    stock: {
      type: Number,
      default: 0,
    },

    sku: {
      type: String,
      default: "",
    },

    // Specifications
    color: {
      type: String,
      default: "",
    },

    size: {
      type: String,
      default: "",
    },

    material: {
      type: String,
      default: "",
    },

    weight: {
      type: Number,
      default: 0,
    },

    // Images
    images: [
      {
        type: String,
      },
    ],

    // AI Features
    virtualTryOn: {
      type: Boolean,
      default: false,
    },

    returnPrediction: {
      type: Boolean,
      default: true,
    },

    predictedReturnRate: {
      type: Number,
      default: 0,
    },

    // Ratings
    averageRating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;