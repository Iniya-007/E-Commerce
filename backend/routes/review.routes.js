import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createReview,
  getProductReviews,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  createReview
);

router.get(
  "/:productId",
  getProductReviews
);

router.delete(
  "/:id",
  protect,
  deleteReview
);

export default router;