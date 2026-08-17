import express from "express";
import protect from "../middleware/auth.middleware.js";
import admin from "../middleware/admin.middleware.js";

import {
  createProduct,
  getProducts,
  getProductById,
} from "../controllers/product.controller.js";

import { getFeaturedProducts } from "../controllers/product.controller.js";
import { getRelatedProducts } from "../controllers/product.controller.js";
import { updateProduct } from "../controllers/product.controller.js";
import { deleteProduct } from "../controllers/product.controller.js";
import upload from "../middleware/upload.middleware.js";
import { uploadProductImage } from "../controllers/product.controller.js";

const router = express.Router();


router.post(
"/",
protect,
createProduct
);

router.get("/", getProducts);

router.get("/featured", getFeaturedProducts);

router.get("/:id/related", getRelatedProducts);

router.get("/:id", getProductById);

router.put("/:id", protect, updateProduct);

router.delete("/:id", protect, deleteProduct);




router.post(
"/upload-image",
upload.single("image"),
uploadProductImage
);

export default router;