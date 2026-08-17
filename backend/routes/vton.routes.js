import express from "express";

import protect from "../middleware/auth.middleware.js";

import {
  tryOnProduct,
  testVtonConnection,
} from "../controllers/vton.controller.js";

const router = express.Router();


// -----------------------------------------
// Test Node → Python VTON connection
// -----------------------------------------

router.get(
  "/test",
  testVtonConnection
);


// -----------------------------------------
// Actual VTON
// -----------------------------------------

router.post(
  "/try-on",
  protect,
  tryOnProduct
);

export default router;