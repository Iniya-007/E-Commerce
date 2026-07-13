import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  addRecentlyViewed,
  getRecentlyViewed,
} from "../controllers/recent.controller.js";

const router =
  express.Router();

router.post(
  "/:productId",
  protect,
  addRecentlyViewed
);

router.get(
  "/",
  protect,
  getRecentlyViewed
);

export default router;