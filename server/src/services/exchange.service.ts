import { db } from "../db";
import {
  accounts,
  exchangeRates,
  journalEntries,
  journalLines,
  ledgerAccounts,
  transactions,
} from "../db/schema";
import { eq, and } from "drizzle-orm";

export async function setRate(base: string, quote: string, rate: number) {
  const [existing] = await db
    .select()
    .from(exchangeRates)
    .where(
      and(
        eq(exchangeRates.baseCurrency, base),
        eq(exchangeRates.quoteCurrency, quote)
      )
    );

  if (existing) {
    const [updated] = await db
      .update(exchangeRates)
      .set({ rate: String(rate), updatedAt: new Date() })
      .where(eq(exchangeRates.id, existing.id))
      .returning();

    return updated;
  }

  const [created] = await db
    .insert(exchangeRates)
    .values({
      baseCurrency: base,
      quoteCurrency: quote,
      rate: String(rate),
    })
    .returning();

  return created;
}

export async function getRate(base: string, quote: string) {
  const [rate] = await db
    .select()
    .from(exchangeRates)
    .where(
      and(
        eq(exchangeRates.baseCurrency, base),
        eq(exchangeRates.quoteCurrency, quote)
      )
    );

  if (!rate) throw new Error("Exchange rate not set");

  return Number(rate.rate);
}

// Hard-code or load from DB lookup (better)
const USD_CASH_ACCOUNT_ID = "735df346-6225-4b80-9735-3e9f47c831d8";
const SLSH_CASH_ACCOUNT_ID = "aea7b54a-56cf-432a-990e-c6858bf741d2";

export async function exchange({
  userId,
  sourceAccountId,
  targetAccountId,
  sourceAmount,
  targetAmount,
  sourceCurrency,
  targetCurrency,
  rate,
}: {
  userId: string;
  sourceAccountId: string;
  targetAccountId: string;
  sourceAmount: number;
  targetAmount: number;
  sourceCurrency: "USD" | "SLSH";
  targetCurrency: "USD" | "SLSH";
  rate: number;
}) {
  if (sourceCurrency === targetCurrency)
    throw new Error("Currencies must be different");

  return await db.transaction(async (tx) => {
    //
    // 1️⃣ LOCK ACCOUNTS
    //
    const [sourceAcc] = await tx
      .select()
      .from(accounts)
      .where(eq(accounts.id, sourceAccountId));

    const [targetAcc] = await tx
      .select()
      .from(accounts)
      .where(eq(accounts.id, targetAccountId));

    if (!sourceAcc || !targetAcc) throw new Error("Account not found");

    if (sourceAcc.userId !== userId || targetAcc.userId !== userId)
      throw new Error("Account ownership mismatch");

    if (sourceAcc.currency !== sourceCurrency)
      throw new Error("Source currency mismatch");

    if (targetAcc.currency !== targetCurrency)
      throw new Error("Target currency mismatch");

    if (Number(sourceAcc.balance) < sourceAmount)
      throw new Error("Insufficient balance");

    //
    // 2️⃣ UPDATE BALANCES
    //
    const newSourceBalance = Number(sourceAcc.balance) - sourceAmount;
    const newTargetBalance = Number(targetAcc.balance) + targetAmount;

    await tx
      .update(accounts)
      .set({ balance: newSourceBalance.toFixed(2) })
      .where(eq(accounts.id, sourceAccountId));

    await tx
      .update(accounts)
      .set({ balance: newTargetBalance.toFixed(2) })
      .where(eq(accounts.id, targetAccountId));

    //
    // 3️⃣ TRANSACTION RECORD
    //
    const [txn] = await tx
      .insert(transactions)
      .values({
        type: "EXCHANGE",
        amount: sourceAmount,
        currency: sourceCurrency,
        status: "COMPLETED",
        meta: {
          userId,
          sourceAccountId,
          targetAccountId,
          sourceAmount,
          targetAmount,
          sourceCurrency,
          targetCurrency,
          rate,
        },
      } as any)
      .returning();

    //
    // 4️⃣ JOURNAL ENTRY
    //
    const [journal] = await tx
      .insert(journalEntries)
      .values({
        id: txn.id,
        description: `FX ${sourceCurrency} → ${targetCurrency}`,
      })
      .returning();

    //
    // 5️⃣ JOURNAL LINES (DOUBLE ENTRY)
    //
    await tx.insert(journalLines).values([
      {
        journalId: journal.id,
        ledgerAccountId:
          targetCurrency === "USD" ? USD_CASH_ACCOUNT_ID : SLSH_CASH_ACCOUNT_ID,
        side: "DEBIT",
        amount: targetAmount.toFixed(2),
      },
      {
        journalId: journal.id,
        ledgerAccountId:
          sourceCurrency === "USD" ? USD_CASH_ACCOUNT_ID : SLSH_CASH_ACCOUNT_ID,
        side: "CREDIT",
        amount: sourceAmount.toFixed(2),
      },
    ]);

    return {
      transactionId: txn.id,
      sourceBalance: newSourceBalance,
      targetBalance: newTargetBalance,
    };
  });
}
