import { db } from "../db";
import {
  accounts,
  exchangeRates,
  journalEntries,
  journalLines,
  ledgerAccounts,
  transactions,
} from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function setRate(base: string, quote: string, rate: number) {
  const [existing] = await db
    .select()
    .from(exchangeRates)
    .where(
      and(
        eq(exchangeRates.baseCurrency, base),
        eq(exchangeRates.quoteCurrency, quote),
      ),
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
        eq(exchangeRates.quoteCurrency, quote),
      ),
    );

  if (!rate) throw new Error("Exchange rate not set");

  return Number(rate.rate);
}

// export async function exchange({
//   userId,
//   sourceAccountId,
//   targetAccountId,
//   sourceAmount,
//   rate,
// }: {
//   userId: string;
//   sourceAccountId: string;
//   targetAccountId: string;
//   sourceAmount: number;
//   rate: number;
// }) {
//   if (sourceAccountId === targetAccountId) {
//     throw new Error("Source and target accounts must be different");
//   }

//   if (!sourceAmount || sourceAmount <= 0) {
//     throw new Error("Source amount must be positive");
//   }

//   if (!rate || rate <= 0) {
//     throw new Error("Invalid exchange rate");
//   }

//   return await db.transaction(async (tx) => {
//     //
//     // 1️⃣ FETCH + LOCK ACCOUNTS
//     //
//     const sourceRes = await tx.execute(sql`
//       SELECT * FROM accounts
//       WHERE id = ${sourceAccountId}
//       FOR UPDATE
//     `);
//     const sourceAcc = sourceRes.rows[0] as any;

//     const targetRes = await tx.execute(sql`
//       SELECT * FROM accounts
//       WHERE id = ${targetAccountId}
//       FOR UPDATE
//     `);
//     const targetAcc = targetRes.rows[0] as any;

//     if (!sourceAcc || !targetAcc) {
//       throw new Error("Account not found");
//     }

//     if (sourceAcc.user_id !== userId || targetAcc.user_id !== userId) {
//       throw new Error("Account ownership mismatch");
//     }

//     //
//     // 2️⃣ DERIVE CURRENCIES FROM ACCOUNTS (NOT INPUT)
//     //
//     const sourceCurrency = sourceAcc.currency;
//     const targetCurrency = targetAcc.currency;

//     if (sourceCurrency === targetCurrency) {
//       throw new Error("Exchange requires different currencies");
//     }

//     //
//     // 3️⃣ CALCULATE TARGET AMOUNT
//     //
//     const targetAmount =
//       sourceCurrency === "USD" ? sourceAmount * rate : sourceAmount / rate;

//     if (Number(sourceAcc.balance) < sourceAmount) {
//       throw new Error("Insufficient balance");
//     }

//     //
//     // 4️⃣ UPDATE BALANCES
//     //
//     const newSourceBalance = Number(sourceAcc.balance) - sourceAmount;
//     const newTargetBalance = Number(targetAcc.balance) + targetAmount;

//     await tx
//       .update(accounts)
//       .set({ balance: newSourceBalance.toFixed(2) })
//       .where(eq(accounts.id, sourceAccountId));

//     await tx
//       .update(accounts)
//       .set({ balance: newTargetBalance.toFixed(2) })
//       .where(eq(accounts.id, targetAccountId));

//     //
//     // 5️⃣ CREATE TRANSACTION RECORD
//     //
//     const [txn] = await tx
//       .insert(transactions)
//       .values({
//         type: "EXCHANGE",
//         amount: sourceAmount,
//         currency: sourceCurrency,
//         status: "COMPLETED",
//         meta: {
//           userId,
//           sourceAccountId,
//           targetAccountId,
//           sourceCurrency,
//           targetCurrency,
//           sourceAmount,
//           targetAmount,
//           rate,
//         },
//       } as any)
//       .returning();

//     //
//     // 6️⃣ JOURNAL ENTRY
//     //
//     const [journal] = await tx
//       .insert(journalEntries)
//       .values({
//         id: txn.id,
//         description: `FX ${sourceCurrency} → ${targetCurrency}`,
//       })
//       .returning();

//     //
//     // 7️⃣ DOUBLE-ENTRY JOURNAL LINES
//     //
//     await tx.insert(journalLines).values([
//       {
//         journalId: journal.id,
//         ledgerAccountId: targetAcc.ledger_account_id,
//         side: "DEBIT",
//         amount: targetAmount.toFixed(2),
//       },
//       {
//         journalId: journal.id,
//         ledgerAccountId: sourceAcc.ledger_account_id,
//         side: "CREDIT",
//         amount: sourceAmount.toFixed(2),
//       },
//     ]);

//     return {
//       transactionId: txn.id,
//       sourceCurrency,
//       targetCurrency,
//       sourceAmount,
//       targetAmount,
//       balances: {
//         source: newSourceBalance,
//         target: newTargetBalance,
//       },
//     };
//   });
// }

export async function exchange({
  userId,
  sourceAccountId,
  targetAccountId,
  sourceAmount,
  rate,
}: {
  userId: string;
  sourceAccountId: string;
  targetAccountId: string;
  sourceAmount: number;
  rate: number;
}) {
  if (sourceAccountId === targetAccountId) {
    throw new Error("Source and target accounts must be different");
  }

  if (!sourceAmount || sourceAmount <= 0) {
    throw new Error("Source amount must be positive");
  }

  if (!rate || rate <= 0) {
    throw new Error("Invalid exchange rate");
  }

  return db.transaction(async (tx) => {
    //
    // 1️⃣ LOCK ACCOUNTS
    //
    const sourceRes = await tx.execute(sql`
     SELECT * FROM accounts
      WHERE id = ${sourceAccountId}
     FOR UPDATE
     `);
    const sourceAcc = sourceRes.rows[0] as any;

    const targetRes = await tx.execute(sql`
 SELECT * FROM accounts
 WHERE id = ${targetAccountId}
    FOR UPDATE
    `);
    const targetAcc = targetRes.rows[0] as any;
    if (!sourceAcc || !targetAcc) {
      throw new Error("Account not found");
    }

    if (sourceAcc.user_id !== userId || targetAcc.user_id !== userId) {
      throw new Error("Account ownership mismatch");
    }

    const sourceCurrency = sourceAcc.currency;
    const targetCurrency = targetAcc.currency;

    if (sourceCurrency === targetCurrency) {
      throw new Error("Exchange requires different currencies");
    }

    //
    // 2️⃣ CALCULATE TARGET AMOUNT
    //
    let targetAmount: number;

    if (sourceCurrency === "USD" && targetCurrency === "SLSH") {
      targetAmount = sourceAmount * rate;
    } else if (sourceCurrency === "SLSH" && targetCurrency === "USD") {
      targetAmount = sourceAmount / rate;
    } else {
      throw new Error("Unsupported currency pair");
    }

    if (Number(sourceAcc.balance) < sourceAmount) {
      throw new Error("Insufficient balance");
    }

    //
    // 3️⃣ UPDATE BALANCES
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
    // 4️⃣ TRANSACTION RECORD
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
          sourceCurrency,
          targetCurrency,
          sourceAmount,
          targetAmount,
          rate,
        },
      } as any)
      .returning();

    //
    // 5️⃣ JOURNAL ENTRY
    //
    const [journal] = await tx
      .insert(journalEntries)
      .values({
        id: txn.id,
        description: `FX ${sourceCurrency} → ${targetCurrency}`,
      })
      .returning();

    //
    // 6️⃣ DOUBLE-ENTRY JOURNAL
    //
    await tx.insert(journalLines).values([
      {
        journalId: journal.id,
        ledgerAccountId: targetAcc.ledger_account_id,
        side: "DEBIT",
        amount: targetAmount.toFixed(2),
      },
      {
        journalId: journal.id,
        ledgerAccountId: sourceAcc.ledger_account_id,
        side: "CREDIT",
        amount: sourceAmount.toFixed(2),
      },
    ]);

    return {
      transactionId: txn.id,
      exchange: {
        from: sourceCurrency,
        to: targetCurrency,
        rate,
      },
      balances: {
        source: newSourceBalance,
        target: newTargetBalance,
      },
    };
  });
}
