import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email atau username wajib diisi."),
  password: z.string().min(1, "Password wajib diisi."),
});

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  nickname: z.string().min(2).max(50),
  username: z
    .string()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Username hanya boleh berisi huruf, angka, dan underscore."),
  email: z.string().email().max(150),
  password: z.string().min(8).max(72),
});

export const registerSellerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(150),
  password: z.string().min(8).max(72),
  token: z.string().min(1),
});
