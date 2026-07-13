import mongoose from "mongoose";

const paymentSchema =
  new mongoose.Schema(
    {
      user: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "User",
        required: true,
      },

      order: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Order",
        required: true,
      },

      amount: {
        type: Number,
        required: true,
      },

      paymentMethod: {
        type: String,
        enum: [
          "COD",
          "UPI",
          "Card",
          "NetBanking",
        ],
        default: "UPI",
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Success",
          "Failed",
        ],
        default: "Pending",
      },

      transactionId: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  );

const Payment = mongoose.model(
  "Payment",
  paymentSchema
);

export default Payment;