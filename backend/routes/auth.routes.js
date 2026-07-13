import express from "express";
import protect from "../middleware/auth.middleware.js";
import {
  registerUser,
  loginUser,
} from "../controllers/auth.controller.js";
import { getMe } from "../controllers/auth.controller.js";


const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Auth Route Working");
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;