import { z } from "zod";

export const productSchema = z.object({
  category_id: z.coerce.number().int().positive(),
  name: z.string().min(2).max(150),
  description: z.string().max(1000).optional().nullable(),
  price: z.coerce.number().positive(),
  image: z.string().max(500).optional().nullable(),
  is_available: z.coerce.boolean().default(true),
});

export const updateProductSchema = productSchema.partial();

export const productQuerySchema = z.object({
  search: z.string().optional(),
  category: z.coerce.number().int().positive().optional(),
});
