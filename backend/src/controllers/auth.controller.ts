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
      },
    });

    // Tokens
    const token = generateToken(user.id);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.log("Error while signup", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
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

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });

    // Generate tokens
    const token = generateToken(user.id);
    return res.status(200).json({
      success: true,
      message: "Login success",
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.log("Error in login", error);
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

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const name = user.fullName;
    const html = forgotPasswordTemplate(name, resetUrl);

    const isSent = await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html,
    });

    if (!isSent) {
      return res.status(200).json({
        success: false,
        message: "Failed to send reset link to your email",
      });
    }

    res.status(200).json({
      success: true,
      message: "Reset link sent to your email",
    });
  } catch (err) {
    console.error("Failed to send reset email", err);
    res.status(500).json({
      success: false,
      message: "Email could not be sent",
    });
  }
};

// ------------------- RESET PASSWORD -------------------
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const userId = (req as any).id;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required",
      });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
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

    user.password = await hashPassword(password);
    await prisma.user.update({
      where:{
        id:userId
      },
      data:{
        resetPasswordExpire:""
      }
    })

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.error("Failed to reset password", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ------------------- CHANGE PASSWORD -------------------
// export const changePassword = async (req: Request, res: Response) => {
//   try {
//     const userId = (req as any).user._id;
//     const { currentPassword, newPassword } = req.body;

//     if (!currentPassword || !newPassword) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password and new password are required",
//       });
//     }

//     const user = await User.findById(userId).select("+password");
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     const isMatch = await bcrypt.compare(currentPassword, user.password);
//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Current password is incorrect",
//       });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: "Password changed successfully",
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: err,
//     });
//   }
// };
