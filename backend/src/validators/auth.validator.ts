import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters long")
    .max(50, "Full name must be under 50 characters"),
  email: z
    .string()
    .email("Invalid email address")
    .min(5, "Email must be at least 5 characters long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password too long"),
});


export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
    email: z
    .string()
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Invalid Password")
    .max(100, "Password too long"),
})