import { z } from "zod";

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      product_id: z.number().int().positive(),
      quantity: z.number().int().min(1).max(100),
    }),
  ).min(1),
  payment_method: z.enum(["qris", "cash"]),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["diproses", "siap_diambil"]),
});
