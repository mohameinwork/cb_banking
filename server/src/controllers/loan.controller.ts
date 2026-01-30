import { Request, Response } from "express";
import { loanPayments, loans } from "../db/schema.js";
import { db } from "../db";
import { eq, sql } from "drizzle-orm";

// Create a loan
export async function createLoan(req: Request, res: Response) {
  try {
    const { accountId, principal, interestRate, termMonths } = req.body;

    if (!accountId || !principal || !interestRate || !termMonths) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const months = Number(termMonths);
    if (isNaN(months) || months <= 0) {
      return res.status(400).json({ message: "Invalid term months" });
    }
    const [loan] = await db
      .insert(loans)
      .values({
        accountId,
        principal,
        interestRate,
        termMonths: months,
        status: "ACTIVE",
      })
      .returning();

    return res.status(201).json({
      message: "Loan created successfully",
      data: loan,
    });
  } catch (error) {
    console.error("Create loan error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get All Loans
export async function getLoans(req: Request, res: Response) {
  try {
    const data = await db
      .select()
      .from(loans)
      .leftJoin(loanPayments, eq(loans.id, loanPayments.loanId));

    return res.json({
      message: "Loans fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get loans error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Get loan by Id
export async function getLoanById(req: Request, res: Response) {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) return res.status(400).json({ message: "Missing loan id" });

    const [loan] = await db.select().from(loans).where(eq(loans.id, id));

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    const payments = await db
      .select()
      .from(loanPayments)
      .where(eq(loanPayments.loanId, id));

    return res.json({
      message: "Loan fetched successfully",
      data: { loan, payments },
    });
  } catch (error) {
    console.error("Get loan error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Update Loans
export async function updateLoan(req: Request, res: Response) {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) return res.status(400).json({ message: "Missing loan id" });
    const { interestRate, termMonths, status } = req.body;

    const [loan] = await db
      .update(loans)
      .set({
        interestRate,
        termMonths,
        status,
      })
      .where(eq(loans.id, id))
      .returning();

    if (!loan) return res.status(404).json({ message: "Loan not found" });

    return res.json({
      message: "Loan updated successfully",
      data: loan,
    });
  } catch (error) {
    console.error("Update loan error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Delete a loan
export async function deleteLoan(req: Request, res: Response) {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    if (!id) return res.status(400).json({ message: "Missing loan id" });

    await db.delete(loanPayments).where(eq(loanPayments.loanId, id));
    const result = await db.delete(loans).where(eq(loans.id, id));

    if (!result.rowCount)
      return res.status(404).json({ message: "Loan not found" });

    return res.json({ message: "Loan deleted successfully" });
  } catch (error) {
    console.error("Delete loan error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Make a payment

export async function makeLoanPayment(req: Request, res: Response) {
  try {
    const { loanId, amount } = req.body;

    if (!loanId || !amount || amount <= 0)
      return res.status(400).json({ message: "Invalid payment data" });

    return await db.transaction(async (tx) => {
      const [loan] = await tx.select().from(loans).where(eq(loans.id, loanId));

      if (!loan) throw new Error("Loan not found");

      if (loan.status !== "ACTIVE") throw new Error("Loan is not active");

      // Total interest
      const interest =
        Number(loan.principal) *
        (Number(loan.interestRate) / 100) *
        loan.termMonths;

      const totalPayable = Number(loan.principal) + interest;

      const [{ totalPaid }] = await tx
        .select({
          totalPaid: sql<number>`COALESCE(SUM(amount),0)`,
        })
        .from(loanPayments)
        .where(eq(loanPayments.loanId, loanId));

      const newTotalPaid = Number(totalPaid) + Number(amount);

      await tx.insert(loanPayments).values({
        loanId,
        amount,
      });

      if (newTotalPaid >= totalPayable) {
        await tx
          .update(loans)
          .set({ status: "PAID" })
          .where(eq(loans.id, loanId));
      }

      return res.json({
        message: "Payment successful",
        totalPaid: newTotalPaid,
        remaining: Math.max(totalPayable - newTotalPaid, 0),
      });
    });
  } catch (error: any) {
    console.error("Loan payment error:", error);
    return res.status(400).json({ message: error.message });
  }
}
