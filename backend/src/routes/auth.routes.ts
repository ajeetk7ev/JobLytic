import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get-me", authMiddleware, getMe);

// Forgot & Reset Password
router.post("/forgot-password", forgotPassword);
router.post("/update-password/:token", resetPassword);

export default router;
