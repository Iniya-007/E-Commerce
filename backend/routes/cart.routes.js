import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  addToCart
);

router.get(
  "/",
  protect,
  getCart
);

router.put(
  "/:productId",
  protect,
  updateCartQuantity
);

router.delete(
  "/:productId",
  protect,
  removeFromCart
);

export default router;