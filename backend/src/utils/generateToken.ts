import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error(
      "ACCESS_TOKEN_SECRET is not defined in environment variables",
    );
  }
  return jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
};
