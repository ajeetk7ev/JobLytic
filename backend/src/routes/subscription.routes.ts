import express from "express";
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
} from "../controllers/subscription.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);
router.get("/status", getSubscriptionStatus);

export default router;
