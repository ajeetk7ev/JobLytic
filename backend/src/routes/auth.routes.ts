import express from "express";
import multer from "multer";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  logout,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/get-me", authMiddleware, getMe);

// Forgot & Reset Password
router.post("/forgot-password", forgotPassword);
router.post("/update-password/:token", resetPassword);

// Settings
router.put("/profile", authMiddleware, upload.single("avatar"), updateProfile);
router.put("/password", authMiddleware, changePassword);
router.delete("/account", authMiddleware, deleteAccount);

export default router;
