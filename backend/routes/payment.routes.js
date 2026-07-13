import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  createPayment,
  paymentSuccess,
  paymentFailed,
} from "../controllers/payment.controller.js";

const router =
  express.Router();

router.post(
  "/",
  protect,
  createPayment
);

router.put(
  "/success/:id",
  protect,
  paymentSuccess
);

router.put(
  "/failed/:id",
  protect,
  paymentFailed
);

export default router;