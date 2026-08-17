import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  becomeSeller,
  updateStore,
  uploadProfileImage,
  deleteProfileImage,
  getProfile,
  updateProfile,
} from "../controllers/user.controller.js";

import upload from "../middleware/upload.middleware.js";


const router = express.Router();

// Become Seller
router.put(
  "/become-seller",
  protect,
  becomeSeller
);

// Update Store
router.put(
  "/store",
  protect,
  updateStore
);

router.patch(
    "/profile-image",
    protect,
    upload.single("profileImage"),
    uploadProfileImage
);

router.delete(
    "/profile-image",
    protect,
    deleteProfileImage
);

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

export default router;