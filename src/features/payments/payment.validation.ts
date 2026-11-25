import { z } from "zod";

export const cashPaymentSchema = z.object({
  cash_received: z.number().positive(),
});

export const verifyPaymentSchema = z.object({
  confirmed: z.literal(true),
});
