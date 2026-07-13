import express from "express";

import protect from "../middleware/auth.middleware.js";
import admin from "../middleware/admin.middleware.js";

import {
  createCoupon,
  getCoupons,
  applyCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

// Public
router.get("/", getCoupons);

// Admin Only
router.post(
  "/",
  protect,
  admin,
  createCoupon
);

// Logged-in User
router.post(
  "/apply",
  protect,
  applyCoupon
);

export default router;