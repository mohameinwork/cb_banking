import { z } from "zod";

export const createLoanSchema = z.object({
  body: z.object({
    accountId: z.string().uuid(),
    principal: z.number().positive(),
    interestRate: z.number().positive(), // % monthly
    termMonths: z.number().int().positive(),
  }),
});

export const repayLoanSchema = z.object({
  body: z.object({
    loanId: z.string().uuid(),
    amount: z.number().positive(),
  }),
});
