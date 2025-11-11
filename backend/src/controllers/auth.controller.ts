import {prisma} from '../config/prisma'
import { comparePassword, hashPassword } from "../utils/hashPassword";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken";
import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import jwt, { JwtPayload } from "jsonwebtoken";


interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

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
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      accessToken,
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
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Update refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Set refresh cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Login success",
      accessToken,
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

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as
      | string
      | JwtPayload;

    if (typeof decoded === "string" || !("userId" in decoded)) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }

    const { userId } = decoded as CustomJwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    //Generate new tokens
    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    // Rotate refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    //Set secure cookie with maxAge (7 days)
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // set to false if testing on localhost without HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired refresh token" });
  }
};

export const logout = async (req:Request, res:Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(200).json({success:true, message: "Logout success" });
 

  await prisma.user.updateMany({
    where: { refreshToken: token },
    data: { refreshToken: null },
  });

  res.clearCookie("refreshToken");
  res.status(200).json({success:true, message: "Logout success" });
};

