import { z } from "zod";

export const moneyAmount = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Must be decimal with max 2dp");

export const depositSchema = z.object({
  body: z.object({
    amount: moneyAmount,
    currency: z.enum(["USD", "SLSH"]),
    id: z.string().uuid(),
  }),
});

export const withdrawSchema = z.object({
  body: z.object({
    amount: moneyAmount,
    currency: z.enum(["USD", "SLSH"]),
    id: z.string().uuid(),
  }),
});

export const transferSchema = z.object({
  body: z.object({
    toAccountId: z.string().uuid(),
    amount: moneyAmount,
    currency: z.enum(["USD", "SLSH"]),
    id: z.string().uuid(),
  }),
});
