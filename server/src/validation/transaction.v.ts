import { z } from "zod";

export const moneyAmount = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Must be decimal with max 2dp");

export const depositSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    amount: moneyAmount,
    currency: z.enum(["USD", "SLSH"]),
  }),
});

export const withdrawSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    amount: moneyAmount,
    currency: z.enum(["USD", "SLSH"]),
  }),
});

export const transferSchema = z.object({
  params: z.object({
    id: z.string().uuid(), // from account
  }),
  body: z.object({
    toAccountId: z.string().uuid(),
    amount: moneyAmount,
    currency: z.enum(["USD", "SLSH"]),
  }),
});
