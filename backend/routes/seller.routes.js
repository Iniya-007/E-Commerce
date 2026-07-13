import express from "express";
import protect from "../middleware/auth.middleware.js";

import {
  activateSeller,
  getSellerProfile,
  updateSellerProfile,
  getSellerDashboard,
} from "../controllers/seller.controller.js";

const router = express.Router();

router.post("/activate", protect, activateSeller);

router.get("/profile", protect, getSellerProfile);

router.put("/profile", protect, updateSellerProfile);

router.get("/dashboard", protect, getSellerDashboard);

export default router;