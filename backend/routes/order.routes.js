import express from "express";

import protect from "../middleware/auth.middleware.js";

import { updateOrderStatus } from "../controllers/order.controller.js";

import admin from "../middleware/admin.middleware.js";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/order.controller.js";


const router = express.Router();

router.post("/", protect, createOrder);

//router.get("/", protect, getMyOrders);


router.get(
  "/my-orders",
  protect,
  getMyOrders
);

router.get("/:id", protect, getOrderById);


router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);

router.put(
  "/:id/status",
  protect,
  admin,
  updateOrderStatus
);



export default router;