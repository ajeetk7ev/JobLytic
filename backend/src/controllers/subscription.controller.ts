import { Request, Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { prisma } from "../config/prisma";

// Initialize Razorpay
// Initialize Razorpay
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay keys are missing in environment variables");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Plans Configuration (USD for display, INR for payment)
const PLANS = {
  pro_monthly: {
    amountINR: 499, // ₹499
    credits: 100,
    durationDays: 30,
  },
  pro_yearly: {
    amountINR: 4999, // ₹4999
    credits: 999999, // Unlimited logic
    durationDays: 365,
  },
  credits_topup: {
    amountINR: 99, // ₹99
    credits: 10,
    durationDays: 0, // No expiry extension, just credits
  },
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const { planId } = req.body; // "pro_monthly", "pro_yearly", "credits_topup"

    if (!PLANS[planId as keyof typeof PLANS]) {
      return res.status(400).json({ success: false, message: "Invalid plan" });
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    const amountInPaise = plan.amountINR * 100;

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId,
        planId,
      },
    };

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create(options);

    // Create a pending payment record
    await prisma.payment.create({
      data: {
        userId,
        razorpayOrderId: order.id,
        amount: plan.amountINR,
        currency: "INR", // Always INR for Razorpay
        status: "pending",
      },
    });

    res.status(200).json({
      success: true,
      order,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planId,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const plan = PLANS[planId as keyof typeof PLANS];
    if (!plan)
      return res
        .status(400)
        .json({ success: false, message: "Invalid plan ID" });

    // Update payment status
    await prisma.payment.updateMany({
      where: { razorpayOrderId: razorpay_order_id },
      data: {
        status: "completed",
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    // Update User Credits & Plan
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    let newCredits = user.credits + plan.credits;
    let newPlan = user.plan;
    let newExpiry = user.subscriptionExpiresAt;

    if (planId.startsWith("pro_")) {
      newPlan = planId;
      const now = newExpiry && newExpiry > new Date() ? newExpiry : new Date();
      newExpiry = new Date(
        now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000,
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        credits: newCredits,
        plan: newPlan,
        subscriptionExpiresAt: newExpiry,
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Payment verification failed" });
  }
};

export const getSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true, plan: true, subscriptionExpiresAt: true },
    });

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching status" });
  }
};
