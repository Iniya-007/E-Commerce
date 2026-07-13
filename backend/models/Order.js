import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: {
      type: String,
      required: true,
    },

    priceAtPurchase: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
],

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
        type: String,
        enum: [
          "Placed",
          "Processing",
          "Packed",
          "Shipped",
          "Out For Delivery",
          "Delivered",
          "Cancelled",
        ],
        default: "Placed",
      },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },

    discountAmount: {
        type: Number,
        default: 0,
    },

    finalPrice: {
        type: Number,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;