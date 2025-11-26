import express from "express";
import { signup, login, forgotPassword, resetPassword } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

// Forgot & Reset Password
router.post("/forgot-password", forgotPassword);
router.post("/update-password/:token", resetPassword);
// router.post("/refresh", refresh);
// router.post("/logout", logout);

export default router;
