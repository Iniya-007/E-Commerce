import mongoose from "mongoose";

const sellerProfileSchema = new mongoose.Schema(
  {
    isSeller: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: [
        "not_applied",
        "pending",
        "approved",
        "rejected",
      ],
      default: "not_applied",
    },

    storeName: {
      type: String,
      default: "",
    },

    businessName: {
      type: String,
      default: "",
    },

    gstNumber: {
      type: String,
      default: "",
    },

    panNumber: {
      type: String,
      default: "",
    },

    aadhaarNumber: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    bankName: {
      type: String,
      default: "",
    },

    accountNumber: {
      type: String,
      default: "",
    },

    ifscCode: {
      type: String,
      default: "",
    },

    documents: [
      {
        type: String,
      },
    ],
  },
  {
    _id: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },

    recentlyViewed: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    sellerProfile: sellerProfileSchema,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;