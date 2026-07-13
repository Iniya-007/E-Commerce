import express from "express";

import protect from "../middleware/auth.middleware.js";
import admin from "../middleware/admin.middleware.js";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get(
  "/",
  getCategories
);

router.post(
  "/",
  protect,
  admin,
  createCategory
);

router.put(
  "/:id",
  protect,
  admin,
  updateCategory
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteCategory
);

export default router;