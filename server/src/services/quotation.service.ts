import { db } from "../db/index.js";
import {
  quotations,
  accounts,
  transactions,
  journalEntries,
  journalLines,
  quotationPayments,
} from "../db/schema.js";
import { desc, eq } from "drizzle-orm";

// ⚠️ Replace with your real system account
const SYSTEM_REVENUE_ACCOUNT_ID = "REPLACE_WITH_REAL_LEDGER_ID";

//
// 1️⃣ CREATE QUOTATION
//
export async function createQuotationService({
  companyAccountId,
  title,
  description,
  total,
  items,
}: {
  companyAccountId: string;
  title: string;
  description?: string;
  total: number;
  items: any[];
}) {
  if (!companyAccountId) throw new Error("Company account is required");
  if (!title) throw new Error("Title is required");
  if (!total || total <= 0) throw new Error("Total must be positive");
  if (!items || !Array.isArray(items) || items.length === 0)
    throw new Error("At least one item is required");

  const [account] = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, companyAccountId));

  if (!account) throw new Error("Company account not found");

  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.total || 0);
  }, 0);

  const [quotation] = await db
    .insert(quotations)
    .values({
      companyAccountId,
      title,
      description,
      items,
      total: totalAmount.toFixed(2),
      status: "UNPAID",
      paidAmount: "0.00",
    } as any)
    .returning();

  return quotation;
}

//
// 2️⃣ GET ALL QUOTATIONS
//
export async function getQuotationsService() {
  return await db.select().from(quotations);
}

//
// 3️⃣ GET SINGLE QUOTATION
//
export async function getQuotationByIdService(id: string) {
  const [quote] = await db
    .select()
    .from(quotations)
    .where(eq(quotations.id, id));

  if (!quote) throw new Error("Quotation not found");

  return quote;
}

//
// 4️⃣ PAY QUOTATION
//
export async function payQuotationPartialService({
  quotationId,
  amount,
}: {
  quotationId: string;
  amount: number;
}) {
  if (!amount || amount <= 0)
    throw new Error("Payment amount must be greater than zero");

  return await db.transaction(async (tx) => {
    //
    // 1️⃣ GET QUOTATION
    //
    const [quote] = await tx
      .select()
      .from(quotations)
      .where(eq(quotations.id, quotationId));

    if (!quote) throw new Error("Quotation not found");

    if (quote.status === "PAID")
      throw new Error("Quotation already fully paid");

    const remaining = Number(quote.total) - Number(quote.paidAmount || 0);

    if (amount > remaining) throw new Error("Amount exceeds remaining balance");

    //
    // 2️⃣ GET ACCOUNT
    //
    const [account] = await tx
      .select()
      .from(accounts)
      .where(eq(accounts.id, quote.companyAccountId));

    if (!account) throw new Error("Account not found");

    if (Number(account.balance) < amount)
      throw new Error("Insufficient balance");

    //
    // 3️⃣ UPDATE ACCOUNT BALANCE
    //
    const newBalance = Number(account.balance) - amount;

    await tx
      .update(accounts)
      .set({ balance: newBalance.toFixed(2) })
      .where(eq(accounts.id, account.id));

    //
    // 4️⃣ SAVE PAYMENT RECORD
    //
    await tx.insert(quotationPayments).values({
      quotationId,
      amount: amount.toFixed(2),
    });

    //
    // 5️⃣ UPDATE QUOTATION
    //
    const newPaidAmount = Number(quote.paidAmount || 0) + amount;

    let newStatus: "UNPAID" | "PARTIAL" | "PAID" = "UNPAID";

    if (newPaidAmount === Number(quote.total)) {
      newStatus = "PAID";
    } else if (newPaidAmount > 0) {
      newStatus = "PARTIAL";
    }

    await tx
      .update(quotations)
      .set({
        paidAmount: newPaidAmount.toFixed(2),
        status: newStatus,
      })
      .where(eq(quotations.id, quotationId));

    //
    // 6️⃣ CREATE TRANSACTION
    //
    const [txn] = await tx
      .insert(transactions)
      .values({
        type: "QUOTATION_PAYMENT",
        amount: amount,
        currency: account.currency,
        fromAccountId: account.id,
        status: "COMPLETED",
        meta: {
          quotationId,
          paymentType: "PARTIAL",
        },
      } as any)
      .returning();

    //
    // 7️⃣ JOURNAL ENTRY
    //
    const [journal] = await tx
      .insert(journalEntries)
      .values({
        transactionId: txn.id,
        description: `Partial payment for quotation`,
      })
      .returning();

    await tx.insert(journalLines).values([
      {
        journalId: journal.id,
        ledgerAccountId: "SYSTEM_REVENUE_ACCOUNT_ID",
        side: "DEBIT",
        amount: amount.toFixed(2),
      },
      {
        journalId: journal.id,
        ledgerAccountId: account.ledgerAccountId,
        side: "CREDIT",
        amount: amount.toFixed(2),
      },
    ]);

    return {
      paid: amount,
      remaining: remaining - amount,
      status: newStatus,
    };
  });
}

// Update quotation - only allow updating title, description, and items if not paid
export async function updateQuotationService(
  id: string,
  {
    title,
    description,
    items,
  }: { title?: string; description?: string; items?: any[] },
) {
  try {
    const [quote] = await db
      .select()
      .from(quotations)
      .where(eq(quotations.id, id));

    if (!quote) throw new Error("Quotation not found");
    if (quote.status === "PAID")
      throw new Error("Cannot update paid quotation");

    const updatedFields: any = {};
    if (title) updatedFields.title = title;
    if (description) updatedFields.description = description;
    if (items) {
      const totalAmount = items.reduce((sum, item) => {
        return sum + (item.dollar || 0);
      }, 0);
      updatedFields.items = items;
      updatedFields.total = totalAmount.toFixed(2);
    }

    await db.update(quotations).set(updatedFields).where(eq(quotations.id, id));

    return { message: "Quotation updated" };
  } catch (error) {
    console.log("Error updating quotation:", error);
    throw new Error("Failed to update quotation");
  }
}

//
// 5️⃣ DELETE QUOTATION
//
export async function deleteQuotationService(id: string) {
  const [quote] = await db
    .select()
    .from(quotations)
    .where(eq(quotations.id, id));

  if (!quote) throw new Error("Quotation not found");

  if (quote.status === "PAID") throw new Error("Cannot delete paid quotation");

  await db.delete(quotations).where(eq(quotations.id, id));

  return { message: "Quotation deleted" };
}

export async function getQuotationPaymentsService(quotationId: string) {
  return await db
    .select()
    .from(quotationPayments)
    .where(eq(quotationPayments.quotationId, quotationId))
    .orderBy(desc(quotationPayments.createdAt));
}
