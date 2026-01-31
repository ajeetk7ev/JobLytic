import { prisma } from "../config/prisma";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";
import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { forgotPasswordTemplate } from "../mail/templates/reset-password";
import { sendEmail } from "../utils/mailSender";

export const signup = async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }

    const { fullName, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        credits: 5, // Default free credits
      },
    });

    // Token
    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Signup error details:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during signup",
      error:
        process.env.NODE_ENV === "development"
          ? (error as any).message
          : undefined,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("Login request received");
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ success: false, errors: parsed.error.flatten().fieldErrors });
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "User not found" });

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google login. Please use Login with Google.",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    // Generate token
    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login success",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Login error details:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during login",
      error:
        process.env.NODE_ENV === "development"
          ? (error as any).message
          : undefined,
    });
  }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as any;
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }

    // Generate token
    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error("Google auth callback error:", error);
    return res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req: any, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.id },
      select: { id: true, email: true, fullName: true, avatar: true },
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in getMe", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

// ------------------- FORGOT PASSWORD -------------------
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Save token in DB
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken,
        resetPasswordExpire,
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const html = forgotPasswordTemplate(user.fullName, resetUrl);

    const isSent = await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html,
    });

    if (!isSent) {
      return res.status(200).json({
        success: false,
        message: "Failed to send email",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reset link sent to your email",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ------------------- RESET PASSWORD -------------------
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Hash token to compare with DB
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user by token & expiry
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken,
        resetPasswordExpire: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpire: null,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ------------------- CHANGE PASSWORD -------------------
// ------------------- UPDATE PROFILE -------------------
export const updateProfile = async (req: any, res: Response) => {
  try {
    const { fullName, email } = req.body;
    const file = req.file;
    const userId = req.id;

    let avatarUrl;

    if (file) {
      // Lazy load Cloudinary
      const { v2: cloudinary } = await import("cloudinary");
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        console.warn("Cloudinary keys missing, skipping upload");
      } else {
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        // Upload to Cloudinary (buffer -> base64 or stream)
        // Since we might be using memory storage, we can upload buffer
        const b64 = Buffer.from(file.buffer).toString("base64");
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: "joblytic_avatars",
        });
        avatarUrl = result.secure_url;
      }
    }

    const updates: any = {};
    if (fullName) updates.fullName = fullName;
    if (email) updates.email = email;
    if (avatarUrl) updates.avatar = avatarUrl;

    const user = await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: { id: true, fullName: true, email: true, avatar: true },
    });

    res.status(200).json({ success: true, message: "Profile updated", user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- CHANGE PASSWORD -------------------
export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.id;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (!user.password) {
      return res
        .status(400)
        .json({ success: false, message: "Use Google Login for this account" });
    }

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Incorrect current password" });
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ------------------- DELETE ACCOUNT -------------------
export const deleteAccount = async (req: any, res: Response) => {
  try {
    const userId = req.id;

    // Delete related data (Prisma doesn't cascade automatically for Mongo unless relation specific)
    // Delete payments, resumes, applications first if needed or rely on cleanup
    await prisma.resume.deleteMany({ where: { userId } });
    await prisma.jobApplication.deleteMany({ where: { userId } });
    await prisma.payment.deleteMany({ where: { userId } });

    await prisma.user.delete({ where: { id: userId } });

    res.clearCookie("token");
    res
      .status(200)
      .json({ success: true, message: "Account deleted permanently" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
