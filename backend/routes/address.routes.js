import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router.post(
  "/",
  protect,
  addAddress
);

router.get(
  "/",
  protect,
  getAddresses
);

router.put(
  "/:id",
  protect,
  updateAddress
);

router.delete(
  "/:id",
  protect,
  deleteAddress
);

export default router;