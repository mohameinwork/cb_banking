import { z } from "zod";

export const setRateSchema = z.object({
  body: z
    .object({
      baseCurrency: z.enum(["USD", "SLSH"]),
      quoteCurrency: z.enum(["USD", "SLSH"]),
      rate: z.number().positive(),
    })
    .refine((d) => d.baseCurrency !== d.quoteCurrency, {
      message: "Currencies must differ",
    }),
});

export const exchangeSchema = z.object({
  body: z.object({
    fromAccountId: z.string().uuid(),
    toAccountId: z.string().uuid(),
    amount: z.number().positive(),
    baseCurrency: z.enum(["USD", "SLSH"]), // currency being exchanged FROM
    quoteCurrency: z.enum(["USD", "SLSH"]), // currency being exchanged TO
  }),
});
