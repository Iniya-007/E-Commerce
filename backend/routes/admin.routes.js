import express from "express";

import protect from "../middleware/auth.middleware.js";
import admin from "../middleware/admin.middleware.js";

import {
  getDashboardStats,
  getSalesAnalytics,
  getBestSellingProducts,
  getLowStockProducts,
} from "../controllers/admin.controller.js";

const router =
  express.Router();

router.get(
  "/dashboard",
  protect,
  admin,
  getDashboardStats
);

router.get(
  "/analytics",
  protect,
  admin,
  getSalesAnalytics
);

router.get(
  "/best-selling",
  protect,
  admin,
  getBestSellingProducts
);

router.get(
  "/low-stock",
  protect,
  admin,
  getLowStockProducts
);

export default router;