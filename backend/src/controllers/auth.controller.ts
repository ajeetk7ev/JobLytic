import { prisma } from "../config/prisma";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import {
  generateAccessToken,
  generateRefreshToken,
  generateToken,
} from "../utils/generateToken";
import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../validators/auth.validator";
import jwt, { JwtPayload } from "jsonwebtoken";

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
